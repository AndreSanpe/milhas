import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import Head from 'next/head';
import React, { useCallback, useEffect, useState } from 'react'
import Layout from '../../components/Layout';
import { User } from '../../types/User';
import { authOptions } from '../api/auth/[...nextauth]';
import styles from './styles.module.css';
import Title from '../../components/Title';
import Button from '../../components/Button';
import { useRouter } from 'next/router';
import Input from '../../components/Input';
import apiEditUser from '../../libs/apiEditUser';
import Loader from '../../components/Loader';
import bcrypt from 'bcrypt';

const UserData = (data: Props) => {

/*  useEffect(() => {
  console.log(data.user)
 },[data]) */
  
  const router = useRouter();

  const [ editing, setEditing ] = useState<boolean>(false);
  const [ editingPass, setEditingPass ] = useState<boolean>(false);

  const [ name, setName ] = useState<string>(data.user.name);
  const [ cpf, setCpf ] = useState<string>(data.user.cpf);
  const [ birthdate, setBirthdate ] = useState<string>(data.user.birthdate);
  const [ cellphone, setCellphone ] = useState<string>(data.user.cellphone);
  const [ email, setEmail ] = useState<string>(data.user.email);
  const [ passwordOld, setPasswordOld ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ passwordVerify, setPasswordVerify ] = useState<string>('');
  const [ hasError, setHasError ] = useState<boolean>(false);
  const [ errorFields, setErrorFields ] = useState<string[]>([]);
  const [ errorPasswordLess, setErrorPasswordLess ] = useState<string[]>([]);
  const [ errorPasswordDifferent, setErrorPasswordDifferent ] = useState<string[]>([]);
  const [ errorPasswordVerify, setErrorPasswordVerify ] = useState<string[]>([]);
  const [ errorEmail, setErrorEmail ] = useState<string[]>([]);
  const [ errorCpf, setErrorCpf ] = useState<string[]>([]);
  const [ errorEmailOrCpf, setErrorEmailOrCpf ] = useState<string[]>([]);
  const [ errorEmailRepeat, setErrorEmailRepeat ] = useState<boolean>(false);
  const [ errorCpfRepeat, setErrorCpfRepeat ] = useState<boolean>(false);
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
      case 'passwordOld':
        setPasswordOld(e.currentTarget.value)
        return;  
      case 'password':
        setPassword(e.currentTarget.value)
        return;
      case 'passwordVerify':
        setPasswordVerify(e.currentTarget.value)
        return;
  }}, []);


  //verify each default entry, if exists errors, push to array
  const verifyUser = () => {
    let newErroFields = [];
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
 
    setErrorFields(newErroFields);
    return approved;
  }

  const verifyPassword = () => {
    let newErrorPasswordVerify = [];
    let newErrorPasswordLess = [];
    let approved = true;

    if(passwordOld === '' || passwordOld.length < 8) {
      newErrorPasswordLess.push('passwordOld')
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

    setErrorPasswordLess(newErrorPasswordLess);
    setErrorPasswordVerify(newErrorPasswordVerify);
    return approved;
  }

  /* Handle User data //////////////////////////////////////////////////////////////////////////*/
  const handleSubmitUser = async () => {
    if(verifyUser()) {
      setLoading(true);
      let userEdited = {
        name,
        cpf,
        birthdate,
        cellphone,
        email,
        id: data.user.id,
      }
      const response = await fetch('/api/tenant', {
        method: 'PUT',
        body: JSON.stringify(userEdited),
        headers: {
          'content-Type': 'application/json',
        },
      }); 

      if(response.status === 401) {
        const responseError = await response.json();
        const error = JSON.stringify(responseError);

        setErrorEmail([]);
        setErrorEmailRepeat(false);
        
        if(error === '"email"') {
          setErrorEmail(['email']);
          setErrorEmailRepeat(true);
          setLoading(false);
          return;
        } 
        
        if (error === '"cpf"') {
          setErrorCpf(['cpf']);
          setErrorCpfRepeat(true);
          setLoading(false);
          return;
        } 
      }

      setErrorEmail([]);
      setErrorEmailRepeat(false);
      setErrorCpf([]);
      setErrorCpfRepeat(false);
      setLoading(false);
      setEditing(false);
      router.push('/minha-conta')
    }
  }

  const handleSubmitUserCanceled = async () => {
    setEditing(false);
    setErrorFields([]);
    setErrorCpfRepeat(false);
    setErrorCpf([]);
    setErrorEmailRepeat(false);
    setErrorEmail([]);
    setName(data.user.name);
    setCpf(data.user.cpf);
    setBirthdate(data.user.birthdate);
    setCellphone(data.user.cellphone);
    setEmail(data.user.email);
  }

   /* Handle paswword //////////////////////////////////////////////////////////////////////////*/
  const handleSubmitPassword = async () => {
    if(verifyPassword()) {
      setLoading(true);
      let userPassword = {
        id: data.user.id,
        passwordOld,
        password
      }    

      const responseUpd = await fetch('/api/editpassword', {
        method: 'PUT',
        body: JSON.stringify(userPassword),
        headers: {
          'content-Type': 'application/json',
        },
      }); 

      if(responseUpd.status === 401) {
        setErrorPasswordDifferent(['passwordDifferent'])
        setLoading(false)
        return
      }

      if(responseUpd.status === 201) {
        setErrorPasswordDifferent([]);
        setEditingPass(false);
      }
      
      setLoading(false)
    
    }
  }

  const handleSubmitPasswordCanceled = async () => {
    setEditingPass(false);
    setErrorPasswordLess([]);
    setErrorPasswordVerify([]);
    setErrorPasswordDifferent([]);
  }

  return (
    <>
    <Head>
      <title>Minha conta . PlanMilhas</title>
    </Head>
    
    <Layout><>
      
      <div className={styles.container}> 

        <Title route='/dashboard'>Minha conta</Title>


        {/* User data editing*/}
        <div className={styles.results}>

          <div className={styles.title}>Dados pessoais</div>

          {!editing && 
            <>
              <div>
                <div className={styles.label}>Nome completo:</div>
                <div>{data.user.name ? data.user.name : '(sem nome)'}</div>
              </div>

              <div>
                <div className={styles.label}>E-mail:</div>
                <div>{data.user.email}</div>
              </div>

              <div>
                <div className={styles.label}>CPF:</div>
                <div>{data.user.cpf ? data.user.cpf : '(sem cpf)'}</div>
              </div>

              <div>
                <div className={styles.label}>Data de nascimento:</div>
                <div>{data.user.birthdate ? data.user.birthdate : '(sem data)'}</div>
              </div>

              <div>
                <div className={styles.label}>Telefone com DDD:</div>
                <div>{data.user.cellphone ? data.user.cellphone : '(sem cpf)'}</div>
              </div>
              
              <div className={styles.button}>
                <Button 
                label= 'Editar dados'
                backgroundColor='#26408C'
                backgroundColorHover='#4D69A6'
                onClick={() => setEditing(true)}
                />
              </div>
            </>
            }

          {editing && 
          <>
          <div className={styles.inputs}>
            <div className={styles.input}>
              <div className={styles.label}>Nome completo</div>
                <Input
                  onSet={handleChange}
                  name='name'
                  value={name}
                  placeholder='Ex.: Rafaella Martins Ribeiro'
                  warning={errorFields.includes('name')}
                />
            </div>
            <div className={styles.input}>
              <div className={styles.label}>E-mail</div>
                <Input
                  onSet={handleChange}
                  name='email' 
                  value={email}
                  placeholder='Ex.: rafa@gmail.com'
                  warning={errorFields.includes('email' || 'emailVerify') || /* errorEmailOrCpf.includes('email') */ errorEmail.includes('email')}
                />
            </div>
            <div className={styles.input}>
              <div className={styles.label}>CPF</div>
                <Input
                  onSet={handleChange}
                  name='cpf' 
                  value={cpf}
                  placeholder='Ex.: 111.111.111-11'
                  mask='cpf'
                  warning={errorFields.includes('cpf') || errorCpfRepeat}
                />
            </div>
            <div className={styles.input}>
              <div className={styles.label}>Data de nascimento</div>
                <Input
                  onSet={handleChange}
                  name='birthdate'
                  value={birthdate}
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
                  value={cellphone}
                  placeholder='Ex.: (35) 999989998'
                  mask='cellphone'
                  warning={errorFields.includes('cellphone')}
                />
            </div>
            

            <div className={styles.button}>
              <Button 
                label= 'Salvar'
                backgroundColor='#26408C'
                backgroundColorHover='#4D69A6'
                onClick={handleSubmitUser}
              />
              <Button 
                label= 'Cancelar'
                backgroundColor='#26408C'
                backgroundColorHover='#4D69A6'
                onClick={handleSubmitUserCanceled}
              />
            </div>

            <div>
              <div className={styles.errors}>
                {errorFields.length || hasError ? <div>Campo(s) obrigatório(s), por favor preencha-o(s)!</div> : ''}
              </div>
              <div className={styles.errors}>
                {errorEmailRepeat ? <div> Este e-mail já foi cadastrado.</div> : ''}
              </div>
              <div className={styles.errors}>
                {errorCpfRepeat ? <div> Este CPF já foi cadastrado.</div> : ''}
              </div>
            </div>
          </div>
          </>}

         </div>{/* User data editing */}
         

        {/* Password editing */}
        <div className={styles.results}>
          <div className={styles.title}>Alteração de senha</div>
          
          {!editingPass &&
          <>
          <div>
            <div className={styles.alert}>Defina uma nova senha de acesso à sua conta.</div>
          </div>

          <div className={styles.button}>
            <Button 
              label= 'Alterar senha'
              backgroundColor='#26408C'
              backgroundColorHover='#4D69A6'
              onClick={() => setEditingPass(true)}
            />
          </div>
          </>
          }

          {editingPass &&
          <>
          <div className={styles.inputs}>
            <div className={styles.input}>
              <div className={styles.label}>Senha atual</div>
                <Input
                  onSet={handleChange}
                  name='passwordOld' 
                  placeholder=''
                  password
                  warning={errorPasswordLess.includes('passwordOld') || errorPasswordDifferent.includes('passwordDifferent')}
                />
            </div>
            <div className={styles.input}>
              <div className={styles.label}>Nova senha</div>
                <Input
                  onSet={handleChange}
                  name='password' 
                  placeholder=''
                  password
                  warning={errorPasswordLess.includes('password')}
                />
            </div>
            <div className={styles.input}>
              <div className={styles.label}>Repetir nova senha</div>
                <Input
                  onSet={handleChange}
                  name='passwordVerify' 
                  placeholder=''
                  password
                  warning={errorPasswordVerify.includes('passwordVerify')}
                />
                <div className={styles.forget}>Mínimo de 8 caracteres</div>
            </div>
            

          </div>

          <div className={styles.button}>
            <Button 
              label= 'Salvar'
              backgroundColor='#26408C'
              backgroundColorHover='#4D69A6'
              onClick={handleSubmitPassword}
            />
            <Button 
              label= 'Cancelar'
              backgroundColor='#26408C'
              backgroundColorHover='#4D69A6'
              onClick={handleSubmitPasswordCanceled}
            />
          </div>

          <div className={styles.error}>  
            <div className={styles.errors}>
              {errorFields.length || hasError ? <div>Campo(s) obrigatório(s), por favor preencha-o(s)!</div> : ''}
            </div>

            <div className={styles.errors}>
              {errorPasswordDifferent.length ? <div> A senha digitada não confere com a atual.</div> : ''}
            </div>

            <div className={styles.errors}>
              {errorPasswordLess.length ? <div> A senha deve conter no mínimo 8 caracteres.</div> : ''}
            </div>

            <div className={styles.errors}>
              {errorPasswordVerify.length ? <div> A confirmação de senhas falhou. As senhas devem ser iguais.</div> : ''}
            </div>
          </div>
          </>
          }

          {loading && <Loader />}
        
          </div>
          
      </div>{/* Div container end */}   
    
    </></Layout>
    </>
  )
}

export default UserData;

type Props = {
  user: User;  
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  if(!session) return { redirect: { destination: '/login', permanent: true }}; 

  /* Get tenant */
  const user = await apiEditUser.getUserEditing(session.user.id)
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

  return {
    props: {
      user
    }
  }
}