
import nodemailer from 'nodemailer';
import { smtp } from 'utils/constants';

export async function POST(request, response) {
    try {
        const formData = await request.formData();
        //const { fullname, email, option, phone, message } = Object.fromEntries(formData);
        const fullname = formData.get("fullname");
        const email = formData.get("email");
        const option = formData.get("option");
        const message = formData.get("message");
        const phone = formData.get("phone");

        console.log(`${fullname} - ${email} - ${option} - ${phone} - ${message}`);

        // Validate input (ensure all required fields are present)
        if (!fullname || !email || !option || !message) {
            return response.status(400).json({ error: 'Please provide all mandatory fields.' });
        }

        // Create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport(smtp);

        // Send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"greenchains.io" <cassie19@ethereal.email>`, // sender address
            to: option === 'new-site' ? 'mkurmot@hotmail.com' : 'mkurmot@gmail.com', // recipient
            subject: 'New Contact Form Submission', // Subject line
            text: `
                Full Name: ${fullname}
                Email: ${email}
                Phone Number: ${phone}
                Message: ${message}
            `, // plain text body
        });

        console.log('Message sent: %s', info.messageId);
        return new Response(JSON.stringify({ status: "success", message: 'Email sent successfully.' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error sending email:', error.message);
        return new Response(JSON.stringify({status: "error", error: 'Internal server error.' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
