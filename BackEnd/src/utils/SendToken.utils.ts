import { Response } from "express";
import { UserDocument } from "../model/User.model";

const sendToken = (user: UserDocument, statusCode: number, res: Response): void => {
  const token: string = user.getJwtToken();
  
  // Options for cookies
  const options = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
  };

  res.status(statusCode)
    .cookie("token", token, options)
    .json(
      {success: true}
    );
};

export default sendToken;