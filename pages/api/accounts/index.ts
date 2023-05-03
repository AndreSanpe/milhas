import { NextApiHandler } from "next";
import { Account } from "../../../types/Account";
import { getSession } from "next-auth/react";
import apiAccounts from "../../../libs/apiAccounts";


const handlerGet: NextApiHandler = async (req, res) => {
  const { userId } = req.body;
  const accounts = await apiAccounts.getAccounts(parseInt(userId));
  if(accounts) {
    res.status(201).json({ accounts })
  } else {
    res.json({ error: "Nenhuma conta encontrada"});
  }
};

const handlerPost: NextApiHandler = async (req, res) => {
  const account: Account = req.body;
  const newAccount = await apiAccounts.addNewAccount(account)

  if(newAccount) {
    res.status(201).json({status: true});
  } else {
    res.json({ error: "Usuário não encontrado"});
  }

};

const handlerPut: NextApiHandler = async (req, res) => {
  const account = req.body;
  const updAccount = await apiAccounts.updateAccount(account);

  if(updAccount) {
    res.json({ status: true});
    return;
  }

  res.json({ error: 'Não foi possível alterar esta conta.'});

};

const handlerDelete: NextApiHandler = async (req, res) => {
  const id: number = req.body;
  await apiAccounts.deleteAccount(id);

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