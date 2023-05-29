import { GetServerSideProps } from 'next';
import { Account, unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../../../components/Button';
import Dropdown from '../../../../components/Dropdown';
import Input from '../../../../components/Input';
import Layout from '../../../../components/Layout';
import Toggle from '../../../../components/Toggle';
import { useAccountsContext } from '../../../../contexts/accounts';
import { useAuthContext } from '../../../../contexts/auth';
import api from '../../../../libs/api';
import { User } from '../../../../types/User';
import { authOptions } from '../../../api/auth/[...nextauth]';
import styles from './styles.module.css';
import Title from '../../../../components/Title';
import apiAccounts from '../../../../libs/apiAccounts';
import apiBuyMiles from '../../../../libs/apiBuyMiles';
import { BuyMiles } from '../../../../types/BuyMiles';


const EditarCompraPontos = (data: Props) => {
  
  const router = useRouter(); 

  /* ContextApi: accounts  */
  const { accounts, setAccounts } = useAccountsContext();
  useEffect(() => {
    if(accounts === null || accounts as [] !== data.accounts) {
      setAccounts(data.accounts as any)
    }
  }, [data, accounts, setAccounts]);

  /* ContextApi: user  */
  const { user, setUser } = useAuthContext();
  useEffect(() => {
    if(user === null || user != data.user) {
      setUser(data.user)
    }
  }, [data, user, setUser]);

  /* State modal//////////////////////////////////////////////////////////////// */
  const [ showModal, setShowModal ] = useState<boolean>(false);
 
  /* General states ///////////////////////////////////////////////////////////////////////*/
  const [ price, setPrice ] = useState<number>(data.buyedMiles.price);
  const [ pointsQuantity, setPointsQuantity ] = useState<number>(data.buyedMiles.pointsQuantity);
  const [ percentage, setPercentage ] = useState<number>(data.buyedMiles.percentage as number);
  const [ sellPrice, setSellPrice ] = useState<number>(0);
  const [ transfer, setTransfer ] = useState<boolean>(data.buyedMiles.transfer);
  const [ creditCard, setCreditCard ] = useState<string>(data.buyedMiles.creditCard as string)
  const [ program, setProgram ] = useState<string>(data.buyedMiles.program);
  const [ destiny, setDestiny ] = useState<string>(data.buyedMiles.destiny as string);
  const [ selectedAccount, setSelectedAccount ] = useState<string>(data.buyedMiles.selectedAccount);
  const [ parcel, setParcel ] = useState(data.buyedMiles.parcel as string);
  const [ month, setMonth ] = useState<string>(data.buyedMiles.month as string);
  const [ dateBuy, setDateBuy ] = useState<string>(data.buyedMiles.dateBuy as string);
  
  /* Auxiliary states for accounts data ////////////////////////////////////////////////////*/
  const [ namesAccounts, setNamesAccounts ] = useState<any[]>([]);
  const [ documentsAccounts, setDocumentsAccounts ] = useState<any[]>([]);
  const [ indice, setIndice ] = useState<any>();
  const [ cpf, setCpf ] = useState<string>('');

  /* Auxiliary states for calculate/////////////////////////////////////////////////////////*/
  const [ miles, setMiles ] = useState<number>(data.buyedMiles.miles as number);
  const [ finalPrice, setFinalPrice ] = useState<number>(data.buyedMiles.finalPrice);

  /* Auxiliary states for errors */
  const [ errorFields, setErrorFields ] = useState<string[]>([]);

   /* List accounts and cpfs////////////////////////////////////////////////////////////////*/
  useEffect(() => {
    const optionsAccounts: string[] = [];
    const documentsAccounts: string[] = [];
    
    if(accounts) {
      accounts.map((item, index) => {
        if(item.name) {
          optionsAccounts.push(item.name);
          documentsAccounts.push(item.document)
        } else {
          optionsAccounts.push('Não há contas cadastradas')
        }
      })  
    }

  setNamesAccounts(optionsAccounts);
  setDocumentsAccounts(documentsAccounts);
  }, [accounts])
  
  /* Find cpf through index*/
  useEffect(() => {
    if(selectedAccount) {
      setCpf(documentsAccounts[indice])
    }
  },[documentsAccounts, indice, selectedAccount])

  /* handle if cpf database */
  useEffect(() => {
    if(!indice && !cpf && data.buyedMiles.cpf) {
      setCpf(data.buyedMiles.cpf)
    }
  }, [cpf, data.buyedMiles.cpf, indice])

  /* Functions of handle input values ///////////////////////////////////////////////////*/
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
      case 'creditCard':
        setCreditCard(e.currentTarget.value);
        return;
      case 'dateBuy': 
        setDateBuy(e.currentTarget.value);
        return;
    }
  },[])

  const handleBoolean = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const transfer = e.currentTarget.checked;
    setTransfer(transfer)
  },[])

  /* Cleaning Inputs /////////////////////////////////////////////////////////////////////*/
  useEffect(() => {
    if(!transfer) {
      setDestiny('');
      setPercentage(0);
    }
  }, [transfer]);

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

  }, [miles, percentage, pointsQuantity, price]);

  /* verify each default entry, if exists errors, push to array */
  const verifyData = () => {
    let newErroFields = [];
    let approved = true;

    if(!price) {
      newErroFields.push('price');
      approved = false;
    }
    if(!pointsQuantity) {
      newErroFields.push('pointsQuantity');
      approved = false;
    }
    if(!dateBuy) {
      newErroFields.push('dateBuy');
      approved = false;
    }
    if(!program){
      newErroFields.push('program');
      approved = false;
    }
    if(!selectedAccount) {
      newErroFields.push('selectedAccount');
      approved = false;
    }
  
    setErrorFields(newErroFields);
    return approved;
  };
  
  const handleSubmit = async () => {
    if(verifyData() && user) {
      let buymiles = {
        price, 
        pointsQuantity,
        dateBuy, 
        program, 
        selectedAccount, 
        cpf,
        transfer, 
        destiny, 
        percentage, 
        creditCard, 
        parcel, 
        month, 
        miles, 
        finalPrice, 
        userId: user.id,
        id: data.buyedMiles.id
      }
      const response = await fetch('/api/buymiles', {
        method: 'PUT',
        body: JSON.stringify(buymiles),
        headers: {
          'content-Type': 'application/json',
        },
      });
      
      router.push('/extratos/compra')
    }
  };


  return (<>

  <Head>
    <title>Editar compra de pontos . PlanMilhas</title>
  </Head>
  <Layout><>

    <div className={styles.container}>

      <Title route={'/dashboard'}>Editar compra de pontos</Title>

      <div className={styles.inputs}>

        {/* Input */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Valor investido na compra:
            </div>
              <Input 
                name='price'
                defaultValue={price ? price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}
                onSet={(e)=> handleValues(e)}
                placeholder={'R$ 0,00'}
                mask='currency'
                warning={errorFields.includes('price')}
              />
          </div>       
        </div>

        {/* Input */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Quantidade de pontos/milhas comprados:
            </div>
              <Input 
                name='pointsQuantity'
                defaultValue={pointsQuantity ? pointsQuantity.toLocaleString('pt-BR') : ''}
                onSet={(e)=> handleValues(e)}
                placeholder={'Ex.: 1.000'}
                mask='miles'
                warning={errorFields.includes('pointsQuantity')}
              />
          </div>       
        </div>

        {/* Input */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Data da compra:
            </div>
              <Input 
                name='dateBuy'
                value={dateBuy ? dateBuy : ''}
                onSet={(e)=> handleValues(e)}
                placeholder={'Ex.: 01/01/2023'}
                mask='date'
                warning={errorFields.includes('dateBuy')}
              />
          </div>       
        </div>

        {/* Input */}
         <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Programa ou clube da compra:
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

        {/* Input */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Selecione a conta da compra:
            </div>
              <Dropdown 
                style={{zIndex: '999'}}
                selected={selectedAccount}
                setSelected={setSelectedAccount}
                options={namesAccounts}
                setIndice={setIndice}
                warning={errorFields.includes('selectedAccount')}
              />
          </div>       
        </div>

        {/* Link */}
        {namesAccounts.length == 0 &&
          <div className={styles.row}>
            <div className={styles.column}>
              <div className={styles.label} style={{color: '#525252', display: 'flex' ,justifyContent: 'flex-end'}}>
                Ainda não cadastrou as contas 
              </div>
              <div className={styles.label} style={{color: '#525252', display: 'flex' ,justifyContent: 'flex-end'}}>
                que você administra?
              </div>
              <div className={styles.linkAux} onClick={() => router.push({...router.query,pathname: '/gerenciamento/contas'}) }>
                Clique aqui e cadastre
              </div>
            </div>       
          </div>
        }

         {/* Input */}
         <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Cartão utilizado na compra:
            </div>
              <Input 
                name='creditCard'
                value={creditCard ? creditCard : ''}
                onSet={(e)=> handleValues(e)}
                placeholder={'Ex.: Visa Infinite XP'}
              />
          </div>       
        </div>

        {/* Input */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Número de parcelas do pagamento:
            </div>
              <Dropdown 
                style={{zIndex: '999'}}
                selected={parcel}
                setSelected={setParcel}
                options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']}
              />
          </div>       
        </div>

        {/* Input */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Selecione o mês da primeira parcela:
            </div>
              <Dropdown 
                style={{zIndex: '999'}}
                selected={month}
                setSelected={setMonth}
                options={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
              />
          </div>       
        </div>

        {/* Input */}
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

        {transfer && <>

        {/* Input */}
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

        {/* Input */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Bônus da transferência em %:
            </div>
              <Input 
                name='percentage'
                value={percentage ? percentage : ''}
                onSet={(e)=> handleValues(e)}
                placeholder={'Ex.: 100%'}
                mask='percentage'
              />
          </div>       
        </div> </>
        }
      </div> 
      {/* Input's end */}
    
      {/* Results */}
      <div className={styles.titleResults} style={{paddingTop: '32px'}}>Resumo da compra</div>
      <div className={styles.results}>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Data da compra:</div>
          <div className={styles.values}>{dateBuy ? dateBuy : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Conta utilizada:</div>
          <div className={styles.values}>{selectedAccount ? selectedAccount : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Documento CPF:</div>
          <div className={styles.values}>{cpf ? cpf : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Valor investido:</div>
          <div className={styles.values}>{price ? price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Cartão utilizado:</div>
          <div className={styles.values}>{creditCard}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Parcelamento:</div>
          <div className={styles.values}>{parcel ? parcel + 'x' : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Pontos comprados:</div>
          <div className={styles.values}>{pointsQuantity ? pointsQuantity.toLocaleString('pt-BR') : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Programa da compra:</div>
          <div className={styles.values}>{program}</div>
        </div>        
      </div>

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

      <div className={styles.contentRow} >
        <div className={styles.contentColumn} style={{border: 'none', paddingTop: '12px'}}>
          <div style={{fontWeight: '600', fontSize:'14px'}}>Valor final do milheiro:</div>
          <div className={styles.values} style={{color: '#6A9000', fontWeight: '600', fontSize: '14px'}}>{finalPrice ? finalPrice.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'R$ 0,00'}</div>
        </div>        
      </div>

      </div>
      {/* Results end */}
      
      {/* Button and actions */}
      <div className={styles.btn}>
        <Button 
          label= 'Atualizar compra'
          backgroundColor='#26408C'
          backgroundColorHover='#4D69A6'
          onClick={handleSubmit}
        />
      </div>

      {/* Error message */}
      <div className={styles.messageError}>
        {errorFields.length ? 'Campo(s) obrigatório(s), por favor preencha-o(s)!' : ''}
      </div>

    </div>

  </></Layout>  
  </>)
}

export default EditarCompraPontos;

type Props = {
  user: User; 
  accounts: Account[];
  buyedMiles: BuyMiles;
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  const { editbuymiles } = context.query;

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

  /* Get one selled miles */
 const buyedMiles = await apiBuyMiles.getOneMilesBuyed(editbuymiles as string);

  return {
    props: {
      user,
      accounts: JSON.parse(JSON.stringify(accounts)),
      buyedMiles: JSON.parse(JSON.stringify(buyedMiles))
    }
  }
}