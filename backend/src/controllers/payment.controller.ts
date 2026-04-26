import { Response } from "express";
import crypto from "crypto";
import { AuthRequest } from "../types/express";
import { razorpay } from "../utils/razorpay";
import { verifyPaymentService } from "../services/order.service";
import { handlePaymentWebhookService } from "../services/payment.service";

/* ======================================================
    1. CREATE RAZORPAY ORDER
====================================================== */
export const createPaymentOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Payment order creation failed",
        });
    }
};

/* ======================================================
    2. VERIFY PAYMENT (Signature & DB Update)
====================================================== */
export const verifyPayment = async (req: AuthRequest, res: Response) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId // మనం డేటాబేస్ లో సేవ్ చేసిన Order ID
        } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET as string;

        // 1. సిగ్నేచర్ వెరిఫికేషన్
        const generated_signature = crypto
            .createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        // 2. డేటాబేస్ లో ఆర్డర్ స్టేటస్ అప్‌డేట్ చేయడం (చాలా ముఖ్యం)
        // మనం order.service.ts లో రాసిన ఫంక్షన్ ని ఇక్కడ వాడుతున్నాం
        await verifyPaymentService(orderId, razorpay_payment_id, razorpay_signature);

        res.status(200).json({
            success: true,
            message: "Payment verified and order updated successfully"
        });   
        
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({
            message: "Payment verification error"
        });
    }
};

/* ======================================================
    3. RAZORPAY WEBHOOK HANDLER
====================================================== */
export const paymentWebhookHandler = async (
    req: any, // Webhook కి raw body అవసరం కాబట్టి ఇక్కడ 'any' వాడటం మంచిది
    res: Response   
) => {
    const signature = req.headers["x-razorpay-signature"] as string;
    const secret = process.env.WEBHOOK_SECRET as string;

    // Webhook బాడీని స్ట్రింగ్ గా మార్చడం
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");

    if (signature !== expectedSignature){
        return res.status(400).json({ message: "Invalid signature" })
    }

    const event = req.body;

    // Webhook ద్వారా కూడా ఆర్డర్ ని PAID గా మార్చడం (Safety Net)
    await handlePaymentWebhookService(event);

    res.status(200).json({ received: true })
}