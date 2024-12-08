import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
export const signup = async (req, res) => {
    try {
        const {fullName, userName, password, email} = req.body;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error: "Invalid Email format"});
        }
        

        // Example usage:
        const validateEmail = (email) => emailRegex.test(email);
        
        // Test the function
        console.log(validateEmail("test@example.com")); // true
        console.log(validateEmail("invalid-email"));    // false
        
        const existingUser = await User.findOne({userName});
        if(existingUser) {
            return res.status(400).json({error: "Username already taken"});
        }
        const existingEmail = await User.findOne({email});
        if(existingEmail) {
            return res.status(400).json({error: "Email already taken"});
        }

        if(password.length < 6) {
            return res.status(400).json({error: "Password should be atleast six characters long"});
        }

        // Hashed Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            userName,
            email,
            password: hashedPassword
        });

        if(newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
        }

        return res.status(201).json({
            _id: newUser._id,
            userName: newUser.userName,
            fullName: newUser.fullName,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileimg: newUser.profileimg,
            coverImg: newUser.coverImg
        });

    } catch (e) {
        console.log(`error in sign up controller ${e}`);
        return res.status(501).json({error: "Internal server error"});
    }
}

export const login = async (req, res) => {
   try {
    const {username, password} = req.body;
    const user = await User.findOne({userName: username});
    const isPasswordValid = await bcrypt.compare(password, user?.password || "");
    console.log("Entered Password:", password);
console.log("Stored Hashed Password:", user?.password);
    if(!user || !isPasswordValid) {
        return res.status(400).json({error: "Incorrect Login Credentials"});
    }

    generateTokenAndSetCookie(user._id, res);
     res.status(201).json({
        _id: user._id,
        userName: user.userName,
        fullName: user.fullName,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileimg: user.profileimg,
        coverImg: user.coverImg
    });
   } catch(e) {
    console.log(`error in login controller: ${e}`);
    return res.status(500).json({error: "Internal Server Error"});
   }
}

export const logout = async (req, res) => {
   try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
   } catch (ex) {
        console.log(`error in logout controller: ${ex}"`);
        return res.status(500).json({error: "Internal Server Error"});
   }
}

export const getMe =  async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileimg: user.profileimg,
            coverImg: user.coverImg
        });
    } catch(er) {
        console.log(`error in getMe: ${er}`);
        return res.status(500).json({error: "Internal Server Error"});
    }
}