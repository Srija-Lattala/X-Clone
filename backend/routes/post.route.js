import express from "express";
import { protectRoute } from '../middleware/protectRoute.js';
import { createPost, deletePost, commentOnPost, likeUnlikePost, getPosts , getLikedPosts, getFollowingPosts, getUserPosts, repostPost, saveUnsavePost, getSavedPosts} from '../controllers/post.controller.js';

const router = express.Router();

router.get("/all", protectRoute, getPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/user/:username", protectRoute, getUserPosts);

router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.post("/repost/:id", protectRoute, repostPost); 
router.delete("/:id", protectRoute, deletePost);
router.post("/:id/save", protectRoute, saveUnsavePost);
router.get("/saved", protectRoute, getSavedPosts);


export default router;