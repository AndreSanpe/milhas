import React, { ReactElement } from 'react'
import Header from '../Header';
import Sidebar from '../Sidebar';
import Menu from '../Menu';

import styles from './styles.module.css';

type Props = {
  children: ReactElement;
}

const Layout = ({ children } : Props) => {
  return (
    <> 
      <div className={styles.master}>
        <Header  />
        <div className={styles.container}>
          {/* <Menu /> */}
          {/* <Sidebar /> */}
            {/* <div className={styles.content}>
              <main className={styles.main}>{children}</main>
            </div> */}
        </div>
      </div>
    </>
  )
}

export default Layout;