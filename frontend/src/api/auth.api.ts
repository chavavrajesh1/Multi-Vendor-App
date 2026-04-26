import API from "./axios";

export const loginUser = (data: {
    email: string;
    password: string;
}) => {
    return API.post("/auth/login", data);
};

export const registerUser = (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
}) => {
    return API.post("/auth/register", data);
}

