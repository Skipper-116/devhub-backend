import mongoose, { Schema, Model, Query } from "mongoose";
import { IProject } from "../types/dbInterface";

// Create Project schema
const ProjectSchema: Schema<IProject> = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        techStack: {
            type: [String],
            required: [true, "Tech stack is required"],
        },
        githubLink: {
            type: String,
            required: [true, "GitHub link is required"],
            validate: {
                validator: function (v: string) {
                    if (!v) return true; // allow null values
                    return /^(https?:\/\/)?(www\.)?github.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/?$/i.test(v);
                },
                message: (props: any) => `${props.value} is not a valid GitHub URL`,
            },
        },
        demoLink: {
            type: String,
            default: null,
            validate: {
                // we need to prevent people posting the same link
                validator: async function (v: string) {
                    if (!v) return true; // allow null values
                    const count = await mongoose.models.Project.countDocuments({ demoLink: v });
                    if (count > 0) return false;
                    return /^(https?:\/\/)?(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)+([/?].*)?$/i.test(v);
                },
            }
        },
        screenshots: {
            type: [String],
            default: [],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
        },
        likes: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comment",
                default: [],
            },
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
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
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    { timestamps: true }
);

// Scoping Project
ProjectSchema.pre(/^find|findById|findOne|findOneAndUpdate|update/, function (this: Query<IProject, IProject>, next) {
    this.find({ voided: false });
    next();
});

// Voiding Project
ProjectSchema.methods.void = async function (reason: string, voidedBy: string) {
    this.voided = true;
    this.voidedReason = reason;
    this.voidedAt = new Date();
    this.voidedBy = voidedBy;
    await this.save();
};

const Project: Model<IProject> = mongoose.model("Project", ProjectSchema);
export default Project;