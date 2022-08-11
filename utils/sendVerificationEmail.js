const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({name,email,verificationToken,origin}) => {
    const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
    const message = `<p> Lütfen E-postanızı doğrulayabilmemiz için linki takip edin : <a href="${verifyEmail}">E-postayı Doğrula!</a> </p>`
    return sendEmail({
        to:email,
        subject : 'E-posta onayı',
        html : `<div style="text-align: center; width: 100%;">
        <div style="font-weight: 700;">Merhaba ${name}</div>
        <div style="font-weight: 400;">E-postanızı kaydedebilmemiz için lütfen doğrulama yapınız..</div>
        <img style="width: 20%;" src="https://cdn4.iconfinder.com/data/icons/social-media-logos-6/512/112-gmail_email_mail-512.png" alt="">
        <div style="text-align: center;"><a href="${verifyEmail}" style="padding: 10px; background-color: aqua; border: none; border-radius: 5px;">Emaili Doğrula</a></div>
    </div>`
    })
}

module.exports = sendVerificationEmail;


// `<h4>Merhaba, ${name} </h4>
//         ${message}
//         `,