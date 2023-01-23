import { signIn, useSession } from 'next-auth/react';
import styles from '../styles/Home.module.css'

export default function Home() {

  const { data: session } = useSession();

  if (session) {
    console.log('user:', session.user)
  }


  return (
    <div className={styles.container}>
      <div>HOME</div>
      <div>
        <button onClick={() => signIn()}>Fazer Login</button>
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
