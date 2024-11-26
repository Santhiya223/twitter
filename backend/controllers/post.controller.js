import {v2 as cloudinary} from 'cloudinary';
import User from "../models/user.model.js";
import Post from '../models/post.model.js';
import Notification from '../models/notification.model.js';

export const createPost = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const user = await User.findById(userId);

        const {text} = req.body;
        const {img} = req.body;
        if(!user) {
            return res.status(404).json({error: "No User found"});
        }

        if(!text && !img) {
            return res.status(404).json({error: "Create any text or image to post"});
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const post = new Post({
            user: userId,
            text,
            img
        });

        await post.save();
        return res.status(201).json(post);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
        console.log(`error in create post: ${error}`);
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){res.status(404).json({error: "Post not found"})};
        if(post.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({error: "No authentication to delete the post"});
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({error: "Post Deleted Successfully"});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
        console.log(`error in delete post: ${error}`);
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const userId = req.user._id;

        if(!text) {
            return res.status(404).json({error: "Please give any text for comment on post"});
        }

        if(!post){res.status(404).json({error: "Post not found"})};

        const comment ={
            user: userId,
            text
        };

        post.comments.push(comment);
        await post.save();
        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
        console.log(`error in comment on post: ${error}`);
    }
}

export const likeUnlikePost = async (req, res) => {
    try{
        const userId = req.user._id;
        const {id:postid} = req.params;
        const post = await Post.findById(postid);
        if(!post) {
            return res.status(404).json({error: "No post found"});
        }
        const likedPost = post.like.includes(userId);
        if(likedPost) {
            await Post.updateOne({_id:postid}, {$pull:{like:userId}});
            await User.updateOne({_id:userId}, {$pull:{likedPost: postid}});
            return res.status(200).json({message: "Post unliked successfully"});
        } else {
            post.like.push(userId);
            await User.updateOne({_id:userId}, {$push:{likedPost: postid}});

            await post.save();
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            });
            await notification.save();
            return res.status(200).json({message: "Post liked successfully"});
        }
    } catch(ex) {
        res.status(500).json({error: "Internal server error"});
        console.log(`error in likeUnlike Post : ${ex}`);
    }  
}

export const getAllPost = async (req, res) => {
    try {
        const post = await Post.find().sort({createdAt: -1}).populate({
path: "user",
select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
                    });
        if(post.length === 0) {
             res.status(200).json([]);
        }
        return res.status(200).json(post);
    } catch(ex) {
        res.status(500).json({error: "Internal server error"});
        console.log(`error in get All Post : ${ex}`);
    }
}

export const getLikedPost = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({error: "No user found"});
        }
        
        const likedPost = await Post.find({_id:{$in:user.likedPost}})
        .populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
                    });

                    res.status(200).json(likedPost);

    } catch (ex) {
        res.status(501).json({error: "Internal server error"});
        console.log(`error in get liked post: ${ex}`);
    }
}

export const getFollowingPost = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({error: "No user found"});
        }
        const following = user.following;
        
        const followingPost = await Post.find({user:{$in:following}})
        .sort({createdAt: -1})
        .populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
                    });

                    res.status(200).json(followingPost);

    } catch (ex) {
        res.status(501).json({error: "Internal server error"});
        console.log(`error in get following post: ${ex}`);
    }
}

export const getUserPost  = async(req, res) =>{
    try {
        const {username} = req.params;
        const user = await User.findOne({"userName":username});
        if(!user) {
            return res.status(404).json({error: "No user found"});
        }

        const userPost =  await Post.find({user: user._id})
        .sort({createdAt: -1})
        .populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
                    });

                    res.status(200).json(userPost);

    } catch(ex) {
        res.status(501).json({error: "Internal server error"});
        console.log(`error in get user post: ${ex}`);
    }
}

