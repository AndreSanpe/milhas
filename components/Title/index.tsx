import React from 'react';
import styles from './styles.module.css';
import BackIcon from './arrow_back.svg';
import router from 'next/router';

type Props = {
  children: string;
  route: string;
}

const Title = ({children, route}: Props) => {
  return (
    <>
      <div className={styles.header}>
        <BackIcon className={styles.button} onClick={() => router.push(route)} route='/dashboard'/>
        <div className={styles.title}>
          {children}
        </div>
      </div> 
    </>
  )
}

export default Title;