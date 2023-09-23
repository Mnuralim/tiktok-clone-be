"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Post_1 = require("../controllers/Post");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.post("/add-post", upload_1.upload, Post_1.addPost);
router.get("/all-post", Post_1.getAllPost);
router.get("/user-post/:username", Post_1.getPostUser);
router.get("/single-post/:id", Post_1.getSinglePost);
router.put("/likes/:postId/:currentUser", Post_1.likePost);
const PostRouter = router;
exports.default = PostRouter;
