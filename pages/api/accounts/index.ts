import { NextApiHandler } from "next";
import api from '../../../libs/api';
import { Account } from "../../../types/Account";


const handlerGet: NextApiHandler = async (req, res) => {
  const { userId } = req.body;
  const accounts = await api.getAccounts(parseInt(userId));
  if(accounts) {
    res.status(201).json({ accounts })
  } else {
    res.json({ error: "Nenhuma conta encontrada"});
  }
    
};

const handlerPost: NextApiHandler = async (req, res) => {
  const account: Account = req.body;
  /* const { name, document,
      statusLivelo, priceLivelo, statusEsfera, priceEsfera, statusLatam, priceLatam, statusAzul, priceAzul, statusSmiles, priceSmiles, userId } = account; */
  const newAccount = await api.addNewAccount(account)

  if(account.id) {
    res.status(201).json({status: true});
  } else {
    res.json({ error: "Usuário não encontrado"});
  }

};

const handlerPut: NextApiHandler = async (req, res) => {
  const account = req.body;
  const updAccount = await api.updateAccount(account);

  if(updAccount) {
    res.json({ status: true});
    return;
  }

  res.json({ error: 'Não foi possível alterar esta conta.'});

};

const handlerDelete: NextApiHandler = async (req, res) => {
  const id: number = req.body;
  await api.deleteAccount(id);

  res.json({ status: true });
};

const handler: NextApiHandler = async (req, res) => {
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