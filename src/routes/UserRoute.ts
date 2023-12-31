import express, { Request, Response } from "express";
import {
  userLogin,
  userLogout,
  userSignUp,
  verifyUser,
} from "../controllers/UserController";
import { verifyToken } from "../utils/token-manager";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("hello");
});

router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.get("/auth-status", verifyToken, verifyUser);
router.get('/logout',userLogout)

export default router;
