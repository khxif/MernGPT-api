import { compare, hash } from "bcrypt";
import { Request, Response } from "express";
import User from "../models/UserSchema";
import { TOKEN_NAME } from "../utils/constants";
import { createToken } from "../utils/token-manager";

export const userSignUp = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.json({ message: "Email already registered" }).status(401);

    const hashedPassword = await hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    const newUser = await user.save();

    res.clearCookie(TOKEN_NAME, {
      httpOnly: true,
      signed: true,
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? "localhost"
          : "https://merngpt-server.onrender.com",
    });
    const token = await createToken(user?._id.toString(), user?.email, "7d");

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(TOKEN_NAME, token, {
      httpOnly: true,
      signed: true,
      expires,
      path: "/",
      domain:
        process.env.NODE_ENV === "production"
          ? "https://merngpt-server.onrender.com"
          : "localhost",
    });
    res.status(200).json(newUser);
  } catch (error) {
    console.log("Sign up error : " + error);
    res.status(201).json({ message: "ERROR", error });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      const isPasswordValid = await compare(password, user.password);

      if (isPasswordValid) {
        res.clearCookie(TOKEN_NAME, {
          httpOnly: true,
          signed: true,
          path: "/",
          domain:
            process.env.NODE_ENV === "production"
              ? "https://merngpt-server.onrender.com"
              : "localhost",
        });
        const token = await createToken(
          user?._id.toString(),
          user?.email,
          "7d"
        );

        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        res.cookie(TOKEN_NAME, token, {
          httpOnly: true,
          signed: true,
          expires,
          path: "/",
          domain:
            process.env.NODE_ENV === "production"
              ? "https://merngpt-server.onrender.com"
              : "localhost",
        });
        res.status(200).json(user);
      } else return res.json({ message: "Invalid credentials" });
    } else return res.json({ message: "Email not registered" });
  } catch (error) {
    console.log("Sign up error : " + error);
    res.status(201).json({ message: "ERROR", error });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  const user = await User.findById(res.locals.jwtData.id);

  if (!user)
    return res.status(401).send("User not registered or Token malfunctioned");

  if (user._id.toString() !== res.locals.jwtData.id)
    return res.status(401).send("Permissions didnt matched");

  res.status(200).json(user);
};

export const userLogout = async (req: Request, res: Response) => {
  res.clearCookie(TOKEN_NAME, {
    httpOnly: true,
    signed: true,
    path: "/",
    domain:
      process.env.NODE_ENV === "production"
        ? "https://merngpt-server.onrender.com"
        : "localhost",
  });
  res.json({message: 'Logout successful'})
};
