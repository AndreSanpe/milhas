import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import React, { useCallback, useState } from 'react'
import ButtonBack from '../../../components/ButtonBack';
import Input from '../../../components/Input';
import InputSelect from '../../../components/InputSelect';
import Layout from '../../../components/Layout';
import api from '../../../libs/api';
import { User } from '../../../types/User';
import { authOptions } from '../../api/auth/[...nextauth]';
import styles from './styles.module.css';


const CustoMilheiro = (data: Props) => {

  /* useState constructs an object with all data received in inputs. */
  const [ values, setValues ] = useState({});

  /* Function that handles string values */
  const handleValuesStrings = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.currentTarget.name]: e.currentTarget.value
    }) 
  }, [values])
  
  console.log(values)

  return (<>

  <Head>
    <title>Calculadora . TOOLMILHAS</title>
  </Head>
  <Layout><>

    <div className={styles.container}>
      <ButtonBack />
      <div className={styles.title}>Calcular: 
        <span style={{color: '#BF066D'}}>custo do milheiro</span>
      </div>

      <div className={styles.inputs}>
        
        {/* Input 1 */}
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.label}>
              Valor investido na compra:
            </div>
              <Input 
                name='currency'
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
                name='miles'
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
              <InputSelect 
                optionOne='Livelo'
                labelOne='Livelo'
              />
          </div>       
        </div>


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