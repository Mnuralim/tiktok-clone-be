import express, { Router } from "express";
import { addPost, getAllPost, getPostUser, getSinglePost, likePost } from "../controllers/Post";
import { upload } from "../middleware/upload";

const router: Router = express.Router();

router.post("/", upload, addPost);
router.get("/", getAllPost);
router.get("/user-post/:username", getPostUser);
router.put("/likes/:postId/:currentUser", likePost);
router.get("/:id", getSinglePost);

const PostRouter = router;

export default PostRouter;
