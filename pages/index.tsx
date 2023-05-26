import { signIn, signOut, useSession } from 'next-auth/react';
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';

export default function Home() {

  const router = useRouter();

  const { data: session } = useSession();

  return (
    <div className={styles.container}>

      <div className={styles.logo}>
        <div className={styles.circle}></div>
        <div className={styles.circle2}></div>
        PlanMilhas
        <div className={styles.circle3}></div>
        <div className={styles.circle4}></div>
      </div> 

      <div style={{display:'flex', flexDirection: 'column', gap: '12px', width:'200px'}}>
        {!session && 
          <button className={styles.btn} onClick={() => signIn()}>Fazer Login</button>
        }
        {session && <>
          <button className={styles.btn} onClick={() => router.push('/dashboard')}>Dashboard</button>
          <button className={styles.btn} onClick={() => signOut()}>Sair</button>
          </>
        }
        
      </div>
      
    </div>
  )
}
