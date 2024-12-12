import {v2 as cloudinary} from 'cloudinary'; 
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from  './routes/auth.routes.js';
import connectToMongodb from './db/connectToMongodb.js';
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";



dotenv.config();
const app = express();
app.use(express.json({limit:'5mb'})); // to parse as json
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Running in Port no : ${PORT}`);
    connectToMongodb();
});
export default app;