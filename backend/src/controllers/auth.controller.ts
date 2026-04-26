import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { registerSchema, loginSchema } from "../validations/auth.validation";
import { ZodError } from "zod";

/**
 * JWT టోకెన్ జనరేట్ చేసే హెల్పర్ ఫంక్షన్
 */
const generateToken = (userId: string, role: string) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jwt.sign({ userId, role }, secret, { expiresIn: "1d" });
};

/**
 * యూజర్ రిజిస్ట్రేషన్ కంట్రోలర్
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. Zod ద్వారా డేటా వాలిడేషన్
        const validatedData = registerSchema.parse(req.body);

        // 2. ఈమెయిల్ ముందే రిజిస్టర్ అయ్యిందో లేదో చెక్ చేయడం
        const existingUser = await User.findOne({ email: validatedData.email });
        if (existingUser) {
            res.status(400).json({ success: false, message: "ఈ ఈమెయిల్ తో ఇప్పటికే ఖాతా ఉంది." });
            return;
        }

        // 3. పాస్‌వర్డ్ హ్యాషింగ్
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(validatedData.password, salt);

        // 4. Role మరియు Approval లాజిక్
        // ఫ్రంటెండ్ నుండి role రాకపోతే ఆటోమేటిక్ గా 'customer' గా తీసుకుంటుంది
        const userRole = validatedData.role || "customer"; 

        // 5. యూజర్ క్రియేషన్
        const user = await User.create({
            name: validatedData.name,
            email: validatedData.email,
            password: hashedPassword,
            role: userRole,
            // వెండర్ అయితే అడ్మిన్ అప్రూవల్ అవసరం (false), కస్టమర్ అయితే డైరెక్ట్ అప్రూవల్ (true)
            isApproved: userRole === "vendor" ? false : true,
        });

        res.status(201).json({
            success: true,
            message: userRole === "vendor" 
                ? "రిజిస్ట్రేషన్ విజయవంతమైంది! అడ్మిన్ అప్రూవల్ కోసం వేచి చూడండి." 
                : "రిజిస్ట్రేషన్ పూర్తయింది.",
            data: { userId: user._id },
        });

    } catch (error: any) {
        if (error instanceof ZodError) {
            console.log("Validation Errors:", error.errors); // సర్వర్ టెర్మినల్ లో చూడవచ్చు
            res.status(400).json({ 
                success: false, 
                message: "వాలిడేషన్ లో తప్పులు ఉన్నాయి", 
                errors: error.issues.map(err => ({ field: err.path[0], message: err.message })) 
            });
        } else {
            console.error("Register Error:", error.message);
            res.status(500).json({ success: false, message: "సర్వర్ లో ఏదో సమస్య తలెత్తింది." });
        }
    }
};

/**
 * యూజర్ లాగిన్ కంట్రోలర్
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. వాలిడేషన్
        const validatedData = loginSchema.parse(req.body);

        // 2. యూజర్ ఉన్నారో లేదో చూడటం
        const user = await User.findOne({ email: validatedData.email });
        if (!user) {
            res.status(401).json({ success: false, message: "ఈమెయిల్ లేదా పాస్‌వర్డ్ తప్పు." });
            return;
        }

        // 3. పాస్‌వర్డ్ సరిపోల్చడం
        const isMatch = await bcrypt.compare(validatedData.password, user.password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: "ఈమెయిల్ లేదా పాస్‌వర్డ్ తప్పు." });
            return;
        }

        // 4. వెండర్ అప్రూవల్ చెక్ చేయడం
        if (user.role === "vendor" && !user.isApproved) {
            res.status(403).json({ 
                success: false, 
                message: "మీ వెండర్ అకౌంట్ ఇంకా అడ్మిన్ అప్రూవల్ లో ఉంది." 
            });
            return;
        }

        // 5. టోకెన్ జనరేట్ చేయడం
        const token = generateToken(user._id.toString(), user.role);

        res.status(200).json({
            success: true,
            message: "లాగిన్ విజయవంతమైంది",
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });

    } catch (error: any) {
        if (error instanceof ZodError) {
            res.status(400).json({ 
                success: false, 
                errors: error.issues.map(err => ({ field: err.path[0], message: err.message })) 
            });
        } else {
            console.error("Login Error:", error.message);
            res.status(500).json({ success: false, message: "సర్వర్ ఎర్రర్" });
        }
    }
};