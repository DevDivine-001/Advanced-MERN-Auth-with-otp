import { MailtrapClient } from "mailtrap"
import dotenv from "dotenv"

dotenv.config()


export const mailTrapClient = new MailtrapClient({
    endpoint: process.env.MAILTRAP_ENDPOINT,
    token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
    email: "hello@demomailtrap.com",
    name: "DevCodes ",
};
// const recipients = [
//     {
//         email: "divineuwandu84@gmail.com",
//     }
// ];

// client
//     .send({
//         from: sender,
//         to: recipients,
//         subject: "You are awesome!",
//         text: "Congrats for sending test email with Mailtrap!",
//         category: "Integration Test",
//     })
//     .then(console.log, console.error);