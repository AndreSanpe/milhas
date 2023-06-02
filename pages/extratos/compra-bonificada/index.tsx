import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import ButtonBack from '../../../components/ButtonBack';
import ContentAccordionBuyBonus from '../../../components/ContentAccordionBuyBonus';
import Layout from '../../../components/Layout';
import { useAuthContext } from '../../../contexts/auth';
import api from '../../../libs/api';
import { Account } from '../../../types/Account';
import { BuyBonus } from '../../../types/BuyBonus';
import { User } from '../../../types/User';
import { authOptions } from '../../api/auth/[...nextauth]';
import styles from './styles.module.css';
import AlertIcon from './error_outline.svg';
import { useRouter } from 'next/router';
import Title from '../../../components/Title';
import apiAccounts from '../../../libs/apiAccounts';
import apiBuyBonus from '../../../libs/apiBuyBonus';
import AddButton from '../../../components/AddButton';
import FormModal from '../../../components/FormModal';

const ExtratoCompraBonificada = (data: Props) => {

  /* Router ///////////////////////////////////////////////////////////////////////////////*/
  const router = useRouter();

  /* Contexts */
  const { user, setUser } = useAuthContext();

  /* States /////////////////////////////////////////////////////////////////////////////*/
  const [ buyBonusData, setBuyBonusData ] = useState<BuyBonus[]>([]);
  const [ noHaveBuyBonus, setNoHaveBuyBonus ] = useState<boolean>(false);
  const [ menuOpened, setMenuOpened ] = useState<string>('');
  const [ showModal, setShowModal ] = useState<boolean>(false);

  /* Sending user data to context /////////////////////////////////////////////////////////*/
  useEffect(() => {
    if(user === null || user != data.user) {
      setUser(data.user)
    }
  }, [data, user, setUser]);

  /* Setting message for not have a buy bonus//////////////////////////////////////////// */
  useEffect(() => {
    if(data.buybonus.length === 0) {
      setNoHaveBuyBonus(true)
    }
  }, [data.buybonus]);

 /* List data buyBonus /////////////////////////////////////////////////////////////////*/
 useEffect(() => {
  const arrayBuyBonus: BuyBonus[] = [];
  
  if(data.buybonus) {
    data.buybonus.map((item, index) => {
      if(item.id) {
        arrayBuyBonus.push(item);
      } else {
        return null;
      }
    })  
  }
  setBuyBonusData(arrayBuyBonus);
  }, [data.buybonus]);
  
  let buyBonusQuantity = 0;
  let valueSaved = 0;
  let percentageDiscount = 0;
  let price = 0;
  let percentageDiscountAverage = 0;

  for(let i = 0; i < buyBonusData.length; i++) {
    valueSaved += (buyBonusData[i].price - buyBonusData[i].finalPrice);
    percentageDiscount += buyBonusData[i].percentageProfit;
    price += buyBonusData[i].price
  }

  if(buyBonusData.length) {
    percentageDiscountAverage =  (valueSaved * 100) / price
    buyBonusQuantity = buyBonusData.length;
  }

  /* Menu edit events //////////////////////////////////////////////////////////////// */
  const handleMenuEvent = (event: MouseEvent) => {
    const tagName = (event.target as Element).tagName;
    if(!['path', 'svg'].includes(tagName)) {
      setMenuOpened('');
    }
  }
  
  const handleBuyBonusEdit = (id: string) => {
    router.push(`/calculadoras/compra-bonificada/${id}`);
  }

  const handleBuyBonusDelete = async (id: string) => {
    const response = await fetch('/api/buybonus', {
      method: 'DELETE',
      body: JSON.stringify(id),
      headers: {
        'content-Type': 'application/json',
      },
    });
    router.push('/extratos/compra-bonificada')
  }

  useEffect(() => {
    window.removeEventListener('click', handleMenuEvent);
    window.addEventListener('click', handleMenuEvent);
    return () => window.removeEventListener('click', handleMenuEvent);
  }, [menuOpened])

  return (
    <>
    <Head>
      <title>Histórico de compra bonificada . PlanMilhas</title>
    </Head>
    
    <Layout><>
      
      <div className={styles.container}> 

        <Title route='/dashboard'>Histórico de compra bonificada</Title>  

        {/* RESULTS RESUME */}
        <div className={styles.results}>

        <div className={styles.row}>
          <div className={styles.column}>

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Total de compras:</div>
              <div className={styles.values}>{buyBonusQuantity ? buyBonusQuantity : ''}</div>
            </div>

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Valor total economizado:</div>
              <div className={styles.values}>{valueSaved ? valueSaved.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
            </div>

            <div className={styles.doubleColumns} style={{border: 'none'}}>
              <div className={styles.secundaryTitle}>Percentual médio de desconto:</div>
              <div className={styles.values}>{percentageDiscountAverage ? percentageDiscountAverage.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%' : ''}</div>
            </div>
            
          </div>
        </div>

        </div>
        {/* RESULTS RESUME END'S */}

        <div className={styles.title}>Compras bonificadas cadastradas</div>   

        {/* Accordion */}
        {data.buybonus.map((item: BuyBonus, index: number) => (
          <ContentAccordionBuyBonus 
            key={index} 
            item={item}
            menuOpened={menuOpened}
            setMenuOpened={setMenuOpened}
            onEdit={handleBuyBonusEdit}
            onDelete={handleBuyBonusDelete}
            /> 
        ))}

        {!noHaveBuyBonus &&
          <div onClick={()=> setShowModal(true)}>
            <AddButton />
          </div>
        }  
        
        {/* Alert modal*/}
        {showModal && 
          <FormModal maxWidth={'340px'} maxHeight={'1500px'}>
            <div className={styles.modalContainer}>
              <div className={styles.modalTitle}>Deseja cadastrar uma nova compra bonificada?</div>
              <div className={styles.modalLink} onClick={() => router.push('/calculadoras/compra-bonificada')}>Sim, cadastrar</div>
              <div className={styles.modalLink} 
                  onClick={() => {setShowModal(false)}}>Não, voltar ao extrato</div>
            </div>
          </FormModal>
        } 
              
        {/* Message for when there is no registered buy bonus yet */}
        {noHaveBuyBonus &&
          <div className={styles.alert}>
            <AlertIcon style={{color: '#F25C05'}}/>
            <div>Você ainda não cadastrou nenhuma compra bonificada. Gostaria de fazer isso agora? 
            <div className={styles.link} onClick={()=> {router.push('/calculadoras/compra-bonificada')}}>Clique aqui</div>
            </div>
          </div>
        }

      </div>{/* Div container end */}
    </></Layout>
    
    </>
  )
}

export default ExtratoCompraBonificada;

type Props = {
  user: User;
  accounts: Account[];  
  buybonus: BuyBonus[];
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

  /* Get accounts */
  const accounts = await apiAccounts.getAccounts(session.user.id);

  /* Get buy bonus data */
  const  buybonus  = await apiBuyBonus.getBuyBonus(session.user.id)
  
  return {
    props: {
      user,
      accounts: JSON.parse(JSON.stringify(accounts)),
      buybonus: JSON.parse(JSON.stringify(buybonus))
    }
  }
}