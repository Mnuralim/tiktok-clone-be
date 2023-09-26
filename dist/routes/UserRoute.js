"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = require("../controllers/User");
const router = express_1.default.Router();
router.post("/", User_1.addUser);
router.get("/", User_1.getAllUsers);
router.put("/follows/:currentId/:targetId", User_1.followUser);
router.get("/check-user/:email", User_1.checkUser);
router.get("/:username", User_1.getSingleUser);
const UserRouter = router;
exports.default = UserRouter;
