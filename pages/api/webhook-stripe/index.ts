import { NextApiHandler } from "next";
import prisma from "../../../libs/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15'
});

export const config = {
  api: {
    bodyParser: false
  }
};

async function buffer(readable: any) {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

const handlerGet: NextApiHandler = async (req, res) => {
  return res.send({message: 'true'})
}

const handlerPost: NextApiHandler = async (req, res) => {
  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']

  const webhookSecret = 
    process.env.STRIPE_WEBHOOK_SECRET_LIVE ??
    process.env.STRIPE_WEBHOOK_SECRET

  let event;

  console.log(sig, webhookSecret)

  try {
    event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret as string)
    console.log(event)
    res.status(200).end();
    
    const checkoutSession = event.data.object as Stripe.Checkout.Session;

    switch(event.type) {
      case 'customer.subscription.created':
        //@ts-ignore
        const stripeSubscriptionId = event?.data?.object?.id  
         //@ts-ignore
        const status = event?.data?.object?.status
         //@ts-ignore
        const stripeCustomerId = event?.data?.object?.customer 
        
        const user = await prisma.user.findFirst({
          where: {
            stripeCustomer: stripeCustomerId
          }
        });

        const subscription = await prisma.subscription.findFirst({
          where: {
            userId: user?.id,
            stripeId: stripeSubscriptionId
          }
        });

        if(subscription) {
          // update
          await prisma.subscription.update({
            where: {
              id: subscription.id
            }, 
            data: {
              subscriptionStatus: true
            }
          })
        } else {
          await prisma.subscription.create({
            data: {
              userId: user?.id as number,
              subscriptionStatus: true,
              stripeId: stripeSubscriptionId,
            }
          })
        }
      break;
    }

  } catch (err) {
    console.log(`Error message: ${err}`)
    return res.send({ message: 'error webhook'});
  }
}

const handler: NextApiHandler = async (req, res) => {
    switch(req.method) {
      case 'GET':
        handlerGet(req, res);
      break;
      case 'POST':
        handlerPost(req, res);
      break;
      /* case 'PUT':
        handlerPut(req, res);
      break; */
      /* case 'DELETE':
        handlerDelete(req, res);
      break; */
    }
  };

export default handler;