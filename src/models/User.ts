import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for the User document
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

// Create User schema
const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/.+@.+\..+/, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
        },
        avatar: {
            type: String,
            default: null,
        },
        bio: {
            type: String,
            default: null,
        },
        skills: {
            type: [String],
            default: [],
        },
        githubUsername: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving the user
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    // we validate the password before hashing it
    if (!this.validatePassword(this.password)) {
        throw new Error('Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character');
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// A method to compare passwords
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.validatePassword = function (password: string): boolean {
    // using a regular expression to validate the password
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    return passwordRegex.test(password);
}

// Create the User model
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
