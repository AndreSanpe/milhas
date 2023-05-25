import { GetServerSideProps } from 'next';
import { Account, unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../../components/Button';
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
import Title from '../../../components/Title';
import FormModal from '../../../components/FormModal';
import apiAccounts from '../../../libs/apiAccounts';

const CompraBumerangue = (data: Props) => {
  
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
  const [ price, setPrice ] = useState<number>(0);
  const [ pointsQuantity, setPointsQuantity ] = useState<number>(0);
  const [ dateBuy, setDateBuy ] = useState<string>('');
  const [ selectedAccount, setSelectedAccount ] = useState<string>('');

  const [ program, setProgram ] = useState<string>('Livelo');
  const [ destinyOne, setDestinyOne ] = useState<string>('Latam Pass');
  const [ percentage, setPercentage ] = useState<number>(0);
  const [ miles, setMiles ] = useState<number>();

  const [ returnPercentage, setReturnPercentage ] = useState<number>(0);
  const [ points, setPoints ] = useState<number>();

  const [ transfer, setTransfer ] = useState<boolean>(false);
  const [ percentageTwo, setPercentageTwo ] = useState<number>(0);
  const [ destinyTwo, setDestinyTwo ] = useState<string>('');
  const [ milesTwo, setMilesTwo ] = useState<number>();

  const [ totalMiles, setTotalMiles ] = useState<number>();
  const [ finalPrice, setFinalPrice ] = useState<number>();
  
  /* Auxiliary states for accounts data ////////////////////////////////////////////////////*/
  const [ namesAccounts, setNamesAccounts ] = useState<any[]>([]);
  const [ documentsAccounts, setDocumentsAccounts ] = useState<any[]>([]);
  const [ indice, setIndice ] = useState<any>();
  const [ cpf, setCpf ] = useState<string>('');

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
      case 'returnPercentage':
        const returnPercentageInput = parseInt(e.currentTarget.value);
        setReturnPercentage(returnPercentageInput);
        return;
      case 'percentageTwo':
        const percentageTwoInput = parseInt(e.currentTarget.value);
        setPercentageTwo(percentageTwoInput);
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
      setDestinyTwo('');
      setPercentageTwo(0);
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
    if(Number.isNaN(returnPercentage)) {
      setReturnPercentage(0);
    }
    if(Number.isNaN(percentageTwo)) {
      setPercentageTwo(0);
    }
    
  }, [percentage, percentageTwo, pointsQuantity, price, returnPercentage])

  /* Calculation after transfer ///////////////////////////////////////////////////*/
  useEffect(()=> {
    if (percentage) {
      const calcMiles = ((percentage + 100)/100 * pointsQuantity);
      setMiles(calcMiles);
    } else {
      setMiles(0);
    }
  }, [percentage, pointsQuantity])

  /* Calculation return to Livelo */
  useEffect(() => {
    if(returnPercentage) {
      const calcPoints = ((returnPercentage)/100 * pointsQuantity)
      setPoints(calcPoints)
    } else {
      setPoints(0)
    }
  }, [pointsQuantity, returnPercentage]);

  /* Calculation after second transfer ///////////////////////////////////////////////////*/
  useEffect(()=> {
    if (percentageTwo && points) {
      const calcMilesTwo = ((percentageTwo + 100)/100 * points);
      setMilesTwo(calcMilesTwo);
    } else {
      setMilesTwo(0);
    }
  }, [percentageTwo, points, pointsQuantity])

  /* Calculation all miles  */
  useEffect(() => {
    if(pointsQuantity && !miles && !points && !milesTwo) {
      setTotalMiles(pointsQuantity);
    }
    else if(miles && !points && !milesTwo) {
      setTotalMiles(miles);
    }
    else if(miles && points && !milesTwo) {
      const allMiles = (miles + points)
      setTotalMiles(allMiles);
    }
    else if(miles && points && milesTwo) {
      const allMiles = (miles + milesTwo)
      setTotalMiles(allMiles);
    }
    else {
      setTotalMiles(0);
    }
  },[miles, milesTwo, points, pointsQuantity]);

   /* Calculation price ///////////////////////////////////////////////////*/
   useEffect(()=> { 
    if(totalMiles) {
      const simpleCalc = ((price) / ((totalMiles)/1000));
      setFinalPrice(simpleCalc);
    }
    else {
      setFinalPrice(0);
    }
  }, [price, totalMiles]);

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

    if(!percentage) {
      newErroFields.push('percetage');
      approved = false;
    }

    if(!returnPercentage) {
      newErroFields.push('returnPercetage');
      approved = false;
    }
  
    setErrorFields(newErroFields);
    return approved;
  };
  
  const handleSubmit = async () => {
    if(verifyData() && user) {
      let buyBumerangue = {
        price, pointsQuantity, dateBuy, selectedAccount, cpf, program, destinyOne, percentage, miles, returnPercentage, points, transfer, percentageTwo, destinyTwo, milesTwo, totalMiles, finalPrice,
        userId: user.id
      }
      const response = await fetch('/api/buybumerangue', {
        method: 'POST',
        body: JSON.stringify(buyBumerangue),
        headers: {
          'content-Type': 'application/json',
        },
      });
      setShowModal(true);
    }
  };

  return (<>

  <Head>
    <title>Compra de Pontos . PlanMilhas</title>
  </Head>
  <Layout><>

    <div className={styles.container}>

      <Title route={'/dashboard'}>Calculadora de compra Bumerangue</Title>

      <div className={styles.inputs}>

        {/* Confirmation modal*/}
        {showModal &&
          <FormModal maxWidth={'340px'} maxHeight={'1500px'}>
            <div className={styles.modalContainer}>
              <div className={styles.modalTitle}>Compra de pontos/milhas salva com sucesso!</div>
              <div className={styles.modalSubtitle}>O que deseja fazer agora?</div>
              <div className={styles.modalLink} onClick={() => router.push('/dashboard')} >Voltar ao início</div>
              <div className={styles.modalLink} 
                  onClick={() => {
                  {router.push('/calculadoras/compra-bumerangue')}
                  document.location.reload()}}>Cadastrar nova compra</div>
              <div className={styles.modalLink} onClick={() => router.push('/extratos/bumerangue')}>Ver extrato de compras</div>
            </div>
          </FormModal>
        }
        
        {/* Input */}
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

        {/* Input */}
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

        {/* Input */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Data da compra:
            </div>
              <Input 
                name='dateBuy'
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
                options={['Livelo']}
                warning={errorFields.includes('program')}
              />
          </div>       
        </div>

       {/* Input */}
       <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Programa destino da transferência:
            </div>
              <Dropdown 
                selected={destinyOne}
                setSelected={setDestinyOne}
                options={['Latam Pass']}
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
                onSet={(e)=> handleValues(e)}
                placeholder={'Ex.: 100%'}
                mask='percentage'
                warning={errorFields.includes('percetage')}
              />
          </div>       
        </div>

        {/* Input */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Bônus de retorno para Livelo em %:
            </div>
              <Input 
                name='returnPercentage'
                onSet={(e)=> handleValues(e)}
                placeholder={'Ex.: 100%'}
                mask='percentage'
                warning={errorFields.includes('returnPercetage')}
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
        <div className={styles.row} >
          <div className={styles.toggle}>
            <div className={styles.label} style={{fontSize: '14px'}}>
              Haverá uma nova transferência <br></br>de pontos?
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
                selected={destinyTwo}
                setSelected={setDestinyTwo}
                options={['Tudo Azul', 'Latam Pass', 'Smiles']}
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
                name='percentageTwo'
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
          <div className={styles.values}>{destinyOne ? destinyOne : ''}</div>
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

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Bônus de retorno para Livelo:</div>
          <div className={styles.values}>{returnPercentage ? returnPercentage + '%' : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Pontos retornados a Livelo:</div>
          <div className={styles.values}>{points ? points.toLocaleString('pt-BR') : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Nova transferência para:</div>
          <div className={styles.values}>{destinyTwo ? destinyTwo : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Bônus da transferência:</div>
          <div className={styles.values}>{percentageTwo ? percentageTwo.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%' : ''}</div>
        </div>        
      </div>    

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Total após transferência:</div>
          <div className={styles.values}>{milesTwo ? milesTwo.toLocaleString('pt-BR') : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow} >
        <div className={styles.contentColumn} style={{border: 'none', paddingTop: '12px'}}>
          <div style={{fontWeight: '600', fontSize:'14px'}}>Milhas totais acumuladas:</div>
          <div className={styles.values} style={{color: '#6A9000', fontWeight: '600', fontSize: '14px'}}>{totalMiles ? totalMiles.toLocaleString('pt-BR') : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow} >
        <div className={styles.contentColumn} style={{border: 'none', paddingTop: '12px'}}>
          <div style={{fontWeight: '600', fontSize:'14px'}}>Valor médio do milheiro:</div>
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

export default CompraBumerangue;


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

  /* Get accounts */
  const accounts = await apiAccounts.getAccounts(session.user.id);

   
  return {
    props: {
      user,
      accounts: JSON.parse(JSON.stringify(accounts))
    }
  }
}