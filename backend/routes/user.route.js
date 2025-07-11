import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile, followUnfollowUser, getSuggestedUser, updateUser, searchUsers } from "../controllers/user.controller.js";
import { removeProfileImage, removeCoverImage } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUser);
router.get("/search", protectRoute, searchUsers);
router.post("/follow/:id",protectRoute, followUnfollowUser);
router.post("/update",protectRoute,updateUser);
router.put("/removeProfileImage", protectRoute, removeProfileImage);
router.put("/removeCoverImage", protectRoute, removeCoverImage);



export default router;