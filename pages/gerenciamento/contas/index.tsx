import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import React, { useCallback, useEffect, useState } from 'react';
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

type Account = {
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
  const [ noHaveAccount, setNoHaveAccount ] = useState<boolean>(false);
  const [ showModal, setShowModal ] = useState<boolean>(false);
  const [ errorFields, setErrorFields ] = useState<string[]>([]);

  /* Sending user data to context */
  useEffect(() => {
    if(user === null || user != data.user) {
      setUser(data.user)
    }
  }, [data, user, setUser]);


 /* Modal actions */
  const handleClick = () => setShowModal(true);
  const closeBtn = () => { 
    setShowModal(false);
    setValues({ name: '', document: '', livelo: false, statusLivelo: false, priceLivelo: '0', esfera: false, statusEsfera: false, priceEsfera: '0', azul: false, statusAzul: false, priceAzul: '0', latam: false, statusLatam: false, priceLatam: '0', smiles: false, statusSmiles: false, priceSmiles: '0'});
    setErrorFields([]);
  }

  /* useState constructs an object with all data received in inputs. */
  const [ values, setValues ] = useState<Account>({
    name: '', document: '', livelo: false, statusLivelo: false, priceLivelo: '0', esfera: false, statusEsfera: false, priceEsfera: '0', azul: false, statusAzul: false, priceAzul: '0', latam: false, statusLatam: false, priceLatam: '0', smiles: false, statusSmiles: false, priceSmiles: '0'
  });

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
 
  /* verify each default entry, if exists errors, push to array */
  const verifyData = () => {
    let newErroFields = [];
    let approved = true;

    if(values.name.length < 2 || values.name === '') {
      newErroFields.push('name');
      approved = false;
    }

    if(values.document === '' || values.document.length !== 14) {
      newErroFields.push('document');
      approved=false
    }

    setErrorFields(newErroFields);
    return approved;
  }

  /* Once verified, send to the database */
  const handleSubmit = async () => {
    if(verifyData() && user) {
      let account = {
        name: values.name,
        document: values.document,
        livelo: values.livelo,
        statusLivelo: values.statusLivelo,
        priceLivelo: values.priceLivelo,
        esfera: values.esfera,
        statusEsfera: values.statusEsfera,
        priceEsfera: values.priceEsfera,
        azul: values.azul,
        statusAzul: values.statusAzul,
        priceAzul: values.priceAzul,
        latam: values.latam,
        statusLatam: values.statusLatam,
        priceLatam: values.priceLatam,
        smiles: values.smiles,
        statusSmiles: values.statusSmiles,
        priceSmiles: values.priceSmiles,
        userId: user.id 
      }
          
      const response = await fetch('/api/accounts', {
        method: 'POST',
        body: JSON.stringify(account),
        headers: {
          'content-Type': 'application/json',
        },
      });
      closeBtn();
    }
  }
 
  return (<>
    <Head>
      <title>Gerenciamento . TOOLMILHAS</title>
    </Head>
    <Layout><>

      <div className={styles.container}>      
        <ButtonBack />
        <div className={styles.title}>Contas cadastradas</div>

        {data.accounts.map((item, index) => (
          <Content key={index} ><>

          {/* Conteúdo que ficará visivel */}
          <div className={styles.row}>
            <div className={styles.column}>
              <div className={styles.doubleColumns}>
                <div className={styles.secundaryTitle}>Nome da conta:</div>
                <div className={styles.text}>{item.name}</div>
              </div>
              <div className={styles.doubleColumns}>
                <div className={styles.secundaryTitle}>Documento CPF:</div>
                <div className={styles.text}>{item.document}</div>
              </div>
            </div>
          </div>  

          {/* Conteúdo que ficará escondido */}
          <div className={styles.dataAccount}>
            <div className={styles.row}>
              <div className={styles.column}>

                {/* Content data title */}
                <div className={styles.tripleColumns}>
                  <div className={styles.contentTitle}>Clubes</div>
                  <div className={styles.contentTitle}>Clube ativo</div>
                  <div className={styles.contentTitle}>Valor mensal</div>
                </div>

                {/* Data: Livelo */}
                <div className={styles.tripleColumns}>
                  <div className={styles.text}>Livelo</div>
                  <div className={styles.text}>{item.statusLivelo ? 'SIM':'NÃO'}</div>
                  <div className={styles.text}>{item.priceLivelo}</div>
                </div>

                {/* Data: Esfera */}
                <div className={styles.tripleColumns}>
                  <div className={styles.text}>Esfera</div>
                  <div className={styles.text}>{item.statusEsfera ? 'SIM':'NÃO'}</div>
                  <div className={styles.text}>{item.priceEsfera}</div>
                </div>

                {/* Data: Azul */}
                <div className={styles.tripleColumns}>
                  <div className={styles.text}>Tudo Azul</div>
                  <div className={styles.text}>{item.statusAzul ? 'SIM':'NÃO'}</div>
                  <div className={styles.text}>{item.priceAzul}</div>
                </div>

                {/* Data: Latam */}
                <div className={styles.tripleColumns}>
                  <div className={styles.text}>Latam Pass</div>
                  <div className={styles.text}>{item.statusLatam ? 'SIM':'NÃO'}</div>
                  <div className={styles.text}>{item.priceLatam}</div>
                </div>

                {/* Data: Smiles */}
                <div className={styles.tripleColumns}>
                  <div className={styles.text}>Smiles</div>
                  <div className={styles.text}>{item.statusSmiles ? 'SIM':'NÃO'}</div>
                  <div className={styles.text}>{item.priceSmiles}</div>
                </div>

              </div>
            </div>  
          </div>


          </></Content>
        ))} {/* Maps end */}

  
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
                        warning={errorFields.includes('name')}
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
                        warning={errorFields.includes('document')}
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
                  onClick={handleSubmit}
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
        
      </div>

    </></Layout>
    </>)
}

export default Contas;

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