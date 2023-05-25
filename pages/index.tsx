import { signIn, signOut, useSession } from 'next-auth/react';
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';

export default function Home() {

  const router = useRouter();

  const { data: session } = useSession();

  if (session) {
    console.log('user:', session.user)
  }


  return (
    <div className={styles.container}>
      <div>HOME:</div>
      <div style={{display:'flex', flexDirection: 'column', gap: '12px', width:'200px'}}>
        {!session && 
          <button onClick={() => signIn()}>Fazer Login</button>
        }
        {session && <>
          <button onClick={() => router.push('/dashboard')}>Dashboard</button>
          <button onClick={() => signOut()}>Sair</button>
          </>
        }
        
      </div>
      <div>
        {session &&  
        <>
         Olá {session.user?.name}
        </>
        }
      </div>
    </div>
  )
}
