export type Account = {
  id?: number;
  name: string;
  document: string;
  livelo: boolean;
  statusLivelo: boolean;
  priceLivelo:string;
  esfera: boolean;
  statusEsfera: boolean;
  priceEsfera: string;
  latam: boolean;
  statusLatam: boolean;
  priceLatam: string;
  azul: boolean;
  statusAzul: boolean;
  priceAzul: string;
  smiles: boolean;
  statusSmiles: boolean;
  priceSmiles: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}