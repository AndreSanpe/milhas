import prisma from './prisma';
import { Account } from "../types/Account";

// eslint-disable-next-line import/no-anonymous-default-export
export default {

  /* POST NEW ACCOUNT */
  addNewAccount: async (account: Account) => {

    const { name, document, statusLivelo, priceLivelo, statusEsfera, priceEsfera, statusLatam, priceLatam, statusAzul, priceAzul, statusSmiles, priceSmiles, userId } = account;

    return await prisma.account.create({
      data: {
        name, document,
        statusLivelo, priceLivelo, statusEsfera, priceEsfera, statusLatam, priceLatam, statusAzul, priceAzul, statusSmiles, priceSmiles, userId
      }
    });

  },

   /* GET ALL ACCOUNTS */
  getAccounts:async (userId: number) => {
    if(!userId) {
      return null;
    }
    const accounts = await prisma.account.findMany({
      where: {
        userId
      }
    });

    return accounts;
  },

  /* GET ONE ACCOUNT */
  getAccount: async (userId: number, id: number) => {
    const account = await prisma.account.findFirst({
      where: {
          userId,
          id
      }
    });

    if(!userId || !id) {
      return null;
    }

    return account;
  },

  /* UPDATE ACCOUNT*/
  updateAccount: async (account: Account) => {
    const updAccount = await prisma.account.update({
      where: {
        id: account.id        
      },
      data: {
        name: account.name,
        document: account.document,
        statusLivelo: account.statusLivelo,
        priceLivelo: account.priceLivelo,
        statusEsfera: account.statusEsfera,
        priceEsfera: account.priceEsfera,
        statusAzul: account.statusAzul,
        priceAzul: account.priceAzul,
        statusLatam: account.statusLatam,
        priceLatam: account.priceLatam,
        statusSmiles: account.statusSmiles,
        priceSmiles: account.priceSmiles,
      }
    });
    return updAccount;
  },

  /* DELETE ACCOUNT */
  deleteAccount: async (id: number) => {
    const deleteId = await prisma.account.delete({
      where: {
        id
      }
    });
  },
}