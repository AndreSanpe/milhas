import React, { useEffect, useState } from 'react'
import { menuLinks } from '../../utils/data';
import styles from'./styles.module.css';
import MenuIcon from './menu.svg';
import CloseIcon from  './close.svg';
import { useAuthContext } from '../../contexts/auth';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';



const Header = () => {

  const { user, setUser } = useAuthContext();
  const [ menuOpen, setMenuOpen ] = useState(false);

  const router = useRouter();

  
  return (<>

    <div className={styles.container}>{/* Header begin */}
      <div className={styles.icon} onClick={() => setMenuOpen(true)}>
        <MenuIcon className={styles.oneIcon} />
      </div>
      <div className={styles.logo}>
        <div className={styles.circle}></div>
        <div className={styles.circle2}></div>
        PlanMilhas
        <div className={styles.circle3}></div>
        <div className={styles.circle4}></div>
      </div> 
    </div> {/* Header end */} 
    
 
    {/* Menu begin - overlay */}
    <div className={styles.overlay} style={{ width: menuOpen ? '100%' : '0px'}}>
      {/* Content begin */}
      <div className={styles.containerMenu} style={{ width: menuOpen ? '300px' : '0px'}}>
        <div style={{display: menuOpen ? 'flex' : ' none'}}>

          <div className={styles.content}>
            <div className={styles.closeIcon}><CloseIcon  onClick={()=> setMenuOpen(false)}/></div>

            {user && 
            <>
              <div className={styles.title}>Olá, {user?.name}!</div>
              <div className={styles.subtitle}>{user?.email}</div>
            </>
            }

            {!user && 
            <>
              <div className={styles.title}>Olá!</div>
              <div className={styles.subtitle}></div>
            </>
            }

            {menuLinks.map((item, index) => 
              <div key={index} onClick={() => router.push({...router.query, pathname: item.path})}>
              <div className={styles.links}>
                <div className={styles.icons}>
                    {item.icon === 'manage' && 'tag icon'}
                </div>
                <div className={styles.label}>
                  {item.label}
                </div>
              </div>
            </div>
            )}
            <div className={styles.links} onClick={() => signOut()}>Sair</div>

          </div>

        </div>
      </div>{/* Content end */}

    </div>{/* Overlay end */}
    
    

  </>)
}

export default Header;

