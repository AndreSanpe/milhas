import { GetServerSideProps } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import React, { useCallback, useState } from 'react';
import Checkbox from '../../components/Checkbox';
import Input from '../../components/Input';
import Layout from '../../components/Layout';
import Toggle from '../../components/Toggle';
import api from '../../libs/api';
import { User } from '../../types/User';
import { authOptions } from '../api/auth/[...nextauth]';
import styles from './styles.module.css';

type Data = {
  name: string;
  email: string;
}

const REF = () => {

 /*  const [ values, setValues ] = useState<Data>({} as Data);

  const handleValuesStrings = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.currentTarget.name]: e.currentTarget.value
    }) 
  }, [values])

  console.log(values) */

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

console.log(name, email)

  const handleSubmit = async () => {
      const response = await fetch('http://localhost:3000/api/teste', {
        method: 'POST',
        body: JSON.stringify({ name, email }),
        headers: {
          'content-Type': 'application/json'
        },
      })
    
   }
    
  


  return (<>
    <Head>
      <title>PÁGINA DE TESTES</title>
    </Head>
    <Layout><>
      <div style={{ margin: '50px'}}>
      {/* <Input 
          name='name'
          onSet={(e)=> handleValuesStrings(e)}
          placeholder={'Ex.: Antônio Garcia'}
      />
      <Input 
          name='email'
          onSet={(e)=> handleValuesStrings(e)}
          placeholder={'Ex.: email'}
      /> */}
      <input onChange={(e)=> {setName(e.currentTarget.value)}}></input>
      <input onChange={(e)=> {setEmail(e.currentTarget.value)}}></input>
      <button onClick={handleSubmit}>Clique aqui</button>
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