import { User } from '../types/User';
import prisma from './prisma';
import bcrypt from 'bcrypt';

// eslint-disable-next-line import/no-anonymous-default-export
export default {

  /*Function that gets users */
  getUserEditing: async (id: string) => {
    const user = await prisma.user.findFirst({
      where: {
        id
      }     
    });

    if(!user) {
      return null;
    };

    if(user){
      return {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        birthdate: user?.birthdate,
        cpf: user?.cpf,
        cellphone: user?.cellphone
      };
    };
  },


   /* UPDATE USER */
   updateUserEdited: async (user: User) => {
    const updUserEdited = await prisma.user.update({
      where: {
        id: user.id        
      },
      data: {
        name: user.name,
        cpf: user.cpf,
        birthdate: user.birthdate,
        cellphone: user.cellphone,
        email: user.email
      }
    });
    return updUserEdited;
  },

  };

  
   



  
  

  







