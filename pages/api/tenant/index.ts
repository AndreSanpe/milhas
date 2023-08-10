import { NextApiHandler } from "next";
import api from '../../../libs/api';
import { User } from "../../../types/User";
import apiEditUser from "../../../libs/apiEditUser";


//Get user data
const handlerGet: NextApiHandler = async (req, res) => {
  const { id }  = req.body;
  const user = await api.getUser(id); 
  
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
    res.status(401).json({error: 'email já existente'})
  })
  
  if(newUser) {
    res.status(201).json({status: true});
  } 
};

//Update user data
const handlerPut: NextApiHandler = async (req, res) => { 
  const userEdited: User = req.body;
  const updUserEdited = await apiEditUser.updateUserEdited(userEdited).catch((e) => {
    return res.status(401).json(e.meta.target[0]) 
  })

  if(updUserEdited) {
    res.status(201).json({ status: true});
    return;
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
    case 'PUT':
      handlerPut(req, res);
    break;
  }
};

export default handler;