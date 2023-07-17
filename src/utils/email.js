const nodemailer = require('nodemailer');

//Creamos una función asíncrona que nos envíe el email.
const sendEmail = async (option) => {

    //1º Creamos el transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587 ,
        auth: {
            user: process.env.EMAIL ,
            pass: process.env.BREVO_KEY
        },
    })

    //2º Configuramos las opciones del email
    const emailOptions = {
        from: `Soporte Homehub ${process.env.EMAIL}`,
        to: option.email,
        subject: option.subject,
        //ESTO PUEDE SER UN TEXT O UN HTML
        //html: '<div> <h2>Gracias por registrarte en la app.</h2> <p>Esto es un correo de verificación estándar.</p> </div>' 
        html: option.message
    };

    //3º Mandamos el correo conforme lo hemos configurado.
    await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;