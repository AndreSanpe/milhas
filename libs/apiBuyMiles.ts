import { BuyMiles } from '../types/BuyMiles';
import prisma from './prisma';

// eslint-disable-next-line import/no-anonymous-default-export
export default {

  /* POST NEW BUY MILES */
  addNewMilesBuyed: async ({price, pointsQuantity, dateBuy, program, selectedAccount, cpf, destiny, percentage, creditCard, parcel, month, miles, finalPrice, userId}: BuyMiles) => {

    return await prisma.buyMiles.create({
      data: {
        price, pointsQuantity, dateBuy, program, selectedAccount, cpf, destiny, percentage, creditCard, parcel, month, miles, finalPrice, userId
      }
    });
  },

  /* GET ALL BUY MILES */
  getMilesBuyed: async (userId: number) => {
    const buyedMiles = await prisma.buyMiles.findMany({
      where: {
        userId
      }
    });

    if(!buyedMiles) {
      return null;
    }
    return buyedMiles;
  },

  /* GET ONE BUY MILES */
  getOneMilesBuyed: async (id: number) => {
    const Buyed = await prisma.buyMiles.findFirst({
      where: {
        id
      }
    });

    if(!Buyed) {
      return null;
    }
    return Buyed;
  },

  /* UPDATE BUY MILES */
  updateMilesBuyed: async (milesBuyed: BuyMiles) => {
    const updMilesBuyed = await prisma.buyMiles.update({
      where: {
        id: milesBuyed.id        
      },
      data: {
        
      }
    });
    return updMilesBuyed;
  },

  /* DELETE BUY MILES */
  deleteMilesBuyed: async (id: number) => {
    const deleteId = await prisma.buyMiles.delete({
      where: {
        id
      }
    });
  },

}