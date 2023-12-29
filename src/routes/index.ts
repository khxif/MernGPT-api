import express from "express";
import UserRoute from "./UserRoute";

const router = express.Router();

router.use("/user", UserRoute);

export default router;
