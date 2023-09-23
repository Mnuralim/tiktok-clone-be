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
exports.followUser = exports.getAllUsers = exports.getSingleUser = exports.checkUser = exports.addUser = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const PostModel_1 = __importDefault(require("../models/PostModel"));
const pusher_1 = __importDefault(require("../utils/pusher"));
const getUserId_1 = require("../utils/getUserId");
const addUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, email, image } = req.body;
    try {
        const data = yield UserModel_1.default.create({
            username,
            email,
            profile: {
                name,
                image,
            },
        });
        res.status(201).json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
exports.addUser = addUser;
const checkUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const data = yield UserModel_1.default.findOne({ email }).select("-__v");
        if (!data)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
exports.checkUser = checkUser;
const getSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const userId = yield (0, getUserId_1.getId)(username);
    try {
        const user = yield UserModel_1.default.findOne({ username })
            .select("-__v")
            .populate({
            path: "liked_post",
            select: "_id thumbnail user_id total_view",
            populate: {
                path: "user_id",
                select: "username",
            },
        });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const postsUser = yield PostModel_1.default.find({ user_id: userId });
        if (!postsUser)
            return res.status(404).json({ message: "Posts not found" });
        let totalLikes = 0;
        for (const post of postsUser) {
            totalLikes += post.total_likes;
        }
        user.total_likes = totalLikes;
        yield user.save();
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
});
exports.getSingleUser = getSingleUser;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield UserModel_1.default.find().select("-__v");
        const getTotalPost = (id) => __awaiter(void 0, void 0, void 0, function* () {
            const post = yield PostModel_1.default.find({ user_id: id });
            const totalPost = post.length;
            return totalPost;
        });
        for (const user of data) {
            user.total_post = yield getTotalPost(user.id);
            yield user.save();
        }
        console.log(data);
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
const followUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentId, targetId } = req.params;
    try {
        const targetUser = yield UserModel_1.default.findById(targetId);
        const currentUser = yield UserModel_1.default.findById(currentId);
        const alreadyFollow = targetUser === null || targetUser === void 0 ? void 0 : targetUser.followers.find((id) => id.toString() === currentId);
        if (alreadyFollow) {
            //@ts-ignore
            targetUser === null || targetUser === void 0 ? void 0 : targetUser.followers.pull(currentId);
            //@ts-ignore
            currentUser === null || currentUser === void 0 ? void 0 : currentUser.following.pull(targetId);
            yield (targetUser === null || targetUser === void 0 ? void 0 : targetUser.save());
            yield (currentUser === null || currentUser === void 0 ? void 0 : currentUser.save());
        }
        else {
            //@ts-ignore
            targetUser === null || targetUser === void 0 ? void 0 : targetUser.followers.push(currentId);
            //@ts-ignore
            currentUser === null || currentUser === void 0 ? void 0 : currentUser.following.push(targetId);
            yield (targetUser === null || targetUser === void 0 ? void 0 : targetUser.save());
            yield (currentUser === null || currentUser === void 0 ? void 0 : currentUser.save());
        }
        const finalTargetUser = yield UserModel_1.default.findByIdAndUpdate(targetId, {
            total_followers: targetUser === null || targetUser === void 0 ? void 0 : targetUser.followers.length,
        }, {
            new: true,
        });
        yield UserModel_1.default.findByIdAndUpdate(currentId, {
            total_following: currentUser === null || currentUser === void 0 ? void 0 : currentUser.following.length,
        }, {
            new: true,
        });
        pusher_1.default.trigger("user", "followUser", {
            user: finalTargetUser,
        });
        res.status(200).json({ success: true, message: "Success" });
    }
    catch (error) {
        next(error);
    }
});
exports.followUser = followUser;
