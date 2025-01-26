import mongoose, { Schema, Model, Query } from "mongoose";
import { IComment } from "../types/dbInterface";

const CommentSchema: Schema<IComment> = new Schema(
    {
        content: {
            type: String,
            required: [true, "Content is required"],
            trim: true,
        },
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
    {
        timestamps: true,
    }
);

CommentSchema.pre(/^find|findById|findOne|findOneAndUpdate|update/, function (this: Query<IComment, IComment>, next) {
    this.find({ voided: false });
    next();
});

CommentSchema.methods.void = async function (reason: string, voidedBy: string) {
    this.voided = true;
    this.voidedReason = reason;
    this.voidedAt = new Date();
    this.voidedBy = voidedBy;
    await this.save();
};

const Comment: Model<IComment> = mongoose.model("Comment", CommentSchema);
export default Comment;