import express, { Router } from "express";
import { addPost, getAllPost, getPostUser, getSinglePost, likePost } from "../controllers/Post";
import { upload } from "../middleware/upload";

const router: Router = express.Router();

router.post("/add-post", upload, addPost);
router.get("/all-post", getAllPost);
router.get("/user-post/:username", getPostUser);
router.get("/single-post/:id", getSinglePost);
router.put("/likes/:postId/:currentUser", likePost);

const PostRouter = router;

export default PostRouter;
