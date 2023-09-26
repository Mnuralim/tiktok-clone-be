import express from "express";
import cors from "cors";
import morgan from "morgan";
import commentRouter from "./routes/CommentRoute";
import PostRouter from "./routes/PostRoute";
import UserRouter from "./routes/userRoute";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/posts", PostRouter);
app.use("/api/v1/comments", commentRouter);

export default app;
