import nodemailer from 'nodemailer';

const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  
  return transporter;
};

export  {createTransporter} ;

