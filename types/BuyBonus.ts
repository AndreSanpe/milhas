export type BuyBonus = {
  id: string;
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
  userId: string;
  score: boolean;
  priceProtection: boolean;
  transfer: boolean;
  currencyOption: string;
  pointsCard: number;
  createdAt: Date;
}