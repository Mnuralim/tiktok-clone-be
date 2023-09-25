import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel";
import Post from "../models/PostModel";
import pusher from "../utils/pusher";
import { getId } from "../utils/getUserId";

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, username, email, image } = req.body;

  try {
    const data = await User.create({
      username,
      email,
      profile: {
        name,
        image,
      },
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const checkUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.params;
  try {
    const data = await User.findOne({ email }).select("-__v");
    if (!data) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  const userId = await getId(username);
  try {
    const user = await User.findOne({ username })
      .select("-__v")
      .populate({
        path: "liked_post",
        select: "_id thumbnail user_id total_view createdAt",
        populate: {
          path: "user_id",
          select: "username",
        },
      });
    if (!user) return res.status(404).json({ message: "User not found" });
    const postsUser = await Post.find({ user_id: userId });
    if (!postsUser) return res.status(404).json({ message: "Posts not found" });

    let totalLikes = 0;
    for (const post of postsUser) {
      totalLikes += post.total_likes;
    }

    user.total_likes = totalLikes;
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await User.find().select("-__v");

    const getTotalPost = async (id: string) => {
      const post = await Post.find({ user_id: id });
      const totalPost = post.length;
      return totalPost;
    };

    for (const user of data) {
      user.total_post = await getTotalPost(user.id);
      await user.save();
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req: Request, res: Response, next: NextFunction) => {
  const { currentId, targetId } = req.params;
  try {
    const targetUser = await User.findById(targetId);
    const currentUser = await User.findById(currentId);
    const alreadyFollow = targetUser?.followers.find((id) => id.toString() === currentId);

    if (alreadyFollow) {
      //@ts-ignore
      targetUser?.followers.pull(currentId);

      //@ts-ignore
      currentUser?.following.pull(targetId);

      await targetUser?.save();
      await currentUser?.save();
    } else {
      //@ts-ignore
      targetUser?.followers.push(currentId);
      //@ts-ignore
      currentUser?.following.push(targetId);
      await targetUser?.save();
      await currentUser?.save();
    }

    const finalTargetUser = await User.findByIdAndUpdate(
      targetId,
      {
        total_followers: targetUser?.followers.length,
      },
      {
        new: true,
      }
    );

    await User.findByIdAndUpdate(
      currentId,
      {
        total_following: currentUser?.following.length,
      },
      {
        new: true,
      }
    );

    await pusher.trigger("user", "followUser", {
      user: finalTargetUser,
    });

    res.status(200).json({ success: true, message: "Success" });
  } catch (error) {
    next(error);
  }
};
