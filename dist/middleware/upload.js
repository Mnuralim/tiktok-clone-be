"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({});
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter(req, file, callback) {
        if (file.fieldname === "video") {
            file.mimetype === "video/mp4" || file.mimetype == "video/mov" ? callback(null, true) : callback(null, false);
        }
        else if (file.fieldname === "thumbnail") {
            file.mimetype === "image/jpeg" || file.mimetype == "image/png" || file.mimetype === "image/jpg" ? callback(null, true) : callback(null, false);
        }
    },
    limits: {
        fileSize: 11000000,
    },
}).fields([
    {
        name: "video",
        maxCount: 1,
    },
    {
        name: "thumbnail",
        maxCount: 1,
    },
]);
