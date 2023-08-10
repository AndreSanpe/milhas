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
<<<<<<< HEAD
    from: 'PlanMilhas <suporte@planmilhas.com.br>',
=======
    from: `'PlanMilhas <${req.body.emailplan}>'`,
>>>>>>> 09286d995f1b689fe699205bac56d945dc56c3e0
    to: req.body.emailuser,
    subject: req.body.subject,
    text: req.body.text,
    html: req.body.texthtml
  }).catch(console.error)

}

export default handlerEmail;