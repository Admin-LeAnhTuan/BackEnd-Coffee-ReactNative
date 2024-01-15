import base64url from "base64url";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../model/User.model"

// Check is authen
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.cookie?.split("=")[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
      const userId = decodedToken.id;
      
      const user = await User.findById(userId);
      if (user) {
        next();
      } else {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
};


// Check is Admin
export const isAdminAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.cookie?.split("=")[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!) as JwtPayload;
        const userId = decodedToken.id;
        
        const user = await User.findById(userId);
        if (user && user.role.includes("admin")) {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden' });
        }
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'Forbidden' });
    }
}

module.exports = {
    isAuthenticated,
    isAdminAuthenticated
}