import mongoose, { Schema, HydratedDocument, Document } from "mongoose";

export enum PaymentMethod {
  CARD = "card",
  UPI = "upi",
  COD = "cod",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface IPayment extends Document {
  order: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;

  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export type PaymentDocument = HydratedDocument<IPayment>;

const PaymentSchema = new Schema<IPayment>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    amount: { type: Number, required: true },

    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    refundAmount: { type: Number },
    refundReason: { type: String },
    refundedAt: { type: Date },
  },
  { timestamps: true }
);

/* INDEXES */

PaymentSchema.index({ order: 1 }, { unique: true });
PaymentSchema.index({ user: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ status: 1, createdAt: -1 });

export const Payment =
  mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", PaymentSchema);