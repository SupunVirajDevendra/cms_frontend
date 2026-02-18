import axios from "axios";

const api = axios.create({
    baseURL: "", // Use relative paths for Vite proxy
    maxBodyLength: Infinity,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
