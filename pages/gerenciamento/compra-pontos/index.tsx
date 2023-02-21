import { GetServerSideProps } from 'next';
import { Account, unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import React, { use, useCallback, useEffect, useState } from 'react'
import Button from '../../../components/Button';
import ButtonBack from '../../../components/ButtonBack';
import Dropdown from '../../../components/Dropdown';
import FormModal from '../../../components/FormModal';
import Input from '../../../components/Input';
import Layout from '../../../components/Layout';
import Toggle from '../../../components/Toggle';
import { useAccountsContext } from '../../../contexts/accounts';
import api from '../../../libs/api';
import { User } from '../../../types/User';
import { authOptions } from '../../api/auth/[...nextauth]';
import styles from './styles.module.css';


const CompraPontos = (data: Props) => {
  
  /* ContextApi: accounts  */
  const { accounts, setAccounts } = useAccountsContext();
  useEffect(() => {
    if(accounts === null || accounts as [] !== data.accounts) {
      setAccounts(data.accounts as any)
    }
  }, [data, accounts, setAccounts]);

   /* List accounts */
  const optionsAccounts: string[] = [];
  if(accounts) {
    accounts.map((item, index) => {
      if(item.name) {
        optionsAccounts.push(item.name)
      } else {
        optionsAccounts.push('Não há contas cadastradas')
      }
    })  
  }

  /* useState constructs an object with all data received in inputs. */
  const [ values, setValues ] = useState({price: '', pointsQuantity: '0', program: '', transfer: false, destiny:'', percentage: '', creditCard: ''});
  const [ toggled, setToggled ] = useState(false);

  /* Auxiliary states for calculate*/
  const [ program, setProgram ] = useState('');
  const [ destiny, setDestiny ] = useState('');
  const [ miles, setMiles ] = useState<number>();
  const [ finalPrice, setFinalPrice ] = useState<number>();
  const [ selectedAccount, setSelectedAccount ] = useState('');
  const [ parcel, setParcel ] = useState('1');
  const [ month, setMonth ] = useState('')
  
  /* States modal */
  const [ showModal, setShowModal ] = useState<boolean>(false);

  /* Function that handles string values */
  const handleValuesStrings = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.currentTarget.name]: e.currentTarget.value
    }) 
  }, [values])

   /* Function that handles booleans values */
   const handleValuesBooleans = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.checked
    }) 
  }, [values])
  
  /* Calculation after transfer */
  useEffect(()=> {
    if (values.percentage !== '0') {
      const calcMiles = (((parseInt(values.percentage)) + 100)/100 * parseInt(values.pointsQuantity.replace(/(\.)/g, '')));
      setMiles(calcMiles);
    } else {
      setMiles(0);
    }
  }, [values.percentage, values.pointsQuantity])

   /* Calculation price */
   useEffect(()=> {
    const price = parseFloat(values.price.replace('R$ ', '').replace('.', '').replace(',', '.'));
    const points = parseInt(values.pointsQuantity.replace(/(\.)/g, ''));
    const percentage = parseInt(values.percentage);

    if(!miles && price && !Number.isNaN(price) && points && !Number.isNaN(points)) {
      const simpleCalc = ((price) / ((points)/1000));
      setFinalPrice(simpleCalc);
    } 

    else if (miles && !Number.isNaN(miles) && !Number.isNaN(price) && points && !Number.isNaN(points) && percentage && !Number.isNaN(percentage)){
      const completeCalc = ((price) / ((miles)/1000));
      setFinalPrice(completeCalc);
    } 

    else {
      setFinalPrice(0);
    }

  }, [miles, values.percentage, values.pointsQuantity, values.price])

  
 
  return (<>

  <Head>
    <title>Compra de Pontos . TOOLMILHAS</title>
  </Head>
  <Layout><>

    <div className={styles.container}>
      
      <ButtonBack />
      <div className={styles.title}>Gerenciar: 
        <span style={{color: '#F25C05'}}>compra de pontos e milhas</span>
      </div>

      <div className={styles.inputs}>
        
        {/* Input 1 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Valor investido na compra:
            </div>
              <Input 
                value={ values.price}
                name='price'
                onSet={(e)=> handleValuesStrings(e)}
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
                onSet={(e)=> handleValuesStrings(e)}
                placeholder={'Ex.: 1.000'}
                mask='miles'
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
                options={optionsAccounts}
              />
          </div>       
        </div>

        {/* Link */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label} style={{color: '#525252', display: 'flex' ,justifyContent: 'flex-end'}}>
              Ainda nao cadastrou uma conta?
            </div>
            <div className={styles.linkAux}>
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
                onSet={(e)=> handleValuesStrings(e)}
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

        {/* Input X */}
        <div className={styles.row} >
          <div className={styles.toggle}>
            <div className={styles.label} style={{fontSize: '14px'}}>
              Haverá transferência de pontos?
            </div>
            <Toggle 
              name='transfer'
              initialValue={values.transfer}
              onSet={(e) => {handleValuesBooleans(e)}}
            />
          </div>   
        </div>

        {values.transfer && <>

        {/* input X */}
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

        {/* Input X */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Bônus da transferência em %:
            </div>
              <Input 
                name='percentage'
                onSet={(e)=> handleValuesStrings(e)}
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
          <div className={styles.values}>099.247.576-42</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Valor investido:</div>
          <div className={styles.values}>{values.price}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Cartão utilizado:</div>
          <div className={styles.values}>{values.creditCard}</div>
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
          <div className={styles.values}>{values.pointsQuantity}</div>
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
          <div className={styles.values}>{values.percentage ? values.percentage + '%' : ''}</div>
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
          onClick={() => setShowModal(true)}
        />
      </div>

      <div className={styles.linkClean} onClick={() => document.location.reload()}>
        Limpar e refazer simulação
      </div>

      {/* Modal to register new buy */}
      {showModal &&
      <FormModal 
        maxWidth={'340px'} 
        maxHeight={'1500px'} 
        closeButton handleClick={() => setShowModal(false)}
      >

        <div className={styles.containerModal}>
          <div className={styles.titleModal}>Informações da Compra</div>
          ...
        
        </div>

      </FormModal>
      
      }

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