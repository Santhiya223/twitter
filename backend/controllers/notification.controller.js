import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getNotifications = async (req, res) => {
    try {

        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) res.status(404).json({error: "No user found"});
        const notifications = await Notification.find({to: userId}).populate({
            path: "from",
            select: "userName profileimg"
        });
        await Notification.updateMany({to: userId}, {read:true});
        res.status(200).json(notifications);
    } catch(e) {
        res.status(501).json({error: "Internal Server Error"});
        console.log(`error in get noitifications notification controller: ${e}`);
    }
}

export const deleteNotifications = async (req, res) => {
    try {

        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) res.status(404).json({error: "No user found"});
        await Notification.deleteMany({to:userId});

        res.status(200).json({message: "Notifications deleted successfully"});
    } catch(e) {
        res.status(501).json({error: "Internal Server Error"});
        console.log(`error in get noitifications notification controller: ${e}`);
    }
}