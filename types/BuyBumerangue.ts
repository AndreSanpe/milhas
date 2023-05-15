export type BuyBumerangue = {
  id: number,
  userId: number,
  price: number;
  pointsQuantity: number;
  dateBuy: string;
  selectedAccount: string;
  cpf: string;

  program: string;
  destinyOne: string;
  percentage: number;
  miles?: number;

  returnPercentage?: number;
  points?: number;
  
  transfer: boolean;
  percentageTwo?: number;
  destinyTwo?: string;
  milesTwo?: number;
  
  totalMiles: number; 
  finalPrice: number;
  
  createdAt: Date,
  updatedAt: Date
}