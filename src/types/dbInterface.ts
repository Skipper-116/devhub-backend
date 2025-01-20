import { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    bio?: string;
    skills?: string[];
    githubUsername?: string;
    role?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (password: string) => Promise<boolean>;
    validatePassword: (password: string) => boolean;
}