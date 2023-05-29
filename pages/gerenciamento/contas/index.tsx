import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import { useAuthContext } from '../../../contexts/auth';
import api from '../../../libs/api';
import { User } from '../../../types/User';
import { authOptions } from '../../api/auth/[...nextauth]';
import styles from './styles.module.css';
import ContentAccordion from '../../../components/ContentAccordion';
import AlertIcon from './error_outline.svg';
import Button from '../../../components/Button';
import { useRouter } from 'next/router';
import Title from '../../../components/Title';
import apiAccounts from '../../../libs/apiAccounts';
import { Account } from '../../../types/Account';

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
  const [ menuOpened, setMenuOpened ] = useState<string>('');
  
  /* Menu edit events //////////////////////////////////////////////////////////////// */
  const handleMenuEvent = (event: MouseEvent) => {
    const tagName = (event.target as Element).tagName;
    if(!['path', 'svg'].includes(tagName)) {
      setMenuOpened('');
    }
  }
  
  const handleAccountEdit = (id: string) => {
    router.push(`/gerenciamento/contas/${id}`);
  }

  const handleAccountDelete = async (id: string) => {
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
      <title>Contas cadastradas . PlanMilhas</title>
    </Head>
    <Layout><>

      <div className={styles.container}> 
        
        <Title route='/dashboard'>Contas administradas</Title>

        {/* <div className={styles.header}>
          <ButtonBack route='/dashboard'/>
          <div className={styles.title}>Contas administradas</div>
        </div>    */}  
        

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
            <AlertIcon style={{color: '#F25C05'}}/>
            <div>Você ainda não cadastrou nenhuma conta. Gostaria de fazer isso agora? Clique no botão abaixo. 
            {/* <span className={styles.link} onClick={()=> {}}>Clique aqui</span> */}
            </div>
          </div>
        }
        
        <div style={{marginTop: '24px'}}>
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

   //Get subscription
  /* const subscription = await api.getSubscription(user.id as string, user.subscriptionId as string);
  
  if(!subscription?.subscriptionStatus) {
    return{
      redirect: {destination: '/assinatura', permanent: false}
    }
  }; */

  /* Get accounts */
  const accounts = await apiAccounts.getAccounts(session.user.id);
  
  return {
    props: {
      user,
      accounts: JSON.parse(JSON.stringify(accounts))
    }
  }
}