import Project from '../../models/Project';
import { IProject, IUser } from '../../types/dbInterface';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../models/User';

let mongoServer: MongoMemoryServer;
const user: IUser = new User();

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    const user: IUser = new User({
        name: 'Mix Doe',
        email: 'mix@gmail.com',
        password: '#Password123',
    });
    await user.save();
    await Project.deleteMany();
});

afterAll(async () => {
    await User.deleteMany();
    await Project.deleteMany();
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Project Model', () => {
    it('should fail validation for invalid GitHub link', async () => {
        const project: IProject = new Project({
            title: 'Project 2',
            description: 'This is another project',
            techStack: ['Angular', 'Express'],
            githubLink: 'invalid-link',
            demoLink: 'https://www.project2.com',
            screenshots: ['https://project2.com/screenshot1.jpg'],
            category: 'Mobile Development',
            likes: [user._id],
            createdBy: user._id,
        });

        try {
            await project.save();
        } catch (error: any) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.githubLink).toBeDefined();
        }
    });

    it('should fail validation for duplicate demo link', async () => {
        const project1: IProject = new Project({
            title: 'Project 3',
            description: 'This is project 3',
            techStack: ['Vue', 'Django'],
            githubLink: 'https://github.com/user/project3',
            demoLink: 'https://www.project3.com',
            screenshots: ['https://project3.com/screenshot1.jpg'],
            category: 'Data Science',
            likes: [user._id],
            createdBy: user._id,
        });
        await project1.save();

        const project2: IProject = new Project({
            title: 'Project 4',
            description: 'This is project 4',
            techStack: ['Vue', 'Flask'],
            githubLink: 'https://github.com/user/project4',
            demoLink: 'https://www.project3.com',
            screenshots: ['https://project4.com/screenshot1.jpg'],
            category: 'Machine Learning',
            likes: [user._id],
            createdBy: user._id,
        });

        try {
            await project2.save();
        } catch (error: any) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.demoLink).toBeDefined();
        }
    });

    it('should fail validation for missing required fields', async () => {
        const project: IProject = new Project({
            techStack: ['React', 'Node.js'],
            githubLink: 'https://github.com/user/project',
            demoLink: 'https://www.project.com',
            screenshots: ['https://project.com/screenshot1.jpg'],
            category: 'Web Development',
            likes: [user._id],
            createdBy: user._id,
        });

        try {
            await project.save();
        } catch (error: any) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.title).toBeDefined();
            expect(error.errors.description).toBeDefined();
        }
    });

    it('should save a valid project', async () => {
        const project: IProject = new Project({
            title: 'Project 1',
            description: 'This is a project',
            techStack: ['React', 'Node.js'],
            githubLink: 'https://github.com/user/project',
            demoLink: 'https://www.project.com',
            screenshots: ['https://project.com/screenshot1.jpg'],
            category: 'Web Development',
            likes: [user._id],
            createdBy: user._id,
        });

        await project.save();
        expect(project._id).toBeDefined();
        expect(project.title).toBe('Project 1');
        expect(project.description).toBe('This is a project');
        expect(project.techStack).toEqual(['React', 'Node.js']);
        expect(project.githubLink).toBe('https://github.com/user/project');
        expect(project.demoLink).toBe('https://www.project.com');
        expect(project.screenshots).toEqual(['https://project.com/screenshot1.jpg']);
        expect(project.category).toBe('Web Development');
        expect(project.likes).toEqual([user._id]);
        expect(project.createdBy).toEqual(user._id);
    });
});