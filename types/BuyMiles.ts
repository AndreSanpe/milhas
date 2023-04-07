export type BuyMiles = {
  id: number;
  price: number;
  pointsQuantity: number;
  dateBuy: string;
  program: string;
  selectedAccount: string;
  cpf: string;
  destiny?: string;
  percentage?: number;
  creditCard?: string;
  parcel?: string;
  month?: string;
  miles?: number;
  finalPrice: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}