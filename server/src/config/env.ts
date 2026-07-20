import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT || "5000",

    MONGODB_URI: process.env.MONGODB_URI || "",

    JWT_SECRET: process.env.JWT_SECRET || "",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "default_access_secret",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",

    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",

    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};