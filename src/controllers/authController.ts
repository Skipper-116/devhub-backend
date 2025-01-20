import { Request, Response, NextFunction, RequestHandler } from "express";
import { encodeToken } from "../utils/tokenUtils";
import User from "../models/User";
import { IUser } from "../types/dbInterface";

const register: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, avatar, bio, skills, githubUsername, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists." });
            return next();
        }

        const allSkills = skills?.split(",").map((skill: string) => skill.trim());
        const user: IUser = new User({ name, email, password, avatar, bio, skills: allSkills, githubUsername, role });
        await user.save();

        const token = encodeToken({ id: user._id });
        res.status(201).json({
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
        return next();
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
        return next();
    }
};

const login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return next();
        }
        const isMatch = await user.comparePassword(password);
        res.status(200).json({ token: encodeToken({ id: user._id }), user: { name: user.name, email: user.email, avatar: user.avatar, bio: user.bio, skills: user.skills, githubUsername: user.githubUsername, role: user.role } });
        return next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
        return next();
    }
}

export { register, login };