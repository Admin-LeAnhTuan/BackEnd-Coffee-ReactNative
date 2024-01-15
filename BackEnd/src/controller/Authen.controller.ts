import {Request, Response} from "express"
import User from "../model/User.model"
import base64url from "base64url"
import jwt,{ JwtPayload } from "jsonwebtoken";

const createActivationToken = require("../helper/Hash.helper");
import sendMail from "../utils/SendEmail.utils"
import sendToken from "../utils/SendToken.utils";


// register account
export const register = async (req: Request, res: Response) => {
  const { name, email, password, phoneNumber } = req.body;
  console.log({ name, email, password, phoneNumber });
  const userEmail = await User.findOne({ email: email });
  try {
    if (userEmail) {
      res.status(500).json("email has been registered");
    } else {
      // create User
      const user = {
        name: name,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
      };
      // generate token with jwt and send email activation
      const activationToken = createActivationToken(user);
      const encodedToken = base64url.encode(activationToken);
      const activationUrl = `${process.env.FE_URL}/activation/${encodedToken}`;
      console.log(activationUrl);
      // sendEmail
      try {
        console.log("send email");
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          message: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
              <h1 style="font-size: 24px; margin-top: 0;">Account Activation</h1>
              <p style="font-size: 16px; margin-bottom: 10px;">Hello ${user.name},</p>
              <p style="font-size: 16px; margin-bottom: 10px;">Please click on the link below to activate your account:</p>
              <p><a href="${activationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px;">Click here to create your account!!</a></p>
              <p style="font-size: 16px; margin-bottom: 10px;">Thank you for joining our service.</p>
              <p style="font-size: 16px; margin-bottom: 10px;">Best regards,</p>
              <p style="font-size: 16px; margin-bottom: 10px;">Love Travel</p>
            </div>
          `,
        });
        res.status(200).json("Registration successful");
      } catch (error: any) {
        res.status(500).json({ error: "send email error" });
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).json("error register account");
  }
};


// activation account
export const activation = async (req:Request, res: Response) => {
    try {
        const activation_token = req.params.token;
        const token: string = base64url.decode(activation_token);
        if(!process.env.ACTIVATION_SECRET) {
            throw new Error("ACTIVATION_SECRET environment variable is not defined.")
        }
        const newUser: JwtPayload | String = jwt.verify(token, process.env.ACTIVATION_SECRET);

        if(!newUser) {
            res.status(500).json("Token in activation error")
            return;
        }
        const { name, email, password, phoneNumber } = newUser as JwtPayload;
        let user = await User.findOne({ email });

        if (user) {
            res.status(400).json({
              success: false,
              message: "User already exists",
            });
            return;
        }

        const newAccount = new User({
            name,
            email,
            password,
            phoneNumber,
        });
        await newAccount.save();

        sendToken(newAccount, 201, res);
    }
    catch(error) {
        res.status(500).json("error activation account")
    }
}

// login
export const login = async (req:Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json("Email and password are required");
    }

    try {
        let user = await User.findOne({ email }).select("+password");
        if (!user) {
            res.status(400).json("User is not activated");
            return;
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(400).json("Invalid password");
            return;
        }

        sendToken(user, 200, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json("Internal server error");
    }
}

// forgetPassword
export const forgetPassword = async (req:Request, res: Response) => {
    const { email } = req.body;

  try {
    // Find the user by email
    let user = await User.findOne({ email });

    // If no user exists with the provided email
    if (!user) {
      res.status(404).json({ error: 'No account exists with the given email' });
      return;
    }

    const resetTokenPayload = {
        userId: user.id,
        email: user.email
      };

    // Generate a password reset token
    const token_forget = createActivationToken(resetTokenPayload);

    // Set the reset password token and time
    user.resetPasswordToken = token_forget;
    user.resetPasswordTime = new Date(Date.now() + 10 * 60 * 1000);

    // Save the user with the updated reset token and time
    await user.save();
    console.log(user)

    // send email foeget
    try {
        console.log("send email");
        await sendMail({
            email: user.email,
            subject: "Activate your account",
            message: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7;">
                <h1 style="font-size: 24px; margin-top: 0;">Account Activation</h1>
                <p style="font-size: 16px; margin-bottom: 10px;">Hello ${user.name},</p>
                <p style="font-size: 16px; margin-bottom: 10px;">Please click on the link below to resert password your account:</p>
                <p><a href="${user.resetPasswordToken}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px;">Click here to create your account!!</a></p>
                <p style="font-size: 16px; margin-bottom: 10px;">Thank you for joining our service.</p>
                <p style="font-size: 16px; margin-bottom: 10px;">Best regards,</p>
                <p style="font-size: 16px; margin-bottom: 10px;">Love Travel</p>
            </div>
            `,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
    // Return a success response
        res.status(200).json({ message: 'Password reset token generated' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

// resetPassword
export const resetPassword = async (req:Request, res: Response) => {
    try {
        const token = req.params.token;
        const password = req.body.password;
    
        // Find the user by reset password token
        const user = await User.findOne({ resetPasswordToken: token });
    
        // If no user exists with the provided reset password token
        if (!user) {
          res.status(404).json({ error: 'Invalid or expired reset password token' });
          return;
        }
    
        console.log(user);
    
        // Update the user's password and reset password fields
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordTime = undefined;
    
        // Save the updated user object
        await user.save();
    
        res.status(200).json({ message: 'Password reset successful' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

// change password
export const chagePassword = async (req:Request, res: Response) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;
    
        // Find the user by ID
        const user = await User.findById(userId);
    
        // If no user exists with the provided ID
        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
    
        // Check if the current password matches the user's stored password
        const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
        if (!isCurrentPasswordValid) {
          res.status(400).json({ error: 'Invalid current password' });
          return;
        }
    
        
        // Set the new password
        user.password = newPassword;
    
        // Save the updated user object
        await user.save();
    
        res.status(200).json({ message: 'Password changed successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
}


module.exports = {
    register,
    activation,
    login,
    forgetPassword,
    resetPassword,
    chagePassword
}