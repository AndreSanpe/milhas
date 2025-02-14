import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react'
import jwt from 'jsonwebtoken';
import styles from './styles.module.css';
import Head from 'next/head';
import Image from 'next/image';
import Logo from '../../public/logo_plamilhas.png';
import Input from '../../components/Input';
import Button from '../../components/Button';
import IconError from './error.svg';
import Loader from '../../components/Loader';
import DoneIcon from './done.svg';

type dataProps = {
  validation: boolean
}

const Reset = (data: dataProps) => {

  const router = useRouter();
  const validationToken = router.query.token;

  const [ password, setPassword ] = useState<string>('');
  const [ passwordVerify, setPasswordVerify ] = useState<string>('');
  const [ errorPasswordLess, setErrorPasswordLess ] = useState<string[]>([]);
  const [ errorPasswordVerify, setErrorPasswordVerify ] = useState<string[]>([]);
  const [ showInputs, setShowInputs ] = useState<boolean>(data.validation);
  const [ notShowInputs, setNotShowInputs ] = useState<boolean>(data.validation);
  const [ passwordChanged, setPasswordChanged ] = useState<boolean>(false);
  const [ notPasswordChanged, setNotPasswordChanged ] = useState<boolean>(false);
  const [ loading, setLoading ] = useState<boolean>(false);

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    switch(e.currentTarget.name) {
      case 'password':
        setPassword(e.currentTarget.value)
        return;
      case 'passwordVerify':
        setPasswordVerify(e.currentTarget.value)
        return;
  }}, []);

  //verify each default entry, if exists errors, push to array
  const verifyUser = () => {
    let newErrorPasswordVerify = [];
    let newErrorPasswordLess = [];
    let approved = true;

    if(password === '' || password.length < 8) {
      newErrorPasswordLess.push('password');
      approved = false;
    }

    if(password !== passwordVerify) {
      newErrorPasswordVerify.push('passwordVerify');
      approved = false;
    }

    setErrorPasswordLess(newErrorPasswordLess);
    setErrorPasswordVerify(newErrorPasswordVerify);
    return approved;
  }

  const handleSubmit = async () => {
    if(verifyUser()){
      setErrorPasswordLess([]);
      setErrorPasswordVerify([]);
      setLoading(true);
      
      let data = {
        validationToken,
        password
      }

      const response = await fetch('/api/recovery', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'content-Type': 'application/json',
        },
      }); 

      if(response.status === 201) {
        setLoading(false);
        setShowInputs(false);
        setPasswordChanged(true);
      }
      else {
        setLoading(false);
        setShowInputs(false);
        setNotPasswordChanged(true);
      }
 
      const delay = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms))
      }

      const alert = async () => {         
        await delay(5000);
        router.push('/login')
      }
      alert();

    }
  }

  return (<>

    <Head>
      <title>Recuperar de senha . PlanMilhas</title>
    </Head>

    <div className={styles.container}>
      <div className={styles.loginArea}>

        <div className={styles.logo}>  

          <Image 
          src={Logo}
          width={180}
          height={35}
          alt=''
          priority={true}
          className={styles.image}
          />       

        </div>

        {showInputs && <>
          
          <div className={styles.title}>Crie uma nova senha</div>
          
          <div className={styles.inputs}>
          <div className={styles.input} style={{marginTop: '24px'}}>
            <div className={styles.label}>Crie uma nova senha</div>
              <Input
                onSet={handleChange}
                name='password' 
                placeholder=''
                password
                warning={errorPasswordLess.includes('password')}
              />
            <div className={styles.forget}>Mínimo de 8 caracteres</div>
          </div>
          <div className={styles.input}>
            <div className={styles.label}>Confirmar a nova senha</div>
              <Input
                onSet={handleChange}
                name='passwordVerify' 
                placeholder=''
                password
                warning={errorPasswordVerify.includes('passwordVerify')}
              />
          </div>
          </div>

          <div className={styles.button}>
            <Button 
              label= 'Alterar senha'
              backgroundColor='#26408C'
              backgroundColorHover='#4D69A6'
              onClick={handleSubmit}
            />
          </div> 
        </>}

        {!notShowInputs && <>
          <div className={styles.title}>Crie uma nova senha</div>
          
          <div className={styles.alert}>
              <div className={styles.icon}>
                <IconError />
              </div>  
              <div className={styles.alertEmail}>
                O link de atualização de senha não é mais válido ou expirou!
              </div>
              <div className={styles.subtitleAlert}>
                <div>Atualize-o,</div> 
                <div className={styles.link} onClick={() => router.push('/recuperar-senha')}>clicando aqui</div>
              </div>
              
            </div>
        </>}

        {passwordChanged &&
          <>
            <div className={styles.alert}>
              <div className={styles.icon}>
                <DoneIcon />
              </div>  
              <div className={styles.alertEmail}>
                Senha alterada com sucesso!
              </div>
              <div className={styles.subtitle}>Faça login usando seus novos dados. Você está sendo redirecionado...</div>
            </div>
          </>
        }

        {notPasswordChanged &&
          <>
            <div className={styles.alert}>
              <div className={styles.icon}>
                <IconError />
              </div>  
              <div className={styles.alertEmail}>
                Não foi possível alterar a senha!
              </div>
              <div className={styles.subtitle}>Repita o procedimento ou entre em contato com o suporte.</div>
            </div>
          </>
        }

        {loading && <Loader />}

        <div className={styles.errors}>
          {errorPasswordLess.length ? <div> A senha deve conter no mínimo 8 caracteres.</div> : ''}
        </div>

        <div className={styles.errors}>
          {errorPasswordVerify.length ? <div> A confirmação de senhas falhou. As senhas devem ser iguais.</div> : ''}
        </div>

      </div>
    </div>
  
    

    </>)
}

export default Reset;

export interface TokenInterface {
  message?: string;
  userId?: string;
  iat?: number;
  exp?: number;
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const { token } = context.query;
  let validation: boolean = true;
  
  const verify: any = jwt.verify(token as string, process.env.TOKEN_SECRET as string, (err, payload) => {
    if(err) {
      if(err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
        return  {
            validation: false
        }
      }
    } 
    return { validation: true }
  })

  validation = verify.validation;

  return {
    props: {
      validation
    }
  }
}