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
import { SellMiles } from '../../../types/SellMiles';
import ContentAccordionBuyMiles from '../../../components/ContentAccordionSellMiles';

const ExtratoCompra = (data: Props) => {

  /* Router ///////////////////////////////////////////////////////////////////////////////*/
  const router = useRouter();

  /* Contexts */
  const { user, setUser } = useAuthContext();

  /* Setting message for not have a buy bonus//////////////////////////////////////////// */
  useEffect(() => {
    if(data.selledMiles.length === 0) {
      setNoHaveBuyMiles(true)
    }
  }, [data.selledMiles]);

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
    router.push(`/gerenciamento/venda-milhas/${id}`);
  }

  const handleBuyMilesDelete = async (id: number) => {
    const response = await fetch('/api/buymiles', {
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

        <div className={styles.header}>
          <ButtonBack route='/dashboard'/>
          <div className={styles.title}>Extrato de venda de milhas</div>
        </div> 

        {/* Accordion */}
        {data.selledMiles.map((item: SellMiles, index: number) => (
          <ContentAccordionBuyMiles
            key={index} 
            item={item}
            menuOpened={menuOpened}
            setMenuOpened={setMenuOpened}
            onEdit={handleSellMilesEdit}
            onDelete={handleSellMilesDelete}
            /> 
        ))} 


       {/* Message for when there is no registered buy miles yet */}
       {noHaveBuyMiles &&
          <div className={styles.alert}>
            <AlertIcon style={{color: '#F25C05'}}/>
            <div>Você ainda não cadastrou nenhuma venda. Gostaria de fazer isso agora? 
            <div className={styles.link} onClick={()=> {router.push('/gerenciamento/venda-milhas')}}>Clique aqui</div>
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
  } 

  /* Get selled miles */
 const buyedMiles = await api.getMilesBuyed(session.user.id)
  
  return {
    props: {
      user,
      buyedMiles: JSON.parse(JSON.stringify(buyedMiles))
    }
  }
}