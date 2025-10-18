import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import userRoutes from './routes/user.routes.js';


mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log("Connected to database!"));

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.listen(7000, () => {
    console.log("server started on localhost:7000");
});