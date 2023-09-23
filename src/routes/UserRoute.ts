import express, { Router } from "express";
import { addUser, checkUser, followUser, getAllUsers, getSingleUser } from "../controllers/User";

const router: Router = express.Router();

router.post("/add-user", addUser);
router.get("/check-user/:email", checkUser);
router.get("/single-user/:username", getSingleUser);
router.get("/all-user", getAllUsers);
router.put("/follows/:currentId/:targetId", followUser);

const UserRouter = router;

export default UserRouter;
