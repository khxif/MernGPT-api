import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import AppRoutes from "./routes/index";
const cookieParser = require("cookie-parser");

dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://mern-gpt.vercel.app"
        : "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api", AppRoutes);

mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => {
    console.log("Connected to MONGODB");
    app.listen(PORT, () => console.log(`Server started on PORT : ${PORT}`));
  })
  .catch((error) => console.log(error));
