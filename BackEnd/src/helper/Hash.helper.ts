import jwt from "jsonwebtoken";

const createActivationToken = (user: any) => {
    if(!process.env.ACTIVATION_SECRET) {
        throw new Error('ACTIVATION_SECRET environment variable is not defined.');
    }

    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
      expiresIn: "5m",
    });
};

module.exports = createActivationToken;