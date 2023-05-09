import { error } from 'console';
import { User } from '../types/User';
import prisma from './prisma';
import bcrypt from 'bcrypt';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15'
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {

  /* Authentication function ///////////////////////////////////////////////////////////////*/
  getAuthUser: async (email: string, unHashPassword: string) => {
    const user = await prisma.user.findFirst({
      where: { email }
    });

    if(!user) {
      return null;
    } 
    
    const comparePass = await bcrypt.compare(unHashPassword, user?.password as string);

    if (comparePass){
      return {
        id: user.id,
        name: user.name,
        email: user.email
      };
    } else {
      return null;
    }
  },

  /*Function that gets users */
  getUser: async (id: number) => {

    if(!id) {
      return null;
    };

    const user = await prisma.user.findFirst({
      where: {
        id
      }     
    });

    if(id){
      return {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        birthDate: user?.birthdate,
        cellphone: user?.cellphone,
        subscriptionId: user?.subscriptionId,
        stripeCustomer: user?.stripeCustomer,
        date: user?.createdAt.getDate().toString()
      };
    };
  },

  /* Create new user */
  addNewUser: async ({ name, email, cpf, birthdate, cellphone, password }: User) => {

    //Handle the password
    let hashedPass = await bcrypt.hashSync(password, 10);
    password = hashedPass;

    //Create new user
    const newUser = await prisma.user.create({
      data: {
        name, email, cpf, birthdate, cellphone, password
      }
    })

    if(newUser) {
      //Creates a new customer in Stripe from the new user
      const customer = await stripe.customers.create({
        name: name,
        email: email,
        metadata: {
          id: (newUser.id).toString(),
        }
      });
      
      //Create a trial subscription 
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: 'price_1N4VFIKU1VIdjQLhSiCGqbHU',
          },
        ],
        trial_period_days: 15,
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'pause',
          },
        },
      });

      //Updates database with customer id
      await prisma?.user.update({
        where: {
          id: newUser.id
        },
        data: {
          stripeCustomer: customer.id,
          subscriptionId: subscription.id
        }
      });

      //Returns the user/customer
      return await prisma.user.findFirst({
        where: {
          id: newUser.id
        }
      })
    }
  },

  /*Function that gets subscription */
  getSubscription: async (userId: number, subscriptionId: string) => {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        subscriptionId
      }
    })

    if(!subscription){
      return null
    }

    return subscription;
  },


  };






