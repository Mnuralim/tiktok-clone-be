import express, { Router } from "express";
import { addComment, getAllComments } from "../controllers/Comment";

const router: Router = express.Router();

router.post("/:userId/:postId", addComment);
router.get("/:postId", getAllComments);

const commentRouter = router;

export default commentRouter;
