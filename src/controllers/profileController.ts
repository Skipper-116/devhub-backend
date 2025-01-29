import { Request, Response, NextFunction, RequestHandler } from "express";
import User from "../models/User";
import { IResponse } from "../types/common";

const getProfile: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            const response: IResponse = {
                message: "Unauthorized",
            };
            res.status(401).json(response);
            return next(response);
        }
        const userId = req.user.id;
        const user = await User.findById(userId).exec();
        if (!user) {
            const response: IResponse = {
                message: "User not found",
            };
            res.status(404).json(response);
            return next(response);
        }
        const response = {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            skills: user.skills,
            githubUsername: user.githubUsername,
            role: user.role
        };
        res.status(200).json(response);
        return next();
    }
    catch (error) {
        console.error(error);
        const response: IResponse = {
            message: "Server error",
        };
        res.status(500).json(response);
        return next(response);
    }
};

const updateProfile: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            const response: IResponse = {
                message: "Unauthorized",
            };
            res.status(401).json(response);
            return next(response);
        }
        const userId = req.user.id;
        const user = await User.findById(userId).exec();
        if (!user) {
            const response: IResponse = {
                message: "User not found",
            };
            res.status(404).json(response);
            return next(response);
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.avatar = req.body.avatar || user.avatar;
        user.bio = req.body.bio || user.bio;
        user.skills = req.body.skills || user.skills;
        user.githubUsername = req.body.githubUsername || user.githubUsername;

        await user.save();

        const response = {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            skills: user.skills,
            githubUsername: user.githubUsername,
            role: user.role
        };
        res.status(200).json(response);
        return next();
    }
    catch (error) {
        console.error(error);
        const response: IResponse = {
            message: "Server error",
        };
        res.status(500).json(response);
        return next(response);
    }
}

// This function soft deletes a user profile
const deleteProfile: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            const response: IResponse = {
                message: "Unauthorized",
            };
            res.status(401).json(response);
            return next(response);
        }
        const userId = req.body.id;
        const user = await User.findById(userId).exec();
        if (!user) {
            const response: IResponse = {
                message: "User not found",
            };
            res.status(404).json(response);
            return next(response);
        }
        if (user.role !== "admin" || user.id !== req.user.id) {
            const response: IResponse = {
                message: "Unauthorized",
            };
            res.status(401).json(response);
            return next(response);
        }
        if (!req.body.reason) {
            const response: IResponse = {
                message: "Please provide a reason for deleting the user",
            };
            res.status(400).json(response);
            return next(response);
        }


        const response: IResponse = await user.void("Deleted by user", req.user.id);
        res.status(200).json(response);
        return next();
    }
    catch (error) {
        console.error(error);
        const response: IResponse = {
            message: "Server error",
        };
        res.status(500).json(response);
        return next(response);
    }
};

export { getProfile, updateProfile, deleteProfile };