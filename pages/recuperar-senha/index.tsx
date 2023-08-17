import React, { useCallback, useState } from 'react';
import styles from './styles.module.css';
import Head from 'next/head';
import Input from '../../components/Input';
import Image from 'next/image';
import Logo from '../../public/logo_plamilhas.png';
import Button from '../../components/Button';
import { useRouter } from 'next/router';
import Loader from '../../components/Loader';
import DoneIcon from './done.svg';
import EmailRecovery from '../../emails/recovery';
import { render } from '@react-email/components';

const RecuperarSenha = () => {

  const router = useRouter();

  const [ loading, setLoading ] = useState<boolean>(false);
  const [ email, setEmail ] = useState('');
  const [ errorFields, setErrorFields ] = useState<string[]>([]);
  const [ emailSent, setEmailSent ] = useState<boolean>(false);
  
  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    if(e.currentTarget.name === 'email') {
      setEmail(e.currentTarget.value)
    }
  }, [])
  
  //verify each default entry, if exists errors, push to array
  const verifyUser = () => {
    let newErroFields = [];
    let approved = true;

    const emailRegexp = /[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;

    if(email === '' || !email.match(emailRegexp)){
      newErroFields.push('email');
      approved = false;
    }

    setErrorFields(newErroFields);
    return approved;
  }

  const handleSubmit = async () => {
  
    if(verifyUser()) {
      setErrorFields([]);
      setLoading(true);

      let dataUser = {
        email
      }

      const response = await fetch('/api/recovery', {
        method: 'POST',
        body: JSON.stringify(dataUser),
        headers: {
          'content-Type': 'application/json',
        },
      }); 

      const delay = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms))
      }
  
      const alert = async () => {
        setLoading(false);
        setEmailSent(true);
        await delay(5000);
        router.push('/login')
      }
  
      alert();
    } 
  }

return (<>
    
    <Head>
      <title>Recuperar senha . PlanMilhas</title>
    </Head>

    <div className={styles.container}>
      <div className={styles.loginArea}> 

        <Image 
        src={Logo}
        width={180}
        height={35}
        alt=''
        priority={true}
        className={styles.image}
        />

        <div className={styles.title}>Recupere sua senha</div>


        {!emailSent && <>
        
          <div className={styles.subtitle}>Preencha o campo abaixo e receba as instruções no seu e-mail cadastrado</div>
    
          <div className={styles.inputs}>
            <div className={styles.input}>
              <div className={styles.label}>E-MAIL</div>
                <Input
                  onSet={handleChange}
                  name='email' 
                  placeholder='Digite seu e-mail'
                  warning={errorFields.includes('email')}
                />
            </div>
          </div> 

          <div className={styles.errors}>
            {errorFields.length ? <div>Digite um e-mail válido</div> : ''}
          </div>

          <div className={styles.button}>
            <Button 
              label= 'Enviar'
              backgroundColor='#26408C'
              backgroundColorHover='#4D69A6'
              onClick={handleSubmit}
            />
          </div> 
      

          <div className={styles.signup}>
            Primeira vez na PlanMilhas?<div className={styles.signupLink} onClick={() => {router.push('/signup')}}>Criar conta</div>
          </div>

          <div className={styles.signup}>
            Já tem uma conta?<div className={styles.signupLink} onClick={() => {router.push('/login')}}>Entrar</div>
          </div>

        </>}

        {emailSent &&
          <>
            <div className={styles.alert}>
              <div className={styles.icon}>
                <DoneIcon />
              </div>  
              <div className={styles.alertEmail}>
                Email enviado com sucesso!
              </div>
              <div className={styles.subtitle}>Verifique sua caixa de entrada e siga as instruções.</div>
            </div>
          </>
        }

        {loading && <Loader />}

      </div>
    </div>


    </>)
}

export default RecuperarSenha