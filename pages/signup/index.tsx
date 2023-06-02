import React, { useCallback, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Logo from './fitnezz_.png';
import styles from './styles.module.css';
import Head from 'next/head';


const Signup = () => {

  const [ name, setName ] = useState<string>('');
  const [ cpf, setCpf ] = useState<string>('');
  const [ birthdate, setBirthdate ] = useState<string>('');
  const [ cellphone, setCellphone ] = useState<string>('');
  const [ email, setEmail ] = useState<string>('');
  const [ emailVerify, setEmailVerify ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ passwordVerify, setPasswordVerify ] = useState<string>('');
  const [ hasError, setHasError ] = useState<boolean>(false);
  const [ errorFields, setErrorFields ] = useState<string[]>([]);

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    switch(e.currentTarget.name) {
      case 'name':
        setName(e.currentTarget.value)
        return;
      case 'cpf':
        setCpf(e.currentTarget.value)
        return;
      case 'birthdate':
        setBirthdate(e.currentTarget.value)
        return;
      case 'cellphone':
        setCellphone(e.currentTarget.value)
        return;
      case 'email':
        setEmail(e.currentTarget.value)
        return;
      /* case 'emailVerify':
        setEmailVerify(e.currentTarget.value)
        return; */
      case 'password':
        setPassword(e.currentTarget.value)
        return;
      case 'passwordVerify':
        setPasswordVerify(e.currentTarget.value)
        return;
    }}, []);

  const router = useRouter();

  //verify each default entry, if exists errors, push to array
  const verifyUser = () => {
    let newErroFields = [];
    let approved = true;

    const emailRegexp = /[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;

    if(email === '' || !email.match(emailRegexp)){
      newErroFields.push('email');
      approved = false;
    }

    /* if(email !== emailVerify) {
      newErroFields.push('emailVerify');
      approved = false;
    } */

    if(password === '') {
      newErroFields.push('password');
      approved = false;
    }

    if(password !== passwordVerify) {
      newErroFields.push('passwordVerify');
      approved = false;
    }
   
    setErrorFields(newErroFields);
    return approved;
  }

  //Once verified, log in
  const handleSubmit = async () => {
    if(verifyUser()){
      let user = {
        name,
        cpf, 
        birthdate,
        cellphone,
        email, 
        password
      }

      const response = await fetch('/api/tenant', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'content-Type': 'application/json',
        },
      }); 
      
      console.log(response)
           
      router.push('/login');

      }

  } 
   
  return (<>

    <Head>
      <title>Crie sua conta . PlanMilhas</title>
    </Head>

    <div className={styles.container}>
      <div className={styles.loginArea}>

        <div className={styles.logo}>  
          {/* <Image 
          src={Logo}
          width={140}
          height={48}
          alt=''
          /> */}

          <div style={{fontSize: '24px', fontWeight: '700', color: '#26408C'}}>LOGO</div>
        </div>

        <div className={styles.title}>Criar conta</div>
        <div className={styles.subtitle}>Crie sua conta e teste gratuitamente a PlanMilhas por 15 dias. Após este período, escolha ativar sua assinatura premium ou cancelar sem custo.</div>
        
        <div className={styles.inputs}>
          <div className={styles.input}>
            <div className={styles.label}>Nome completo</div>
              <Input
                onSet={handleChange}
                name='name'
                placeholder='Ex.: Rafaella Martins Ribeiro'
                warning={errorFields.includes('name')}
              />
          </div>
          <div className={styles.input}>
            <div className={styles.label}>CPF</div>
              <Input
                onSet={handleChange}
                name='cpf' 
                placeholder='Ex.: 111.111.111-11'
                mask='cpf'
                warning={errorFields.includes('cpf')}
              />
          </div>
          <div className={styles.input}>
            <div className={styles.label}>Data de nascimento</div>
              <Input
                onSet={handleChange}
                name='birthdate'
                mask='date'
                placeholder='Ex.: 30/06/1990'
                warning={errorFields.includes('birthdate')}
              />
          </div>
          <div className={styles.input}>
            <div className={styles.label}>Telefone com DDD</div>
              <Input
                onSet={handleChange}
                name='cellphone' 
                placeholder='Ex.: (35) 999989998'
                mask='cellphone'
                warning={errorFields.includes('cellphone')}
              />
          </div>
          <div className={styles.input}>
            <div className={styles.label}>E-mail</div>
              <Input
                onSet={handleChange}
                name='email' 
                placeholder='Ex.: rafa@gmail.com'
                warning={errorFields.includes('email' || 'emailVerify')}
              />
          </div>
          {/* <div className={styles.input}>
            <div className={styles.label}>Confirmar E-mail</div>
              <Input
                onSet={handleChange}
                name='emailVerify' 
                placeholder='Ex.: rafa@gmail.com'
                warning={errorFields.includes('emailVerify')}
              />
          </div> */}
          <div className={styles.input}>
            <div className={styles.label}>Crie uma senha</div>
              <Input
                onSet={handleChange}
                name='password' 
                placeholder=''
                password
                warning={errorFields.includes('password')}
              />
            <div className={styles.forget}>Mínimo de 8 caracteres</div>
          </div>
          <div className={styles.input}>
            <div className={styles.label}>Confirmar senha</div>
              <Input
                onSet={handleChange}
                name='passwordVerify' 
                placeholder=''
                password
                warning={errorFields.includes('passwordVerify')}
              />
          </div>
          
        </div>

        

        <div className={styles.button}>
          
          <Button 
          label= 'Cadastrar'
          backgroundColor='#26408C'
          backgroundColorHover='#4D69A6'
          onClick={handleSubmit}
        />
        </div>

        <div className={styles.errors}>
          {errorFields.length || hasError ? <div>Usuário e/ou senha inválido(s)!</div> : ''}
        </div>

        <div className={styles.signup}>
          Já tem uma conta?<div className={styles.signupLink} onClick={() => {router.push('/login')}}>Entrar</div>
        </div>

      </div>
    </div>
    </>)
}

export default Signup;