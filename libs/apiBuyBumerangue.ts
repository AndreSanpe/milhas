import { BuyBumerangue } from '../types/BuyBumerangue';
import prisma from './prisma';

// eslint-disable-next-line import/no-anonymous-default-export
export default {

  /* POST NEW BUY BUMERANGUE */
  addNewBuyBumerangue: async ({price, pointsQuantity, dateBuy, selectedAccount, cpf, program, destinyOne, percentage, miles, returnPercentage, points, transfer, percentageTwo, destinyTwo, milesTwo, totalMiles, finalPrice, userId}: BuyBumerangue) => {

    return await prisma.buyBumerange.create({
      data: {
        price, pointsQuantity, dateBuy, selectedAccount, cpf, program, destinyOne, percentage, miles, returnPercentage, points, transfer, percentageTwo, destinyTwo, milesTwo, totalMiles, finalPrice, userId
      }
    });
  },

  /* GET ALL BUY BUMERANGUES */
  getBuysBumerangue: async (userId: string) => {
    const buysBumerangue = await prisma.buyBumerange.findMany({
      where: {
        userId
      }
    });

    if(!buysBumerangue) {
      return null;
    }
    return buysBumerangue;
  },

  /* GET ONE BUY BUMERANGUE */
  getOneBuyBumerangue: async (id: string) => {
    const buyBumerangue = await prisma.buyBumerange.findFirst({
      where: {
        id
      }
    });

    if(!buyBumerangue) {
      return null;
    }
    return buyBumerangue;
  },

  /* UPDATE BUY BUMERANGUE */
  updateBuyBumerangue: async (buyBumerangue: BuyBumerangue) => {
    const updBuyBumerangue = await prisma.buyBumerange.update({
      where: {
        id: buyBumerangue.id        
      },
      data: {
        price: buyBumerangue.price, 
        pointsQuantity: buyBumerangue.pointsQuantity, 
        dateBuy: buyBumerangue.dateBuy, 
        selectedAccount: buyBumerangue.selectedAccount, 
        cpf: buyBumerangue.cpf, 
        program: buyBumerangue.program, 
        destinyOne: buyBumerangue.destinyOne, 
        percentage: buyBumerangue.percentage, 
        miles: buyBumerangue.miles, 
        returnPercentage: buyBumerangue.returnPercentage, 
        points: buyBumerangue.points, 
        transfer: buyBumerangue.transfer, 
        percentageTwo: buyBumerangue.percentageTwo, 
        destinyTwo: buyBumerangue.destinyTwo, 
        milesTwo: buyBumerangue.milesTwo, 
        totalMiles: buyBumerangue.totalMiles, 
        finalPrice: buyBumerangue.finalPrice
      }
    });
    return updBuyBumerangue;
  },

  /* DELETE BUY BUMERANGUE */
  deleteBuyBumerangue: async (id: string) => {
    const deleteId = await prisma.buyBumerange.delete({
      where: {
        id
      }
    });
  },

}