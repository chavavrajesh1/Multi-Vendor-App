import API from "./axios";

export const createPaymentOrder = async (amount: number) => {
    return API.post("/orders/create-payment", { amount });
};