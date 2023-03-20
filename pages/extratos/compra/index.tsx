import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import ButtonBack from '../../../components/ButtonBack';
import Layout from '../../../components/Layout';
import { useAccountsContext } from '../../../contexts/accounts';
import { useAuthContext } from '../../../contexts/auth';
import api from '../../../libs/api';
import { Account } from '../../../types/Account';
import { User } from '../../../types/User';
import { authOptions } from '../../api/auth/[...nextauth]';
import styles from './styles.module.css';

const ExtratoCompra = (data: Props) => {

  /* Contexts */
  const { user, setUser } = useAuthContext();

  /* Sending user data to context /////////////////////////////////////////////////////////*/
  useEffect(() => {
    if(user === null || user != data.user) {
      setUser(data.user)
    }
  }, [data, user, setUser]);

   /* ContextApi: accounts  ///////////////////////////////////////////////////////////////*/
   const { accounts, setAccounts } = useAccountsContext();
   useEffect(() => {
     if(accounts === null || accounts as [] !== data.accounts) {
       setAccounts(data.accounts as any)
     }
   }, [data, accounts, setAccounts]);

   /* Auxiliary states for accounts data */
  const [ accountsData, setAccountsData ] = useState<any[]>([]);
  const [ status, setStatus ] = useState<any>();
  
  /* List data accounts /////////////////////////////////////////////////////////////////*/
  useEffect(() => {
    const data: any[] = [];
    
    if(accounts) {
      accounts.map((item, index) => {
        if(item.name) {
          data.push(item);
        } else {
          data.push('Não há contas cadastradas')
        }
      })  
    }

  setAccountsData(data);
  }, [accounts])

  /* Clubs actives number */
  let nLiveloActive = 0;
  let nEsferaActive = 0;
  let nAzulActive = 0;
  let nLatamActive = 0;
  let nSmilesActive = 0;

  for(let i = 0; i < accountsData.length; i++) {
    if(accountsData[i].statusLivelo) {
      nLiveloActive++;
    } 
    if (accountsData[i].statusEsfera){
      nEsferaActive++;
    }
    if (accountsData[i].statusAzul){
      nAzulActive++;
    }
    if (accountsData[i].statusLatam){
      nLatamActive++;
    }
    if (accountsData[i].statusSmiles){
      nSmilesActive++;
    }
  }
  
  console.log(nLiveloActive, nEsferaActive, nAzulActive, nLatamActive, nSmilesActive);

  let costLivelo = 0;

  for(let i = 0; i < accountsData.length; i++) {
    if(accountsData[i].priceLivelo) {
      costLivelo += accountsData[i].priceLivelo;
    }
  }

  console.log(costLivelo)

  return (
    <>
    <Head>
      <title>Extrato de compra de pontos . TOOLMILHAS</title>
    </Head>
    
    <Layout><>
      
      <div className={styles.container}>      
        <ButtonBack />
        <div className={styles.title} style={{marginBottom: '0px'}}>Extrato de compra</div>
        <div className={styles.title} style={{marginTop: '0px'}}>de pontos</div>

        <div>...</div>


      
      </div>{/* Div container end */}
    
    
    
    </></Layout>
    
    </>
  )
}

export default ExtratoCompra;

type Props = {
  user: User;
  accounts: Account[];  
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
  
  return {
    props: {
      user,
      accounts
    }
  }
}