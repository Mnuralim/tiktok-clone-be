import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profile: {
      name: {
        type: String,
        default: "",
      },
      image: {
        type: String,
      },
      bio: {
        type: String,
        default: "",
      },
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    total_followers: {
      type: Number,
      default: 0,
    },
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    total_following: {
      type: Number,
      default: 0,
    },
    liked_post: [
      {
        type: Schema.Types.ObjectId,
        ref: "posts",
      },
    ],
    total_post: {
      type: Number,
      default: 0,
    },
    total_likes: {
      type: Number,
      default: 0,
    },
    refreshtoken: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema);

export default User;
