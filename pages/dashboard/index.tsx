import Layout from '../../components/Layout';
import styles from './styles.module.css';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { User } from '../../types/User';
import { useAuthContext } from '../../contexts/auth';
import { useCallback, useEffect, useState } from 'react';
import { Session, unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import api from '../../libs/api';

const Dashboard = (data: Props) => {
 
  const { user, setUser } = useAuthContext();
 
  useEffect(() => {
    if(user === null || user != data.user) {
      setUser(data.user)
    }
  }, [data, user, setUser]);


  return (<>
    <Head>
      <title>Página inicial . milhas</title>
    </Head>
    <Layout>
      <div className={styles.container}>
        {/* <div className={styles.header}>
          <h1 className={styles.title}>Olá, {user?.name}!</h1>
          <h2 className={styles.subtitle}>Você está logado na conta de: <span>{user?.email}</span></h2>
          <h2 className={styles.data}>Data de expiração: <span>{}</span></h2>
        </div> */}
      {/* <InputField /> */}
      
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

  const session = await unstable_getServerSession(
    context.req, context.res, authOptions
  );

  if(!session) return { redirect: { destination: '/login', permanent: true }}; 

  // Get tenant
  const user = await api.getUser(session.user.id)
  if(!user){
    return {
      redirect: {destination:'/', permanent: false}
    }
  } 
  
  return {
    props: {
      loggedUser: session.user,
      user,
      
    }
  }
}