"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const CommentRoute_1 = __importDefault(require("./routes/CommentRoute"));
const PostRoute_1 = __importDefault(require("./routes/PostRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/users", userRoute_1.default);
app.use("/api/v1/posts", PostRoute_1.default);
app.use("/api/v1/comments", CommentRoute_1.default);
exports.default = app;
