import { Request, Response } from "express";
import { approveVendorService, getAllVendorsService } from "./admin.service";

export const approveVendor = async (
  req: Request<{ vendorId: string }>,
  res: Response,
) => {
  console.log("🔥 Approve route hit");
  console.log("Vendor ID:", req.params.vendorId);

  try {
    const { vendorId } = req.params;

    const vendor = await approveVendorService(vendorId);

    return res.status(200).json({
      success: true,
      vendor,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllVendors = async (
  req:Request, res: Response
) => {
  try {
    
    const vendors = await getAllVendorsService();

    res.status(200).json({
      success: true,
      vendors
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
