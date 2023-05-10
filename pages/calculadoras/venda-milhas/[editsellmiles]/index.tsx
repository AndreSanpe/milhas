import { GetServerSideProps } from 'next';
import { Account, unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../../../components/Button';
import Dropdown from '../../../../components/Dropdown';
import Input from '../../../../components/Input';
import Layout from '../../../../components/Layout';
import { useAccountsContext } from '../../../../contexts/accounts';
import { useAuthContext } from '../../../../contexts/auth';
import api from '../../../../libs/api';
import { User } from '../../../../types/User';
import { authOptions } from '../../../api/auth/[...nextauth]';
import styles from './styles.module.css';
import { SellMiles } from '../../../../types/SellMiles';
import Title from '../../../../components/Title';
import apiAccounts from '../../../../libs/apiAccounts';
import apiSellMiles from '../../../../libs/apiSellMiles';


const EditarVendaMilhas = (data: Props) => {
  
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
 
  /* General states ///////////////////////////////////////////////////*/
  const [ pointsQuantity, setPointsQuantity ] = useState<number>(data.selledMiles.pointsQuantity);
  const [ priceBuy, setPriceBuy ] = useState<number>(data.selledMiles.priceBuy)
  const [ priceSell, setPriceSell ] = useState<number>(data.selledMiles.priceSell);
  const [ program, setProgram ] = useState<string>(data.selledMiles.program);
  const [ programBuyer, setProgramBuyer ] = useState<string>(data.selledMiles.programBuyer);
  const [ selectedAccount, setSelectedAccount ] = useState<string>(data.selledMiles.selectedAccount);
  const [ receipt, setReceipt ] = useState<number>(data.selledMiles.receipt as number);
  const [ dateSell, setDateSell ] = useState<string>(data.selledMiles.dateSell as string);
  const [ dateReceipt, setDateReceipt ] = useState<string>(data.selledMiles.dateReceipt as string);
  
  /* Auxiliary states for accounts data */
  const [ namesAccounts, setNamesAccounts ] = useState<any[]>([]);
  const [ documentsAccounts, setDocumentsAccounts ] = useState<any[]>([]);
  const [ indice, setIndice ] = useState<any>();
  const [ cpf, setCpf ] = useState<string>(data.selledMiles.cpf);
  

  /* Auxiliary states for calculate*/
  const [ profit, setProfit ] = useState<number>(data.selledMiles.profit);
  const [ percentageProfit, setPercentageProfit ] = useState<number>(data.selledMiles.percentageProfit);

  /* Auxiliary states for errors */
  const [ errorFields, setErrorFields ] = useState<string[]>([]);

   /* List accounts and cpfs*/
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
    };

  setNamesAccounts(optionsAccounts);
  setDocumentsAccounts(documentsAccounts);
  }, [accounts])
  
  /* Find cpf through index*/
  useEffect(() => {
    if(selectedAccount) {
      setCpf(documentsAccounts[indice])
    }
  },[documentsAccounts, indice, selectedAccount]);

  /* handle if cpf database */
  useEffect(() => {
    if(!indice && !cpf && data.selledMiles.cpf) {
      setCpf(data.selledMiles.cpf)
    }
  }, [cpf, data.selledMiles.cpf, indice])

  /* Functions of handle input values ///////////////////////////////////////////////////*/
  const handleValues = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    switch(e.currentTarget.name) {
      case 'pointsQuantity':
        const pointsInput = parseInt(e.currentTarget.value.replace(/(\.)/g, ''));
        setPointsQuantity(pointsInput);
        return;
      case 'priceBuy':
        const priceInput = parseFloat((e.currentTarget.value).replace('R$ ', '').replace('.', '').replace(',', '.'));
        setPriceBuy(priceInput);
        return;
      case 'priceSell':
        const sellPriceInput = parseFloat((e.currentTarget.value).replace('R$ ', '').replace('.', '').replace(',', '.'));
        setPriceSell(sellPriceInput);
        return;
      case 'dateSell': 
         setDateSell(e.currentTarget.value);
         return;
      case 'receipt':
        const receipt = parseInt(e.currentTarget.value.replace(/(\.)/g, ''));
        setReceipt(receipt);
        return;
      case 'dateReceipt':
        setDateReceipt(e.currentTarget.value);
        return;
    }
  },[]);

  /* useEffect protecting from results in NaN format /////////////////////////////////////*/
  useEffect(() => {
    if(Number.isNaN(pointsQuantity)) {
      setPointsQuantity(0);
    }
    if(Number.isNaN(priceBuy)) {
      setPriceBuy(0);
    }
    if(Number.isNaN(priceSell)) {
      setPriceSell(0);
    }
    if(Number.isNaN(profit)){
      setProfit(0);
    }
    if(Number.isNaN(percentageProfit)) {
      setPercentageProfit(0);
    }
  }, [percentageProfit, pointsQuantity, priceBuy, priceSell, profit]);

  /* Calculation profit ///////////////////////////////////////////////////*/
  useEffect(()=> { 
    if(priceBuy && priceSell) {
      const calcProfit = priceSell - priceBuy;
      setProfit(calcProfit);
    } else {
      setProfit(0);
    }
   },[priceBuy, priceSell]);

   /* Calculation percentage ///////////////////////////////////////////////////*/
  useEffect(()=> {
    if(priceBuy && profit) {
      const percentageProfit = (profit * 100) / priceBuy;
      setPercentageProfit(percentageProfit)
    }
    else if (priceBuy == 0 || profit == 0) {
      setPercentageProfit(0)
    }
  }, [priceBuy, profit]);

  /* verify each default entry, if exists errors, push to array */
   const verifyData = () => {
    let newErroFields = [];
    let approved = true;

    if(!pointsQuantity) {
      newErroFields.push('pointsQuantity');
      approved = false;
    }
    if(!priceBuy) {
      newErroFields.push('priceBuy');
      approved = false;
    }
    if(!priceSell) {
      newErroFields.push('priceSell');
      approved = false;
    }
    if(!program){
      newErroFields.push('program');
      approved = false;
    }
    if(!programBuyer){
      newErroFields.push('programBuyer');
      approved = false;
    }
    if(!selectedAccount) {
      newErroFields.push('selectedAccount');
      approved = false;
    }
    if(!dateSell) {
      newErroFields.push('dateSell');
      approved = false;
    }
  
    setErrorFields(newErroFields);
    return approved;
  };
  
  const handleSubmit = async () => {
    if(verifyData() && user) {
      let sellmiles = {
        pointsQuantity, 
        priceBuy, 
        priceSell, 
        program,
        cpf, 
        programBuyer, 
        selectedAccount, 
        receipt, 
        dateSell, 
        dateReceipt, 
        profit, 
        percentageProfit,
        id: data.selledMiles.id, 
        userId: user.id
      }

      const response = await fetch('/api/sellmiles', {
        method: 'PUT',
        body: JSON.stringify(sellmiles),
        headers: {
          'content-Type': 'application/json',
        },
      });

      setErrorFields([]);
      router.push('/extratos/venda')
    }
  }
  
  return (<>

  <Head>
    <title>Editar venda de milhas . PlanMilhas</title>
  </Head>
  <Layout><>

    <div className={styles.container}>

      <Title route='/extratos/venda'>Editar venda de milhas</Title>   
      
      <div className={styles.inputs}>

        {/* Input 1 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Quantidade de milhas vendidas:
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
        
        {/* Input 2 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Valor investido na compra das milhas:
            </div>
              <Input 
                name='priceBuy'
                defaultValue={priceBuy ? priceBuy.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}
                onSet={(e)=> handleValues(e)}
                placeholder={'R$ 0,00'}
                mask='currency'
                warning={errorFields.includes('priceBuy')}
              />
          </div>       
        </div>

        {/* Input 3 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Valor recebido pela venda:
            </div>
              <Input 
                name='priceSell'
                defaultValue={priceSell ? priceSell.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}
                onSet={(e)=> handleValues(e)}
                placeholder={'R$ 0,00'}
                mask='currency'
                warning={errorFields.includes('priceSell')}
              />
          </div>       
        </div>

        {/* Input 4 */}
         <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Programa da venda:
            </div>
              <Dropdown 
                style={{zIndex: '999'}}
                selected={program}
                setSelected={setProgram}
                options={['Tudo Azul', 'Latam Pass', 'Smiles']}
                warning={errorFields.includes('program')}
              />
          </div>       
        </div>

        {/* Input 4 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Programa comprador das milhas:
            </div>
              <Dropdown 
                style={{zIndex: '999'}}
                selected={programBuyer}
                setSelected={setProgramBuyer}
                options={['Hotmilhas', 'Max Milhas', 'Outros']}
                warning={errorFields.includes('programBuyer')}
              />
          </div>       
        </div>

        {/* Input 5 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Selecione a conta da venda:
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

        {/* Input 6 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Data da venda:
            </div>
              <Input 
                name='dateSell'
                value={dateSell ? dateSell : ''}
                onSet={(e)=> handleValues(e)}
                placeholder={'Ex.: 01/01/2023'}
                mask='date'
                warning={errorFields.includes('dateSell')}
              />
          </div>       
        </div>

         {/* Input 5 */}
         <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Prazo de recebimento (em dias):
            </div>
              <Input 
                name='receipt'
                defaultValue={receipt ? receipt : ''}
                onSet={(e)=> handleValues(e)}
                placeholder={'Ex.: 150 dias'}
                mask='miles'
              />
          </div>       
        </div>

        {/* Input 6 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Data do recebimento:
            </div>
              <Input 
                name='dateReceipt'
                value={dateReceipt ? dateReceipt : ''}
                onSet={(e)=> handleValues(e)}
                placeholder={'Ex.: 20/05/2023'}
                mask='date'
              />
          </div>       
        </div>
        

      </div> 
      {/* Input's end */}
    
      {/* Results */}
      <div className={styles.titleResults} style={{paddingTop: '32px'}}>Resumo da venda</div>
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
          <div className={styles.values}>{priceBuy ? priceBuy.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Valor recebido pela venda:</div>
          <div className={styles.values}>{priceSell ? priceSell.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Programa da venda:</div>
          <div className={styles.values}>{program ? program : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Vendido para:</div>
          <div className={styles.values}>{programBuyer ? programBuyer : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Data da venda:</div>
          <div className={styles.values}>{dateSell ? dateSell : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Prazo de recebimento:</div>
          <div className={styles.values}>{receipt ? receipt+' dias' : ''}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn} style={{border: 'none'}}>
          <div className={styles.titleValues}>Data do recebimento:</div>
          <div className={styles.values}>{dateReceipt ? dateReceipt : ''}</div>
        </div>        
      </div>

      {profit > 0  && 
        
        <div className={styles.contentRow}>
          <div className={styles.contentColumn} style={{border: 'none', borderTop: '1px solid #DCE7FF'}}>
            <div className={styles.titleValues} style={{color: '#6A9000', fontWeight: 600}}>Lucro estimado:</div>
            <div className={styles.values} style={{color: '#6A9000', fontWeight: '600', fontSize: '14px'}}>{profit.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
          </div>        
        </div>
      }

      {profit == 0 ? 
        <div className={styles.contentRow}>
          <div className={styles.contentColumn} style={{border: 'none', borderTop: '1px solid #DCE7FF'}}>
            <div className={styles.titleValues} style={{color: '#F29E05', fontWeight: 600}}>Lucro estimado:</div>
            <div className={styles.values} style={{color: '#F29E05', fontWeight: '600', fontSize: '14px'}}>{profit.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
          </div>        
        </div> 
      : ''
      }

      {profit < 0 &&
        <div className={styles.contentRow}>
          <div className={styles.contentColumn} style={{border: 'none', borderTop: '1px solid #DCE7FF'}}>
            <div className={styles.titleValues} style={{color: '#D92B05', fontWeight: 600}}>Prejuízo estimado:</div>
            <div className={styles.values} style={{color: '#D92B05', fontWeight: '600', fontSize: '14px'}}>{profit.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
          </div>        
        </div>
      }

      {percentageProfit > 0 ?
        (<div className={styles.contentRow}>
          <div className={styles.contentColumn} style={{border: 'none', borderTop: '1px solid #DCE7FF'}}>
            <div className={styles.titleValues}>Em percentual:</div>
            <div className={styles.values}>{'+'+percentageProfit.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%'}</div>
          </div>        
        </div>) : ''
      } 

      {percentageProfit == 0 ? 
        (priceSell ? 
        <div className={styles.contentRow}>
          <div className={styles.contentColumn} style={{border: 'none', borderTop: '1px solid #DCE7FF'}}>
            <div className={styles.titleValues}>Em percentual:</div>
            <div className={styles.values}>{percentageProfit.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%'}</div>
          </div>        
        </div> : '' ) 
        : ''
      } 

      {percentageProfit < 0 ?
        (<div className={styles.contentRow}>
          <div className={styles.contentColumn}style={{border: 'none', borderTop: '1px solid #DCE7FF'}}>
            <div className={styles.titleValues}>Em percentual:</div>
            <div className={styles.values}>{percentageProfit.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%'}</div>
          </div>        
        </div>) : ''
      }       
      
      </div>
      {/* Results end */}
      
      {/* Button and actions */}
      <div className={styles.btn}>
        <Button 
          label= 'Atualizar venda'
          backgroundColor='#26408C'
          backgroundColorHover='#4D69A6'
          onClick={handleSubmit}
        />
      </div>


    </div>

  </></Layout>  
  </>)
}

export default EditarVendaMilhas;

type Props = {
  user: User; 
  accounts: Account[];
  selledMiles: SellMiles;
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  const { editsellmiles } = context.query;

  if(!session) return { redirect: { destination: '/login', permanent: true }}; 

  /* Get tenant */
  const user = await api.getUser(session.user.id)
  if(!user){
    return {
      redirect: {destination:'/', permanent: false}
    }
  } 

  /* Get accounts */
  const accounts = await apiAccounts.getAccounts(session.user.id);

  /* Get one selled miles */
 const selledMiles = await apiSellMiles.getOneMilesSelled(parseInt(editsellmiles as string));
   
  return {
    props: {
      user,
      accounts: JSON.parse(JSON.stringify(accounts)),
      selledMiles: JSON.parse(JSON.stringify(selledMiles))
    }
  }
}