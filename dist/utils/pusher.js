"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pusher_1 = __importDefault(require("pusher"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pusher = new pusher_1.default({
    appId: process.env.PUSHER_API_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: "ap1",
    useTLS: true,
});
exports.default = pusher;
