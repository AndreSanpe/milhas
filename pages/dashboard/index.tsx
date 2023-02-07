import Layout from '../../components/Layout';
import styles from './styles.module.css';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { User } from '../../types/User';
import { useAuthContext } from '../../contexts/auth';
import { useCallback, useEffect, useState } from 'react';
import { AuthOptions, Session, unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import api from '../../libs/api';
import { calculators, management } from '../../utils/data';
import ButtonMenu from '../../components/ButtonMenu';
import { useRouter } from 'next/router';


const Dashboard = (data: Props) => {
 
  const { user, setUser } = useAuthContext();
  const router = useRouter();
 
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
        <div className={styles.title}>Olá, {user?.name}!</div>
        <span className={styles.subtitle}>Gerenciamento</span>

        <div className={styles.buttons}>
          {management.map((links, index) => (
            <ButtonMenu key={index} onClick={() => router.push({...router.query, pathname: links.path})}>
              <div>
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
  
  return {
    props: {
      loggedUser: session.user,
      user,
      
    }
  }
}


