import express, { Router } from "express";
import { addComment, getAllComments } from "../controllers/Comment";

const router: Router = express.Router();

router.post("/add-comment/:userId/:postId", addComment);
router.get("/all-comments/:postId", getAllComments);

const commentRouter = router;

export default commentRouter;
