import { Request, Response, NextFunction, RequestHandler } from "express";
import Project from "../models/Project";
import Comment from "../models/Comment";
import { IResponse } from "../types/common";

const createProject: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            const result: IResponse = {
                message: "Unauthorized",
            };
            const response = res.status(401).json(result);
            return next(response);
        }
        const { title, description, techStack, githubLink, demoLink, screenshots, category } = req.body;
        const createdBy = req.user.id;
        const project = new Project({ title, description, demoLink, screenshots, category, createdBy, techStack, githubLink });
        await project.save();
        const result = {
            message: "Project created successfully",
            project,
        };
        const response = res.status(201).json(result);
        return next(response);
    }
    catch (error) {
        console.error(error);
        const result: IResponse = {
            message: "Server error",
        };
        const response = res.status(500).json(result);
        return next(response);
    }
}

const getProjects: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit } = req.query;
        const count = await Project.countDocuments().exec();
        const results = await Project.find().skip(Number(page) * Number(limit)).limit(Number(limit)).exec();
        const projects = results.map(project => ({
            _id: project._id,
            title: project.title,
            description: project.description,
            techStack: project.techStack,
            githubLink: project.githubLink,
            demoLink: project.demoLink,
            screenshots: project.screenshots,
            category: project.category,
            createdBy: project.createdBy,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            commentsCount: project.comments?.length,
            likesCount: project.likes?.length,
        }));
        const result = {
            projects,
            count,
        };
        const response = res.status(200).json(result);
        return next(response);
    }
    catch (error) {
        console.error(error);
        const result: IResponse = {
            message: "Server error",
        };
        const response = res.status(500).json(result);
        return next(response);
    }
}

const getProject: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await Project.findById(id).exec();
        if (!result) {
            const result: IResponse = {
                message: "Project not found",
            };
            const response = res.status(404).json(result);
            return next(response);
        }
        const project = {
            _id: result._id,
            title: result.title,
            description: result.description,
            techStack: result.techStack,
            githubLink: result.githubLink,
            demoLink: result.demoLink,
            screenshots: result.screenshots,
            category: result.category,
            createdBy: result.createdBy,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            commentsCount: result.comments?.length || 0,
            likesCount: result.likes?.length || 0,
        };
        const response = res.status(200).json({ project: project });
        return next(response);
    }
    catch (error) {
        console.error(error);
        const result: IResponse = {
            message: "Server error",
        };
        const response = res.status(500).json(result);
        return next(response);
    }
}

const updateProject: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            const result: IResponse = {
                message: "Unauthorized",
            };
            const response = res.status(401).json(result);
            return next(response);
        }
        const { id } = req.params;
        const project = await Project.findById(id).exec();
        if (!project) {
            const result: IResponse = {
                message: "Project not found",
            };
            const response = res.status(404).json(result);
            return next(response);
        }
        if (project.createdBy.toString() !== req.user.id) {
            const result: IResponse = {
                message: "Unauthorized",
            };
            const response = res.status(401).json(result);
            return next(response);
        }
        const { title, description, techStack, githubLink, demoLink, screenshots, category } = req.body;
        project.title = title || project.title;
        project.description = description || project.description;
        project.techStack = techStack || project.techStack;
        project.githubLink = githubLink || project.githubLink;
        project.demoLink = demoLink || project.demoLink;
        project.screenshots = screenshots || project.screenshots;
        project.category = category || project.category;
        await project.save();
        const result = {
            message: "Project updated successfully",
            project: {
                _id: project._id,
                title: project.title,
                description: project.description,
                techStack: project.techStack,
                githubLink: project.githubLink,
                demoLink: project.demoLink,
                screenshots: project.screenshots,
                category: project.category,
                createdBy: project.createdBy,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                commentsCount: project.comments?.length,
                likesCount: project.likes?.length,
            },
        };
        const response = res.status(200).json(result);
        return next(response);
    }
    catch (error) {
        console.error(error);
        const result: IResponse = {
            message: "Server error",
        };
        const response = res.status(500).json(result);
        return next(response);
    }
}

const deleteProject: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            const result: IResponse = {
                message: "Unauthorized",
            };
            const response = res.status(401).json(result);
            return next(response);
        }
        const { id, reason } = req.params;
        const project = await Project.findById(id).exec();
        if (!project) {
            const result: IResponse = {
                message: "Project not found",
            };
            const response = res.status(404).json(result);
            return next(response);
        }
        if (project.createdBy.toString() !== req.user.id) {
            const result: IResponse = {
                message: "Unauthorized",
            };
            const response = res.status(401).json(result);
            return next(response);
        }
        await project.void(reason, req.user.id);
        const result: IResponse = {
            message: "Project deleted successfully",
        };
        const response = res.status(200).json(result);
        return next(response);
    }
    catch (error) {
        console.error(error);
        const result: IResponse = {
            message: "Server error",
        };
        const response = res.status(500).json(result);
        return next(response);
    }
}

const likeProject: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            const result: IResponse = {
                message: "Unauthorized",
            };
            const response = res.status(401).json(result);
            return next(response);
        }
        const { id } = req.params;
        const project = await Project.findById(id).exec();
        if (!project) {
            const result: IResponse = {
                message: "Project not found",
            };
            const response = res.status(404).json(result);
            return next(response);
        }
        const userId = req.user.id;
        let message = "Project liked successfully";
        if (project.likes?.includes(userId)) {
            message = "Project unliked successfully";
            project.likes = project.likes.filter((like) => like.toString() !== userId);
        } else {
            project.likes?.push(userId);
        }
        await project.save();
        const result = {
            message: message,
            likes: project.likes?.length,
        };
        const response = res.status(200).json(result);
        return next(response);
    }
    catch (error) {
        console.error(error);
        const result: IResponse = {
            message: "Server error",
        };
        const response = res.status(500).json(result);
        return next(response);
    }
}

const commentProject: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            const result: IResponse = {
                message: "Unauthorized",
            };
            const response = res.status(401).json(result);
            return next(response);
        }
        const { id } = req.params;
        const project = await Project.findById(id).exec();
        if (!project) {
            const result: IResponse = {
                message: "Project not found",
            };
            const response = res.status(404).json(result);
            return next(response);
        }

        const { content } = req.body;
        const comment = new Comment({ content, createdBy: req.user.id });
        await comment.save();
        project.comments?.push(comment.id);
        await project.save();
        const result = {
            message: "Comment added successfully",
            comments: project.comments?.length,
        };
        const response = res.status(201).json(result);
        return next(response);
    }
    catch (error) {
        console.error(error);
        const result: IResponse = {
            message: "Server error",
        };
        const response = res.status(500).json(result);
        return next(response);
    }
}

const removeComment: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    // we should ensure that a comment is only removed by the user who created it or by an admin
    try {
        if (!req.user) {
            const result: IResponse = {
                message: "Unauthorized",
            };
            const response = res.status(401).json(result);
            return next(response);
        }
        const { id } = req.params;
        const { commentId, reason } = req.body;
        const comment = await Comment.findById(commentId).exec();
        const project = await Project.findById(id).exec();
        if (!project) {
            const result: IResponse = {
                message: "Project not found",
            };
            const response = res.status(404).json(result);
            return next(response);
        }
        if (!comment || !project) {
            const result: IResponse = {
                message: "Comment not found",
            };
            const response = res.status(404).json(result);
            return next(response);
        }
        if (comment.createdBy.toString() !== req.user.id) {
            const result: IResponse = {
                message: "Unauthorized",
            };
            const response = res.status(401).json(result);
            return next(response);
        }
        await comment.void(reason, req.user.id);
        const result: IResponse = {
            message: "Comment removed successfully",
        };
        const response = res.status(200).json(result);
        return next(response);
    }
    catch (error) {
        console.error(error);
        const result: IResponse = {
            message: "Server error",
        };
        const response = res.status(500).json(result);
        return next(response);
    }
}

const getComments: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id).exec();
        if (!project) {
            const result: IResponse = {
                message: "Project not found",
            };
            const response = res.status(404).json(result);
            return next(response);
        }
        const comments = await Comment.find({ _id: { $in: project.comments } }).exec();
        const result = {
            comments,
        };
        const response = res.status(200).json(result);
        return next(response);
    }
    catch (error) {
        console.error(error);
        const result: IResponse = {
            message: "Server error",
        };
        const response = res.status(500).json(result);
        return next(response);
    }
}

export { createProject, getProjects, getProject, updateProject, deleteProject, likeProject, commentProject, removeComment, getComments };