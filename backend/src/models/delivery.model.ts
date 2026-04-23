import mongoose, { Schema } from "mongoose";


export enum DeliveryStatus {
    ASSIGNED = "assigned",
    PICKED_UP = "picked_up",
    DELIVERED = "delivered"
}

export interface IDelivery extends Document {
    order: mongoose.Types.ObjectId;
    deliveryPartner: mongoose.Types.ObjectId;
    status: DeliveryStatus;
}

const DeliverySchema = new Schema<IDelivery>(
    {
        order: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },

        deliveryPartner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(DeliveryStatus),
            default: DeliveryStatus.ASSIGNED,
        },
    },
    { timestamps: true }
);

export const Delivery = mongoose.model<IDelivery>("Delivery", DeliverySchema);