import mongoose, { Schema, Document, HydratedDocument } from "mongoose";

/* =====================================================
    ENUMS
===================================================== */

export enum OrderStatus {
  PENDING = "pending",           // Initial stage
  CONFIRMED = "confirmed",       // Accepted by restaurant
  PREPARING = "preparing",       // In kitchen/packing
  SHIPPED = "shipped",           // Dispatched for long distance
  OUT_FOR_DELIVERY = "out_for_delivery", // Local delivery
  DELIVERED = "delivered",       // Reached customer
  CANCELLED = "cancelled",       // Rejected/Cancelled
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export enum PaymentMethod {
  COD = "cod",
  CARD = "card",
  UPI = "upi",
  RAZORPAY = "razorpay", // Added for online gateway
}

/* =====================================================
    INTERFACE
===================================================== */

export interface IOrder extends Document {
  orderNumber: string;

  user: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId; // Kept as restaurant as per your request

  items: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  totalAmount: number;

  status: OrderStatus;

  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  
  // Razorpay integration fields
  razorpayOrderId?: string;
  razorpayPaymentId?: string;

  expiresAt?: Date;

  isDeleted: boolean;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export type OrderDocument = HydratedDocument<IOrder>;

/* =====================================================
    SCHEMA
===================================================== */

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant", // Links to your restaurant/branch model
      required: true,
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },

    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },

    expiresAt: {
      type: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

/* =====================================================
    AUTO GENERATE ORDER NUMBER
===================================================== */

OrderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  // ఇక్కడ next() అవసరం లేదు, async ఫంక్షన్ కాబట్టి ఆటోమేటిక్ గా ముందుకు వెళ్తుంది.
});

/* =====================================================
    MODEL EXPORT
===================================================== */

export const Order =
  mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);