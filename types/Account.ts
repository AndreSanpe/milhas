export type Account = {
  id: string;
  name: string;
  document: string;
  statusLivelo: boolean;
  priceLivelo: number;
  statusEsfera: boolean;
  priceEsfera: number;
  statusLatam: boolean;
  priceLatam: number;
  statusAzul: boolean;
  priceAzul: number;
  statusSmiles: boolean;
  priceSmiles: number;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}