import { signIn, signOut, useSession } from 'next-auth/react';
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState } from 'react';
import Loader from '../components/Loader';

export default function Home() {

  /* signIn() */

  const router = useRouter();
  const { data: session } = useSession();
  
  const [ loading, setLoading ] = useState<boolean>(false);

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
          <button className={styles.btn} onClick={() => {setLoading(true); signOut()}}>Sair</button>
          {loading && <Loader />}
          </>
        }
        
      </div>
      
    </div>
    </>)
}
