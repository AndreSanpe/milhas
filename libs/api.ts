import { Account } from '../types/Account';
import { BuyBonus } from '../types/BuyBonus';
import { BuyMiles } from '../types/BuyMiles';
import { SellMiles } from '../types/SellMiles';
import prisma from './prisma';

// eslint-disable-next-line import/no-anonymous-default-export
export default {

  /* Function for authentication ///////////////////////////////////////////////////////////////*/
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
      return {
        id: user.id,
        name: user.name,
        email: user.email
      };
    }
  
  },


  /* User-related functions//////////////////////////////////////////////////////////////////// */
  /*Functions related to managed users */
  getUser: async (id: number) => {
    const user = await prisma.user.findFirst({
      where: {
        id
      }     
    });

    if(!id) {
      return null;
    };

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


   /* Functions related to managed accounts ////////////////////////////////////////////////////*/
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

  /* Function to get accounts data */
  getAccounts:async (userId: number) => {
    const accounts: Account[] = [];
    const account = await prisma.account.findMany({
      where: {
        userId
      }
    });

    if(!userId) {
      return null;
    }

    if(userId && account) {
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
    }
  },

  /* Function to get one account for edit */
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

  /* Function to update an account */
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

  /* Function to delete an account */
  deleteAccount: async (id: number) => {
    const deleteId = await prisma.account.delete({
      where: {
        id
      }
    });
  },
  

  /* Functions related to the purchase of miles///////////////////////////////////////////////// */
  /* Function to Add new miles buyed data */
  addNewMilesBuyed: async ({price, pointsQuantity, program, selectedAccount, cpf, destiny, percentage, creditCard, parcel, month, miles, finalPrice, userId}: BuyMiles) => {

    return await prisma.buyMiles.create({
      data: {
        price, pointsQuantity, program, selectedAccount, cpf, destiny, percentage, creditCard, parcel, month, miles, finalPrice, userId
      }
    });
  },

  /* Function to get miles buyed data */
  getMilesBuyed: async () => {

  },

  /* Function to Add new miles selled data */
  addNewMilesSelled: async ({pointsQuantity, priceBuy, priceSell, program, programBuyer, selectedAccount, receipt, dateSell, dateReceipt, profit, percentageProfit, userId}: SellMiles) => {

    return await prisma.sellMiles.create({
      data: {
        pointsQuantity, priceBuy, priceSell, program, programBuyer, selectedAccount, receipt, dateSell, dateReceipt, profit, percentageProfit, userId
      }
    });
  },

  /* Function for get miles selled data */
  getMilesSelled: async (userId: number) => {
    const selledMiles = await prisma.sellMiles.findMany({
      where: {
        userId
      }
    });

    if(!selledMiles) {
      return null;
    }

    return selledMiles;
  },


  /* Functions related to the buy bonus///////////////////////////////////////////////// */
  addNewBuyBonus: async ({product,price,pointsForReal,program,pointsQuantity,pointsCardQuantity, totalpoints,destiny,percentage,miles,secureValue,sellPrice,priceMiles,percentageProfit,finalPrice,score,priceProtection, transfer, currencyOption,
    pointsCard, userId}: BuyBonus) => {

    return await prisma.buyBonus.create({
      data : {
        product, price, pointsForReal, program, pointsQuantity, pointsCardQuantity, totalpoints, destiny ,percentage, miles, secureValue, sellPrice, priceMiles, percentageProfit, finalPrice, score, priceProtection, transfer, currencyOption,
        pointsCard, userId
      }
    });
  },

  /* Function for get buy bonus data */
  getBuyBonus: async (userId: number) => {
    const buys = await prisma.buyBonus.findMany({
      where: {
        userId
      }
    });

    if(!buys) {
      return null;
    }

    return buys;
  },

  /* Function for get one buy bonus data */
  getOneBuyBonus: async (id: number) => {
    const buy = await prisma.buyBonus.findFirst({
      where: {
        id
      }
    });

    if(!id) {
      return null;
    }

    return buy;
  },

  /* Function to update an account */
  updateBuyBonus: async (buybonus: BuyBonus) => {
    const updBuyBonus = await prisma.buyBonus.update({
      where: {
        id: buybonus.id        
      },
      data: {
        product: buybonus.product,
        price: buybonus.price,
        pointsForReal: buybonus.pointsForReal,
        program: buybonus.program,
        pointsQuantity: buybonus.pointsQuantity,
        pointsCardQuantity: buybonus.pointsCardQuantity,
        totalpoints: buybonus.totalpoints,
        destiny: buybonus.destiny,
        percentage: buybonus.percentage,
        miles: buybonus.miles,
        secureValue: buybonus.secureValue,
        sellPrice: buybonus.sellPrice,
        priceMiles: buybonus.priceMiles,
        percentageProfit: buybonus.percentageProfit,
        finalPrice: buybonus.finalPrice,
        score: buybonus.score, 
        priceProtection: buybonus.priceProtection,
        currencyOption: buybonus.currencyOption,
        pointsCard: buybonus.pointsCard,
        transfer: buybonus.transfer
      }
    });
    return updBuyBonus;
  },

  /* Function to delete an buy bonus */
  deleteBuyBonus: async (id: number) => {
    const deleteId = await prisma.buyBonus.delete({
      where: {
        id
      }
    });
  },


  };






