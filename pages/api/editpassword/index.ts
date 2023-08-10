import { NextApiHandler } from "next";
import prisma from '../../../libs/prisma';
import bcrypt from "bcrypt";

type UserPass = {
  id: string,
  passwordOld: string,
  password: string
}

//Update password
const handlerPut:  NextApiHandler = async (req, res) => {
  const {id, password, passwordOld}: UserPass = req.body;

  const response = await prisma.user.findFirst({
    where: {
      id
    }
  })

  const comparePass = await bcrypt.compare(passwordOld, response?.password as string);

  if(!comparePass) {
    return res.status(401).json({error: 'Senhas diferentes'})
  }

  let hashedPass = bcrypt.hashSync(password, 10);
  const passwordNew: string = hashedPass;

  /* console.log(`Este é a comparação: ${comparePass}`)
  console.log(`Este é o pass Hashed: ${passwordNew}`) */

  if(comparePass) {
    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        password: passwordNew
      }     
    });
  };

  return res.status(201).json({status: true})

  }


const handler: NextApiHandler = async (req, res) => {
  switch(req.method) {
    case 'PUT':
      handlerPut(req, res);
    break;
  }
};

export default handler;