import { NextApiHandler } from "next";

const handlerPing: NextApiHandler = (req, res) => {
  res.json({pong: true});
}

export default handlerPing;