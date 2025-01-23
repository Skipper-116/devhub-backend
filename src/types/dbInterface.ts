import { Document } from 'mongoose';
import { IResponse } from './common';

export interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    bio?: string;
    skills?: string[];
    githubUsername?: string;
    role?: string;
    voided: boolean;
    voidedReason?: string;
    voidedAt?: Date;
    voidedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (password: string) => Promise<boolean>;
    validatePassword: (password: string) => boolean;
    void: (reason: string, voidedBy: string) => IResponse;
}