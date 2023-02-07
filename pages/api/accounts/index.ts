import { NextApiHandler } from "next";
import api from '../../../libs/api';


const handlerGet: NextApiHandler = async (req, res) => {
  const { userId } = req.body;
  const accounts = await api.getAccounts(parseInt(userId));
  if(accounts) {
    res.status(201).json({ accounts })
  } else {
    res.json({ error: "Nenhuma conta encontrada"});
  }
    
}

const handlerPost: NextApiHandler = async (req, res) => {
  const account = req.body;
  const { name, document,
      statusLivelo, priceLivelo, statusEsfera, priceEsfera, statusLatam, priceLatam, statusAzul, priceAzul, statusSmiles, priceSmiles, userId } = account;

  const newAccount = await api.addNewAccount(account)

  if(account.id) {
    res.status(201).json({status: true});
  } else {
    res.json({ error: "Usuário não encontrado"});
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