import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import ButtonBack from '../../../components/ButtonBack';
import Layout from '../../../components/Layout';
import { useAuthContext } from '../../../contexts/auth';
import api from '../../../libs/api';
import { User } from '../../../types/User';
import { authOptions } from '../../api/auth/[...nextauth]';
import styles from './styles.module.css';
import AlertIcon from './error_outline.svg';
import { useRouter } from 'next/router';
import ContentAccordionBuyMiles from '../../../components/ContentAccordionBuyMiles';
import { BuyMiles } from '../../../types/BuyMiles';
import Title from '../../../components/Title';
import apiBuyMiles from '../../../libs/apiBuyMiles';

const ExtratoCompra = (data: Props) => {

  /* Router ///////////////////////////////////////////////////////////////////////////////*/
  const router = useRouter();

  /* Contexts */
  const { user, setUser } = useAuthContext();

  /* Setting message for not have a buy bonus//////////////////////////////////////////// */
  useEffect(() => {
    if(data.buyedMiles.length === 0) {
      setNoHaveBuyMiles(true)
    }
  }, [data.buyedMiles]);

  /* General states //////////////////////////////////////////////////////////////////*/
  const [ noHaveBuyMiles, setNoHaveBuyMiles ] = useState<boolean>(false);
  
  /* Menu edit states //////////////////////////////////////////////////////////////// */
  const [ menuOpened, setMenuOpened ] = useState<number>(0);
  
  /* Menu edit events //////////////////////////////////////////////////////////////// */
  const handleMenuEvent = (event: MouseEvent) => {
    const tagName = (event.target as Element).tagName;
    if(!['path', 'svg'].includes(tagName)) {
      setMenuOpened(0);
    }
  }
  
  const handleBuyMilesEdit = (id: number) => {
    router.push(`/calculadoras/compra-pontos/${id}`);
  }

  const handleBuyMilesDelete = async (id: number) => {
    const response = await fetch('/api/buymiles', {
      method: 'DELETE',
      body: JSON.stringify(id),
      headers: {
        'content-Type': 'application/json',
      },
    });
    router.push('/extratos/compra')
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

        <Title route='/dashboard'>Extrato de compra de milhas</Title>  

        {/* RESULTS RESUME */}
        <div className={styles.results}>

        <div className={styles.row}>
          <div className={styles.column}>

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Total de milhas compradas:</div>
              <div className={styles.values}>{/* miles ? miles.toLocaleString('pt-BR') : '' */}</div>
            </div>

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Total de compras:</div>
              <div className={styles.values}>{/* sellQuantity ? sellQuantity : '' */}</div>
            </div>

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Total investido:</div>
              <div className={styles.values}>{/* investiment ? investiment.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : '' */}</div>
            </div>

            <div className={styles.doubleColumns} style={{border: 'none'}}>
              <div className={styles.secundaryTitle}>Valor médio do milheiro:</div>
              <div className={styles.values}>{/* investiment ? investiment.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : '' */}</div>
            </div>
            
          </div>
        </div>

        </div>
        {/* RESULTS RESUME END'S */}

        <div className={styles.title}>Compras cadastradas</div>

        {/* Accordion */}
        {data.buyedMiles.map((item: BuyMiles, index: number) => (
          <ContentAccordionBuyMiles
            key={index} 
            item={item}
            menuOpened={menuOpened}
            setMenuOpened={setMenuOpened}
            onEdit={handleBuyMilesEdit}
            onDelete={handleBuyMilesDelete}
            /> 
        ))} 


       {/* Message for when there is no registered buy miles yet */}
       {noHaveBuyMiles &&
          <div className={styles.alert}>
            <AlertIcon style={{color: '#F25C05'}}/>
            <div>Você ainda não cadastrou nenhuma venda. Gostaria de fazer isso agora? 
            <div className={styles.link} onClick={()=> {router.push('/calculadoras/compra-pontos')}}>Clique aqui</div>
            </div>
          </div>
        }
        
      </div>{/* Div container end */}

    </></Layout>
    
    </>
  )
}

export default ExtratoCompra;

type Props = {
  user: User;
  buyedMiles: BuyMiles[];  
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
  } 

  /* Get buys miles */
 const buyedMiles = await apiBuyMiles.getMilesBuyed(session.user.id);
  
  return {
    props: {
      user,
      buyedMiles: JSON.parse(JSON.stringify(buyedMiles))
    }
  }
}