import { signIn, signOut, useSession } from 'next-auth/react';
import styles from '../styles/Home.module.css'

export default function Home() {

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
        {session && 
          <button onClick={() => signOut()}>Sair</button>
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
