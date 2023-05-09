import { NextApiHandler } from "next";
import { getSession } from "next-auth/react";
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15'
});

const handlerPost: NextApiHandler = async (req, res) => {
  const user = await getSession({ req });
  if(!user) {
    return null;
  }
  
  try {
    //Check customer id
    const dbUser = await prisma?.user.findFirst({
      where: {
        id: user.user.id
      }
    });
    
    //Get subscription
    const subscription = await prisma?.subscription.findFirst({
      where: {
        userId: dbUser?.id,
        subscriptionId: dbUser?.subscriptionId
      }
    })

    let stripCustomerId = dbUser?.stripeCustomer;

    //If user has active subscription >> send it to the customer portal
    if(subscription) {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripCustomerId as string,
        return_url: `${req.headers.origin}/dashboard/?success=portal`,
      });
      return res.redirect(303, portalSession.url);
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      client_reference_id: (user.user.id).toString(),
      customer: stripCustomerId as string,
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1N4VFIKU1VIdjQLhSiCGqbHU',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/dashboard/?success=true`,
      cancel_url: `${req.headers.origin}/dashboard/?canceled=true`,
    });
    return res.redirect(303, session.url as string);
  } catch (err) {
    return res.send({ message: 'error handler post'});
  }
}


const handler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
    if(!session) {
      res.json({ error: 'Acesso negado' });
      return;
    }

    switch(req.method) {
      /* case 'GET':
        handlerGet(req, res);
      break; */
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