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
exports.likePost = exports.getSinglePost = exports.getPostUser = exports.getAllPost = exports.addPost = void 0;
const PostModel_1 = __importDefault(require("../models/PostModel"));
const uploader_1 = require("../utils/uploader");
const getUserId_1 = require("../utils/getUserId");
const pusher_1 = __importDefault(require("../utils/pusher"));
const CommentModel_1 = __importDefault(require("../models/CommentModel"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const addPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { caption, location, userId } = req.body;
        const files = req.files;
        //@ts-ignore
        const thumbnailPath = files.thumbnail[0].path;
        //@ts-ignore
        const videoPath = files.video[0].path;
        const date = new Date();
        const videoPublicId = `videopost${date.getTime()}${userId}`;
        const thumbnailPublicid = `thumbnail${date.getTime()}${userId}`;
        const thumbnailResult = yield (0, uploader_1.uploader)(thumbnailPath, thumbnailPublicid);
        const videoresult = yield (0, uploader_1.uploader)(videoPath, videoPublicId);
        const data = yield PostModel_1.default.create({
            user_id: userId,
            caption,
            location,
            thumbnail: thumbnailResult.secure_url,
            post: videoresult.secure_url,
            post_public_id: videoPublicId,
        });
        const newData = yield data.populate("user_id", "username _id profile.image");
        yield pusher_1.default.trigger("post", "newPost", {
            post: newData,
        });
        res.status(201).json({ success: true, newData });
    }
    catch (error) {
        next(error);
    }
});
exports.addPost = addPost;
const getAllPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield PostModel_1.default.find().populate("user_id", "username _id profile.image").select("-__v -updatedAt").sort("-createdAt");
        for (const post of posts) {
            post.total_comments = (yield CommentModel_1.default.find({ post: post._id })).length;
        }
        res.status(200).json({ success: true, data: posts });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllPost = getAllPost;
const getPostUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const userId = yield (0, getUserId_1.getId)(username);
    try {
        const data = yield PostModel_1.default.find({
            user_id: userId,
        })
            .populate("user_id", "username _id profile.image")
            .select("-__v -updatedAt");
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
exports.getPostUser = getPostUser;
const getSinglePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const data = yield PostModel_1.default.findById(id).populate("user_id", "username _id profile.image").select("-__v -updatedAt");
        if (!data)
            return res.status(404).json({ message: "Data not found", success: false });
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
exports.getSinglePost = getSinglePost;
const likePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, currentUser } = req.params;
    try {
        const post = yield PostModel_1.default.findById(postId);
        if (!post)
            return res.status(404).json({ message: "Data not found", success: false });
        const user = yield UserModel_1.default.findById(currentUser);
        const alreadyLike = post.likes.find((id) => id.toString() === currentUser);
        if (!alreadyLike) {
            //@ts-ignore
            post.likes.push(currentUser);
            //@ts-ignore
            user === null || user === void 0 ? void 0 : user.liked_post.push(postId);
            yield post.save();
            yield (user === null || user === void 0 ? void 0 : user.save());
        }
        else {
            //@ts-ignore
            post.likes.pull(currentUser);
            //@ts-ignore
            user === null || user === void 0 ? void 0 : user.liked_post.pull(postId);
            yield post.save();
            yield (user === null || user === void 0 ? void 0 : user.save());
        }
        const totalLikes = post.likes.length;
        post.total_likes = totalLikes;
        post.total_comments = (yield CommentModel_1.default.find({ post: post._id })).length;
        yield post.populate("user_id", "username _id profile.image");
        yield post.save();
        const allPost = yield PostModel_1.default.find().populate("user_id", "username _id profile.image").select("-__v -updatedAt").sort("-createdAt");
        pusher_1.default.trigger("post", "likePost", {
            allPost: allPost,
            singlePost: post,
        });
        res.status(200).json({ success: true, data: post });
    }
    catch (error) {
        next(error);
    }
});
exports.likePost = likePost;
