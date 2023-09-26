import express, { Router } from "express";
import { addUser, checkUser, followUser, getAllUsers, getSingleUser } from "../controllers/User";

const router: Router = express.Router();

router.post("/", addUser);
router.get("/", getAllUsers);
router.put("/follows/:currentId/:targetId", followUser);
router.get("/check-user/:email", checkUser);
router.get("/:username", getSingleUser);

const UserRouter = router;

export default UserRouter;
