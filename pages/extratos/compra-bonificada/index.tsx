import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import ButtonBack from '../../../components/ButtonBack';
import ContentAccordionBuyBonus from '../../../components/ContentAccordionBuyBonus';
import Layout from '../../../components/Layout';
import { useAuthContext } from '../../../contexts/auth';
import api from '../../../libs/api';
import { Account } from '../../../types/Account';
import { BuyBonus } from '../../../types/BuyBonus';
import { User } from '../../../types/User';
import { authOptions } from '../../api/auth/[...nextauth]';
import styles from './styles.module.css';
import AlertIcon from './error_outline.svg';

const ExtratoCompraBonificada = (data: Props) => {

  /* Contexts */
  const { user, setUser } = useAuthContext();

  /* Sending user data to context /////////////////////////////////////////////////////////*/
  useEffect(() => {
    if(user === null || user != data.user) {
      setUser(data.user)
    }
  }, [data, user, setUser]);

  /* Setting message for not have a buy bonus//////////////////////////////////////////// */
  useEffect(() => {
    if(data.buybonus.length === 0) {
      setNoHaveAccount(true)
    }
  }, [data.buybonus]);

   /* ContextApi: accounts  ///////////////////////////////////////////////////////////////*/
   /* const { accounts, setAccounts } = useAccountsContext();
   useEffect(() => {
     if(accounts === null || accounts as [] !== data.accounts) {
       setAccounts(data.accounts as any)
     }
   }, [data, accounts, setAccounts]);
 */

  /* General states //////////////////////////////////////////////////////////////////*/
  const [ noHaveAccount, setNoHaveAccount ] = useState<boolean>(false);
 

  return (
    <>
    <Head>
      <title>Extrato de compra bonificada . TOOLMILHAS</title>
    </Head>
    
    <Layout><>
      
      <div className={styles.container}>      
        <ButtonBack route='/dashboard'/>
        <div className={styles.title} style={{marginBottom: '0px'}}>Histórico de compra</div>
        <div className={styles.title} style={{marginTop: '0px'}}>bonificada</div>

        {/* Accordion */}
        {data.buybonus.map((item: BuyBonus, index: number) => (
          <ContentAccordionBuyBonus key={index} item={item as BuyBonus}/> 
        ))} 
              
        {/* Message for when there is no registered account yet */}
        {noHaveAccount &&
          <div className={styles.alert}>
            <AlertIcon />
            <div>Você ainda não cadastrou nenhuma compra bonificada. Gostaria de fazer isso agora? 
            {/* <span className={styles.link} onClick={()=> {}}>Clique aqui</span> */}
            </div>
          </div>
        }

        


      
      </div>{/* Div container end */}
    
    
    
    </></Layout>
    
    </>
  )
}

export default ExtratoCompraBonificada;

type Props = {
  user: User;
  accounts: Account[];  
  buybonus: BuyBonus[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if(!session) return { redirect: { destination: '/login', permanent: true }}; 

  /* Get tenant */
  const user = await api.getUser(session.user.id)
  if(!user){
    return {
      redirect: {destination:'/', permanent: false}
    }
  } 

  /* Get accounts */
  const accounts = await api.getAccounts(session.user.id);

  /* Get buy bonus data */
  const  buybonus  = await api.getBuyBonus(session.user.id)
  
  return {
    props: {
      user,
      accounts,
      buybonus: JSON.parse(JSON.stringify(buybonus))
    }
  }
}