import React from 'react'
import styles from './styles.module.css';
import Layout from '../../components/Layout';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import api from '../../libs/api';


const Assinatura = () => {
  return (<>
    <Layout>
      
      <div className={styles.container}>

        <title>Assinatura</title>

        <form action={`/api/subscription`} method='POST'>
          <button>Assinar</button>
        </form>

      </div>
    
    </Layout>
  </>)
}

export default Assinatura;


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