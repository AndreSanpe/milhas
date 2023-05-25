export type SellMiles = {
  id: string;
  pointsQuantity: number;
  priceBuy: number;
  priceSell: number;
  program: string;
  programBuyer: string;
  selectedAccount: string;
  cpf: string;
  receipt?: number;
  dateSell?: string;
  dateReceipt?: string;
  profit: number;
  percentageProfit: number;
  userId: string;
  createdAt: Date;
};