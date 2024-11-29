import express from "express";
import { Login, Logout, Signup, VerifyEmail, ForGotPassword, resetPassword, checkAuth } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";


const router = express.Router()

router.post('/signup', Signup)

router.post('/login', Login)

router.post('/logout', Logout)

router.post('/verify-email', VerifyEmail)
router.post('/forgot-password', ForGotPassword)
router.post('/reset-password/:token', resetPassword)

router.post("/check-auth", verifyToken, checkAuth)

export default router