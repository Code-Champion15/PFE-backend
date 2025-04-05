const nodemailer = require('nodemailer');

// Créez un transporteur Nodemailer avec Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   
    pass: process.env.EMAIL_PASS,   
  },
  tls: {
    rejectUnauthorized: false 
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

const sendResetPasswordEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false 
    }
  });

  const resetUrl = `${process.env.BASE_FRONT_URL}/login/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetUrl}`,
  };

  await transporter.sendMail(mailOptions);
};


module.exports = { sendVerificationEmail, sendResetPasswordEmail };

