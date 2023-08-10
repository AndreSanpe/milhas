import { NextApiHandler } from "next";
import nodemailer from 'nodemailer';


const handlerEmail:  NextApiHandler = async (req, res) => {

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_MAIL_USER,
      pass: process.env.ZOHO_MAIL_PASS,
    }
  });

  const sendEmail = await transporter.sendMail({
    from: 'PlanMilhas <suporte@planmilhas.com.br>',
    to: req.body.emailuser,
    subject: req.body.subject,
    text: req.body.text,
    html: req.body.texthtml
  }).catch(console.error)

}

export default handlerEmail;