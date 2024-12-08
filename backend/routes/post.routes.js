import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { commentOnPost, createPost, deletePost, getAllPost, getFollowingPost, getLikedPost, getUserPost, likeUnlikePost } from '../controllers/post.controller.js';
const router= express.Router();





export default router;