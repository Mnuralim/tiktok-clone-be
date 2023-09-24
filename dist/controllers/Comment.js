"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllComments = exports.addComment = void 0;
const CommentModel_1 = __importDefault(require("../models/CommentModel"));
const pusher_1 = __importDefault(require("../utils/pusher"));
const addComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId } = req.params;
    const { comment } = req.body;
    try {
        const data = yield CommentModel_1.default.create({
            user: userId,
            post: postId,
            text: comment,
        });
        yield data.populate("user", "_id profile username");
        yield pusher_1.default.trigger("comment", "commentPost", {
            comment: data,
        });
        res.status(201).json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
exports.addComment = addComment;
const getAllComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        const data = yield CommentModel_1.default.find({ post: postId }).populate("user", "_id profile username");
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllComments = getAllComments;
