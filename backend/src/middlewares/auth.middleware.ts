import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/express";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Header నుండి టోకెన్ తీసుకోవడం
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Please login to access this resource" 
    });
  }

  try {
    // టోకెన్ వెరిఫై చేయడం
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // టోకెన్ లో ఉన్న డేటాను AuthRequest టైప్‌కి తగ్గట్టుగా అసైన్ చేయడం
    // మీ టోకెన్ పేలోడ్‌లో 'userId' ఉండాలి
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};