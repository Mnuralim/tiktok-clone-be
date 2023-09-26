"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Comment_1 = require("../controllers/Comment");
const router = express_1.default.Router();
router.post("/:userId/:postId", Comment_1.addComment);
router.get("/:postId", Comment_1.getAllComments);
const commentRouter = router;
exports.default = commentRouter;
