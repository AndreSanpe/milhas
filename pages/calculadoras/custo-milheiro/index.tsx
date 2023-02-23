import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react'
import ButtonBack from '../../../components/ButtonBack';
import Input from '../../../components/Input';
import Layout from '../../../components/Layout';
import api from '../../../libs/api';
import { User } from '../../../types/User';
import { authOptions } from '../../api/auth/[...nextauth]';
import styles from './styles.module.css';


const CustoMilheiro = (data: Props) => {

  const router = useRouter(); 

   /* States ///////////////////////////////////////////////////*/
  const [ price, setPrice ] = useState<number>(0);
  const [ pointsQuantity, setPointsQuantity ] = useState<number>(0);
  const [ percentage, setPercentage ] = useState<number>(0);
  const [ sellPrice, setSellPrice ] = useState<number>(0);

  /* Auxiliary states for calculate ///////////////////////////////////////////////////*/
  const [ miles, setMiles ] = useState<number>(0);
  const [ finalPrice, setFinalPrice ] = useState<number>(0);
  const [ profit, setProfit ] = useState<number>(0);
  const [ percentageProfit, setPercentageProfit ] = useState<number>(0);
  
  /* Function handle input values ///////////////////////////////////////////////////*/
  const handleValues = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    switch(e.currentTarget.name) {
      case 'price':
        const priceInput = parseFloat((e.currentTarget.value).replace('R$ ', '').replace('.', '').replace(',', '.'));
        setPrice(priceInput);
        return;
      case 'pointsQuantity':
        const pointsInput = parseInt(e.currentTarget.value.replace(/(\.)/g, ''));
        setPointsQuantity(pointsInput);
        return;
      case 'percentage':
        const percentageInput = parseInt(e.currentTarget.value);
        setPercentage(percentageInput);
        return;
      case 'sellPrice':
        const sellPriceInput = parseFloat((e.currentTarget.value).replace('R$ ', '').replace('.', '').replace(',', '.'));
        setSellPrice(sellPriceInput);
        return;
    }
    
  },[])

  /* useEffect protecting from results in NaN format /////////////////////////////////////*/
  useEffect(() => {
    if(Number.isNaN(price)) {
      setPrice(0);
    }
    if(Number.isNaN(pointsQuantity)) {
      setPointsQuantity(0);
    }
    if(Number.isNaN(percentage)) {
      setPercentage(0);
    }
    if(Number.isNaN(sellPrice)) {
      setSellPrice(0);
    }
  }, [percentage, pointsQuantity, price, sellPrice])

  /* Calculation after transfer ///////////////////////////////////////////////////*/
  useEffect(()=> {
    if (percentage) {
      const calcMiles = ((percentage + 100)/100 * pointsQuantity);
      setMiles(calcMiles);
    } else {
      setMiles(0);
    }
  }, [percentage, pointsQuantity])

  /* Calculation price ///////////////////////////////////////////////////*/
  useEffect(()=> { 
    if(!miles && price && pointsQuantity) {
      const simpleCalc = ((price) / ((pointsQuantity)/1000));
      setFinalPrice(simpleCalc);
    }
    else if(miles && pointsQuantity && percentage && percentage){
      const completeCalc = ((price) / ((miles)/1000));
      setFinalPrice(completeCalc);
    }
    else {
      setFinalPrice(0);
    }

  }, [miles, percentage, pointsQuantity, price])
  
  /* Calculation profit ///////////////////////////////////////////////////*/
  useEffect(() => {
    if(finalPrice && miles && sellPrice) {
      const resulttWithTransfer = (sellPrice * (miles/1000)) - (price);
      setProfit(resulttWithTransfer);
    } 
    else if(!miles && finalPrice && pointsQuantity && sellPrice) {
      const resultWthoutTransfer = (sellPrice * (pointsQuantity/1000)) - (price);
      setProfit(resultWthoutTransfer);
    }
    else {
      setProfit(0);
    }

  }, [finalPrice, miles, pointsQuantity, price, sellPrice])

  /* Calculation percentage ///////////////////////////////////////////////////*/
  useEffect(()=> {
    if(price && profit) {
      const percentageProfit = (profit * 100) / price;
      setPercentageProfit(percentageProfit)
    }
    else if (price == 0 || profit == 0) {
      setPercentageProfit(0)
    }
  }, [price, profit])

  

  return (<>

  <Head>
    <title>Calculadora . TOOLMILHAS</title>
  </Head>
  <Layout><>

    <div className={styles.container}>
      
      <ButtonBack />
      <div className={styles.title}>Calcular: 
        <span style={{color: '#F25C05'}}>custo do milheiro</span>
      </div>

      <div className={styles.inputs}>
        
        {/* Input 1 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Valor investido na compra:
            </div>
              <Input 
                name='price'
                onSet={(e)=> handleValues(e)}
                placeholder={'R$ 0,00'}
                mask='currency'
              />
          </div>       
        </div>

        {/* Input 2 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Quantidade de pontos/milhas comprados:
            </div>
              <Input 
                name='pointsQuantity'
                onSet={(e)=> handleValues(e)}
                placeholder={'Ex.: 1.000'}
                mask='miles'
              />
          </div>       
        </div>

        {/* Input 3 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Se houver, % de bônus da transferência:
            </div>
              <Input 
                name='percentage'
                onSet={(e)=> handleValues(e)}
                placeholder={'Ex.: 100%'}
                mask='percentage'
              />
          </div>       
        </div> 

        {/* Input 4 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Cotação do milheiro para venda:
            </div>
              <Input 
                name='sellPrice'
                onSet={(e)=> handleValues(e)}
                placeholder={'R$ 0,00'}
                mask='currency'
              />
          </div>       
        </div> 

      </div> 
      {/* Input's end */}
    
      {/* Results */}
      <div className={styles.titleResults} style={{paddingTop: '32px'}}>Resultado</div>
      <div className={styles.results}>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Valor investido:</div>
          <div className={styles.values}>{price ? price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Total de pontos comprados:</div>
          <div className={styles.values}>{pointsQuantity ? pointsQuantity.toLocaleString('pt-BR') : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Bônus da transferência:</div>
          <div className={styles.values}>{percentage ? percentage + '%' : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Total após transferência:</div>
          <div className={styles.values}>{miles ? miles.toLocaleString('pt-BR') : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow} >
        <div className={styles.contentColumn} /* style={{border: 'none', paddingTop: '12px'}} */>
          <div className={styles.titleValues} style={{fontWeight: '600', fontSize: '14px'}}>Valor final do milheiro:</div>
          <div className={styles.values} style={{color: '#6A9000', fontWeight: '600', fontSize: '14px'}}>{finalPrice ? finalPrice.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'R$ 0,00'}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn} style={{border: 'none'}}>
          <div className={styles.titleValues}>Cotação atual de venda:</div>
          <div className={styles.values}>{sellPrice ? sellPrice.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
        </div>        
      </div>

      {profit > 0  && 
        
          <div className={styles.contentRow}>
            <div className={styles.contentColumn} style={{borderTop: '1px solid #DCE7FF'}}>
              <div className={styles.titleValues} style={{color: '#6A9000', fontWeight: 600}}>Lucro estimado:</div>
              <div className={styles.values} style={{color: '#6A9000', fontWeight: '600', fontSize: '14px'}}>{profit.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
            </div>        
          </div>
       
      }

      {profit == 0 ? ( sellPrice ?
        <div className={styles.contentRow}>
          <div className={styles.contentColumn} style={{borderTop: '1px solid #DCE7FF'}}>
            <div className={styles.titleValues} style={{color: '#F29E05', fontWeight: 600}}>Lucro estimado:</div>
            <div className={styles.values} style={{color: '#F29E05', fontWeight: '600', fontSize: '14px'}}>{profit.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
          </div>        
        </div> : ''
      ) : ''
      }

      {profit < 0 && 
        <div className={styles.contentRow}>
          <div className={styles.contentColumn} style={{borderTop: '1px solid #DCE7FF'}}>
            <div className={styles.titleValues} style={{color: '#D92B05', fontWeight: 600}}>Prejuízo estimado:</div>
            <div className={styles.values} style={{color: '#D92B05', fontWeight: '600', fontSize: '14px'}}>{profit.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
          </div>        
        </div>
      }

      {percentageProfit > 0 ?
        (<div className={styles.contentRow}>
          <div className={styles.contentColumn} style={{border: 'none'}}>
            <div className={styles.titleValues}>Em percentual:</div>
            <div className={styles.values}>{'+'+percentageProfit.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%'}</div>
          </div>        
        </div>) : ''
      } 

      {percentageProfit == 0 ? 
        (sellPrice ? 
        <div className={styles.contentRow}>
          <div className={styles.contentColumn} style={{border: 'none'}}>
            <div className={styles.titleValues}>Em percentual:</div>
            <div className={styles.values}>{percentageProfit.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%'}</div>
          </div>        
        </div> : '' ) 
        : ''
      } 

      {percentageProfit < 0 ?
        (<div className={styles.contentRow}>
          <div className={styles.contentColumn} style={{border: 'none'}}>
            <div className={styles.titleValues}>Em percentual:</div>
            <div className={styles.values}>{percentageProfit.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%'}</div>
          </div>        
        </div>) : ''
      }       

      </div>
      {/* Results end */}
      
      <div className={styles.linkClean} onClick={() => document.location.reload()}>
        Limpar e refazer simulação
      </div>

      
    </div>

  </></Layout>  
  </>)
}

export default CustoMilheiro;


type Props = {
  user: User; 
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

   
  return {
    props: {
      user,
    }
  }
}