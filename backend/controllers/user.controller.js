
import {v2 as cloudinary} from 'cloudinary'; 
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

export const getProfileUser = async (req, res) =>  {
    const {userName} = req.params;
    try {
        const user = await User.findOne({userName}).select("-password");
        if(!user) {
            res.status(400).json({error: "No User found"});
        }
        res.status(200).json(user);
    } catch(ex) {
        res.status(500).json({error: "Internal Server Error"});
        console.log(`error in get user profile ${ex}`);
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const usersFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            {
                $match: {
                    _id: {$ne:userId}
                }
            },
            {
                $sample: {size: 10}
            }

        ]);

        const filteredUsers = users.filter(user => !usersFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0,4);
        suggestedUsers.forEach(user => user.password = null);
        res.status(200).json(suggestedUsers);

       
    } catch(ex) {
        res.status(500).json({error: "Internal Server Error"});
        console.log(`error in get suggested users: ${ex}`);
    }
}

export const  followAndUnfollowUser = async (req,res) => {
    try {
        const {id} = req.params;
        const currentUser = await User.findById(req.user._id);
        const userToModify = await User.findById(id);

        if(id == req.user._id.toString()) {
            return res.status(500).json({error: "You cannot follow or unfollow yourself"});
        }

        if(!currentUser || !userToModify) {
            return res.status(500).json({error: "No user found"});
        }

        const isfollowing = await currentUser.following.includes(id);
        if(isfollowing) {
            await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}});
            res.status(200).json({message: "User Unfollowed Successfully"});
        } else {
            await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});

            const newNotification = new Notification({
                from: req.user._id,
                to: userToModify._id,
                type: "follow",
            });
            await newNotification.save();
            res.status(200).json({message: "User followed Successfully"});
        }
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
        console.log(`error in follow And Unfollow users: ${error}`);
    }
   
}

export const updateUserProfile =  async (req, res) => {
    const {fullName, userName, email, OldPassword, newPassword, bio, link} = req.body;
    let {profileImg, coverImg} = req.body;

    try {
        const userId = req.user._id;
        var user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({error: "User not found"});
        }

        if((!OldPassword && newPassword)||(!newPassword && OldPassword)) {
            return res.status(400).json({error: "Please provide both the current password and new password"});
        }

        if(OldPassword && newPassword) {
            const isMatch = await bcrypt.compare(OldPassword, user.password);
            if(!isMatch) {
                return res.status(400).json({error: "Current password is incorrect"});
            }

            if(newPassword.length < 6) {
                return res.status(400).json({error: "Password must be atleast 6 characters long"});
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);

        }

        if (profileImg){
            if(user.profileimg) {
                await cloudinary.uploader.destroy(user.profileimg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedResponse.secure_url;
        }


        if(coverImg) {
            if(user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedResponse.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.userName = userName || user.userName;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileimg = profileImg || user.profileimg;
        user.coverImg = coverImg || user.coverImg;

        user = await user.save();
        user.password = null;
        return res.status(200).json(user);

    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
        console.log(`error in update user profile: ${error}`);
    }

}