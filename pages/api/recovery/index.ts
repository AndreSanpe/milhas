import { NextApiHandler } from "next";
import prisma from '../../../libs/prisma';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from "bcrypt";
<<<<<<< HEAD
import EmailRecovery from "../../../emails/recuperar-senha";
import { render } from "@react-email/components";
=======
import { error } from "console";
>>>>>>> 09286d995f1b689fe699205bac56d945dc56c3e0

//Send link for update password
const handlerPost:  NextApiHandler = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })

    if(!user) {
      return res.status(201).json({text: 'Email inválido'})
    }

    if(user) {
      //Create token with jwt
      const userToken = jwt.sign({userId: user.id}, process.env.TOKEN_SECRET as string, {
        expiresIn: "1h"
      })
<<<<<<< HEAD
      const url: string = `http://localhost:3000/reset/${userToken}`
      const htmlRecovery = render(EmailRecovery(url as any))
=======
      const url = `http://localhost:3000/reset/${userToken}`
>>>>>>> 09286d995f1b689fe699205bac56d945dc56c3e0

      //Send recovery email
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
        to: user.email,
        subject: 'Recuperação de senha',
<<<<<<< HEAD
        text: '',
        html: htmlRecovery
=======
        text: 'Recupere sua senha clicando no botão abaixo',
        html: `<a href=${url}>Clique aqui</a>`
>>>>>>> 09286d995f1b689fe699205bac56d945dc56c3e0
      }).catch(console.error) 
    
      res.status(201).json({message: 'Email enviado com sucesso'})
    }
  } catch {
  res.status(401).json({ message: 'Email não enviado '})
  } 
}

//Update password
const handlerPut:  NextApiHandler = async (req, res) => { 
  const { validationToken, password } = req.body;

  let hashedPass = bcrypt.hashSync(password, 10);
  const passwordNew: string = hashedPass;

  try {
    const verify: any = jwt.verify(validationToken as string, process.env.TOKEN_SECRET as string, (err, payload) => {
      if(err) {
        if(err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
          return  {
              validation: false
          }
        }
      } 
      return payload;
    });
  
    const userId: any = verify.userId;
  
    if(userId) {
      const response = await prisma.user.update({
        where: {
          id: userId 
        },
        data: {
          password: passwordNew
        }
      }).catch(console.error);
    
      res.status(201).json({message: 'Senha alterada com sucesso'})
    }     
  } catch {
    res.status(401).json({message: 'Senha não alterada'})
  }
};

const handler: NextApiHandler = async (req, res) => {
  switch(req.method) {
    case 'POST':
      handlerPost(req, res);
    break;
    case 'PUT':
      handlerPut(req, res);
    break;
  }
};
   
export default handler;