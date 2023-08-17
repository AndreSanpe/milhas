import React, { useCallback, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Logo from '../../public/logo_plamilhas.png';
import styles from './styles.module.css';
import Head from 'next/head';
import Image from 'next/image';
import Loader from '../../components/Loader';
import { render } from '@react-email/components';
import Welcome from '../../emails/welcome';


const Signup = () => {

  const [ name, setName ] = useState<string>('');
  const [ cpf, setCpf ] = useState<string>('');
  const [ birthdate, setBirthdate ] = useState<string>('');
  const [ cellphone, setCellphone ] = useState<string>('');
  const [ email, setEmail ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ passwordVerify, setPasswordVerify ] = useState<string>('');
  const [ hasError, setHasError ] = useState<boolean>(false);
  const [ errorFields, setErrorFields ] = useState<string[]>([]);
  const [ errorPasswordLess, setErrorPasswordLess ] = useState<string[]>([]);
  const [ errorPasswordVerify, setErrorPasswordVerify ] = useState<string[]>([]);
  const [ errorEmailOrCpf, setErrorEmailOrCpf ] = useState<boolean>(false);
  const [ loading, setLoading ] = useState<boolean>(false);

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
    let newErrorPasswordVerify = [];
    let newErrorPasswordLess = [];
    let approved = true;

    if(name === '') {
      newErroFields.push('name');
      approved = false;
    }

    if(cpf.length < 14) {
      newErroFields.push('cpf');
      approved = false;
    }

    if(birthdate.length < 10) {
      newErroFields.push('birthdate');
      approved = false;
    }

    if(cellphone === '') {
      newErroFields.push('cellphone');
      approved = false;
    }

    const emailRegexp = /[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi;

    if(email === '' || !email.match(emailRegexp)){
      newErroFields.push('email');
      approved = false;
    }

    if(password === '' || password.length < 8) {
      newErrorPasswordLess.push('password');
      approved = false;
    }

    if(password !== passwordVerify) {
      newErrorPasswordVerify.push('passwordVerify');
      approved = false;
    }
   
    setErrorFields(newErroFields);
    setErrorPasswordLess(newErrorPasswordLess);
    setErrorPasswordVerify(newErrorPasswordVerify);
    return approved;
  }

  //Once verified, log in
  const handleSubmit = async () => {
    setLoading(true);
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
      
      if(response.status === 401) {
        console.log('cpf ou email já cadastrado')
        setErrorEmailOrCpf(true);
        setLoading(false);
        return
      }

      if(response.ok) {

        const request = await signIn('credentials', {
          redirect: false,
          email, password
        });

        if(request && request.error === null && request.ok){
          router.push('/dashboard');
          } else {
            router.push('/login');
            console.log('Ocorreu algum erro no login automático');
          }
      } else {
        router.push('/login');
      }

      const firstName = name.split(" ")[0]
      const htmlWelcome = render(<Welcome firstName={firstName}/>)

      //If it's ok >> send welcome email
      let dataEmail = {
      emailplan: 'PlanMilhas <no-reply@planmilhas.com.br>',
      emailuser: email,
      subject: 'Boas-vindas a PlanMilhas!',
      text: '',
      texthtml: htmlWelcome
      }
    
      const sendEmail = await fetch('/api/email', {
      method: 'POST',
      body: JSON.stringify(dataEmail),
      headers: {
        'content-Type': 'application/json',
      },
      }); 
  
    }

    setLoading(false);
  } 
   
  return (<>

    <Head>
      <title>Crie sua conta . PlanMilhas</title>
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
          
          <div className={styles.input}>
            <div className={styles.label}>Crie uma senha</div>
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
            <div className={styles.label}>Confirmar senha</div>
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
          label= 'Cadastrar'
          backgroundColor='#26408C'
          backgroundColorHover='#4D69A6'
          onClick={handleSubmit}
        />
        </div>

        <div className={styles.errors}>
          {errorFields.length || hasError ? <div>Campo(s) obrigatório(s), por favor preencha-o(s)!</div> : ''}
        </div>

        <div className={styles.errors}>
          {errorPasswordLess.length ? <div> A senha deve conter no mínimo 8 caracteres.</div> : ''}
        </div>

        <div className={styles.errors}>
          {errorPasswordVerify.length ? <div> A confirmação de senhas falhou. As senhas devem ser iguais.</div> : ''}
        </div>

        <div className={styles.errors}>
          {errorEmailOrCpf ? <div> E-mail e/ou cpf já cadastrado.</div> : ''}
        </div>

        <div className={styles.recovery}>
        {errorEmailOrCpf? <div>Se você já se cadastrou e esqueceu a senha, <span  className={styles.recoveryBtn} onClick={() => {}}>clique aqui</span></div> : ''}
        </div>

        <div className={styles.signup}>
          Já tem uma conta?<div className={styles.signupLink} onClick={() => {router.push('/login')}}>Entrar</div>
        </div>

        {loading && <Loader />}

      </div>
    </div>
    </>)
}

export default Signup;