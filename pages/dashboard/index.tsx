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
import Input from '../../components/Input';

interface Inputs {
  name: string;
  miles: string;
  cpf: string;
  cep: string;
  currency: string;
}

const Dashboard = (data: Props) => {
 
  const { user, setUser } = useAuthContext();
  const [ value, setValue ] = useState<Inputs>({} as Inputs)

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setValue({
      ...value,
      [e.currentTarget.name]: e.currentTarget.value
    })
  }, [value])


  useEffect(() => {
    if(user === null || user != data.user) {
      setUser(data.user)
    }
  }, [data.user, setUser, user]);

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
      <Input
        onSet={handleChange}
        name='cep'
        placeholder='Digite seu cep'
        mask='cep'
        warning={false}/>

      <Input
        onSet={handleChange}
        name='currency'
        placeholder='R$ 0,00'
        mask='currency'
        />

        <Input
        onSet={handleChange}
        name='name'
        placeholder='Digite seu nome'
        />

        <Input
        onSet={handleChange}
        name='miles'
        placeholder='Qtde de milhas'
        mask='miles'
        />

        <Input
        onSet={handleChange}
        name='cpf'
        placeholder='Cpf'
        mask='cpf'
        />

        <Input
        onSet={handleChange}
        name='date'
        placeholder='Data de nascimento'
        mask='date'
        />

        <button onClick={() => console.log(value)}>Enviar</button>
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