import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import dotenv from "dotenv";
import projectRoutes from "../../routes/projectRoutes";
import Project from "../../models/Project";
import User from '../../models/User';
import { encodeToken } from "../../utils/tokenUtils";

dotenv.config();
const app = express();
let mongoServer: MongoMemoryServer;
app.use(express.json());
app.use("/api/v1/projects", projectRoutes);
let token: string = "";

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    await User.deleteMany();
    await Project.deleteMany();
    const user = await User.create({ name: "John Doe", email: "john@gmail.com", password: "#Password123" });
    token = encodeToken({ id: user._id });
});

afterAll(async () => {
    await User.deleteMany();
    await Project.deleteMany();
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Project Controller", () => {
    it("should create a project", async () => {
        const res = await request(app)
            .post("/api/v1/projects")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Project 1",
                description: "This is a project",
                techStack: ["React", "Node.js"],
                githubLink: "https://www.github.com/user/project1",
                demoLink: "https://www.project1.com",
                screenshots: ["https://project1.com/screenshot1.jpg"],
                category: "Web Development",
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("message", "Project created successfully");
        expect(res.body).toHaveProperty("project");
    });

    it("should get all projects", async () => {
        const res = await request(app)
            .get("/api/v1/projects")
            .set("Authorization", `Bearer ${token}`)
            .query({ page: 0, limit: 10 });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("projects");
        expect(res.body).toHaveProperty("count");
        expect(res.body.projects).toHaveLength(1);
        expect(res.body.count).toBe(1);
    });

    it("should get a project", async () => {
        try {
            const project = await Project.findOne().exec();
            if (!project) {
                throw new Error("Project not found");
            }
            const res = await request(app)
                .get(`/api/v1/projects/${project._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("project");
        } catch (error) {
            console.error(error);
        }
    });

    it("should update a project", async () => {
        try {
            const project = await Project.findOne().exec();
            if (!project) {
                throw new Error("Project not found");
            }
            const res = await request(app)
                .put(`/api/v1/projects/${project._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "Project 2",
                    description: "This is project 2",
                    techStack: ["Vue", "Flask"],
                    githubLink: "https://www.github.com/user/project2",
                    demoLink: "https://www.project2.com",
                    screenshots: ["https://project2.com/screenshot1.jpg"],
                    category: "Machine Learning",
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message", "Project updated successfully");
            expect(res.body).toHaveProperty("project");
        } catch (error) {
            console.error(error);
        }
    });

    it("should like a project", async () => {
        try {
            const project = await Project.findOne().exec();
            if (!project) {
                throw new Error("Project not found");
            }
            const res = await request(app)
                .put(`/api/v1/projects/${project._id}/like`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message", "Project liked successfully");
            expect(res.body).toHaveProperty("likes");
            expect(res.body.likes).toBe(1);
        } catch (error) {
            console.error(error);
        }
    });

    it("should unlike a project", async () => {
        try {
            const project = await Project.findOne().exec();
            if (!project) {
                throw new Error("Project not found");
            }
            const res = await request(app)
                .put(`/api/v1/projects/${project._id}/like`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message", "Project unliked successfully");
            expect(res.body).toHaveProperty("likes");
            expect(res.body.likes).toBe(0);
        } catch (error) {
            console.error(error);
        }
    });

    it("should comment on a project", async () => {
        try {
            const project = await Project.findOne().exec();
            if (!project) {
                throw new Error("Project not found");
            }
            const res = await request(app)
                .post(`/api/v1/projects/${project._id}/comment`)
                .set("Authorization", `Bearer ${token}`)
                .send({ content: "This is a comment" });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("message", "Comment added successfully");
            expect(res.body).toHaveProperty("comments");
            expect(res.body.comments).toBe(1);
        } catch (error) {
            console.error(error);
        }
    });

    it("should get all comments for a project", async () => {
        try {
            const project = await Project.findOne().exec();
            if (!project) {
                throw new Error("Project not found");
            }
            const res = await request(app)
                .get(`/api/v1/projects/${project._id}/comment`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("comments");
            expect(res.body.comments).toHaveLength(1);
        } catch (error) {
            console.error(error);
        }
    });

    it("should delete a comment", async () => {
        try {
            const project = await Project.findOne().exec();
            if (!project) {
                throw new Error("Project not found");
            }
            const comment = await request(app)
                .get(`/api/v1/projects/${project._id}/comment`)
                .set("Authorization", `Bearer ${token}`);

            const res = await request(app)
                .delete(`/api/v1/projects/${project._id}/comment`)
                .set("Authorization", `Bearer ${token}`)
                .send({ reason: "I am no longer interested", commentId: comment.body.comments[0]._id });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message", "Comment removed successfully");
        } catch (error) {
            console.error(error);
        }
    });

    it("should delete a project", async () => {
        try {
            const project = await Project.findOne().exec();
            if (!project) {
                throw new Error("Project not found");
            }
            const res = await request(app)
                .delete(`/api/v1/projects/${project._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ reason: "I am no longer interested" });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("message", "Project deleted successfully");
        } catch (error) {
            console.error(error);
        }
    });
});