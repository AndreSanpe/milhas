import { NextApiHandler } from "next";
import api from "../../../libs/api";
import { BuyMiles } from "../../../types/BuyMiles";
import { getSession } from "next-auth/react";

const handlerGet: NextApiHandler = async (req, res) => {
  const { userId } = req.body;
  const milesBuyed = await api.getMilesBuyed(parseInt(userId));
  
  if(milesBuyed) {
    res.status(201).json({ milesBuyed })
  } else {
    res.json({ error: "Nenhuma compra encontrada"});
  }
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

const handlerPut: NextApiHandler = async (req, res) => {
  const milesBuyed: BuyMiles = req.body;
  const updMilesBuyed = await api.updateMilesBuyed(milesBuyed);

  if(updMilesBuyed) {
    res.json({ message: 'Compra atualizada com sucesso!'});
    return;
  }
  res.json({ error: 'Não foi possível alterar esta compra.'});
};

const handlerDelete: NextApiHandler = async (req, res) => {
  const id: number = req.body;
  await api.deleteMilesBuyed(id);

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