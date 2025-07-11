import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import {v2 as cloudinary} from "cloudinary";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
    try {
        const {text} = req.body;
        let {img} = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User not found"});

        if(!text && !img) return res.status(400).json({message: "Post must contain text or an image"});

        if(img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post ({
            user: userId,
            text,
            img,
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch  (error) {
        res.status(500).json({error: "Internal Server Error"});
        console.log("Error in createPost controller: ", error);

    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({message: "Post not found"});
        if(post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({message: "You are not authorized to delete this post"});
        }

        if (post.isRepost && post.originalPost) {
            await Post.findByIdAndUpdate(post.originalPost, {
                $pull: { repostedBy: req.user._id }
            });
        }

        if(post.img) {
            const imgParts = post.img.split("/");
            const imgFileName = imgParts[imgParts.length - 1]; // Get last part of URL
            const imgId = imgFileName.split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Post deleted successfully"});

    } catch(error) {
        console.log("Error in deletePost controller: ", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        if(!text) {
            return res.status(400).json({error: "Text field is required"});
        }
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({error: "Post not found"});
        const comment = {user: userId, text};
        post.comments.push(comment);
        await post.save();
        res.status(200).json(post);
    } catch(error) {
        console.log("Error in commentOnPost controller: ", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const likeUnlikePost = async (req,res) => {
    try {
        const userId = req.user._id;
        const {id: postId} = req.params;

        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({error: "Post not found"});
        const userLikedPost = post.likes.includes(userId);
        if(userLikedPost) {
            //unlike post
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
            await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}});
            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        } else {
            post.likes.push(userId);
            await User.updateOne({_id: userId}, {$push: {likedPosts: postId}});
            await post.save();
            const notification = new Notification ({
                from : userId,
                to: post.user,
                type: "like"
            });
            await notification.save();
            const updatedLikes = post.likes
            res.status(200).json(updatedLikes);
    
        }
        
       
    } catch (error) {
        console.log("Error in likeUnlikePost controller: ", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1}).populate({
            path: "user",
            select: "-password"
        })
        .populate({
            path: "comments.user",
            select: "-password"
        });

        if(posts.length === 0) {
            res.status(200).json([]);
        }
        res.status(200).json(posts);
    } catch(error) {
        console.log("Error in getPosts controller: ", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const getLikedPosts = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if(!user) res.status(404).json({error: "User not found"});
        const likedPosts = await Post.find({_id: {$in: user.likedPosts}})
        .populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        });
        res.status(200).json(likedPosts);
    } catch(error) {
        console.log("Error in getLikedPosts controller: ", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) res.status(404).json({error: "User not found"});
        const following = user.following;
        const findPosts = await Post.find({user: {$in: following}})
        .sort({createdAt: -1}).
        populate({
            path: "user",
            select: "-password",
        }).
        populate({
            path: "comments.user",
            select: "-password",
        });
        res.status(200).json(findPosts);

    } catch (error) {
        console.log("Error in getFollowingPosts controller: ", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({username});
        if(!user) return res.status(404).json({error: "User not found"});
        const posts = await Post.find({user: user._id})
        .sort({createdAt: -1})
        .populate({
            path: "user",
            select: "-password",
        }).populate({
            path: "comments.user",
            select: "-password",
        });
        res.status(200).json(posts);

    } catch (error) {
        console.log("Error in getUserPosts controller: ", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const repostPost = async (req, res) => {
    try {
        const originalPostId = req.params.id;

        const originalPost = await Post.findById(originalPostId);
        if (!originalPost) {
            return res.status(404).json({ message: "Original post not found." });
        }

        const alreadyReposted = await Post.findOne({
            user: req.user._id,
            isRepost: true,
            originalPost: originalPostId
        });

        if (alreadyReposted) {
            return res.status(400).json({ message: "You already reposted this." });
        }

        const repost = new Post({
            user: req.user._id,
            text: originalPost.text,
            img: originalPost.img || "",
            isRepost: true,
            originalPost: originalPost._id
        });

        await repost.save();

        // Add user to repostedBy list in original post
        if (!originalPost.repostedBy.includes(req.user._id)) {
            originalPost.repostedBy.push(req.user._id);
            await originalPost.save();
        }

        // Create repost notification
        if (req.user._id.toString() !== originalPost.user.toString()) {
            const notification = new Notification({
                from: req.user._id,
                to: originalPost.user,
                type: "repost"
            });
            await notification.save();
        }

        return res.status(201).json({ message: "Post reposted successfully!", repost });

    } catch (err) {
        console.error("Error in repostPost:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

export const saveUnsavePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const alreadySaved = user.savedPosts.map(String).includes(postId);

        if (alreadySaved) {
            await User.findByIdAndUpdate(userId, {
                $pull: { savedPosts: postId },
            });
            return res.status(200).json({
                message: "Post unsaved successfully",
            }); 
        } else {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { savedPosts: postId },
            });
            const updatedUser = await User.findById(userId);
            return res.status(200).json({
                message: alreadySaved ? "Post unsaved successfully" : "Post saved successfully",
                savedPosts: updatedUser.savedPosts,
            });
        }
    } catch (error) {
        console.error("Error in saveUnsavePost controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getSavedPosts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: "savedPosts",
            populate: {
                path: "user comments.user",
                select: "-password"
            }
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json(user.savedPosts);
    } catch (error) {
        console.error("Error in getSavedPosts controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
