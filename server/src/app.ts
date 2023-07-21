require("dotenv").config();
import "./types";
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { trimmer } from "./middlewares/trimmer";
import cors from "cors";
import config from "./config";

const port = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: config.origin, credentials: true }));

app.use(trimmer);
app.use(routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({ error: "404 Not Found" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
});

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() =>
    app.listen(port, () => console.log("Server is listening on port", port))
  )
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
