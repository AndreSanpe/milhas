import { NextApiHandler } from "next";
import api from "../../../libs/api";

const handler: NextApiHandler =  async (req, res) => {
  const { name, email } = req.body;
  const testar = await api.testador(name, email);
  res.json({status: "deu certo"});
}

export default handler;