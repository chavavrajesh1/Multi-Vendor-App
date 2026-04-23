import { ZodError } from "zod";

export const validate = (schema: any) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log("Zod error:", error.issues);  // 👈 PRINT FULL ERROR
        return res.status(400).json({
          message: "Validation failed",
          errors: error.issues,
        });
      }

      return res.status(400).json({ message: "Invalid input" });
    }
  };
};