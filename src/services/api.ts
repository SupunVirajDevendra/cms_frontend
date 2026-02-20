import axios from "axios";
import { encryptData } from "../utils/crypto";

const ENABLE_ENCRYPTION = import.meta.env.VITE_ENABLE_ENCRYPTION === "true";

const api = axios.create({
    baseURL: "", // Use relative paths for Vite proxy
    maxBodyLength: Infinity,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor for Encryption
api.interceptors.request.use(async (config) => {
    if (ENABLE_ENCRYPTION && config.data && ["post", "put", "patch"].includes(config.method || "")) {
        try {
            const encrypted = await encryptData(config.data);
            config.data = { payload: encrypted };
            console.log("Payload encrypted successfully");
        } catch (error) {
            console.error("Encryption failed:", error);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
