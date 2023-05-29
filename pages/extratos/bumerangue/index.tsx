import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout';
import { useAuthContext } from '../../../contexts/auth';
import api from '../../../libs/api';
import { User } from '../../../types/User';
import { authOptions } from '../../api/auth/[...nextauth]';
import styles from './styles.module.css';
import AlertIcon from './error_outline.svg';
import { useRouter } from 'next/router';
import ContentAccordionBuyBumerangue from '../../../components/ContentAccordionBuyBumerangue';
import Title from '../../../components/Title';
import apiBuyBumerangue from '../../../libs/apiBuyBumerangue';
import { BuyBumerangue } from '../../../types/BuyBumerangue';

const ExtratoCompraBumerangue = (data: Props) => {

  /* Router ///////////////////////////////////////////////////////////////////////////////*/
  const router = useRouter();

  /* Contexts */
  const { user, setUser } = useAuthContext();

  /* States ///////////////////////////////////////////////////////////////////////////*/
  const [ buyBumerangueData, setBuyBumerangueData ] = useState<BuyBumerangue[]>([]);
  const [ noHaveBuyBumerangue, setNoHaveBuyBumerangue ] = useState<boolean>(false);
  const [ menuOpened, setMenuOpened ] = useState<string>('');

  /* Setting message for not have a buy bumerangue//////////////////////////////////////////// */
  useEffect(() => {
    if(data.buyBumerangue.length === 0) {
      setNoHaveBuyBumerangue(true)
    }
  }, [data.buyBumerangue.length]);

  /* List data buyBumerangue /////////////////////////////////////////////////////////////////*/
 useEffect(() => {
  const arrayBuyBumerangue: BuyBumerangue[] = [];
  
  if(data.buyBumerangue) {
    data.buyBumerangue.map((item, index) => {
      if(item.id) {
        arrayBuyBumerangue.push(item);
      } else {
        return null;
      }
    })  
  }
  setBuyBumerangueData(arrayBuyBumerangue);
  }, [data.buyBumerangue])

  let miles = 0;
  let buyQuantity = 0;
  let investiment = 0;
  let averageCoastMiles = 0;

  for(let i = 0; i < buyBumerangueData.length; i++) {
    if(buyBumerangueData[i].totalMiles) {
      miles += buyBumerangueData[i].totalMiles as number;
    } else {
      miles += buyBumerangueData[i].pointsQuantity;
    }
    investiment += buyBumerangueData[i].price;
  }

  if(miles && investiment) {
    averageCoastMiles = investiment / (miles / 1000);
  }

  if(buyBumerangueData.length) {
    buyQuantity = buyBumerangueData.length;
  }
  
  /* Menu edit events //////////////////////////////////////////////////////////////// */
  const handleMenuEvent = (event: MouseEvent) => {
    const tagName = (event.target as Element).tagName;
    if(!['path', 'svg'].includes(tagName)) {
      setMenuOpened('');
    }
  }
  
  const handleBuyBumerangueEdit = (id: string) => {
    router.push(`/calculadoras/compra-bumerangue/${id}`);
  }

  const handleBuyBumerangueDelete = async (id: string) => {
    const response = await fetch('/api/buybumerangue', {
      method: 'DELETE',
      body: JSON.stringify(id),
      headers: {
        'content-Type': 'application/json',
      },
    });
    router.push('/extratos/bumerangue')
  }

  useEffect(() => {
    window.removeEventListener('click', handleMenuEvent);
    window.addEventListener('click', handleMenuEvent);
    return () => window.removeEventListener('click', handleMenuEvent);
  }, [menuOpened])


  return (
    <>
    <Head>
      <title>Extrato de compra de milhas . PlanMilhas</title>
    </Head>
    
    <Layout><>
      
      <div className={styles.container}>    

        <Title route='/dashboard'>Extrato de compra Bumerangue</Title>  

        {/* RESULTS RESUME */}
        <div className={styles.results}>

        <div className={styles.row}>
          <div className={styles.column}>

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Total de milhas acumuladas:</div>
              <div className={styles.values}>{miles ? miles.toLocaleString('pt-BR') : ''}</div>
            </div>

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Total de compras:</div>
              <div className={styles.values}>{buyQuantity ? buyQuantity : ''}</div>
            </div>

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Total investido:</div>
              <div className={styles.values}>{investiment ? investiment.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
            </div>

            <div className={styles.doubleColumns} style={{border: 'none'}}>
              <div className={styles.secundaryTitle}>Valor médio do milheiro:</div>
              <div className={styles.values}>{averageCoastMiles ? averageCoastMiles.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
            </div>
            
          </div>
        </div>

        </div>
        {/* RESULTS RESUME END'S */}

        <div className={styles.title}>Compras Bumerangue</div>

        {/* Accordion */}
        {data.buyBumerangue.map((item: BuyBumerangue, index: number) => (
          <ContentAccordionBuyBumerangue
            key={index} 
            item={item}
            menuOpened={menuOpened}
            setMenuOpened={setMenuOpened}
            onEdit={handleBuyBumerangueEdit}
            onDelete={handleBuyBumerangueDelete}
            /> 
        ))} 


       {/* Message for when there is no registered buy miles yet */}
       {noHaveBuyBumerangue &&
          <div className={styles.alert}>
            <AlertIcon style={{color: '#F25C05'}}/>
            <div>Você ainda não cadastrou nenhuma compra bumerangue. Gostaria de fazer isso agora? 
            <div className={styles.link} onClick={()=> {router.push('/calculadoras/compra-bumerangue')}}>Clique aqui</div>
            </div>
          </div>
        }
        
      </div>{/* Div container end */}

    </></Layout>
    
    </>
  )
}

export default ExtratoCompraBumerangue;

type Props = {
  user: User;
  buyBumerangue: BuyBumerangue[];  
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if(!session) return { redirect: { destination: '/login', permanent: true }}; 

  /* Get tenant */
  const user = await api.getUser(session.user.id);
  if(!user){
    return {
      redirect: {destination:'/', permanent: false}
    }
  };
  
  //Get subscription
  /* const subscription = await api.getSubscription(user.id as string, user.subscriptionId as string);
  
  if(!subscription?.subscriptionStatus) {
    return{
      redirect: {destination: '/assinatura', permanent: false}
    }
  }; */

  /* Get buys bumerangue */
 const buyBumerangue = await apiBuyBumerangue.getBuysBumerangue(session.user.id);
  
  return {
    props: {
      user,
      buyBumerangue: JSON.parse(JSON.stringify(buyBumerangue))
    }
  }
}