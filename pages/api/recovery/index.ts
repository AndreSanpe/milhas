import { NextApiHandler } from "next";
import prisma from '../../../libs/prisma';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from "bcrypt";
import Recovery from "../../../emails/recovery";
import { render } from "@react-email/components";


//Send link for update password
const handlerPost:  NextApiHandler = async (req, res) => {
  const { email } = req.body;
  const baseUrl = process.env.DOMAIN_URL ? `${process.env.DOMAIN_URL}/` : '';

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
      
      const url: string = `${baseUrl}reset/${userToken}`
      const urlLink = url.toString();
      const htmlRecovery = render(Recovery(urlLink))

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
        from: 'PlanMilhas <no-reply@planmilhas.com.br>',
        to: user.email,
        subject: 'Recuperação de senha',
        text: '',
        html: htmlRecovery
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