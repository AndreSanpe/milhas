export type SellMiles = {
  id: number;
  pointsQuantity: number;
  priceBuy: number;
  priceSell: number;
  program: string;
  programBuyer: string;
  selectedAccount: string;
  receipt?: number;
  dateSell?: string;
  dateReceipt?: string;
  profit: number;
  percentageProfit: number;
  userId: number;
  createdAt: Date;
};