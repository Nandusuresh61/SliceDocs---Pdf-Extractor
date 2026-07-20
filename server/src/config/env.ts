import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT || "5000",

    MONGODB_URI: process.env.MONGODB_URI || "",

    JWT_SECRET: process.env.JWT_SECRET || "",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "default_access_secret",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    
    // AWS S3 Configurations
    AWS_REGION: process.env.AWS_REGION || "",
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || "",

    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};