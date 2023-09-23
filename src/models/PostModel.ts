import mongoose, { Schema } from "mongoose";

// Declare the Schema of the Mongo model
const postSchema = new mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    post: {
      type: String,
      required: true,
    },
    post_public_id: String,
    thumbnail: String,
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    total_likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
    total_comments: {
      type: Number,
      default: 0,
    },
    total_view: {
      type: Number,
      default: 0,
    },
    location: String,
  },
  {
    timestamps: true,
  }
);

//Export the model
const Post = mongoose.model("posts", postSchema);

export default Post;
