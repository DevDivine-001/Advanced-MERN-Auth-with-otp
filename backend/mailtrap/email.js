import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailTrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }]

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        })
        console.log("Email sent successfully", response)
    } catch (error) {
        console.log(`Error sending verification`, error);

        throw new Error(`Error sending verification email: ${error}`)


    }

}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }]


    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            // template_uuid: "50d9d190-8f07-11ef-0040-f16b398d7fa6",
            // template_uuid: "8da532e7-e866-4821-b193-609a833a7a5f",
            template_uuid: "8da532e7-e866-4821-b193-609a833a7a5f",
            template_variables: {
                company_info_name: "Auth System Company",
                name: name
            },
        });
        console.log("Welcome email sent successfully", response)

    } catch (error) {
        console.error("Error sending welcome email", error)
        throw new Error(`Error sending welcome email: ${error}`)

    }
}


export const sendPasswordResetEmail = async (email, resetURL) => {

    const recipient = [{ email }]

    try {

        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(("{resetURL}", { resetURL })),
            category: 'Password Reset'

        })
        console.log(response)

    } catch (error) {
        console.log(`Error sending password reset email`, error)

        throw new error(`Error sending password reset email: ${error}`)

    }

}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }]

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: 'Password Reset',

        })

        console.log('Password reset email sent successfully', response)
    } catch (error) {
        console.log(`Error sending password reset success`, error)
        throw new Error(`Error sending password reset success email: ${error}`)
    }

}