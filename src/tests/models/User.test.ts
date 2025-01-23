import User from '../../models/User';
import { IUser } from '../../types/dbInterface';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IResponse } from '../../types/common';
import exp from 'constants';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('User Model', () => {
    it('should hash the password before saving', async () => {
        const user: IUser = new User({
            name: 'John Doe',
            email: 'john@example.com',
            password: '#Password123',
        });

        await user.save();

        expect(user.password).not.toBe('#Password123');
        expect(user.role).toBe('user');
        expect(user.bio).toBeNull();
        expect(user.avatar).toBeNull();
        expect(user.githubUsername).toBeNull();
        expect(user.skills).toHaveLength(0);
    });

    it('should validate a correct password', async () => {
        const user: IUser = await User.create({
            name: 'Jane Doe',
            email: 'jane@example.com',
            password: '#Password123',
            githubUsername: 'janedoe',
            skills: ['JavaScript', 'React', 'Node.js'],
            bio: 'Jane is a software developer',
            avatar: 'https://example.com/avatar.jpg',
            role: 'admin',
        });

        const isMatch = await user.comparePassword('#Password123');
        expect(isMatch).toBe(true);
        expect(user.role).toBe('admin');
        expect(user.bio).toBe('Jane is a software developer');
        expect(user.avatar).toBe('https://example.com/avatar.jpg');
        expect(user.githubUsername).toBe('janedoe');
        expect(user.skills).toHaveLength(3);
    });

    it('should not validate an incorrect password', async () => {
        const user: IUser = await User.create({
            name: 'Larry Doe',
            email: 'larry@example.com',
            password: '#Password123',
        });

        const isMatch = await user.comparePassword('wrongpassword');
        expect(isMatch).toBe(false);
    });

    it('should void a user', async () => {
        const user: IUser = await User.create({
            name: 'Garry Doe',
            email: 'garry@exampl.com',
            password: '#Password123',
        });

        const result = await user.void('User is no longer active', user._id);
        expect(result.message).toBe('User removed successfully');
        const resultTwo = await User.findById(user._id).exec();
        expect(resultTwo).toBeNull();
    });

    it('should find three saved users', async () => {
        const users = await User.find();

        expect(users).toHaveLength(3);
    });
});
