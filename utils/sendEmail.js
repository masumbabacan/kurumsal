const nodemailer = require('nodemailer');
const nodeMailerConfig = require('./nodemailerConfig');

const sendEmail = async ({to,subject,html}) => {
    const transporter = nodemailer.createTransport(nodeMailerConfig);
    return transporter.sendMail({
        from: 'Masum Babacan <masum@btmteknoloji.com>',
        to,
        subject,
        html,
    });
};

module.exports = sendEmail;