import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from '../../routes/authRoutes';
import User from '../../models/User';

let mongoServer: MongoMemoryServer;
const app = express();
dotenv.config();

app.use(express.json());
app.use('/api/v1/auth', authRoutes);

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    await User.deleteMany();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Auth Controller', () => {
    describe('POST /api/v1/auth/register', () => {
        it('should register a new user and return a token', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: '#Password123!',
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user.email).toBe('john@example.com');
        });

        it('should not register a user with an existing email', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'Password123!',
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', "User already exists.");
        });

        it('should return 400 for invalid data', async () => {
            const res = await request(app).post('/api/v1/auth/register').send({
                name: '',
                email: 'invalid-email',
                password: '123',
            });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should log in a user and return a token', async () => {
            const user = await User.create({
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'Password123!',
            });

            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'jane@example.com',
                    password: 'Password123!',
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user.email).toBe('jane@example.com');
        });

        it('should not log in with incorrect credentials', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'jane@example.com',
                    password: 'WrongPassword!',
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Invalid credentials');
        });

        it('should return 400 if user does not exist', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'Password123!',
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Invalid credentials');
        });
    });
});
