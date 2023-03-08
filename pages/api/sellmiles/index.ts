import { NextApiHandler } from "next";
import api from "../../../libs/api";
import { SellMiles } from "../../../types/SellMiles";


const handlerGet: NextApiHandler = async (req, res) => {
};

const handlerPost: NextApiHandler = async (req, res) => {
  const sell: SellMiles = req.body;
  const newSellMiles = await api.addNewMilesSelled(sell);

  if(newSellMiles.id) {
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