import { BuyBonus } from '../types/BuyBonus';
import prisma from './prisma';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  
   /* POST BUY BONUS///////////////////////////////////////////////// */
   addNewBuyBonus: async ({product,price,pointsForReal,program,pointsQuantity,pointsCardQuantity, totalpoints,destiny,percentage,miles,secureValue,sellPrice,priceMiles,percentageProfit,finalPrice,score,priceProtection, transfer, currencyOption,
    pointsCard, userId}: BuyBonus) => {

    return await prisma.buyBonus.create({
      data : {
        product, price, pointsForReal, program, pointsQuantity, pointsCardQuantity, totalpoints, destiny ,percentage, miles, secureValue, sellPrice, priceMiles, percentageProfit, finalPrice, score, priceProtection, transfer, currencyOption,
        pointsCard, userId
      }
    });
  },

  /* GET ALL BUY BONUS */
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

  /* GET ONE BUY BONUS */
  getOneBuyBonus: async (id: number) => {
    const buy = await prisma.buyBonus.findFirst({
      where: {
        id
      }
    });

    if(!buy) {
      return null;
    }
    return buy;
  },

  /* UPDATE BUY BONUS */
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

  /* DELETE BUY BONUS */
  deleteBuyBonus: async (id: number) => {
    const deleteId = await prisma.buyBonus.delete({
      where: {
        id
      }
    });
  },

}