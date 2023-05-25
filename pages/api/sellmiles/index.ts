import { NextApiHandler } from "next";
import { SellMiles } from "../../../types/SellMiles";
import { getSession } from "next-auth/react";
import apiSellMiles from "../../../libs/apiSellMiles";


const handlerGet: NextApiHandler = async (req, res) => {
  const { userId } = req.body;
  const selledMiles = await apiSellMiles.getMilesSelled(userId);
  
  if(selledMiles) {
    res.status(201).json({ selledMiles })
  } else {
    res.json({ error: "Nenhuma venda encontrada"});
  }
};

const handlerPost: NextApiHandler = async (req, res) => {
  const sell: SellMiles = req.body;
  const newSellMiles = await apiSellMiles.addNewMilesSelled(sell);

  if(newSellMiles.id) {
    res.status(201).json({status: true});
  } else {
    res.json({ error: "Ocorreu algum erro!"});
  }
};

const handlerPut: NextApiHandler = async (req, res) => {
  const milesSelled: SellMiles = req.body;
  const updMilesSelled = await apiSellMiles.updateMilesSelled(milesSelled);

  if(updMilesSelled) {
    res.json({ message: 'Venda atualizada com sucesso!'});
    return;
  }
  res.json({ error: 'Não foi possível alterar esta venda.'});
};

const handlerDelete: NextApiHandler = async (req, res) => {
  const id: string = req.body;
  await apiSellMiles.deleteMilesSelled(id);

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