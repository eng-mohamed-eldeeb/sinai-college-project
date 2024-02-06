import nodemailer from 'nodemailer';

export const sendMail = async (email, subject, next) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: process.env.EMAIL_PORT,
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject,
            text: `Hello, you are receiving this email because you have registered on our website. If you did not register, please ignore this email.`,
        });
        console.log("Email sent");
    } catch (error) {
        console.log(error);
    }
}