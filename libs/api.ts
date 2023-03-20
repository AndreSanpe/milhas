import { Account } from '../types/Account';
import { BuyBonus } from '../types/BuyBonus';
import { BuyMiles } from '../types/BuyMiles';
import { SellMiles } from '../types/SellMiles';
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

    account.map((item: any, index: number) => (
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
  
  /* Function for Add new miles buyed data */
  addNewMilesBuyed: async ({price, pointsQuantity, program, selectedAccount, cpf, destiny, percentage, creditCard, parcel, month, miles, finalPrice, userId}: BuyMiles) => {

    return await prisma.buyMiles.create({
      data: {
        price, pointsQuantity, program, selectedAccount, cpf, destiny, percentage, creditCard, parcel, month, miles, finalPrice, userId
      }
    });
  },

  /* Function for get miles buyed data */
  getMilesBuyed: async () => {

  },

  /* Function for Add new miles selled data */
  addNewMilesSelled: async ({pointsQuantity, priceBuy, priceSell, program, programBuyer, selectedAccount, receipt, dateSell, dateReceipt, profit, percentageProfit, userId}: SellMiles) => {

    return await prisma.sellMiles.create({
      data: {
        pointsQuantity, priceBuy, priceSell, program, programBuyer, selectedAccount, receipt, dateSell, dateReceipt, profit, percentageProfit, userId
      }
    });
  },

  /* Function for get miles selled data */
  getMilesSelled: async () => {

  },

  addNewBuyBonus: async ({product,price,pointsForReal,program,pointsQuantity,pointsCardQuantity, totalpoints,destiny,percentage,miles,secureValue,sellPrice,priceMiles,percentageProfit,finalPrice,userId}: BuyBonus) => {

    return await prisma.buyBonus.create({
      data : {
        product, price, pointsForReal, program, pointsQuantity, pointsCardQuantity, totalpoints, destiny ,percentage, miles, secureValue, sellPrice, priceMiles, percentageProfit, finalPrice,userId
      }
    });
  },

  /* Function for get buy bonus data */
  getBuyBonus: async (userId: number) => {
      const buy = await prisma.buyBonus.findMany({
        where: {
          userId
        }
      });
      return buy;
  },


  };






