const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    try {
        sgMail.send({
            to: email,
            from: 'lariasTaskManager@udemy.com',
            subject: 'Thanks fir joining in!',
            text: 'Welcome to the app, ' + name + '. Let me know how you get along with the app. '
        });
    } catch (e) {
        console.log(e);
    }
}


const sendCancelationEmail = (email, name) => {
    try {
        sgMail.send({
            to: email,
            from: 'lariasTaskManager@udemy.com',
            subject: 'Bye!',
            text: 'Thanks for your time, ' + name + '. We gona miss you!'
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
