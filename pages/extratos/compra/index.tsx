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
import AddButton from '../../../components/AddButton';
import FormModal from '../../../components/FormModal';

const ExtratoCompra = (data: Props) => {

  /* Router ///////////////////////////////////////////////////////////////////////////////*/
  const router = useRouter();

  /* Contexts */
  const { user, setUser } = useAuthContext();

  /* States ///////////////////////////////////////////////////////////////////////////*/
  const [ buyedMilesData, setBuyedMilesData ] = useState<BuyMiles[]>([]);
  const [ noHaveBuyMiles, setNoHaveBuyMiles ] = useState<boolean>(false);
  const [ menuOpened, setMenuOpened ] = useState<string>('');
  const [ showModal, setShowModal ] = useState<boolean>(false);

  /* Setting message for not have a buy miles//////////////////////////////////////////// */
  useEffect(() => {
    if(data.buyedMiles.length === 0) {
      setNoHaveBuyMiles(true)
    }
  }, [data.buyedMiles]);

  /* List data buyedMiles /////////////////////////////////////////////////////////////////*/
 useEffect(() => {
  const arrayBuyedMiles: BuyMiles[] = [];
  
  if(data.buyedMiles) {
    data.buyedMiles.map((item, index) => {
      if(item.id) {
        arrayBuyedMiles.push(item);
      } else {
        return null;
      }
    })  
  }
  setBuyedMilesData(arrayBuyedMiles);
  }, [data.buyedMiles])

  let miles = 0;
  let buyQuantity = 0;
  let investiment = 0;
  let averageCoastMiles = 0;
  let averageCoastMilesLivelo = 0;
  let averageCoastMilesEsfera = 0;
  let averageCoastMilesAzul = 0;
  let averageCoastMilesLatam = 0;
  let averageCoastMilesSmiles = 0;

  for(let i = 0; i < buyedMilesData.length; i++) {
    if(buyedMilesData[i].miles) {
      miles += buyedMilesData[i].miles as number;
    } else {
      miles += buyedMilesData[i].pointsQuantity;
    }
    investiment += buyedMilesData[i].price;

    
  }

  if(miles && investiment) {
    averageCoastMiles = investiment / (miles / 1000);
  }

  if(buyedMilesData.length) {
    buyQuantity = buyedMilesData.length;
  }

  /* Menu edit events //////////////////////////////////////////////////////////////// */
  const handleMenuEvent = (event: MouseEvent) => {
    const tagName = (event.target as Element).tagName;
    if(!['path', 'svg'].includes(tagName)) {
      setMenuOpened('');
    }
  }
  
  const handleBuyMilesEdit = (id: string) => {
    router.push(`/calculadoras/compra-pontos/${id}`);
  }

  const handleBuyMilesDelete = async (id: string) => {
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

        {!noHaveBuyMiles &&
          <div onClick={()=> setShowModal(true)}>
            <AddButton />
          </div>
        }  
        
        {/* Alert modal*/}
        {showModal && 
          <FormModal maxWidth={'340px'} maxHeight={'1500px'}>
            <div className={styles.modalContainer}>
              <div className={styles.modalTitle}>Deseja cadastrar uma nova compra?</div>
              <div className={styles.modalLink} onClick={() => router.push('/calculadoras/compra-pontos')}>Sim, cadastrar</div>
              <div className={styles.modalLink} 
                  onClick={() => {setShowModal(false)}}>Não, voltar ao extrato</div>
            </div>
          </FormModal>
        }
        
       {/* Message for when there is no registered buy miles yet */}
       {noHaveBuyMiles &&
          <div className={styles.alert}>
            <AlertIcon style={{color: '#F25C05'}}/>
            <div>Você ainda não cadastrou nenhuma compra. Gostaria de fazer isso agora? 
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
  };
  
  //Get subscription
  /* const subscription = await api.getSubscription(user.id as string, user.subscriptionId as string);
  
  if(!subscription?.subscriptionStatus) {
    return{
      redirect: {destination: '/assinatura', permanent: false}
    }
  }; */

  /* Get buys miles */
 const buyedMiles = await apiBuyMiles.getMilesBuyed(session.user.id);
  
  return {
    props: {
      user,
      buyedMiles: JSON.parse(JSON.stringify(buyedMiles))
    }
  }
}