import { NextApiHandler } from "next";
import api from "../../../libs/api";
import { BuyMiles } from "../../../types/BuyMiles";

const handlerGet: NextApiHandler = async (req, res) => {
};

const handlerPost: NextApiHandler = async (req, res) => {
  const buy: BuyMiles = req.body
  const newBuyMiles = await api.addNewMilesBuyed(buy);

  if(newBuyMiles.id) {
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