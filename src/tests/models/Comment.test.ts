import Comment from '../../models/Comment';
import { IComment, IUser } from '../../types/dbInterface';
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
        email: 'mix@example.com',
        password: '#Password123',
    });
    await user.save();
    await Comment.deleteMany();
});

afterAll(async () => {
    await User.deleteMany();
    await Comment.deleteMany();
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Comment Model', () => {
    it('should fail validation for empty content', async () => {
        const comment: IComment = new Comment({
            content: '',
            createdBy: user._id,
        });

        try {
            await comment.save();
        } catch (error: any) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.content).toBeDefined();
        }
    });

    it('should fail validation for missing createdBy', async () => {
        const comment: IComment = new Comment({
            content: 'This is a comment',
        });

        try {
            await comment.save();
        } catch (error: any) {
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
            expect(error.errors.createdBy).toBeDefined();
        }
    });

    it('should void a comment', async () => {
        const comment: IComment = new Comment({
            content: 'This is a comment',
            createdBy: user._id,
        });
        await comment.save();
        await comment.void('Spam', user._id);
        const voidedComment = await Comment.findById(comment._id).exec();
        expect(voidedComment).toBeNull();
    });

    it('should not return voided comments', async () => {
        const comment: IComment = new Comment({
            content: 'This is a comment',
            createdBy: user._id,
        });
        await comment.save();
        await comment.void('Spam', user._id);
        const comments = await Comment.find().exec();
        expect(comments.length).toBe(0);
    });

    it('should return non-voided comments', async () => {
        const comment1: IComment = new Comment({
            content: 'This is a comment',
            createdBy: user._id,
        });
        const comment2: IComment = new Comment({
            content: 'This is another comment',
            createdBy: user._id,
        });
        await comment1.save();
        await comment2.save();
        await comment1.void('Spam', user._id);
        const comments = await Comment.find().exec();
        expect(comments.length).toBe(1);
    });

    it('should save a valid comment', async () => {
        const comment: IComment = new Comment({
            content: 'This is a comment',
            createdBy: user._id,
        });

        await comment.save();
        expect(comment._id).toBeDefined();
        expect(comment.content).toBe('This is a comment');
        expect(comment.createdBy).toEqual(user._id);
    });
});