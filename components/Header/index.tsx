import React, { useEffect, useState } from 'react'
import { User } from '../../types/User';
import { GetServerSideProps } from 'next';
import styles from'./styles.module.css';
import MenuIcon from './menu.svg';
import CloseIcon from  './close.svg';


const Header = () => {
  
  const [ menuOpen, setMenuOpen ] = useState(false);
  
  return (<>

    {/* Header begin */}
    <div className={styles.container}>
      <div className={styles.icon} onClick={() => setMenuOpen(true)}>
        <MenuIcon className={styles.oneIcon} />
      </div>
      <div className={styles.logo}>LOGO</div>  
    </div> {/* Header end */} 

 
    {/* Menu begin - overlay */}
    
    <div className={styles.overlay} style={{ width: menuOpen ? '100%' : '0px'}}>
     
      {/* Content begin */}
      <div className={styles.containerMenu} style={{ width: menuOpen ? '300px' : '0px'}}>
        <div style={{display: menuOpen ? 'flex' : ' none'}}>
          <div className={styles.closeIcon}><CloseIcon  onClick={()=> setMenuOpen(false)}/></div>
         

        </div>
      </div>{/* Content end */}

    </div>{/* Overlay end */}
    
    

  </>)
}

export default Header;

type Props = {
  tenant: User,
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  

  return {
    props: {
      
    }
  }
}