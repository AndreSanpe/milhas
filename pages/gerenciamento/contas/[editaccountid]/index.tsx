import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../../../../components/Layout';
import api from '../../../../libs/api';
import { User } from '../../../../types/User';
import { authOptions } from '../../../api/auth/[...nextauth]';
import styles from './styles.module.css';
import ButtonBack from '../../../../components/ButtonBack';
import Button from '../../../../components/Button';
import FormModal from '../../../../components/FormModal';
import Input from '../../../../components/Input';
import Toggle from '../../../../components/Toggle';
import { useRouter } from 'next/router';
import { Account } from '../../../../types/Account';
import Title from '../../../../components/Title';
import apiAccounts from '../../../../libs/apiAccounts';


const EditarConta = (data: Props) => {

  /* Router ///////////////////////////////////////////////////////////////////////////////*/
  const router = useRouter();

  /* General states //////////////////////////////////////////////////////////////////*/
  const [ errorFields, setErrorFields ] = useState<string[]>([]);
  
  /* Input states //////////////////////////////////////////////////////////////////// */
  const [ name, setName ] = useState<string>(data.account.name);
  const [ cpf, setCpf ] = useState<string>(data.account.document);
  const [ statusLivelo, setStatusLivelo ] = useState<boolean>(data.account.statusLivelo);
  const [ priceLivelo, setPriceLivelo ] = useState<number>(data.account.priceLivelo);
  const [ statusEsfera, setStatusEsfera ] = useState<boolean>(data.account.statusEsfera);
  const [ priceEsfera, setPriceEsfera ] = useState<number>(data.account.priceEsfera);
  const [ statusAzul, setStatusAzul ] = useState<boolean>(data.account.statusAzul);
  const [ priceAzul, setPriceAzul ] = useState<number>(data.account.priceAzul);
  const [ statusLatam, setStatusLatam ] = useState<boolean>(data.account.statusLatam);
  const [ priceLatam, setPriceLatam ] = useState<number>(data.account.priceLatam);
  const [ statusSmiles, setStatusSmiles ] = useState<boolean>(data.account.statusSmiles);
  const [ priceSmiles, setPriceSmiles ] = useState<number>(data.account.priceSmiles);

  /* Functions of handle input values ///////////////////////////////////////////////////*/
  const handleValues = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    switch(e.currentTarget.name) {
      case 'name':
        setName(e.currentTarget.value);
        return;
      case 'document':
        setCpf(e.currentTarget.value);
        return;
      case 'priceLivelo':
        const priceL = parseFloat((e.currentTarget.value).replace('R$ ', '').replace('.', '').replace(',', '.'));
        setPriceLivelo(priceL);
        return;
      case 'priceEsfera':
        const priceE = parseFloat((e.currentTarget.value).replace('R$ ', '').replace('.', '').replace(',', '.'));
        setPriceEsfera(priceE);
        return;
      case 'priceAzul':
        const priceA = parseFloat((e.currentTarget.value).replace('R$ ', '').replace('.', '').replace(',', '.'));
        setPriceAzul(priceA);
        return;
      case 'priceLatam':
        const priceLP = parseFloat((e.currentTarget.value).replace('R$ ', '').replace('.', '').replace(',', '.'));
        setPriceLatam(priceLP);
        return;
      case 'priceSmiles':
        const priceS = parseFloat((e.currentTarget.value).replace('R$ ', '').replace('.', '').replace(',', '.'));
        setPriceSmiles(priceS);
        return;
    }
  },[]);

  const handleBooleans = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    switch(e.currentTarget.name) {
      case 'statusLivelo':
        setStatusLivelo(e.currentTarget.checked);
        return;
      case 'statusEsfera':
        setStatusEsfera(e.currentTarget.checked);
        return;
      case 'statusAzul':
        setStatusAzul(e.currentTarget.checked);
        return;
      case 'statusLatam':
        setStatusLatam(e.currentTarget.checked);
        return;
      case 'statusSmiles':
        setStatusSmiles(e.currentTarget.checked);
        return;
    }
  },[]);

   /* useEffect protecting from results in NaN format /////////////////////////////////////*/
  useEffect(() => {
    if(Number.isNaN(priceLivelo)) {
      setPriceLivelo(0);
    }
    if(Number.isNaN(priceEsfera)) {
      setPriceEsfera(0);
    }
    if(Number.isNaN(priceAzul)) {
      setPriceAzul(0);
    }
    if(Number.isNaN(priceLatam)) {
      setPriceLatam(0);
    }
    if(Number.isNaN(priceSmiles)) {
      setPriceSmiles(0);
    }
  },[priceAzul, priceEsfera, priceLatam, priceLivelo, priceSmiles]);

  /* useEffect clearing input values that are not active /////////////////////////////////*/
  useEffect(() => {
    if(!statusLivelo) {
      const inputValue = (document.getElementById('priceLivelo') as HTMLInputElement)?.value;
      if(inputValue) {
        (document.getElementById('priceLivelo') as HTMLInputElement).value = '';
        setPriceLivelo(0)
      }    
    }
    if(!statusEsfera) {
      const inputValue = (document.getElementById('priceEsfera') as HTMLInputElement)?.value;
      if(inputValue) {
        (document.getElementById('priceEsfera') as HTMLInputElement).value = '';
        setPriceEsfera(0)
      }    
    }
    if(!statusAzul) {
      const inputValue = (document.getElementById('priceAzul') as HTMLInputElement)?.value;
      if(inputValue) {
        (document.getElementById('priceAzul') as HTMLInputElement).value = '';
        setPriceAzul(0)
      }    
    }
    if(!statusLatam) {
      const inputValue = (document.getElementById('priceLatam') as HTMLInputElement)?.value;
      if(inputValue) {
        (document.getElementById('priceLatam') as HTMLInputElement).value = '';
        setPriceLatam(0)
      }    
    }
    if(!statusSmiles) {
      const inputValue = (document.getElementById('priceSmiles') as HTMLInputElement)?.value;
      if(inputValue) {
        (document.getElementById('priceSmiles') as HTMLInputElement).value = '';
        setPriceSmiles(0)
      }    
    }
  },[statusAzul, statusEsfera, statusLatam, statusLivelo, statusSmiles])

  /* verify each default entry, if exists errors, push to array */
  const verifyData = () => {
    let newErroFields = [];
    let approved = true;

    if(name.length < 2 || name === '') {
      newErroFields.push('name');
      approved = false;
    }

    if(cpf === '' || cpf.length !== 14) {
      newErroFields.push('document');
      approved=false
    }

    setErrorFields(newErroFields);
    return approved;
  }

  /* Once verified, send to the database */
  const handleSubmit = async () => {
    if(verifyData() && data.user) {
      let account = {
        id: data.account.id,
        name: name,
        document: cpf,
        statusLivelo: statusLivelo,
        priceLivelo: priceLivelo,
        statusEsfera: statusEsfera,
        priceEsfera: priceEsfera,
        statusAzul: statusAzul,
        priceAzul: priceAzul,
        statusLatam: statusLatam,
        priceLatam: priceLatam,
        statusSmiles: statusSmiles,
        priceSmiles: priceSmiles,
        userId: data.user.id 
      }
          
      const response = await fetch('/api/accounts', {
        method: 'PUT',
        body: JSON.stringify(account),
        headers: {
          'content-Type': 'application/json',
        },
      });
      setErrorFields([]);
      router.push('/gerenciamento/contas')
    }
  }

 
  return (<>
    <Head>
      <title>Editando conta . PlanMilhas</title>
    </Head>
    <Layout><>

      <div className={styles.container}>    

        <Title route='/gerenciamento/contas'>Editar dados da conta</Title>

        {/* Edit account */}
        <div className={styles.inputs}>
              
                <div className={styles.row}>
                  <div className={styles.column}>
                    <div className={styles.label}>Nome da conta:</div>
                      <Input 
                        name='name'
                        value={name}
                        onSet={(e)=> handleValues(e)}
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
                        value={cpf}
                        onSet={(e) => handleValues(e)}
                        placeholder={'Ex.: 123.123.123-12'}
                        mask='cpf'
                        warning={errorFields.includes('document')}
                      />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.column}>
                    <div className={styles.label}>Selecione os clubes ativos que a conta possui:</div>
                  </div>
                </div>

                {/* LIVELO: Template with 1 row, 1 column with 3 new columns */}
                <div className={styles.row}>
                  <div className={styles.column}>
                    <div className={styles.columns}>
                      <div className={styles.label} style={{color: '#26408C'}}>Clubes:</div>
                      <div className={styles.label} style={{color: '#26408C'}}>Assinatura:</div>
                      <div className={styles.labelAux}>Valor:</div>
                    </div>
                    <div className={styles.columns}>
                      {/* Column 1 */}
                      <div className={styles.checkbox}>
                        Livelo
                      </div>
                      {/* Column 2 */}
                      <div className={styles.status}>
                        <Toggle 
                          name='statusLivelo'
                          initialValue={statusLivelo}
                          onSet={(e) => handleBooleans(e)}
                        />
                      </div>
                      {/* Column 3 */}
                      <div className={styles.price}>
                        <Input
                          id='priceLivelo'
                          name='priceLivelo'
                          defaultValue={priceLivelo ? priceLivelo.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'R$ 0,00'}
                          style={{width: '70px'}}
                          onSet={(e) => handleValues(e)}
                          placeholder={'R$ 0,00'}
                          mask='currency'
                          disabled={!statusLivelo}
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
                        Esfera
                      </div>
                      {/* Column 2 */}
                      <div className={styles.status}>
                        <Toggle 
                          name='statusEsfera'
                          initialValue={statusEsfera}
                          onSet={(e) => handleBooleans(e)}
                        />
                      </div>
                      {/* Column 3 */}
                      <div className={styles.price}>
                        <Input
                          id='priceEsfera'
                          name='priceEsfera' 
                          defaultValue={priceEsfera ? priceEsfera.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'R$ 0,00'}
                          style={{width: '70px'}}
                          onSet={(e) => handleValues(e)}
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
                        Tudo Azul
                      </div>
                      {/* Column 2 */}
                      <div className={styles.status}>
                        <Toggle 
                          name='statusAzul'
                          initialValue={statusAzul}
                          onSet={(e) => handleBooleans(e)}
                        />
                      </div>
                      {/* Column 3 */}
                      <div className={styles.price}>
                        <Input
                          id='priceAzul'
                          name='priceAzul' 
                          defaultValue={priceAzul ? priceAzul.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'R$ 0,00'}
                          style={{width: '70px'}}
                          onSet={(e) => handleValues(e)}
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
                        Latam Pass
                      </div>
                      {/* Column 2 */}
                      <div className={styles.status}>
                        <Toggle 
                          name='statusLatam'
                          initialValue={statusLatam}
                          onSet={(e) => handleBooleans(e)}
                        />
                      </div>
                      {/* Column 3 */}
                      <div className={styles.price}>
                        <Input
                          id='priceLatam'
                          name='priceLatam'
                          defaultValue={priceLatam ? priceLatam.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'R$ 0,00'} 
                          style={{width: '70px'}}
                          onSet={(e) => handleValues(e)}
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
                        Smiles
                      </div>
                      {/* Column 2 */}
                      <div className={styles.status}>
                        <Toggle 
                          name='statusSmiles'
                          initialValue={statusSmiles}
                          onSet={(e) => handleBooleans(e)}
                        />
                      </div>
                      {/* Column 3 */}
                      <div className={styles.price}>
                        <Input
                          id='priceSmiles'
                          name='priceSmiles' 
                          defaultValue={priceSmiles ? priceSmiles.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : 'R$ 0,00'}
                          style={{width: '70px'}}
                          onSet={(e) => handleValues(e)}
                          placeholder={'R$ 0,00'}
                          mask='currency'
                        />
                      </div>
                    </div>
                  </div>  
                </div>
          
              </div> {/* Inputs end */}         
        
        <div style={{marginTop: '28px'}}>
          <Button 
            label={'Atualizar dados'}
            backgroundColor={'#26408C'}
            backgroundColorHover={'#4D69A6'}
            color={'#fff'}
            onClick={handleSubmit}
          />
        </div>

        <div className={styles.messageError}>
          {errorFields.length ? 'Campo(s) obrigatório(s), por favor preencha-o(s)!' : ''}
        </div>  
        
      </div>

    </></Layout>
    </>)
}

export default EditarConta;

type Props = {
  user: User;
  account: Account;  
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  const { editaccountid } = context.query;

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

  /* Get one account */
  const account = await apiAccounts.getAccount(session.user.id, editaccountid as string);
  
  return {
    props: {
      user,
      account: JSON.parse(JSON.stringify(account))
    }
  }
}