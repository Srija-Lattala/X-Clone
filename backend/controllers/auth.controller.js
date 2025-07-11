import { generateTokenAndSetCookie } from "../lib/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";

export const signup = async (req,res) => {
    try {
        const {fullName, username, email, password} = req.body;
        if (!fullName || !username || !email || !password) {
			return res.status(400).json({ error: "All fields are required" });
		}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({error: "Invalid email format"});
        }
        const existingUser = await User.findOne({ username });
        if(existingUser) {
            return res.status(400).json({error: "Username is already taken"});
        }
        const existingEmail = await User.findOne({ email });
        if(existingEmail) {
            return res.status(400).json({error: "Email is already registered"});
        }
        if(password.length < 6) {
            return res.status(400).json({error: "Password must be at least 6 characters long"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        const newUser = new User ({
            fullName,
            username,
            email,
            password:hashedPassword
        })
        if(newUser) {
            await newUser.save();
            const token = generateTokenAndSetCookie(newUser._id, res);
            res.status(201).json({
                token,
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                coverImg: newUser.coverImg,
            })
        } else {
            res.status(400).json({error: "Invalid user data"});
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }  
};

export const login = async (req,res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect) {
            return res.status(400).json({error: "Invalid credentials"});
        }
        const token = generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            token,
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            coverImg: user.coverImg,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }  
}

export const logout = async (req,res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Successfully logged out"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const getMe = async (req,res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}