export type Account = {
  id?: number;
  name: string;
  document: string;
  statusLivelo: boolean;
  priceLivelo:string;
  statusEsfera: boolean;
  priceEsfera: string;
  statusLatam: boolean;
  priceLatam: string;
  statusAzul: boolean;
  priceAzul: string;
  statusSmiles: boolean;
  priceSmiles: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}