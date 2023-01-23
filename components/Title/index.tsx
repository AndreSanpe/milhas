import React, { ReactElement } from 'react';
import styles from './styles.module.css';

type Props = {
  children: string;
}

const Title = ({children}: Props) => {
  return (
    <>
      <div className={styles.container}>
        {children}
        <div className={styles.containerLine}>
          <div className={styles.line}></div>
        </div>
      </div>
    </>
  )
}

export default Title;