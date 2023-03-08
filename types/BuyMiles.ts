export type BuyMiles = {
  price: number;
  pointsQuantity: number;
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