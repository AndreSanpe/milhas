import { NextApiHandler } from "next";
import prisma from "../../../libs/prisma";
import api from '../../../libs/api';
import { Account } from "../../../types/Account";

const handlerGet: NextApiHandler = async (req, res) => {

}

const handlerPost: NextApiHandler = async (req, res) => {
  const { name, document, livelo, priceLivelo, esfera, priceEsfera, latam, priceLatam, azul, priceAzul, smiles, priceSmiles, userId }: Account = req.body;

  const account = await api.addNewAccount( name, document, livelo, priceLivelo, esfera, priceEsfera, latam, priceLatam, azul, priceAzul, smiles, priceSmiles, userId )

  res.status(201).json({status: true});
  
}


const handler: NextApiHandler = async (req, res) => {
  switch(req.method) {
    case 'GET':
      handlerGet(req, res);
    break;
    case 'POST':
      handlerPost(req, res);
    break;
  }

}

export default handler;