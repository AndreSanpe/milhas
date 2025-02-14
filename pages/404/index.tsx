import React from 'react';
import styles from './style.module.css';
import NotFoundIcon from './not-found.svg'
import { useRouter } from 'next/router';

const NotFound = () => {
 
  const router = useRouter();
 
 return (<>

    <div className={styles.container}>
      <div className={styles.notFound}>
        <div className={styles.icon}><NotFoundIcon /></div>
        <div className={styles.message}>
          <div className={styles.title}>Ops! Página não encontrada</div>
          <div className={styles.subtitle}>Provável que a página solicitada não exista.</div> 
          <div onClick={() => router.push('/')} className={styles.back}>voltar</div> 
        </div>
      </div> 
    </div>

    </>)
}

export default NotFound;