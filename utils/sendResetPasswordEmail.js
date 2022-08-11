const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({name,email,token,origin}) => {
    const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`
    const message = `<p> Lütfen şifrenizi sıfırlayabilmek için linki takip edin : <a href="${resetURL}">Şifreyi sıfırla!</a> </p>`
    return sendEmail({
        to:email,
        subject : 'Şifreyi Sıfırla',
        html : `<h4>Merhaba, ${name} </h4>
        ${message}
        `,
    })
}

module.exports = sendResetPasswordEmail;