export type BuyBonus = {
  product: string;
  price: number;
  pointsForReal: number;
  program: string;
  pointsQuantity: number;
  pointsCardQuantity?: number;
  totalpoints?: number
  destiny?: string;
  percentage?: number;
  miles?: number;
  secureValue?: number;
  sellPrice: number;
  priceMiles: number;
  percentageProfit: number;
  finalPrice: number;
  userId: number;
  createdAt: Date;
}