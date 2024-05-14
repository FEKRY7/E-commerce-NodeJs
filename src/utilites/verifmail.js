const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, verificationLink) => {
    const emailUser = process.env.EMAIL;
    const emailPassword = process.env.PASS;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPassword
        }
    });

    const mailOptions = {
        from: emailUser,
        to: email,
        subject: 'Activate your account',
        html: `
            <div>
                <a href="${verificationLink}">Click here to activate your account</a>
            </div>
        `,
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = sendVerificationEmail;
