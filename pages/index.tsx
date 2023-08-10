import { signIn, signOut, useSession } from 'next-auth/react';
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState } from 'react';
import Loader from '../components/Loader';
<<<<<<< HEAD
import Recovery from '../emails/recovery';
import EmailRecovery from '../emails/recuperar-senha';
import { render } from '@react-email/components';

export default function Home() {

=======

export default function Home() {

  /* signIn() */
>>>>>>> 09286d995f1b689fe699205bac56d945dc56c3e0

  const router = useRouter();
  const { data: session } = useSession();
  
  const [ loading, setLoading ] = useState<boolean>(false);

<<<<<<< HEAD
  const html = render(<Recovery recoveryLink='httP://localhost:3000/reset/123456'/>, {
    pretty:true,
  })


  const handlerMail = async () => {
    
    let data = {
      emailplan: 'contato@planmilhas.com.br',
      emailuser: 'brunofelisbertos@gmail.com',
      subject: 'Recupere sua senha',
      text: 'Texto',
      texthtml: html
=======
  const handlerMail = async () => {
    
    let data = {
      mailplan: 'contato@planmilhas.com.br',
      mailuser: 'brunofelisbertos@gmail.com',
      subject: 'Está funfando ok agora!',
      text: 'Texto',
      texthtml: '<b>Este texto está em negrito</b>'
>>>>>>> 09286d995f1b689fe699205bac56d945dc56c3e0
    }
    
    const sendMail = await fetch('/api/email', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'content-Type': 'application/json',
      },
    }); 

  }

  return (<>

    <Head>
      <title>PlanMilhas</title>
    </Head>

    <div className={styles.container}>

      <div className={styles.logo}>
        <div className={styles.circle}></div>
        <div className={styles.circle2}></div>
        PlanMilhas
        <div className={styles.circle3}></div>
        <div className={styles.circle4}></div>
      </div> 

      

      <div style={{display:'flex', flexDirection: 'column', gap: '12px', width:'200px'}}>
        {!session &&  <>
          <button className={styles.btn} onClick={() => {setLoading(true); signIn()}}>Fazer Login</button>
          {loading && <Loader />}
          </>
        } 
  
        {session && <>
          <button className={styles.btn} onClick={() => router.push('/dashboard')}>Dashboard</button>
          <button className={styles.btn} onClick={handlerMail}>SendMail</button>
          <button className={styles.btn} onClick={() => {setLoading(true); signOut()}}>Sair</button>
          {loading && <Loader />}
          </>
        }

        
      </div>
      
    </div>
    </>)
}
