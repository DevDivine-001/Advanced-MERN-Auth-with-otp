import express from "express";
import dotenv from "dotenv"

import { connectDB } from "./db/connectDB.js"
import authRoutes from "./routes/auth.routes.js"
import cookieParser from "cookie-parser";

dotenv.config()


const app = express()
const PORT = process.env.PORT || 4000


app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)


app.listen(PORT, () => {
    connectDB()
    console.log('sever is running on port 4000 babe 👋👋👋❤️', PORT);
})