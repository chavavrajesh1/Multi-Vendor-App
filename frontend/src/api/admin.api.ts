import API from "./axios";

/* =================================
   TYPES
================================= */

export interface Vendor {
  _id: string;
  name: string;
  email: string;
  role: "vendor";
  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/* =================================
   GET ALL VENDORS
================================= */
export const getAllVendors = () => {
  return API.get<{ success: boolean; count?: number; vendors: Vendor[] }>(
    "/admin/vendors"
  );
};

/* =================================
   GET PENDING VENDORS
================================= */
export const getPendingVendors = () => {
  return API.get<{ success: boolean; count?: number; vendors: Vendor[] }>(
    "/admin/vendors/pending"
  );
};

/* =================================
   APPROVE VENDOR
================================= */
export const approveVendor = (vendorId: string) => {
  return API.patch<{ success: boolean; message: string; vendor: Vendor }>(
    `/admin/approve-vendor/${vendorId}`
  );
};