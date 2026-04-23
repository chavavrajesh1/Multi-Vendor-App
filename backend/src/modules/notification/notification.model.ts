import mongoose, { Document, Schema } from "mongoose";


export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
}

const notificationSchema = new Schema<INotification>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            enum: ["ORDER", "COUPON", "SYSTEM"],
            default: "SYSTEM",
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
);

export const Notification = mongoose.model<INotification>(
    "Notification",
    notificationSchema
);