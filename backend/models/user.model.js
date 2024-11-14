import mongoose from 'mongoose';

const userSchema =  new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    profileimg: {
        type: String,
        default: ""
    },
    coverImg: {
        type: String,
        default: ""
    }
}, { timeStamps: true });

const User = await new mongoose.model("User", userSchema);
export default User;