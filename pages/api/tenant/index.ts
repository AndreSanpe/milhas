import { NextApiHandler } from "next";
import api from '../../../libs/api';
import { User } from "../../../types/User";


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

//New user
const handlerPost: NextApiHandler = async (req, res) => { 

  const user: User = req.body;
  const newUser = await api.addNewUser(user).catch((e) => {
    res.status(400).json({error: 'email já existente'})
  })
  
  if(newUser) {
    res.status(201).json({status: true});
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