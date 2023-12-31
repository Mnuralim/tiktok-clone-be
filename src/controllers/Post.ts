import { Request, Response, NextFunction } from "express";
import Post from "../models/PostModel";
import { uploader } from "../utils/uploader";
import { getId } from "../utils/getUserId";
import pusher from "../utils/pusher";
import Comment from "../models/CommentModel";
import User from "../models/UserModel";

export const addPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { caption, location, userId } = req.body;
    const files = req.files;
    //@ts-ignore
    const thumbnailPath = files.thumbnail[0].path as string;
    //@ts-ignore
    const videoPath = files.video[0].path as string;
    const date = new Date();
    const videoPublicId = `videopost${date.getTime()}${userId}`;
    const thumbnailPublicid = `thumbnail${date.getTime()}${userId}`;

    const thumbnailResult = await uploader(thumbnailPath, thumbnailPublicid);
    const videoresult = await uploader(videoPath, videoPublicId);

    const addNewPost = await Post.create({
      user_id: userId,
      caption,
      location,
      thumbnail: thumbnailResult.secure_url,
      post: videoresult.secure_url,
      post_public_id: videoPublicId,
    });

    await addNewPost.populate("user_id", "username _id profile.image");

    await pusher.trigger("post", "newPost", {
      post: addNewPost,
    });

    res.status(201).json({ success: true, data: addNewPost });
  } catch (error) {
    next(error);
  }
};

export const getAllPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await Post.find().populate("user_id", "username _id profile.image").select("-__v -updatedAt").sort("-createdAt");
    for (const post of posts) {
      post.total_comments = (await Comment.find({ post: post._id })).length;
    }
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
};

export const getPostUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  const userId = await getId(username);
  try {
    const userPosts = await Post.find({
      user_id: userId,
    })
      .populate("user_id", "username _id profile.image")
      .select("-__v -updatedAt")
      .sort("createdAt");

    res.status(200).json({ success: true, data: userPosts });
  } catch (error) {
    next(error);
  }
};

export const getSinglePost = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate("user_id", "username _id profile.image").select("-__v -updatedAt");
    if (!post) return res.status(404).json({ message: "Data not found", success: false });

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  const { postId, currentUser } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Data not found", success: false });

    const user = await User.findById(currentUser);
    const alreadyLike = post.likes.find((id) => id.toString() === currentUser);

    if (!alreadyLike) {
      //@ts-ignore
      post.likes.push(currentUser);
      //@ts-ignore
      user?.liked_post.push(postId);
      await post.save();
      await user?.save();
    } else {
      //@ts-ignore
      post.likes.pull(currentUser);
      //@ts-ignore
      user?.liked_post.pull(postId);
      await post.save();
      await user?.save();
    }
    const totalLikes = post.likes.length;
    post.total_likes = totalLikes;

    post.total_comments = (await Comment.find({ post: post._id })).length;

    await post.populate("user_id", "username _id profile.image");
    await post.save();

    await pusher.trigger("post", "likePost", {
      singlePost: post,
    });

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};
