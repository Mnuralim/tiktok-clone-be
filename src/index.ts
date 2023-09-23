import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { db } from "./config/db";
import UserRouter from "./routes/UserRoute";
import PostRouter from "./routes/PostRoute";
import commentRouter from "./routes/CommentRoute";

dotenv.config();
db();
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/user", UserRouter);
app.use("/api/post", PostRouter);
app.use("/api/comments", commentRouter);

app.listen(process.env.PORT, () => console.log(`Server is up and running on port ${process.env.PORT}`));
