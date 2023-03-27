import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import ButtonBack from '../../../components/ButtonBack';
import Layout from '../../../components/Layout';
import { useAccountsContext } from '../../../contexts/accounts';
import { useAuthContext } from '../../../contexts/auth';
import api from '../../../libs/api';
import { Account } from '../../../types/Account';
import { User } from '../../../types/User';
import { authOptions } from '../../api/auth/[...nextauth]';
import styles from './styles.module.css';

const AssinaturaClubes = (data: Props) => {

  /* Contexts */
  const { user, setUser } = useAuthContext();

  /* Sending user data to context /////////////////////////////////////////////////////////*/
  useEffect(() => {
    if(user === null || user != data.user) {
      setUser(data.user)
    }
  }, [data, user, setUser]);

   /* ContextApi: accounts  ///////////////////////////////////////////////////////////////*/
   const { accounts, setAccounts } = useAccountsContext();
   useEffect(() => {
     if(accounts === null || accounts as [] !== data.accounts) {
       setAccounts(data.accounts as any)
     }
   }, [data, accounts, setAccounts]);

   /* Auxiliary states for accounts data */
  const [ accountsData, setAccountsData ] = useState<any[]>([]);
  const [ status, setStatus ] = useState<any>();
  
  /* List data accounts /////////////////////////////////////////////////////////////////*/
  useEffect(() => {
    const data: any[] = [];
    
    if(accounts) {
      accounts.map((item, index) => {
        if(item.name) {
          data.push(item);
        } else {
          data.push('Não há contas cadastradas')
        }
      })  
    }

  setAccountsData(data);
  }, [accounts])

  /* Clubs actives number */
  let nLiveloActive = 0;
  let nEsferaActive = 0;
  let nAzulActive = 0;
  let nLatamActive = 0;
  let nSmilesActive = 0;

  for(let i = 0; i < accountsData.length; i++) {
    if(accountsData[i].statusLivelo) {
      nLiveloActive++;
    } 
    if (accountsData[i].statusEsfera){
      nEsferaActive++;
    }
    if (accountsData[i].statusAzul){
      nAzulActive++;
    }
    if (accountsData[i].statusLatam){
      nLatamActive++;
    }
    if (accountsData[i].statusSmiles){
      nSmilesActive++;
    }
  }
  
  let nClubs = (nLiveloActive + nEsferaActive + nAzulActive + nLatamActive + nSmilesActive);

  let costLivelo = 0;
  let costEsfera = 0;
  let costAzul = 0;
  let costLatam = 0;
  let costSmiles = 0;

  for(let i = 0; i < accountsData.length; i++) {
    if(accountsData[i].priceLivelo) {
      costLivelo += accountsData[i].priceLivelo;
    }
    if(accountsData[i].priceEsfera) {
      costEsfera += accountsData[i].priceEsfera;
    }
    if(accountsData[i].priceAzul) {
      costAzul += accountsData[i].priceAzul;
    }
    if(accountsData[i].priceLatam) {
      costLatam += accountsData[i].priceLatam;
    }
    if(accountsData[i].priceSmiles) {
      costSmiles += accountsData[i].priceSmiles;
    }
  }

  let nCost = (costLivelo + costEsfera + costAzul + costLatam + costSmiles);


  return (
    <>
    <Head>
      <title>Extrato de assinaturas. TOOLMILHAS</title>
    </Head>
    
    <Layout><>
      
      <div className={styles.container}>      
        <ButtonBack />
        <div className={styles.title} style={{marginBottom: '0px'}}>Extrato de assinaturas</div>
        <div className={styles.title} style={{marginTop: '0px'}}>de clubes</div>

        {/* Results */}
        <div className={styles.results}>

        <div className={styles.contentRow}>
          <div className={styles.contentColumn}>
            <div className={styles.contentColumns}>
              <div className={styles.titleResults}>Clubes:</div>
              <div className={styles.titleResultsAux}>Quantidade de assinaturas:</div>
              <div className={styles.titleResultsAux}>Valor mensal por clube:</div>
            </div>
          </div>        
        </div>

        <div className={styles.contentRow}>
          <div className={styles.contentColumn}>
            <div className={styles.contentColumns}>
              <div className={styles.label}>Esfera:</div>
              <div className={styles.labelAux}>{nEsferaActive + ' ativos'}</div>
              <div className={styles.labelAux}>{costEsfera ? costEsfera.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'R$ 0,00'}</div>
            </div>
          </div>        
        </div>

        <div className={styles.contentRow}>
          <div className={styles.contentColumn}>
            <div className={styles.contentColumns}>
              <div className={styles.label}>Livelo:</div>
              <div className={styles.labelAux}>{nLiveloActive + ' ativos'}</div>
              <div className={styles.labelAux}>{costLivelo ? costLivelo.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'R$ 0,00'}</div>
            </div>
          </div>        
        </div>

        <div className={styles.contentRow}>
          <div className={styles.contentColumn}>
            <div className={styles.contentColumns}>
              <div className={styles.label}>Tudo Azul:</div>
              <div className={styles.labelAux}>{nAzulActive + ' ativos'}</div>
              <div className={styles.labelAux}>{costAzul ? costAzul.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'R$ 0,00'}</div>
            </div>
          </div>        
        </div>

        <div className={styles.contentRow}>
          <div className={styles.contentColumn}>
            <div className={styles.contentColumns}>
              <div className={styles.label}>Latam Pass:</div>
              <div className={styles.labelAux}>{nLatamActive + ' ativos'}</div>
              <div className={styles.labelAux}>{costLatam ? costLatam.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'R$ 0,00'}</div>
            </div>
          </div>        
        </div>

        <div className={styles.contentRow}>
          <div className={styles.contentColumn}>
            <div className={styles.contentColumns}>
              <div className={styles.label}>Smiles:</div>
              <div className={styles.labelAux}>{nSmilesActive + ' ativos'}</div>
              <div className={styles.labelAux}>{costSmiles ? costSmiles.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'R$ 0,00'}</div>
            </div>
          </div>        
        </div>

        <div className={styles.contentRow}>
          <div className={styles.contentColumn} style={{border: 'none'}}>
            <div className={styles.contentColumns}>
              <div className={styles.titleResults} style={{fontWeight: '700'}}>TOTAL:</div>
              <div className={styles.titleResultsAux} style={{fontWeight: '700', color: '#F25C05'}}>{nClubs ? nClubs+' ativos' : '0 ativo'}</div>
              <div className={styles.titleResultsAux} style={{fontWeight: '700', color: '#F25C05'}}>{nCost ? nCost.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'R$ 0,00'}</div>
            </div>
          </div>        
        </div>

      </div>
      {/* Results end */}
      
      </div>{/* Div container end */}
    
    
    
    </></Layout>
    
    </>
  )
}

export default AssinaturaClubes;

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