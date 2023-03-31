import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import { useAuthContext } from '../../../contexts/auth';
import api from '../../../libs/api';
import { User } from '../../../types/User';
import { authOptions } from '../../api/auth/[...nextauth]';
import styles from './styles.module.css';
import ButtonBack from '../../../components/ButtonBack';
import ContentAccordion from '../../../components/ContentAccordion';
import AlertIcon from './error_outline.svg';
import Button from '../../../components/Button';
import { useRouter } from 'next/router';

type Account = {
  name: string;
  document: string;
  statusLivelo: boolean;
  priceLivelo: number;
  statusEsfera: boolean;
  priceEsfera: number;
  statusAzul: boolean;
  priceAzul: number;
  statusLatam: boolean;
  priceLatam: number;
  statusSmiles: boolean;
  priceSmiles: number;
  userId: number;
}

const Contas = (data: Props) => {

  /* Router ///////////////////////////////////////////////////////////////////////////////*/
  const router = useRouter();

  /* Contexts /////////////////////////////////////////////////////////////////////////////*/
  const { user, setUser } = useAuthContext();

  /* Sending user data to context /////////////////////////////////////////////////////////*/
  useEffect(() => {
    if(user === null || user != data.user) {
      setUser(data.user)
    }
    if(data.accounts.length === 0) {
      setNoHaveAccount(true);
    }
  }, [data, user, setUser]);

  /* General states //////////////////////////////////////////////////////////////////*/
  const [ noHaveAccount, setNoHaveAccount ] = useState<boolean>(false);
  
  /* Menu edit states //////////////////////////////////////////////////////////////// */
  const [ menuOpened, setMenuOpened ] = useState<number>(0);
  
  /* Menu edit events //////////////////////////////////////////////////////////////// */
  const handleMenuEvent = (event: MouseEvent) => {
    const tagName = (event.target as Element).tagName;
    if(!['path', 'svg'].includes(tagName)) {
      setMenuOpened(0);
    }
  }
  
  const handleAccountEdit = (id: number) => {
    router.push(`/gerenciamento/contas/${id}`);
  }

  const handleAccountDelete = async (id: number) => {
    const response = await fetch('/api/accounts', {
      method: 'DELETE',
      body: JSON.stringify(id),
      headers: {
        'content-Type': 'application/json',
      },
    });
    router.push('/gerenciamento/contas')
  }

  useEffect(() => {
    window.removeEventListener('click', handleMenuEvent);
    window.addEventListener('click', handleMenuEvent);
    return () => window.removeEventListener('click', handleMenuEvent);
  }, [menuOpened])

 /* Button add action /////////////////////////////////////////////////////////////////////*/
  const handleClick = () => router.push('/gerenciamento/contas/nova-conta');
   
 
  return (<>
    <Head>
      <title>Gerenciamento . TOOLMILHAS</title>
    </Head>
    <Layout><>

      <div className={styles.container}>      
        <ButtonBack route='/dashboard'/>
        <div className={styles.title}>Contas cadastradas</div>

        {/* Accordion */}
        {data.accounts.map((item: Account, index: number) => (
          <ContentAccordion 
            key={index} 
            item={item}
            menuOpened={menuOpened}
            setMenuOpened={setMenuOpened}
            onEdit={handleAccountEdit}
            onDelete={handleAccountDelete}
          />
        ))} 
              
        {/* Message for when there is no registered account yet */}
        {noHaveAccount &&
          <div className={styles.alert}>
            <AlertIcon />
            <div>Você ainda não cadastrou nenhuma conta. Gostaria de fazer isso agora? 
            {/* <span className={styles.link} onClick={()=> {}}>Clique aqui</span> */}
            </div>
          </div>
        }
        
        <div style={{margin: '52px', marginTop: '24px'}}>
          <Button 
            label={'Adicionar nova conta'}
            backgroundColor={'#26408C'}
            backgroundColorHover={'#4D69A6'}
            color={'#fff'}
            onClick={handleClick}
          />
        </div>
        
      </div>

    </></Layout>
    </>)
}

export default Contas;

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