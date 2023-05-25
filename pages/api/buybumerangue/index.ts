import { NextApiHandler } from "next";
import { BuyMiles } from "../../../types/BuyMiles";
import { getSession } from "next-auth/react";
import apiBuyBumerangue from "../../../libs/apiBuyBumerangue";
import { BuyBumerangue } from "../../../types/BuyBumerangue";

const handlerGet: NextApiHandler = async (req, res) => {
  const { userId } = req.body;
  const buyBumerangue = await apiBuyBumerangue.getBuysBumerangue(userId);
  
  if(buyBumerangue) {
    res.status(201).json({ buyBumerangue })
  } else {
    res.json({ error: "Nenhuma compra encontrada"});
  } 
};

const handlerPost: NextApiHandler = async (req, res) => {
  const buyBumerangue: BuyBumerangue = req.body
  const newBuyBumerangue = await apiBuyBumerangue.addNewBuyBumerangue(buyBumerangue);

  if(newBuyBumerangue.id) {
    res.status(201).json({status: true});
  } else {
    res.json({ error: "Ocorreu algum erro!"});
  }
};

const handlerPut: NextApiHandler = async (req, res) => {
  const buyBumerangue: BuyBumerangue = req.body;
  const updBuyBumerangue = await apiBuyBumerangue.updateBuyBumerangue(buyBumerangue);

  if(updBuyBumerangue) {
    res.json({ message: 'Compra atualizada com sucesso!'});
    return;
  }
  res.json({ error: 'Não foi possível alterar esta compra.'});
};

const handlerDelete: NextApiHandler = async (req, res) => {
  const id: string = req.body;
  await apiBuyBumerangue.deleteBuyBumerangue(id);

  res.json({ status: true });
};


const handler: NextApiHandler = async (req, res) => {

  const session = await getSession({ req });
  if(!session) {
    res.json({ error: 'Acesso negado' });
    return;
  }

  switch(req.method) {
    case 'GET':
      handlerGet(req, res);
    break;
    case 'POST':
      handlerPost(req, res);
    break;
    case 'PUT':
      handlerPut(req, res);
    break;
    case 'DELETE':
      handlerDelete(req, res);
    break;
  }
};

export default handler;