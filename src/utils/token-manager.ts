import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { TOKEN_NAME } from "./constants";

export const createToken = async (
  id: string,
  email: string,
  expiresIn: string
) => {
  const payload = {
    id,
    email,
  };
  const token = sign(payload, process.env.JWT_SECRET!, {
    expiresIn,
  });
  return token;
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[TOKEN_NAME];
  console.log("token" + token);

  if (!token || token.trim() === "")
    return res.status(401).json({ message: "Token not received" });

  verify(token, process.env.JWT_SECRET!, (error: any, success: any) => {
    if (error) return res.status(401).json({ message: "Token expired!" });
    else {
      res.locals.jwtData = success;
      return next();
    }
  });
};
