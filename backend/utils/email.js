// utils/email.js
const nodemailer = require('nodemailer');

// Créez un transporteur Nodemailer avec Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // Votre adresse Gmail
    pass: process.env.EMAIL_PASS,   // Votre mot de passe d'application
  },
  tls: {
    rejectUnauthorized: false // Désactive la vérification SSL (uniquement en développement)
  }
});


// Fonction pour envoyer l'email de vérification
const sendVerificationEmail = (email, token) => {
  const verificationUrl = `${process.env.BASE_URL}/auth/verify/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Vérification de votre email',
    html: `<p>Cliquez sur le lien suivant pour vérifier votre email : </p><a href="${verificationUrl}">${verificationUrl}</a>`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
