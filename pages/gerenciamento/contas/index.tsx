import { GetServerSideProps } from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import { useAuthContext } from '../../../contexts/auth';
import api from '../../../libs/api';
import { User } from '../../../types/User';
import { authOptions } from '../../api/auth/[...nextauth]';
import styles from './styles.module.css';
import ButtonBack from '../../../components/ButtonBack';
import Content from '../../../components/Content';
import AlertIcon from './error_outline.svg';
import Button from '../../../components/Button';
import FormModal from '../../../components/FormModal';
import Input from '../../../components/Input';
import Toggle from '../../../components/Toggle';
import Checkbox from '../../../components/Checkbox';

interface Account {
  name: string;
  document: string;
  livelo: boolean;
  statusLivelo: boolean;
  priceLivelo: string;
  esfera: boolean;
  statusEsfera: boolean;
  priceEsfera: string;
  azul: boolean;
  statusAzul: boolean;
  priceAzul: string;
  latam: boolean;
  statusLatam: boolean;
  priceLatam: string;
  smiles: boolean;
  statusSmiles: boolean;
  priceSmiles: string;
}


const Contas = (data: Props) => {

  const { user, setUser } = useAuthContext();
  const [ noHaveAccount, setNoHaveAccount ] = useState<boolean>(true);
  const [ showModal, setShowModal ] = useState<boolean>(false);
 
  const [ nameAccount, setNameAccount ] = useState<string>('');
  const [ cpfAccount, setCpfAccount ] = useState<string>('');
  const [ livelo, setLivelo ] = useState<boolean>(false);
  const [ statusLivelo, setStatusLivelo ] = useState<boolean>(false);
  const [ priceLivelo, setPriceLivelo ] = useState<string>('');
  const [ esfera, setEsfera ] = useState<boolean>(false);
  const [ statusEsfera, setStatusEsfera ] = useState<boolean>(false);
  const [ priceEsfera, setPriceEsfera ] = useState<string>('');
  const [ azul, setAzul ] = useState<boolean>(false);
  const [ statusAzul, setStatusAzul ] = useState<boolean>(false);
  const [ priceAzul, setPriceAzul ] = useState<string>('');
  const [ latam, setLatam ] = useState<boolean>(false);
  const [ statusLatam, setStatusLatam ] = useState<boolean>(false);
  const [ priceLatam, setPriceLatam ] = useState<string>('');
  const [ smiles, setSmiles ] = useState<boolean>(false);
  const [ statusSmiles, setStatusSmiles ] = useState<boolean>(false);
  const [ priceSmiles, setPriceSmiles ] = useState<string>('');


  /* Area de testes */
  const [ values, setValues ] = useState<Account>({
    name: '', document: '', livelo: false, statusLivelo: false, priceLivelo: '0', esfera: false, statusEsfera: false, priceEsfera: '0', azul: false, statusAzul: false, priceAzul: '0', latam: false, statusLatam: false, priceLatam: '0', smiles: false, statusSmiles: false, priceSmiles: '0'
  });

  const handleValuesStrings = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.currentTarget.name]: e.currentTarget.value
    }) 
  }, [values])

  const handleValuesBooleans = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.checked
    }) 
  }, [values])

  console.log(values)

  //Modal actions
  const handleClick = () => setShowModal(true);
  const closeBtn = () => setShowModal(false);
 
  useEffect(() => {
    if(user === null || user != data.user) {
      setUser(data.user)
    }
  }, [data, user, setUser]);

  return (<>
    <Head>
      <title>Gerenciamento . TOOLMILHAS</title>
    </Head>
    <Layout><>

      <div className={styles.container}>      
        <ButtonBack />
        <div className={styles.title}>Contas cadastradas</div>

        {/* Message for when there is no registered account yet */}
        {noHaveAccount &&
          <div className={styles.alert}>
            <AlertIcon />
            <div>Você ainda não cadastrou nenhuma conta. Gostaria de fazer isso agora? 
            {/* <span className={styles.link} onClick={()=> {}}>Clique aqui</span> */}
            </div>
          </div>
        }

        {/* Modal to register new account */}
        {showModal &&
          <FormModal maxWidth={'340px'} maxHeight={'1500px'} closeButton handleClick={closeBtn}>
            <div className={styles.containerModal}>
              <div className={styles.titleModal}>Cadastrar nova conta</div>
              
              <div className={styles.inputs}>
              
                <div className={styles.row}>
                  <div className={styles.column}>
                    <div className={styles.label}>Nome da conta:</div>
                      <Input 
                        name='name'
                        onSet={(e)=> handleValuesStrings(e)}
                        placeholder={'Ex.: Antônio Garcia'}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.column}>
                    <div className={styles.label}>Documento CPF:</div>
                      <Input 
                        name='document'
                        onSet={(e) => handleValuesStrings(e)}
                        placeholder={'Ex.: 123.123.123-12'}
                        mask='cpf'
                      />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.column}>
                    <div className={styles.label}>Selecione os clubes que a conta possui:</div>
                  </div>
                </div>

                {/* LIVELO: Template with 1 row, 1 column with 3 new columns */}
                <div className={styles.row}>
                  <div className={styles.column}>
                    <div className={styles.columns}>
                      <div className={styles.label} style={{color: '#3B0585'}}>Clubes:</div>
                      <div className={styles.label} style={{color: '#3B0585'}}>Assinatura:</div>
                      <div className={styles.labelAux}>Valor:</div>
                    </div>
                    <div className={styles.columns}>
                      {/* Column 1 */}
                      <div className={styles.checkbox}>
                        <Checkbox 
                          name='livelo'
                          label='Livelo'
                          initialValue={values.livelo}
                          onSet={(e) => handleValuesBooleans(e)}
                        />
                      </div>
                      {/* Column 2 */}
                      <div className={styles.status}>
                        <Toggle 
                          name='statusLivelo'
                          initialValue={values.statusLivelo}
                          onSet={(e) => handleValuesBooleans(e)}
                        />
                      </div>
                      {/* Column 3 */}
                      <div className={styles.price}>
                        <Input
                          name='priceLivelo' 
                          style={{width: '70px'}}
                          onSet={(e) => handleValuesStrings(e)}
                          placeholder={'R$ 0,00'}
                          mask='currency'
                          disabled={!values.statusLivelo}
                        />
                      </div>
                    </div>
                  </div>  
                </div>

                {/* ESFERA: Template with 1 row, 1 column with 3 new columns */}
                <div className={styles.row}>
                  <div className={styles.column}>
                    <div className={styles.columns}>
                      {/* Column 1 */}
                      <div className={styles.checkbox}>
                        <Checkbox 
                          name='esfera'
                          label='Esfera'
                          initialValue={values.esfera}
                          onSet={(e) => handleValuesBooleans(e)}
                        />
                      </div>
                      {/* Column 2 */}
                      <div className={styles.status}>
                        <Toggle 
                          name='statusEsfera'
                          initialValue={values.statusEsfera}
                          onSet={(e) => handleValuesBooleans(e)}
                        />
                      </div>
                      {/* Column 3 */}
                      <div className={styles.price}>
                        <Input
                          name='priceEsfera' 
                          style={{width: '70px'}}
                          onSet={(e) => handleValuesStrings(e)}
                          placeholder={'R$ 0,00'}
                          mask='currency'
                        />
                      </div>
                    </div>
                  </div>  
                </div>

                {/* AZUL: Template with 1 row, 1 column with 3 new columns */}
                <div className={styles.row}>
                  <div className={styles.column}>
                    <div className={styles.columns}>
                      {/* Column 1 */}
                      <div className={styles.checkbox}>
                        <Checkbox 
                          name='azul'
                          label='Tudo Azul'
                          initialValue={values.azul}
                          onSet={(e) => handleValuesBooleans(e)}
                        />
                      </div>
                      {/* Column 2 */}
                      <div className={styles.status}>
                        <Toggle 
                          name='statusAzul'
                          initialValue={values.statusAzul}
                          onSet={(e) => handleValuesBooleans(e)}
                        />
                      </div>
                      {/* Column 3 */}
                      <div className={styles.price}>
                        <Input
                          name='priceAzul' 
                          style={{width: '70px'}}
                          onSet={(e) => handleValuesStrings(e)}
                          placeholder={'R$ 0,00'}
                          mask='currency'
                        />
                      </div>
                    </div>
                  </div>  
                </div>
                
                {/* LATAM: Template with 1 row, 1 column with 3 new columns */}
                <div className={styles.row}>
                  <div className={styles.column}>
                    <div className={styles.columns}>
                      {/* Column 1 */}
                      <div className={styles.checkbox}>
                        <Checkbox 
                          name='latam'
                          label='Latam Pass'
                          initialValue={values.latam}
                          onSet={(e) => handleValuesBooleans(e)}
                        />
                      </div>
                      {/* Column 2 */}
                      <div className={styles.status}>
                        <Toggle 
                          name='statusLatam'
                          initialValue={values.statusLatam}
                          onSet={(e) => handleValuesBooleans(e)}
                        />
                      </div>
                      {/* Column 3 */}
                      <div className={styles.price}>
                        <Input
                          name='priceLatam' 
                          style={{width: '70px'}}
                          onSet={(e) => handleValuesStrings(e)}
                          placeholder={'R$ 0,00'}
                          mask='currency'
                        />
                      </div>
                    </div>
                  </div>  
                </div>

                {/* SMILES: Template with 1 row, 1 column with 3 new columns */}
                <div className={styles.row}>
                  <div className={styles.column}>
                    <div className={styles.columns}>
                      {/* Column 1 */}
                      <div className={styles.checkbox}>
                        <Checkbox 
                          name='smiles'
                          label='Smiles'
                          initialValue={values.smiles}
                          onSet={(e) => handleValuesBooleans(e)}
                        />
                      </div>
                      {/* Column 2 */}
                      <div className={styles.status}>
                        <Toggle 
                          name='statusSmiles'
                          initialValue={values.statusSmiles}
                          onSet={(e) => handleValuesBooleans(e)}
                        />
                      </div>
                      {/* Column 3 */}
                      <div className={styles.price}>
                        <Input
                          name='priceSmiles' 
                          style={{width: '70px'}}
                          onSet={(e) => handleValuesStrings(e)}
                          placeholder={'R$ 0,00'}
                          mask='currency'
                        />
                      </div>
                    </div>
                  </div>  
                </div>
          
              </div> {/* Inputs end */}

              <div className={styles.btnModal}>
                <Button 
                  backgroundColor='#86B700'
                  label='Salvar dados'
                  color='#fff'
                  backgroundColorHover='#6A9000'
                />
              </div>
            
            </div>
          </FormModal>
        }
        
        <div style={{margin: '52px'}}>
          <Button 
            label={'Adicionar nova conta'}
            backgroundColor={'#4C109D'}
            backgroundColorHover={'#5E1FB5'}
            color={'#FAF7FF'}
            onClick={handleClick}
          />
        </div>
        
        
        <Content>
          <div>...</div>
        </Content>
      </div>

    </></Layout>
    </>)
}

export default Contas;

type Props = {
  user: User;  
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if(!session) return { redirect: { destination: '/login', permanent: true }}; 

  // Get tenant
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