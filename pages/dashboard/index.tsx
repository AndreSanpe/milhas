import Layout from '../../components/Layout';
import styles from './styles.module.css';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { User } from '../../types/User';
import { useAuthContext } from '../../contexts/auth';
import {  useEffect, useState } from 'react';
import {  Session, unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import api from '../../libs/api';
import { calculators, management } from '../../utils/data';
import ButtonMenu from '../../components/ButtonMenu';
import { useRouter } from 'next/router';
import ManageAccountsIcon from './icons/manage.svg';
import SavingsIcon from './icons/savings.svg';
import BalanceIcon from './icons/account_balance.svg';
import ExtractIcon from './icons/extract.svg';
import PaidIcon from './icons/paid.svg';
import ShoppingIcon from './icons/shopping.svg';
import SellIcon from './icons/sell.svg';
import BagIcon from './icons/bag.svg';
import BoomerangIcon from './icons/boomerang.svg';
import BonusIcon from './icons/percent.svg';
import TrendingIcon from './icons/trending.svg';
import AnalyticsIcon from './icons/analytics.svg';
import BumerangueIcon from './icons/bumerangue.svg';
import CardIcon from './icons/card.svg';


const Dashboard = (data: Props) => {
 
  const { user, setUser } = useAuthContext();
  const router = useRouter();

  const firstName = user?.name.split(" ")[0];
 
  useEffect(() => {
    if(user === null || user != data.user) {
      setUser(data.user)
    }
  }, [data, user, setUser]);



  return (<>
    <Head>
      <title>Página inicial . PlanMilhas</title>
    </Head>
    <Layout>
      <div className={styles.container}>
      
            <div className={styles.title}>Olá, {firstName}!</div>
            <span className={styles.subtitle}>Gerenciamento</span>
          
        <div className={styles.buttons}>
          {management.map((links, index) => (
            <ButtonMenu key={index} onClick={() => router.push({...router.query, pathname: links.path})}>
              <div>
                <div className={styles.icons}>
                    {links.icon === 'manage' && <ManageAccountsIcon />}
                    {links.icon === 'savings' && <SavingsIcon />}
                    {links.icon === 'balance' && <BalanceIcon />}
                    {links.icon === 'extract' && <ExtractIcon />}
                    {links.icon === 'shopping' && <ShoppingIcon />}
                    {links.icon === 'sell' && <SellIcon />}
                    {links.icon === 'bumerangue' && <BumerangueIcon />}
                    {links.icon === 'trending' && <TrendingIcon />}
                    {links.icon === 'analytics' && <AnalyticsIcon />}
                    {links.icon === 'card' && <CardIcon />}
                </div>
                <div className={styles.label}>
                  {links.label}
                </div>
              </div>
            </ButtonMenu>))
          }
        </div> {/* Calculators menu */}
        
        <span className={styles.subtitle}>Calculadoras</span>

        <div className={styles.buttons}>
          {calculators.map((links, index) => (
            <ButtonMenu key={index} onClick={() => router.push({...router.query,pathname: links.path})}>
              <div>
                <div className={styles.icons}>
                  {links.icon === 'shopping' && <ShoppingIcon />}
                  {links.icon === 'sell' && <SellIcon />}
                  {links.icon === 'paid' && <PaidIcon />}
                  {links.icon === 'bag' && <BagIcon />}
                  {links.icon === 'boomerang' && <BoomerangIcon />}
                  {links.icon === 'percent' && <BonusIcon />}
                </div>
                <div className={styles.label}>
                  {links.label}
                </div>
              </div>
            </ButtonMenu>))
          }
        </div> {/* Calculators menu */}
      
      {/* Container's menu end */}
      </div> 
        
    </Layout>
  </>
    
  )
}

export default Dashboard;

type Props = {
  user: User;
  loggedUser: Session;
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if(!session) return { redirect: { destination: '/login', permanent: true }}; 

  // Get tenant
  const user = await api.getUser(session.user.id)
  if(!user){
    return {
      redirect: {destination:'/', permanent: false}
    }
  } 

  //Get subscription
  /* const subscription = await api.getSubscription(user.id as string, user.subscriptionId as string);
  
  if(!subscription?.subscriptionStatus) {
    return{
      redirect: {destination: '/assinatura', permanent: false}
    }
  } */
  
  return {
    props: {
      loggedUser: session.user,
      user,
    }
  }
}


