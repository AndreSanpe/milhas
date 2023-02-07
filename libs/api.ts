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

  //Function for get user data
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

  /* Add new account (cpf) controlled */
  addNewAccount: async (account: Account) => {

    const { name, document, statusLivelo, priceLivelo, statusEsfera, priceEsfera, statusLatam, priceLatam, statusAzul, priceAzul, statusSmiles, priceSmiles, userId } = account;

    return await prisma.account.create({
      data: {
        name, document,
        statusLivelo, priceLivelo, statusEsfera, priceEsfera, statusLatam, priceLatam, statusAzul, priceAzul, statusSmiles, priceSmiles, userId
      }
    });

  },

  /* Function for get accounts data */
  getAccounts:async (userId: number) => {
    const accounts: Account[] = [];
    const account = await prisma.account.findMany({
      where: {
        userId
      }
    });

    account.map((item, index) => (
      accounts.push({
        id: item.id,
        name: item.name,
        document: item.document,
        statusLivelo: item.statusLivelo,
        priceLivelo: item.priceLivelo,
        statusEsfera: item.statusEsfera,
        priceEsfera: item.priceEsfera,
        statusAzul: item.statusAzul,
        priceAzul: item.priceAzul,
        statusLatam: item.statusLatam,
        priceLatam: item.priceLatam,
        statusSmiles: item.statusSmiles,
        priceSmiles: item.priceSmiles,
        userId: item.userId
      })
    ))
    return accounts;   

  },
  

  };






