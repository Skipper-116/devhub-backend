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

export interface IComment extends Document {
    _id: string;
    content: string;
    createdBy: string;
    voided: boolean;
    voidedReason?: string;
    voidedAt?: Date;
    voidedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    void: (reason: string, voidedBy: string) => IResponse;
}

export interface IProject extends Document {
    _id: string;
    title: string;
    description: string;
    techStack: string[];
    githubLink?: string;
    demoLink?: string;
    screenshots?: string[];
    category: string;
    likes?: string[];
    comments?: Comment[];
    createdBy: string;
    voided: boolean;
    voidedReason?: string;
    voidedAt?: Date;
    voidedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    void: (reason: string, voidedBy: string) => IResponse;
}

export interface IForum extends Document {
    _id: string;
    title: string;
    content: string;
    category: string;
    upvotes: string[];
    comments: Comment[];
    createdBy: string;
    voided: boolean;
    voidedReason?: string;
    voidedAt?: Date;
    voidedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    void: (reason: string, voidedBy: string) => IResponse;
}

export interface Challenges extends Document {
    _id: string;
    title: string;
    description: string;
    submissions: Submission[];
    createdBy: string;
    voided: boolean;
    voidedReason?: string;
    voidedAt?: Date;
    voidedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    void: (reason: string, voidedBy: string) => IResponse;
}

export interface Submission extends Document {
    _id: string;
    solutionLink: string;
    comments: Comment[];
    createdBy: string;
    votes: string[];
    voided: boolean;
    voidedReason?: string;
    voidedAt?: Date;
    voidedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    void: (reason: string, voidedBy: string) => IResponse;
}

export interface Message extends Document {
    _id: string;
    content: string;
    voided: boolean;
    createdBy: string;
    voidedReason?: string;
    voidedAt?: Date;
    voidedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    void: (reason: string, voidedBy: string) => IResponse;
}

export interface Chats extends Document {
    _id: string;
    participants: string[];
    messages: Message[];
    createdBy: string;
    voided: boolean;
    voidedReason?: string;
    voidedAt?: Date;
    voidedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    void: (reason: string, voidedBy: string) => IResponse;
}