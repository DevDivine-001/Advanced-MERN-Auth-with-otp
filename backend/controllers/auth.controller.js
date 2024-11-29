
import { User } from "../model/User.model.js";
import validator from 'validator';
import bcryptjs from "bcryptjs";
import { generateTokenAnSetCookie } from "../utils/generateTokenAnSetCookie.js";
import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail, sendResetSuccessEmail } from "../mailtrap/email.js";
import crypto from "crypto"

export const Signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            throw new Error("All fields are require")
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        const userAlreadyExists = await User.findOne({ email })
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }
        const hashedPassword = await bcryptjs.hash(password, 10)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 4 * 60 * 60 * 1000,
        })

        await user.save()

        // jwt

        generateTokenAnSetCookie(res, user._id)

        await sendVerificationEmail(user.email, verificationToken)

        res.status(201).json({
            success: true,
            message: 'user created successfully',
            user: {
                ...user._doc,
                password: undefined,
            }
        })


    } catch (error) {
        res.status(400).json({ success: false, message: error.message })

    }
    // res.send('signup route')

}

export const VerifyEmail = async (req, res) => {
    const { code } = req.body

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" })
        }

        user.isVerified = true
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully ",
            user: {
                ...user._doc,
                password: undefined,
            }
        })
    } catch (error) {
        console.log("error in verifyEmail", error)
        res.status(500).json({ success: false, message: "Server error" })

    }

}

export const Login = async (req, res) => {
    const { email, password } = req.body
    try {

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' })
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' })
        }

        generateTokenAnSetCookie(res, user._id)
        await user.save()

        res.status(200).json({
            success: true,
            massage: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })
    } catch (error) {

        console.log("Error in login", error)
        res.status(400).json({ success: false, message: error.message })

    }


}

export const Logout = async (req, res) => {
    res.clearCookie('token')
    res.status(200).json({ success: true, massage: 'Logged out successfully' })
    console.log(req)

}

export const ForGotPassword = async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        //  Generate reset token

        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 1000


        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiresAt

        await user.save()

        // send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json({ success: true, message: "Password reset Link sent to your email" })


    } catch (error) {
        console.log("Error in forgotPassword", error)
        res.status(400).json({ success: false, message: error.message })

    }

}


export const resetPassword = async (req, res) => {
    try {

        const { token } = req.body
        const { password } = req.body

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $get: Date.now() }
        })


        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token' })
        }
        const hashedPassword = await bcryptjs.hash(password, 10)

        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined
        await user.save();

        await sendResetSuccessEmail(user.email)

        res.status(200).json({ success: true, message: "Password reset  successfully" })


    } catch (error) {
        console.log("Error in resetPassword", error)
        res.status(400).json({ success: false, message: error.message })

    }

}



export const checkAuth = async (req, res) => {

    try {
        const user = await User.findById(req.userId).select("password")
        if (!user) {
            return res.status(400).json({ success: false, message: "user not found" })
        }
        res.status(200).json({ success: true, user })
    } catch (error) {
        console.log('Error in checkAuth', error)
        res.status(400).json({ success: false, message: error.massage })
    }
}