import { NextApiHandler } from "next";
import api from '../../../libs/api';

//Get user data
const handlerGet: NextApiHandler = async (req, res) => {
  const { id }  = req.body;
  const user = await api.getUser(parseInt(id as string)); 
  
  if(user?.id) {
    res.json({ user });
    return
  }  else {
    res.json({ error: "Usuário não encontrado"});
  }

};

const handler: NextApiHandler = async (req, res) => {
  switch(req.method) {
    case 'GET':
      handlerGet(req, res);
    break;
  }
}

export default handler;