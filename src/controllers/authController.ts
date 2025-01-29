import { Request, Response, NextFunction, RequestHandler } from "express";
import { MongoServerError } from "mongodb";
import { encodeToken } from "../utils/tokenUtils";
import User from "../models/User";
import { IUser } from "../types/dbInterface";

const register: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, avatar, bio, skills, githubUsername, role } = req.body;
        const user: IUser = new User({ name, email, password, avatar, bio, skills, githubUsername, role });
        await user.save();

        const token = encodeToken({ id: user._id });
        const response = res.status(201).json({
            token,
            user: {
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                skills: user.skills,
                githubUsername: user.githubUsername,
                role: user.role,
            },
        });
        return next(response);
    }
    // we need to catch MongoServerError here
    catch (error: any) {
        if (error instanceof MongoServerError) {
            const response = res.status(400).json({ message: "User already exists." });
            return next(response);
        }
        if (error._message === 'User validation failed') {
            const response = res.status(400).json({ message: error.message });
            return next(response);
        }
        const response = res.status(500).json({ message: "Server error" });
        return next(response);
    }
};

const login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            const response = res.status(400).json({ message: "Invalid credentials" });
            return next(response);
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            const response = res.status(400).json({ message: "Invalid credentials" });
            return next(response);
        }
        const response = res.status(200).json({ token: encodeToken({ id: user._id }), user: { name: user.name, email: user.email, avatar: user.avatar, bio: user.bio, skills: user.skills, githubUsername: user.githubUsername, role: user.role } });
        return next(response);
    }
    catch (error) {
        console.error(error);
        const response = res.status(500).json({ message: "Server error" });
        return next(response);
    }
}

export { register, login };