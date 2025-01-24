import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import dotenv from 'dotenv';
import profileRoutes from '../../routes/profileRoutes';
import User from '../../models/User';
import { encodeToken } from "../../utils/tokenUtils";

dotenv.config();
const app = express();
let mongoServer: MongoMemoryServer;

app.use(express.json());
app.use('/api/v1/profile', profileRoutes);

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await User.deleteMany();
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Profile Controller', () => {
    describe('GET /api/v1/profile', () => {
        it('should return user profile', async () => {
            const user = await User.create({ name: 'John Doe', email: 'john@example.com', password: 'Password123!' });

            const res = await request(app)
                .get('/api/v1/profile')
                .set('Authorization', `Bearer ${encodeToken({ id: user._id })}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'John Doe');
            expect(res.body).toHaveProperty('email', 'john@example.com');
        });
    });

    describe('PUT /api/v1/profile', () => {
        it('should update user profile', async () => {
            const user = await User.create({ name: 'Jane Doe', email: 'jane@example.com', password: 'Password123!' });

            const res = await request(app)
                .put('/api/v1/profile')
                .set('Authorization', `Bearer ${encodeToken({ id: user._id })}`)
                .send({
                    name: 'Jane Smith',
                    email: 'janedoe@example.com',
                    skills: 'Node.js, Express.js, MongoDB',
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', 'Jane Smith');
            expect(res.body).toHaveProperty('email', 'janedoe@example.com');
            expect(res.body).toHaveProperty('skills', ['Node.js', 'Express.js', 'MongoDB']);
        });
    });

    describe('DELETE /api/v1/profile', () => {
        it('should delete user profile', async () => {
            const user = await User.create({ name: 'Gary Doe', email: 'gary@example.com', password: 'Password123!', role: 'admin' });

            const res = await request(app)
                .delete('/api/v1/profile')
                .set('Authorization', `Bearer ${encodeToken({ id: user._id })}`).send(
                    {
                        id: user._id,
                    }
                );

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Please provide a reason for deleting the user');

            const res2 = await request(app)
                .delete('/api/v1/profile')
                .set('Authorization', `Bearer ${encodeToken({ id: user._id })}`)
                .send({
                    id: user._id,
                    reason: 'I am no longer interested'
                });

            expect(res2.status).toBe(200);
            expect(res2.body).toHaveProperty('message', "User removed successfully");
        });
    });
});


