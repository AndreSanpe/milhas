import { NextApiHandler } from "next";
import api from "../../../libs/api";
import { BuyBonus } from "../../../types/BuyBonus";
import { getSession } from "next-auth/react";
import apiBuyBonus from "../../../libs/apiBuyBonus";

const handlerGet: NextApiHandler = async (req, res) => {
  const { userId } = req.body;
  const buys = await apiBuyBonus.getBuyBonus(parseInt(userId));
  if(buys) {
    res.status(201).json({ buys })
  } else {
    res.json({ error: "Nenhuma compra bonificada encontrada"});
  }
};

const handlerPost: NextApiHandler = async (req, res) => {
  const buybonus: BuyBonus = req.body;
  const newBuyBonus = await apiBuyBonus.addNewBuyBonus(buybonus);

  if(newBuyBonus) {
    res.status(201).json({status: true});
  } else {
    res.json({ error: "Ocorreu algum erro!"});
  }
};

const handlerPut: NextApiHandler = async (req, res) => {
  const buyBonus: BuyBonus = req.body;
  const updBuyBonus = await apiBuyBonus.updateBuyBonus(buyBonus);

  if(updBuyBonus) {
    res.json({ status: true});
    return;
  }
  res.json({ error: 'Não foi possível alterar esta compra.'});
};

const handlerDelete: NextApiHandler = async (req, res) => {
  const id: number = req.body;
  await apiBuyBonus.deleteBuyBonus(id);

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