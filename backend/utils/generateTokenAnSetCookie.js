// export const verificationToken = () => Math.floor(100000 + Math.random() + 900000).toString()


import jwt from "jsonwebtoken"

export const generateTokenAnSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '5d'
    })

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 5 * 24 * 60 * 60 * 1000,
    })
    return token
}
