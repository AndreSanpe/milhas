import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import React, { useCallback, useEffect, useState } from 'react'
import Layout from '../../../components/Layout';
import { useAuthContext } from '../../../contexts/auth';
import api from '../../../libs/api';
import { User } from '../../../types/User';
import { authOptions } from '../../api/auth/[...nextauth]';
import styles from './styles.module.css';
import AlertIcon from './error_outline.svg';
import { useRouter } from 'next/router';
import { SellMiles } from '../../../types/SellMiles';
import ContentAccordionSellMiles from '../../../components/ContentAccordionSellMiles';
import Title from '../../../components/Title';
import apiSellMiles from '../../../libs/apiSellMiles';

const ExtratoVenda = (data: Props) => {

  /* Router ///////////////////////////////////////////////////////////////////////////////*/
  const router = useRouter();

  /* Contexts */
  const { user, setUser } = useAuthContext();

  /* States */
 const [ selledMilesData, setSelledMilesData ] = useState<SellMiles[]>([]);
 const [ noHaveSelledMiles, setNoHaveSelledMiles ] = useState<boolean>(false);
 const [ menuOpened, setMenuOpened ] = useState<string>('');

  /* Setting message for not have a buy bonus//////////////////////////////////////////// */
  useEffect(() => {
    if(data.selledMiles.length === 0) {
      setNoHaveSelledMiles(true)
    }
  }, [data.selledMiles]);

 /* List data selledMiles /////////////////////////////////////////////////////////////////*/
 useEffect(() => {
  const arraySelledMiles: SellMiles[] = [];
  
  if(data.selledMiles) {
    data.selledMiles.map((item, index) => {
      if(item.id) {
        arraySelledMiles.push(item);
      } else {
        return null;
      }
    })  
  }
  setSelledMilesData(arraySelledMiles);

  }, [data.selledMiles])

  let investiment = 0;
  let profit = 0;
  let percentageProfit = 0;
  let percentageProfitAverage = 0;
  let miles = 0;
  let sellQuantity = 0;

  for(let i = 0; i < selledMilesData.length; i++) {
    profit += selledMilesData[i].profit;
    percentageProfit += selledMilesData[i].percentageProfit;
    miles += selledMilesData[i].pointsQuantity;
    investiment += selledMilesData[i].priceBuy;
  }

  if(selledMilesData.length) {
    percentageProfitAverage = (profit * 100) / (investiment);
    sellQuantity = selledMilesData.length;
  }

  /* Menu edit events //////////////////////////////////////////////////////////////// */
  const handleMenuEvent = (event: MouseEvent) => {
    const tagName = (event.target as Element).tagName;
    if(!['path', 'svg'].includes(tagName)) {
      setMenuOpened('');
    }
  }
  
  const handleSellMilesEdit = (id: string) => {
    router.push(`/calculadoras/venda-milhas/${id}`);
  }

  const handleSellMilesDelete = async (id: string) => {
    const response = await fetch('/api/sellmiles', {
      method: 'DELETE',
      body: JSON.stringify(id),
      headers: {
        'content-Type': 'application/json',
      },
    });
    router.push('/extratos/venda')
  }

  useEffect(() => {
    window.removeEventListener('click', handleMenuEvent);
    window.addEventListener('click', handleMenuEvent);
    return () => window.removeEventListener('click', handleMenuEvent);
  }, [menuOpened])


  return (
    <>
    <Head>
      <title>Extrato de venda de milhas . PlanMilhas</title>
    </Head>
    
    <Layout><>
      
      <div className={styles.container}>   

        <Title route='/dashboard'>Extrato de venda de milhas</Title>   

        {/* RESULTS RESUME */}
        <div className={styles.results}>

        <div className={styles.row}>
          <div className={styles.column}>

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Total de milhas vendidas:</div>
              <div className={styles.values}>{miles ? miles.toLocaleString('pt-BR') : ''}</div>
            </div>

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Total de vendas:</div>
              <div className={styles.values}>{sellQuantity ? sellQuantity : ''}</div>
            </div>

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Total investido:</div>
              <div className={styles.values}>{investiment ? investiment.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
            </div>

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Lucro total estimado:</div>
              <div className={styles.values}>{profit ? profit.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
            </div>

            <div className={styles.doubleColumns} style={{border: 'none'}}>
              <div className={styles.secundaryTitle}>Percentual médio:</div>
              <div className={styles.values}>{percentageProfitAverage ? percentageProfitAverage.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%' : ''}</div>
            </div>
            
          </div>
        </div>

        </div>
        {/* RESULTS RESUME END'S */}

        <div className={styles.title}>Vendas cadastradas</div>

        {/* Accordion */}
        {data.selledMiles.map((item: SellMiles, index: number) => (
          <ContentAccordionSellMiles
            key={index} 
            item={item}
            menuOpened={menuOpened}
            setMenuOpened={setMenuOpened}
            onEdit={handleSellMilesEdit}
            onDelete={handleSellMilesDelete}
            /> 
        ))} 


       {/* Message for when there is no registered buy bonus yet */}
       {noHaveSelledMiles &&
          <div className={styles.alert}>
            <AlertIcon style={{color: '#F25C05'}}/>
            <div>Você ainda não cadastrou nenhuma venda. Gostaria de fazer isso agora? 
            <div className={styles.link} onClick={()=> {router.push('/calculadoras/venda-milhas')}}>Clique aqui</div>
            </div>
          </div>
        }
        
      </div>{/* Div container end */}

    </></Layout>
    
    </>
  )
}

export default ExtratoVenda;

type Props = {
  user: User;
  selledMiles: SellMiles[];  
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
  };
  
  //Get subscription
  const subscription = await api.getSubscription(user.id as string, user.subscriptionId as string);
  
  if(!subscription?.subscriptionStatus) {
    return{
      redirect: {destination: '/assinatura', permanent: false}
    }
  };

  /* Get selled miles */
 const selledMiles = await apiSellMiles.getMilesSelled(session.user.id)
  
  return {
    props: {
      user,
      selledMiles: JSON.parse(JSON.stringify(selledMiles))
    }
  }
}