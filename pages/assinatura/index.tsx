import React from 'react'
import styles from './styles.module.css';
import Layout from '../../components/Layout';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import api from '../../libs/api';
import Button from '../../components/Button';
import AlertIcon from './error_outline.svg';


const Assinatura = () => {
  return (<>
    <Layout>
      
      <div className={styles.container}>

        <title>Gerenciar assinatura . PlanMilhas</title>

        <div className={styles.content}>
          <AlertIcon style={{color: '#F25C05'}}/>
          <div className={styles.message}>Ops, sua assinatura precisa de atenção! Clique no botão abaixo e verique-a para continuar utilizando todos benefícios da ferramenta.</div>

          <form action={`/api/subscription`} method='POST'>
            {/* Button and actions */}
            
            <div className={styles.btn}>
              <Button 
                label= 'Gerenciar assinatura'
                backgroundColor='#26408C'
                backgroundColorHover='#4D69A6'
              />
            </div>
          </form>
        </div>

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