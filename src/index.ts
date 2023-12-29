import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import AppRoutes from "./routes/index";

dotenv.config();
const PORT = 5000;

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.use("/api", AppRoutes);

mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => console.log("Connected to MONGODB"))
  .catch((error) => console.log(error));

app.listen(PORT, () => console.log(`Server started on PORT : ${PORT}`));
