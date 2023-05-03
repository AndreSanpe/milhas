import { User } from '../types/User';
import prisma from './prisma';
import bcrypt from 'bcrypt';


// eslint-disable-next-line import/no-anonymous-default-export
export default {

  /* Authentication function ///////////////////////////////////////////////////////////////*/
  getAuthUser: async (email: string, unHashPassword: string) => {
    const user = await prisma.user.findFirst({
      where: { email, status: true }
    });

    if(!user) {
      return null;
    } 
    
    const comparePass = await bcrypt.compare(unHashPassword, user?.password as string);
    console.log(comparePass)
    if (comparePass){
      return {
        id: user.id,
        name: user.name,
        email: user.email
      };
    } else {
      return null;
    }
  },

  /*Function that gets users */
  getUser: async (id: number) => {

    if(!id) {
      return null;
    };

    const user = await prisma.user.findFirst({
      where: {
        id
      }     
    });

    if(id){
      return {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        birthDate: user?.birthdate,
        cellphone: user?.cellphone,
        status: user?.status,
        date: user?.createdAt.getDate().toString()
      };
    };
  },

  /* Create new user */
  addNewUser: async ({ name, email, cpf, birthdate, cellphone, password }: User) => {

    let hashedPass = await bcrypt.hashSync(password, 10);
    password = hashedPass;

    return await prisma.user.create({
      data : {
        name, email, cpf, birthdate, cellphone, password
      }
    })
  },



  };






