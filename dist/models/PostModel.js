"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Declare the Schema of the Mongo model
const postSchema = new mongoose_1.default.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "users",
        },
    ],
    total_likes: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
//Export the model
const Post = mongoose_1.default.model("posts", postSchema);
exports.default = Post;
