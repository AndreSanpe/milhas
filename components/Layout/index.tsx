import React, { ReactElement } from 'react'
import Header from '../Header';
import styles from './styles.module.css';

type Props = {
  children: ReactElement;
}

const Layout = ({ children } : Props) => {
  return (
    <> 
        <div className={styles.container}>
          <Header  />
          <div className={styles.content}>
            <main className={styles.main}>{children}</main>
          </div> 
        </div>
    </>
  )
}

export default Layout;