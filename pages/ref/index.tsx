import { GetServerSideProps } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import React, { useState } from 'react';
import Checkbox from '../../components/Checkbox';
import Layout from '../../components/Layout';
import Toggle from '../../components/Toggle';
import api from '../../libs/api';
import { User } from '../../types/User';
import { authOptions } from '../api/auth/[...nextauth]';
import styles from './styles.module.css';

const REF = () => {

  const [ check, setCheck ] = useState(false);
  console.log(check)

  return (<>
    <Head>
      <title>PÁGINA DE TESTES</title>
    </Head>
    <Layout><>
      <div style={{ margin: '50px'}}>
        <Checkbox
          label='Tudo Azul' 
          initialValue={check}
          onSet={setCheck}
        />
      </div>
    </></Layout>
    </>)
}

export default REF;

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