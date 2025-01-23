import mongoose, { Schema, Model, Query } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/dbInterface';
import { IResponse } from '../types/common';

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
            sparse: true,
            default: null,
            validate: {
                validator: async function (v: string) {
                    if (!v) return true; // allow null values
                    const count = await mongoose.models.User.countDocuments({ githubUsername: v });
                    if (count > 0) return false;
                    return /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(v);
                },
                message: (props: any) => `${props.value} is not a valid GitHub username`,
            },
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        voided: {
            type: Boolean,
            default: false,
        },
        voidedReason: {
            type: String,
            default: null,
        },
        voidedAt: {
            type: Date,
            default: null,
        },
        voidedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
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

UserSchema.methods.void = async function (reason: string, voidedBy: string): Promise<IResponse> {
    try {
        this.voided = true;
        this.voidedReason = reason;
        this.voidedAt = new Date();
        this.voidedBy = voidedBy;
        await this.save();
        return { message: 'User removed successfully' } as IResponse;
    } catch (error) {
        console.error(error);
        throw new Error('An error occurred while voiding user');
    }
}

// Pre middleware to filter out voided users
UserSchema.pre(/^(find|findOne|findById)/, function (next) {
    const query = this as Query<IUser[], IUser, {}>;
    query.where({ voided: false });
    next();
});

// Create the User model
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
