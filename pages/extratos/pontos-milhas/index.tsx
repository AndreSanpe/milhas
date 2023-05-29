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
import { useRouter } from 'next/router';
import { SellMiles } from '../../../types/SellMiles';
import Title from '../../../components/Title';
import apiSellMiles from '../../../libs/apiSellMiles';
import apiBuyMiles from '../../../libs/apiBuyMiles';
import { BuyMiles } from '../../../types/BuyMiles';
import apiBuyBumerangue from '../../../libs/apiBuyBumerangue';
import { BuyBumerangue } from '../../../types/BuyBumerangue';

const ExtratoPontosMilhas = (data: Props) => {

  /* Router ///////////////////////////////////////////////////////////////////////////////*/
  const router = useRouter();

  /* Contexts */
  const { user, setUser } = useAuthContext();

  /* States */
 const [ selledMilesData, setSelledMilesData ] = useState<SellMiles[]>([]);
 const [ buyedMilesData, setBuyedMilesData ] = useState<BuyMiles[]>([]);
 const [ bumerangueMilesData, setBumerangueMilesData ] = useState<BuyBumerangue[]>([]);

 /* Handle buyedMiles data //////////////////////////////////////////////////////////////// */
 useEffect(() => {
  const arrayBuyedMiles: BuyMiles[] = [];

  if(data.buyedMiles) {
    data.buyedMiles.map((item, index) => {
      if(item.id) {
        arrayBuyedMiles.push(item)
      } else {
        return null;
      }
    })
  }
  setBuyedMilesData(arrayBuyedMiles);
 },[data.buyedMiles]);

/* Handle buyBumerangue data //////////////////////////////////////////////////////////////// */
useEffect(() => {
  const arrayBumerangueMiles: BuyBumerangue[] = [];

  if(data.bumerangueMiles) {
    data.bumerangueMiles.map((item, index) => {
      if(item.id) {
        arrayBumerangueMiles.push(item)
      } else {
        return null;
      }
    })
  }
  setBumerangueMilesData(arrayBumerangueMiles);
  },[data.bumerangueMiles]);

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
  }, [data.selledMiles]);

  /* Handle calculates */
  let pointsLivelo = 0;
  let pointsEsfera = 0;
  let milesAzul = 0;
  let milesLatam = 0;
  let milesSmiles = 0;

  /* Handle buyedMiles data calculate */
  for(let i = 0; i < buyedMilesData.length; i++) {

      /* Check if have transfer - If true sum */
      if(buyedMilesData[i].destiny && buyedMilesData[i].miles) {
        if(buyedMilesData[i].destiny === 'Tudo Azul') {
            milesAzul += buyedMilesData[i].miles as number;
        } 
        else if (buyedMilesData[i].destiny === 'Latam Pass') {
          milesLatam += buyedMilesData[i].miles as number;
        }
        else if (buyedMilesData[i].destiny === 'Smiles') {
          milesSmiles += buyedMilesData[i].miles as number;
        } 
      }

      /* if haven't transfer it, add the points */
      if(!buyedMilesData[i].destiny && !buyedMilesData[i].miles) {
        if(buyedMilesData[i].program === 'Livelo') {
          pointsLivelo += buyedMilesData[i].pointsQuantity;
        }
        else if(buyedMilesData[i].program === 'Esfera') {
          pointsEsfera += buyedMilesData[i].pointsQuantity;
        }
        else if(buyedMilesData[i].program === 'Tudo Azul') {
          milesAzul += buyedMilesData[i].pointsQuantity;
        }
        else if(buyedMilesData[i].program === 'Latam Pass') {
          milesLatam += buyedMilesData[i].pointsQuantity;
        }
        else if(buyedMilesData[i].program === 'Smiles') {
          milesSmiles += buyedMilesData[i].pointsQuantity;
        }
      }

    }
  
  /* Handle bumerangueMiles data calculate*/
  for(let i = 0; i < bumerangueMilesData.length; i++) {
    
    if(bumerangueMilesData[i].destinyOne === 'Latam Pass') {
      milesLatam += bumerangueMilesData[i].miles as number;
    }

    if(bumerangueMilesData[i].destinyTwo && bumerangueMilesData[i].milesTwo) {
      if(bumerangueMilesData[i].destinyTwo === 'Tudo Azul') {
        milesAzul += bumerangueMilesData[i].milesTwo as number;
      }
      else if(bumerangueMilesData[i].destinyTwo === 'Latam Pass') {
        milesLatam += bumerangueMilesData[i].milesTwo as number;
      }
      else if(bumerangueMilesData[i].destinyTwo === 'Smiles') {
        milesSmiles += bumerangueMilesData[i].milesTwo as number;
      }
    }

    if(!bumerangueMilesData[i].destinyTwo && !bumerangueMilesData[i].milesTwo && bumerangueMilesData[i].points) {
      pointsLivelo += bumerangueMilesData[i].points as number;
    }
  }
  
  /* Handle selleMiles data calculate */
  for(let i = 0; i < selledMilesData.length; i++) {
    
    if(selledMilesData[i].program) {
      if(selledMilesData[i].program === 'Tudo Azul') {
        milesAzul -= selledMilesData[i].pointsQuantity;
      }
      else if(selledMilesData[i].program === 'Latam Pass') {
        milesLatam -= selledMilesData[i].pointsQuantity;
      }
      else if(selledMilesData[i].program === 'Smiles') {
        milesSmiles -= selledMilesData[i].pointsQuantity;
      }
    }
  }


  return (
    <>
    <Head>
      <title>Extrato de pontos e milhas . PlanMilhas</title>
    </Head>
    
    <Layout><>
      
      <div className={styles.container}>   

        <Title route='/dashboard'>Extrato de pontos e milhas</Title>   

        {/* RESULTS RESUME */}
        <div className={styles.results}>

          <div className={styles.title}>Saldo total:</div>

        <div className={styles.row}>
          <div className={styles.column}>

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Total de pontos Livelo:</div>
              <div className={styles.values}>{pointsLivelo ? pointsLivelo.toLocaleString('pt-BR') : 0}</div>
            </div>

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Total de pontos Esfera:</div>
              <div className={styles.values}>{pointsEsfera ? pointsEsfera.toLocaleString('pt-BR') : 0}</div>
            </div>

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Total de milhas Azul:</div>
              <div className={styles.values}>{milesAzul ? milesAzul.toLocaleString('pt-BR') : 0}</div>
            </div>

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Total de milhas Latam:</div>
              <div className={styles.values}>{milesLatam ? milesLatam.toLocaleString('pt-BR') : 0}</div>
            </div>

            <div className={styles.doubleColumns} style={{border: 'none'}}>
              <div className={styles.secundaryTitle}>Total de milhas Smiles:</div>
              <div className={styles.values}>{milesSmiles ? milesSmiles.toLocaleString('pt-BR') : 0}</div>
            </div>
            
          </div>
        </div>

        </div>
        
        <div className={styles.alert}>
          *Saldo baseado no montante atual de pontos/milhas, somados de todas contas administradas, em cada programa.
        </div>
        
      </div>{/* Div container end */}

    </></Layout>
    
    </>
  )
}

export default ExtratoPontosMilhas;

type Props = {
  user: User;
  selledMiles: SellMiles[];  
  buyedMiles: BuyMiles[];
  bumerangueMiles: BuyBumerangue[]
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
  /* const subscription = await api.getSubscription(user.id as string, user.subscriptionId as string);
  
  if(!subscription?.subscriptionStatus) {
    return{
      redirect: {destination: '/assinatura', permanent: false}
    }
  }; */

  /* Get selled miles */
  const selledMiles = await apiSellMiles.getMilesSelled(session.user.id);

  /* Get buyed miles */
  const buyedMiles = await apiBuyMiles.getMilesBuyed(session.user.id);

  /* Get bumerangue miles */
  const bumerangueMiles = await apiBuyBumerangue.getBuysBumerangue(session.user.id);
  
  return {
    props: {
      user,
      selledMiles: JSON.parse(JSON.stringify(selledMiles)),
      buyedMiles: JSON.parse(JSON.stringify(buyedMiles)),
      bumerangueMiles: JSON.parse(JSON.stringify(bumerangueMiles))
    }
  }
}