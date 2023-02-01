import { Account } from '../types/Account';
import prisma from './prisma';

// eslint-disable-next-line import/no-anonymous-default-export
export default {

  //Function for authentication
  getAuthUser: async (email: string, password: string) => {
    const user = await prisma.user.findFirst({
      where: { email, status: true }
    });
    
    if(!user) {
      return null;
    } 

    if (email !== user.email) {
      return null;
    }

    if (user && email === user.email && password === user.password ){
      return user;
    }
  
  },

  //Function for get tenant data
  getUser: async (id: number) => {
    const user = await prisma.user.findFirst({
      where: {
        id
      }     
    });
    
    return {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      birthDate: user?.birthdate,
      cellphone: user?.cellphone,
      status: user?.status,
      date: user?.createdAt.getDate().toString()
    };
  },

  addNewAccount: async (name: string, document: string, livelo: boolean, priceLivelo: string, esfera: boolean, priceEsfera: string, latam: boolean, priceLatam: string, azul: boolean, priceAzul: string, smiles: boolean, priceSmiles: string, userId: number) => {

    const newAccount = await prisma.account.create({
      data: {
        name, document,
        livelo, priceLivelo, esfera, priceEsfera, latam, priceLatam, azul, priceAzul, smiles, priceSmiles, userId
      }
    });

    return newAccount;
  }

}