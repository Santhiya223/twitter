import express from 'express';
import dotenv from 'dotenv';
import authRoutes from  './routes/auth.routes.js';
import connectToMongodb from './db/connectToMongodb.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
app.use(express.json()); // to parse as json
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Running in Port no : ${PORT}`);
    connectToMongodb();
});
export default app;