import { SellMiles } from '../types/SellMiles';
import prisma from './prisma';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  
  /* POST NEW SELL MILES */
  addNewMilesSelled: async ({pointsQuantity, priceBuy, priceSell, program, programBuyer, selectedAccount, cpf, receipt, dateSell, dateReceipt, profit, percentageProfit, userId}: SellMiles) => {

    return await prisma.sellMiles.create({
      data: {
        pointsQuantity, priceBuy, priceSell, program, programBuyer, selectedAccount, cpf, receipt, dateSell, dateReceipt, profit, percentageProfit, userId
      }
    });
  },

  /* GET ALL SELL MILES */
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

  /* GET ONE SELL MILES */
  getOneMilesSelled: async (id: number) => {
    const selled = await prisma.sellMiles.findFirst({
      where: {
        id
      }
    });

    if(!selled) {
      return null;
    }
    return selled;
  },

  /* UPDATE SELL MILES */
  updateMilesSelled: async (milesSelled: SellMiles) => {
    const updMilesSelled = await prisma.sellMiles.update({
      where: {
        id: milesSelled.id        
      },
      data: {
        pointsQuantity: milesSelled.pointsQuantity, 
        priceBuy: milesSelled.priceBuy, 
        priceSell: milesSelled.priceSell, 
        program: milesSelled.program,
        cpf: milesSelled.cpf, 
        programBuyer: milesSelled.programBuyer, 
        selectedAccount: milesSelled.selectedAccount, 
        receipt: milesSelled.receipt, 
        dateSell: milesSelled.dateSell, 
        dateReceipt: milesSelled.dateReceipt, 
        profit: milesSelled.profit, 
        percentageProfit: milesSelled.percentageProfit
      }
    });
    return updMilesSelled;
  },

  /* DELETE SELL MILES */
  deleteMilesSelled: async (id: number) => {
    const deleteId = await prisma.sellMiles.delete({
      where: {
        id
      }
    });
  },

}