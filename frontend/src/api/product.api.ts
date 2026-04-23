import API from "./axios";

// CUSTOMER -> See all products
export const getAllProducts = () => {
    return API.get("/products");
};

// VENDOR -> See only his products
export const getVendorProducts = () => {
    return API.get("/products/my-products");
};

// ✅ VENDOR -> Delete a product (దీన్ని యాడ్ చేయండి)
export const deleteProduct = (id: string) => {
    return API.delete(`/products/${id}`);
};

// ✅ VENDOR -> Update a product (ముందు ముందు దీని అవసరం కూడా ఉంటుంది)
export const updateProduct = (id: string, data: any) => {
    return API.put(`/products/${id}`, data);
};