require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const sgApiKey = process.env.SENDGRID_KEY;
sgMail.setApiKey(sgApiKey);


const welcomeEmail=(email,name)=>{
    const msg = {
        to: email, // Change to your recipient
        from: "developersavenue@gmail.com", // Change to your verified sender
        subject: 'Success Account Activation!',
        text:`Congratulations ${name} On Setting Up Your Task API account,login and have a lifetime access to our API endpoints!!!!`, // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      sgMail.send(msg)

}

const cancelationMessage=(email,name)=>{
    const msg = {
        to: email, // Change to your recipient
        from: "developersavenue@gmail.com", // Change to your verified sender
        subject: 'We Are Sorry To Let You Go !',
        text:`For some reason, ${name} you chose to leave us,kindly provide us with a feedback telling us why you deleted your account so as to better our services for our future customers.`, // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      sgMail.send(msg)

}


module.exports={
    welcomeEmail,
    cancelationMessage
}