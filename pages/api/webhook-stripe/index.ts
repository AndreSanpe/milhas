import { NextApiHandler } from "next";
import prisma from "../../../libs/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
  typescript: true
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
    
  try {
    let event = stripe.webhooks.constructEvent(
      buf, 
      sig as string,
      webhookSecret as string) as Stripe.DiscriminatedEvent
    res.status(200).end();
    
    const checkoutSession = event.data.object as Stripe.Checkout.Session;

    switch(event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        
        const stripeSubscriptionId = event.data.object.id
        const status = event.data.object.status
        const stripeCustomerId = event.data.object.customer 
        const currentPeriodStart = new Date(event.data.object.current_period_start * 1000) 
        const currentPeriodEnd = new Date(event.data.object.current_period_end * 1000) 
        
        //Checking if the subscription is valid (paid or trial)
        let subscriptionStatus = false;
        if(status === 'active' || status === 'trialing') {
          subscriptionStatus = true;
        } else {
          subscriptionStatus = false
        }

        //Search user via stripe consumer
        const user = await prisma.user.findFirst({
          where: {
            stripeCustomer: stripeCustomerId as string
          }
        });

        //Search subscription via user and stripe ID
        const subscription = await prisma.subscription.findFirst({
          where: {
            userId: user?.id,
            subscriptionId: stripeSubscriptionId
          }
        });

        //If there is no signature, create one, if there is, update
        if(subscription) {
          // update
          await prisma.subscription.update({
            where: {
              id: subscription.id
            }, 
            data: {
              subscriptionStatus,
              currentPeriodStart,
              currentPeriodEnd
            }
          })
        } else {
          await prisma.subscription.create({
            data: {
              userId: user?.id as string,
              subscriptionStatus: true,
              subscriptionId: stripeSubscriptionId,
              currentPeriodEnd,
              currentPeriodStart
            }
          })
        }
        break
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
    }
  };

export default handler;