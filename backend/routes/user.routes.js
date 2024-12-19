import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { followAndUnfollowUser, getProfileUser, getSuggestedUsers, updateUserProfile } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/profile/:userName", protectRoute, getProfileUser);
router.get("/getSuggestedUsers", protectRoute, getSuggestedUsers);
router.post("/followAndUnfollowUser/:id", protectRoute, followAndUnfollowUser);
router.post("/update", protectRoute, updateUserProfile);
export default router;