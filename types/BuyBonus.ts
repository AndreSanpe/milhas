export type BuyBonus = {
  id: number;
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
  score: boolean;
  priceProtection: boolean;
  transfer: boolean;
  currencyOption: string;
  pointsCard: number;
  createdAt: Date;
}