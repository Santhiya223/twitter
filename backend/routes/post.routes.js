import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { commentOnPost, createPost, deletePost, getAllPost, getFollowingPost, getLikedPost, getUserPost, likeUnlikePost } from '../controllers/post.controller.js';
const router= express.Router();

router.post("/create", protectRoute,createPost);
router.delete("/delete/:id", protectRoute,deletePost);
router.post("/comment/:id", protectRoute,commentOnPost);
router.post("/likeUnlike/:id", protectRoute, likeUnlikePost);
router.get("/getAllPost",  protectRoute, getAllPost);
router.get("/getLikedPost/:id", protectRoute, getLikedPost);
router.get("/getFollowingPost", protectRoute, getFollowingPost);
router.get("/getUserPost/:username", protectRoute, getUserPost);



export default router;