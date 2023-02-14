import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import React, { useCallback, useEffect, useState } from 'react'
import Button from '../../../components/Button';
import ButtonBack from '../../../components/ButtonBack';
import ContentAccordion from '../../../components/ContentAccordion';
import Dropdown from '../../../components/Dropdown';
import Input from '../../../components/Input';
import InputSelect from '../../../components/InputSelect';
import Layout from '../../../components/Layout';
import Toggle from '../../../components/Toggle';
import api from '../../../libs/api';
import { User } from '../../../types/User';
import { authOptions } from '../../api/auth/[...nextauth]';
import styles from './styles.module.css';


const CustoMilheiro = (data: Props) => {

  /* useState constructs an object with all data received in inputs. */
  const [ values, setValues ] = useState({price: 'R$ 0,00', pointsQuantity: '0', program: '', transfer: false, destiny:'', percentage: '0'});
  const [ toggled, setToggled ] = useState(false);

  /* Auxiliary states */
  const [ program, setProgram ] = useState('');
  const [ destiny, setDestiny ] = useState('');
  const [ miles, setMiles ] = useState<number>();
  const [ finalPrice, setFinalPrice ] = useState<number>();


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
    
    console.log(price, points, percentage, miles)

  }, [miles, values.percentage, values.pointsQuantity, values.price])

  
  console.log(finalPrice)

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

        {/* input 5 */}
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

        {/* Input 6 */}
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
      </div> {/* Input's end */}
    
      <div className={styles.titleResults} style={{paddingTop: '32px'}}>Resultado</div>
      {/* Results */}
      <div className={styles.results}>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Valor investido:</div>
          <div className={styles.values}>{values.price}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Total de pontos comprados:</div>
          <div className={styles.values}>{values.pointsQuantity}</div>
        </div>        
      </div>

      <div className={styles.contentRow}>
        <div className={styles.contentColumn}>
          <div className={styles.titleValues}>Total após transferência:</div>
          <div className={styles.values}>{miles ? miles.toLocaleString('pt-BR') : '-'}</div>
        </div>        
      </div>

      <div className={styles.contentRow} style={{borderTop: '1px solid #DCE7FF', paddingTop: '8px', marginTop: '8px'}}>
        <div className={styles.contentColumn}>
          <div style={{fontWeight: '600'}}>Valor final do milheiro:</div>
          <div className={styles.values} style={{color: '#6A9000', fontWeight: '600'}}>{finalPrice ? finalPrice.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'R$ 0,00'}</div>
        </div>        
      </div>

      </div>
      
      <div className={styles.btn}>
        <Button 
          label= 'Salvar como compra'
          backgroundColor='#26408C'
          backgroundColorHover='#4D69A6'
        />
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