import { GetServerSideProps } from 'next';
import { Account, unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../../components/Button';
import ButtonBack from '../../../components/ButtonBack';
import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/Input';
import Layout from '../../../components/Layout';
import Toggle from '../../../components/Toggle';
import { useAccountsContext } from '../../../contexts/accounts';
import { useAuthContext } from '../../../contexts/auth';
import api from '../../../libs/api';
import { User } from '../../../types/User';
import { authOptions } from '../../api/auth/[...nextauth]';
import styles from './styles.module.css';


const CompraPontos = (data: Props) => {
  
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
 
  /* General states ///////////////////////////////////////////////////////////////////////*/
  const [ price, setPrice ] = useState<number>(0);
  const [ pointsQuantity, setPointsQuantity ] = useState<number>(0);
  const [ percentage, setPercentage ] = useState<number>(0);
  const [ sellPrice, setSellPrice ] = useState<number>(0);
  const [ transfer, setTransfer ] = useState<boolean>(false);
  const [ creditCard, setCreditCard ] = useState<string>('')
  const [ program, setProgram ] = useState<string>('');
  const [ destiny, setDestiny ] = useState<string>('');
  const [ selectedAccount, setSelectedAccount ] = useState<string>('');
  const [ parcel, setParcel ] = useState('');
  const [ month, setMonth ] = useState<string>('')
  
  /* Auxiliary states for accounts data ////////////////////////////////////////////////////*/
  const [ namesAccounts, setNamesAccounts ] = useState<any[]>([]);
  const [ documentsAccounts, setDocumentsAccounts ] = useState<any[]>([]);
  const [ indice, setIndice ] = useState<any>();
  const [ cpf, setCpf ] = useState<string>('');

  /* Auxiliary states for calculate/////////////////////////////////////////////////////////*/
  const [ miles, setMiles ] = useState<number>();
  const [ finalPrice, setFinalPrice ] = useState<number>();

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
    }
  },[])

  const handleBoolean = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const transfer = e.currentTarget.checked;
    setTransfer(transfer)
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
        program, 
        selectedAccount, 
        cpf, 
        destiny, 
        percentage, 
        creditCard, 
        parcel, 
        month, 
        miles, 
        finalPrice, 
        userId: user.id
      }
      const response = await fetch('/api/buymiles', {
        method: 'POST',
        body: JSON.stringify(buymiles),
        headers: {
          'content-Type': 'application/json',
        },
      });
    }
  }

  return (<>

  <Head>
    <title>Compra de Pontos . PlanMilhas</title>
  </Head>
  <Layout><>

    <div className={styles.container}>

      <div className={styles.header}>
        <ButtonBack route='/dashboard'/>
        <div className={styles.title}>Calculadora de compra de pontos e milhas</div>
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
                warning={errorFields.includes('price')}
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
                warning={errorFields.includes('pointsQuantity')}
              />
          </div>       
        </div>

        {/* Input 3 */}
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

        {/* Input 4 */}
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

         {/* Input 5 */}
         <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Cartão utilizado na compra:
            </div>
              <Input 
                name='creditCard'
                onSet={(e)=> handleValues(e)}
                placeholder={'Ex.: Visa Infinite XP'}
              />
          </div>       
        </div>

        {/* Input 6 */}
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

        {/* Input 7 */}
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

        {/* Input 8 */}
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

        {/* Input 9 */}
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

        {/* Input 10 */}
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
        </div> </>
        }
      </div> 
      {/* Input's end */}
    
      {/* Results */}
      <div className={styles.titleResults} style={{paddingTop: '32px'}}>Resumo da compra</div>
      <div className={styles.results}>

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
          label= 'Salvar compra'
          backgroundColor='#26408C'
          backgroundColorHover='#4D69A6'
          onClick={handleSubmit}
        />
      </div>

      <div className={styles.linkClean} onClick={() => document.location.reload()}>
        Limpar e refazer simulação
      </div>


    </div>

  </></Layout>  
  </>)
}

export default CompraPontos;


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