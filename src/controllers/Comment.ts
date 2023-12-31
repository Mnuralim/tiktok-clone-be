import { Request, Response, NextFunction } from "express";
import Comment from "../models/CommentModel";
import pusher from "../utils/pusher";

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, postId } = req.params;
  const { comment } = req.body;

  try {
    const addNewComment = await Comment.create({
      user: userId,
      post: postId,
      text: comment,
    });
    await addNewComment.populate("user", "_id profile username");
    await pusher.trigger("comment", "commentPost", {
      comment: addNewComment,
    });

    res.status(201).json({ success: true, data: addNewComment });
  } catch (error) {
    next(error);
  }
};

export const getAllComments = async (req: Request, res: Response, next: NextFunction) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ post: postId }).populate("user", "_id profile username");
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};
