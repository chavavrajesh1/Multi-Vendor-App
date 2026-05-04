import multer from "multer";
import path from "node:path";
import fs from "node:fs";

// ✅ ఫోల్డర్ ఉందో లేదో చెక్ చేసి, లేకపోతే క్రియేట్ చేస్తుంది
const uploadDir = "uploads/products";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // ఫైల్ పేరును సురక్షితంగా మార్చడం (Date + Original Name)
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// ✅ అన్ని రకాల ఇమేజ్ ఫార్మాట్లను అనుమతించే ఫిల్టర్
const fileFilter = (req: any, file: any, cb: any) => {
    // మనం అనుమతించే ఫార్మాట్లు: jpg, jpeg, png, webp
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // వేరే ఫైల్స్ (pdf, exe, etc.) వస్తే రిజెక్ట్ చేస్తుంది
        cb(new Error("ఈ ఫైల్ ఫార్మాట్ సపోర్ట్ చేయదు! కేవలం JPG, PNG, WEBP మాత్రమే అప్‌లోడ్ చేయండి."), false);
    }
};

export const upload = multer({ 
    storage,
    fileFilter,
    limits: { 
        fileSize: 10 * 1024 * 1024 // గరిష్టంగా 10MB వరకు పెంచాను (హై క్వాలిటీ ఫోటోల కోసం)
    } 
});