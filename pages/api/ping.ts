import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";

const handlerPing: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
  if(!session) {
    res.json({ error: 'Acesso negado'});
    return;
  }

  res.json({pong: true});
}

export default handlerPing;