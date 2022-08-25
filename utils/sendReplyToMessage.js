const sendEmail = require("./sendEmail");

const sendReplyToMessage = async ({name,email,message,subject}) => {
    return sendEmail({
        to:email,
        subject : subject,
        html : `<h4>Merhaba, ${name} </h4>
        <p>${message}</p>
        <div style="padding:20px 0 0 0; display:flex; justify-content: start; align-items: center;">
            <div>
                <img style="width:100%;" src="https://i.hizliresim.com/ayh997w.png">
            </div>
        </div>
        `,
        
    })
}

module.exports = sendReplyToMessage;