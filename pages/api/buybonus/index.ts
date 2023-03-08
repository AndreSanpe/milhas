import { NextApiHandler } from "next";
import api from "../../../libs/api";
import { BuyBonus } from "../../../types/BuyBonus";

const handlerGet: NextApiHandler = async (req, res) => {
};

const handlerPost: NextApiHandler = async (req, res) => {
  const buybonus: BuyBonus = req.body;
  const newBuyBonus = await api.addNewBuyBonus(buybonus);

  if(newBuyBonus) {
    res.status(201).json({status: true});
  } else {
    res.json({ error: "Ocorreu algum erro!"});
  }
};

const handler: NextApiHandler = async (req, res) => {
  switch(req.method) {
    case 'GET':
      handlerGet(req, res);
    break;
    case 'POST':
      handlerPost(req, res);
    break;
  }
};

export default handler;