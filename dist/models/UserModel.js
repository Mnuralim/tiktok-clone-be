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
const userSchema = new mongoose_1.default.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    total_followers: {
        type: Number,
        default: 0,
    },
    following: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    total_following: {
        type: Number,
        default: 0,
    },
    liked_post: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
const User = mongoose_1.default.model("users", userSchema);
exports.default = User;
