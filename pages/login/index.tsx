import React, { useCallback, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Logo from './fitnezz_.png';
import styles from './styles.module.css';

const Login = () => {

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ hasError, setHasError ] = useState(false);
  const [ errorFields, setErrorFields ] = useState<string[]>([]);

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    if(e.currentTarget.name === 'email') {
      setEmail(e.currentTarget.value)
    }
    if(e.currentTarget.name === 'password') {
      setPassword(e.currentTarget.value)
    }
  }, [])

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

    if(password === '') {
      newErroFields.push('password');
      approved = false;
    }

    setErrorFields(newErroFields);
    return approved;
  }

  //Once verified, log in
  const handleSubmit = async () => {
    if(verifyUser()){
      setErrorFields([])
      const request = await signIn('credentials', {
        redirect: false,
        email, password
      });

    if(request && request.ok && request.status){
      router.push('/dashboard');
      } else {
        router.push('/login');
        setHasError(true);
      }
    } 
   }
  
  return (

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

        <div className={styles.title}>Identifique-se</div>
        <div className={styles.subtitle}>Digite seu e-mail e senha</div>
        
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
          <div className={styles.input}>
            <div className={styles.label}>SENHA</div>
              <Input
                onSet={handleChange}
                name='password' 
                placeholder='Digite sua senha'
                password
                warning={errorFields.includes('password')}
              />
            <div className={styles.forget}>Esqueci minha senha</div>
          </div>
        </div>

        

        <div className={styles.button}>
          
          <Button 
          label= 'Entrar'
          backgroundColor='#26408C'
          backgroundColorHover='#4D69A6'
          onClick={handleSubmit}
        />
        </div>

        <div className={styles.errors}>
          {errorFields.length || hasError ? <div>Usuário e/ou senha inválido(s)!</div> : ''}
        </div>

        <div className={styles.signup}>
          Primeira vez na PlanMilhas?<div className={styles.signupLink} onClick={() => {router.push('/signup')}}>Criar conta</div>
        </div>

      </div>
    </div>
  )
}

export default Login;