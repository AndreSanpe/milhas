import { GetServerSideProps } from 'next';
import { Account, unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../../components/Button';
import Dropdown from '../../../components/Dropdown';
import FormModal from '../../../components/FormModal';
import Input from '../../../components/Input';
import Layout from '../../../components/Layout';
import Toggle from '../../../components/Toggle';
import { useAccountsContext } from '../../../contexts/accounts';
import { useAuthContext } from '../../../contexts/auth';
import api from '../../../libs/api';
import { User } from '../../../types/User';
import { authOptions } from '../../api/auth/[...nextauth]';
import styles from './styles.module.css';
import Title from '../../../components/Title';
import apiAccounts from '../../../libs/apiAccounts';


const CompraBonificada = (data: Props) => {
  
  const router = useRouter(); 

  /* ContextApi: user  */
    const { user, setUser } = useAuthContext();
    useEffect(() => {
      if(user === null || user != data.user) {
        setUser(data.user)
      }
    }, [data, user, setUser]);

  /* State modal//////////////////////////////////////////////////////////////// */
  const [ showModal, setShowModal ] = useState<boolean>(false);
 
  /* States part 1 (4 inputs) ///////////////////////////////////////////////////*/
  const [ product, setProduct ] = useState<string>('');
  const [ price, setPrice ] = useState<number>(0);
  const [ pointsForReal, setPointsForReal ] = useState<number>(0);
  const [ program, setProgram ] = useState<string>('');

  /* States part 2 (Score) ///////////////////////////////////////////////////*/
  const [ score, setScore ] = useState<boolean>(false);
  const [ currencyOption, setCurrencyOption ] = useState<string>('');
  const [ pointsCard, setPointsCard ] = useState<number>(0);
  const [ currency, setCurrency ] = useState<number>(0);

  /* States part 3 (Price protection) ///////////////////////////////////////*/
  const [ priceProtection, setPriceProtection ] = useState<boolean>(false);
  const [ secureValue, setSecureValue ] = useState<number>(0);

  /* States part 4 (Transfer) //////////////////////////////////////////////*/
  const [ transfer, setTransfer ] = useState<boolean>(false);
  const [ destiny, setDestiny ] = useState<string>('');
  const [ percentage, setPercentage ] = useState<number>(0);
  
  /* States auxiliary for calculate ///////////////////////////////////////*/
  const [ pointsQuantity, setPointsQuantity ] = useState<number>(0);
  const [ pointsCardQuantity, setPointsCardQuantity ] = useState<number>(0);
  const [ totalpoints, setTotalPoints ] = useState<number>(0);
  const [ miles, setMiles ] = useState<number>(0);
  const [ sellPrice, setSellPrice ] = useState<number>(0);
  const [ priceMiles, setPriceMiles ] = useState<number>(0);
  const [ percentageProfit, setPercentageProfit ] = useState<number>(0);
  const [ finalPrice, setFinalPrice ] = useState<number>(0);

  /* Auxiliary states for errors */
  const [ errorFields, setErrorFields ] = useState<string[]>([]);
 
  /* Functions of handle input values ///////////////////////////////////////////////////*/
  const handleValues = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    switch(e.currentTarget.name) {
      case 'product':
        setProduct(e.currentTarget.value);
        return
      case 'price':
        const priceInput = parseFloat((e.currentTarget.value).replace('R$ ', '').replace('.', '').replace(',', '.'));
        setPrice(priceInput);
        return;
      case 'pointsForReal':
        const pointsInput = parseInt(e.currentTarget.value.replace(/(\.)/g, ''));
        setPointsForReal(pointsInput);
        return;
      case 'pointsCard':
        const pointsCardInput = parseFloat((e.currentTarget.value).replace(',', '.'));
        setPointsCard(pointsCardInput)
        return;
      case 'percentage':
        const percentageInput = parseInt(e.currentTarget.value);
        setPercentage(percentageInput);
        return;
      case 'sellPrice':
        const sellPriceInput = parseFloat((e.currentTarget.value).replace('R$ ', '').replace('.', '').replace(',', '.'));
        setSellPrice(sellPriceInput);
        return;
      case 'secureValue':
        const secureInput = parseFloat((e.currentTarget.value).replace('R$ ', '').replace('.', '').replace(',', '.'));
        setSecureValue(secureInput)
    }
  },[])

  const handleBoolean = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    switch(e.currentTarget.name) {
      case 'score':
        const score = e.currentTarget.checked;
        setScore(score);
        return;
      case 'priceProtection':
        const protection = e.currentTarget.checked;
        setPriceProtection(protection);
        return;
      case 'transfer':
        const transfer = e.currentTarget.checked;
        setTransfer(transfer);
        return;
    }
  },[]) 

  /* Calculation of points ///////////////////////////////////////////////////*/
  useEffect(() => {
    if(price && pointsForReal) {
      const calc = Math.round(price * pointsForReal);
      setPointsQuantity(calc);
    }
    else {
      setPointsQuantity(0);
    }
  },[pointsForReal, price])

  /* Fetch API for currency (dolar) ///////////////////////////////////////////////////*/
  useEffect(() => {
    const dolar = async () => {
      const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
      const json = await response.json();
      setCurrency(parseFloat(json.USDBRL.low))
    }
    dolar();
  },[])

  /* Calculation of card points ///////////////////////////////////////////////////*/
  useEffect(() => {
    if(score && currencyOption === 'Real' && pointsCard) {
      const calcReal = Math.round(pointsCard * price);
      setPointsCardQuantity(calcReal);
    }
    else if(score && currencyOption === 'Dólar' && pointsCard && currency) {
      const calcDolar = Math.round((pointsCard / currency) * price);
      setPointsCardQuantity(calcDolar);
    }
    else {
      setPointsCardQuantity(0);
    }
  },[currency, currencyOption, pointsCard, price, score]);

  /* Calculation total points ///////////////////////////////////////////////////*/
  useEffect(() => {
    if(pointsQuantity && pointsCardQuantity) {
      const sumPoints = pointsQuantity + pointsCardQuantity;
      setTotalPoints(sumPoints)
    }
    else {
      setTotalPoints(0);
    }
  },[pointsCardQuantity, pointsQuantity])

   /* Calculation after transfer ///////////////////////////////////////////////////*/
  useEffect(()=> {
    if (transfer && percentage && !score){
      const calcMilesWithoutScore = Math.floor((percentage + 100)/100 * pointsQuantity);
      setMiles(calcMilesWithoutScore);
    }
    else if (transfer && percentage && score) {
      const calcMilesWithScore = Math.floor((percentage + 100)/100 * totalpoints);
      setMiles(calcMilesWithScore);
    } 
    else {
      setMiles(0);
    }
  }, [percentage, pointsQuantity, score, totalpoints, transfer]);

  /* Calculation value of miles ///////////////////////////////////////////////////*/
  useEffect(()=> {
    if(pointsQuantity && sellPrice && !totalpoints && !miles) {
      const finalPriceWithoutTransferAndCard = (Math.floor(pointsQuantity / 1000))* sellPrice;
      setPriceMiles(finalPriceWithoutTransferAndCard);
    }
    else if(pointsQuantity && sellPrice && totalpoints && !miles) {
      const finalPriceWithoutTransfer = (Math.floor(totalpoints / 1000))* sellPrice;
      setPriceMiles(finalPriceWithoutTransfer);
    }
    else if (pointsQuantity && sellPrice && miles) {
      const finalPriceWithTransfer = (Math.floor(miles / 1000))* sellPrice;
      setPriceMiles(finalPriceWithTransfer);
    }
    else {
      setPriceMiles(0);
    }
  },[miles, pointsQuantity, sellPrice, totalpoints]);

  /* Calculation percentage discounts///////////////////////////////////////////////////*/
  useEffect(()=> {
    if(price && finalPrice) {
      const percentageProfit = ((price - finalPrice) * 100) / price;
      setPercentageProfit(percentageProfit)
    }
    else {
      setPercentageProfit(0)
    }
  }, [price, finalPrice])

  /* Calculation final price of product */
  useEffect(() => {
    if(price && priceMiles && !secureValue) {
      const productCost = price - priceMiles;
      setFinalPrice(productCost);
    }
    else if(price && priceMiles && secureValue) {
      const productCost = price - priceMiles - secureValue;
      setFinalPrice(productCost);
    }
    else {
      setFinalPrice(0)
    }
  },[price, priceMiles, secureValue])

  /* Cleaning Inputs /////////////////////////////////////////////////////////////////////*/
  useEffect(() => {
    if(!score) {
      setCurrencyOption('');
      setPointsCard(0);
    }
    if(!transfer) {
      setDestiny('');
      setPercentage(0);
    }
    if(!priceProtection) {
      setSecureValue(0);
    }
  }, [priceProtection, score, transfer]);

  /* useEffect protecting from results in NaN format /////////////////////////////////////*/
  useEffect(() => {
    if(Number.isNaN(price)) {
      setPrice(0);
      return;
    }
    if(Number.isNaN(pointsQuantity)) {
      setPointsQuantity(0);
      return;
    }
    if(Number.isNaN(pointsForReal)) {
      setPointsForReal(0);
      return;
    }
    if(Number.isNaN(pointsCard)){
      setPointsCard(0);
      return;
    }
    if(Number.isNaN(pointsCardQuantity)) {
      setPointsCardQuantity(0);
      return;
    }
    if(Number.isNaN(secureValue)) {
      setSecureValue(0);
      return;
    }
    if(Number.isNaN(percentage)) {
      setPercentage(0);
      return;
    }
    if(Number.isNaN(sellPrice)) {
      setSellPrice(0);
      return;
    }
  }, [percentage, pointsCard, pointsCardQuantity, pointsForReal, pointsQuantity, price, secureValue, sellPrice])
     
  /* verify each default entry, if exists errors, push to array */
  const verifyData = () => {
    let newErroFields = [];
    let approved = true;

    if(!product) {
      newErroFields.push('product');
      approved = false;
    }
    if(!price) {
      newErroFields.push('price');
      approved = false;
    }
    if(!pointsForReal) {
      newErroFields.push('pointsForReal');
      approved = false;
    }
    if(!program){
      newErroFields.push('program');
      approved = false;
    }
    if(!sellPrice){
      newErroFields.push('sellPrice');
      approved = false;
    }
  
    setErrorFields(newErroFields);
    return approved;
  };

  const handleSubmit = async () => {
    if(verifyData() && user) {
      let buybonus = {
        product,
        price,
        pointsForReal,
        program,
        pointsQuantity,
        pointsCardQuantity,
        totalpoints,
        destiny,
        percentage,
        miles,
        secureValue,
        sellPrice,
        priceMiles,
        percentageProfit,
        finalPrice,
        score, 
        priceProtection,
        transfer,
        currencyOption,
        pointsCard,
        userId: user.id
      }
      const response = await fetch('/api/buybonus', {
        method: 'POST',
        body: JSON.stringify(buybonus),
        headers: {
          'content-Type': 'application/json',
        },
      });

      setShowModal(true);
    }
  };

  return (<>

  <Head>
    <title>Calculadora de compra bonificada . PlanMilhas</title>
  </Head>
  <Layout><>

    <div className={styles.container}>

      <Title route='/dashboard'>Calculadora de compra bonificada</Title>

      <div className={styles.inputs}>

        {/* Confirmation modal*/}
        {showModal &&
          <FormModal maxWidth={'340px'} maxHeight={'1500px'}>
            <div className={styles.modalContainer}>
              <div className={styles.modalTitle}>Compra bonificada salva com sucesso!</div>
              <div className={styles.modalSubtitle}>O que deseja fazer agora?</div>
              <div className={styles.modalLink} onClick={() => router.push('/dashboard')} >Voltar ao início</div>
              <div className={styles.modalLink} 
                  onClick={() => {
                  {router.push('/calculadoras/compra-bonificada')}
                  document.location.reload()}}>Cadastrar nova compra</div>
              <div className={styles.modalLink} onClick={() => router.push('/extratos/compra-bonificada')}>Ver histórico de compras</div>
            </div>
          </FormModal>
        }

        {/* Input 1 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Nome do produto:
            </div>
              <Input 
                name='product'
                onSet={(e)=> handleValues(e)}
                placeholder={'Ex.: Iphone 14'}
                warning={errorFields.includes('product')}
              />
          </div>       
        </div>
        
        {/* Input 2 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Preço de compra do produto:
            </div>
              <Input 
                name='price'
                onSet={(e)=> handleValues(e)}
                placeholder={'R$ 0,00'}
                mask='currency'
                warning={errorFields.includes('price')}
              />
          </div>       
        </div>

        {/* Input 3 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Quantidade de pontos ganhos por real:
            </div>
              <Input 
                name='pointsForReal'
                onSet={(e)=> handleValues(e)}
                placeholder={'Ex.: 10'}
                mask='twoDigits'
                warning={errorFields.includes('pointsForReal')}
              />
          </div>       
        </div>

        {/* Input 4 */}
         <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Programa de pontos utilizado:
            </div>
              <Dropdown 
                style={{zIndex: '999'}}
                selected={program}
                setSelected={setProgram}
                options={['Livelo', 'Esfera', 'Tudo Azul', 'Latam Pass', 'Smiles']}
                warning={errorFields.includes('program')}
              />
          </div>       
        </div>

        {/*  O cartão utilizado acumula pontos? */}
        {/* Input 5 */}
        <div className={styles.row} >
          <div className={styles.toggle}>
            <div className={styles.label} style={{fontSize: '14px'}}>
              O cartão utilizado acumula pontos?
            </div>
            <Toggle 
              name='score'
              initialValue={score}
              onSet={(e) => handleBoolean(e)}
            />
          </div>   
        </div>

        {score && 
        <>
        {/* Input 6 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              O acúmulo é em pontos por real ou dólar?
            </div>
              <Dropdown 
                style={{zIndex: '999'}}
                selected={currencyOption}
                setSelected={setCurrencyOption}
                options={['Real', 'Dólar']}
              />
          </div>       
        </div>

        {/* Input 7 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Quantidade de pontos ganhos por {currencyOption}:
            </div>
              <Input 
                name='pointsCard'
                onSet={(e)=> handleValues(e)}
                placeholder={'Ex.: 2,2'}
                mask='decimal'
              />
          </div>       
        </div>
       </>
        }

        {/* Possuí seguro proteção de preço? */}
        {/* Input 8 */}
        <div className={styles.row} >
          <div className={styles.toggle}>
            <div className={styles.label} style={{fontSize: '14px'}}>
              Seu cartão possuí seguro proteção <br></br>de preço?
            </div>
            <Toggle 
              name='priceProtection'
              initialValue={priceProtection}
              onSet={(e) => handleBoolean(e)}
            />
          </div>   
        </div>

        {priceProtection && 
        <>
        {/* Input 9 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Valor esperado de retorno do seguro:
            </div>
              <Input 
                name='secureValue'
                onSet={(e)=> handleValues(e)}
                placeholder={'R$ 0,00'}
                mask='currency'
              />
          </div>       
        </div>
        </>
        }

        {/* Haverá transferência de pontos? */}
        {/* Input 10 */}
        <div className={styles.row} >
          <div className={styles.toggle}>
            <div className={styles.label} style={{fontSize: '14px'}}>
              Haverá transferência de pontos?
            </div>
            <Toggle 
              name='transfer'
              initialValue={transfer}
              onSet={(e) => handleBoolean(e)}
            />
          </div>   
        </div>

        {transfer && 
        <>
        {/* Input 11 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Programa destino da transferência:
            </div>
              <Dropdown 
                selected={destiny}
                setSelected={setDestiny}
                options={['Livelo', 'Esfera', 'Tudo Azul', 'Latam Pass', 'Smiles']}
              />
          </div>       
        </div>

        {/* Input 12 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Bônus da transferência em %:
            </div>
              <Input 
                name='percentage'
                onSet={(e)=> handleValues(e)}
                placeholder={'Ex.: 100%'}
                mask='percentage'
              />
          </div>       
        </div> 
        </>
        }

        {/* Input 13 */}
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
                warning={errorFields.includes('sellPrice')}
              />
          </div>       
        </div>

        
      </div> 
      {/* Input's end */}
    
      {/* Results */}
      <div className={styles.titleResults} style={{paddingTop: '32px'}}>Resumo da compra</div>
      <div className={styles.results}>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Produto:</div>
          <div className={styles.values}>{product}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Preço do produto:</div>
          <div className={styles.values}>{price ? price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Pontos ganhos por real:</div>
          <div className={styles.values}>{pointsForReal ? pointsForReal : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Programa de acúmulo:</div>
          <div className={styles.values}>{program ? program : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Pontos/milhas acumulados pelo produto:</div>
          <div className={styles.values}>{pointsQuantity ? pointsQuantity.toLocaleString('pt-BR') : ''}</div>
        </div>        
      </div>

      {score && 
      <>
      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Pontos acumulados pelo cartão:</div>
          <div className={styles.values}>{pointsCardQuantity ? pointsCardQuantity.toLocaleString('pt-BR') : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Total de pontos Produto + Cartão:</div>
          <div className={styles.values}>{totalpoints ? totalpoints.toLocaleString('pt-BR') : ''}</div>
        </div>        
      </div>
      </>
      }

      {transfer &&
      <>
      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Transferência para:</div>
          <div className={styles.values}>{destiny}</div>
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
      </>
      }

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Valor recuperado na venda das milhas:</div>
          <div className={styles.values} style={{color: '#F25C05'}}>{priceMiles ? priceMiles.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
        </div>        
      </div>

      {priceProtection &&
      <>
      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Seguro proteção de preço:</div>
          <div className={styles.values} style={{color: '#F25C05'}}>{secureValue ? secureValue.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
        </div>        
      </div>
      </>
      }

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Percentual de desconto:</div>
          <div className={styles.values} style={{color: '#F25C05'}}>{percentageProfit ? percentageProfit.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%' : ''}</div>
        </div>        
      </div>
      
      <div className={styles.contentRow} >
        <div className={styles.contentColumn} style={{border: 'none', paddingTop: '12px'}}>
          <div style={{fontWeight: '600', fontSize:'14px'}}>Preço final do produto:</div>
          <div className={styles.values} style={{color: '#6A9000', fontWeight: '600', fontSize: '14px'}}>{finalPrice ? finalPrice.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
        </div>        
      </div>

      </div>
      {/* Results end */}
      
      {/* Button and actions */}
      <div className={styles.btn}>
        <Button 
          label= 'Salvar compra'
          backgroundColor='#26408C'
          backgroundColorHover='#4D69A6'
          onClick={handleSubmit}
        />
      </div>

      {/* Error message */}
      <div className={styles.messageError}>
        {errorFields.length ? 'Campo(s) obrigatório(s), por favor preencha-o(s)!' : ''}
      </div>

      <div className={styles.linkClean} onClick={() => document.location.reload()}>
        Limpar e refazer simulação
      </div>


    </div>

  </></Layout>  
  </>)
}

export default CompraBonificada;


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
  };

  //Get subscription
  const subscription = await api.getSubscription(user.id as string, user.subscriptionId as string);
  
  if(!subscription?.subscriptionStatus) {
    return{
      redirect: {destination: '/assinatura', permanent: false}
    }
  };
   
  return {
    props: {
      user
    }
  }
}