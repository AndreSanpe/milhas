export type BuyMiles = {
  id: string;
  price: number;
  pointsQuantity: number;
  dateBuy: string;
  program: string;
  selectedAccount: string;
  cpf: string;
  transfer: boolean;
  destiny?: string;
  percentage?: number;
  creditCard?: string;
  parcel?: string;
  month?: string;
  miles?: number;
  finalPrice: number;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}