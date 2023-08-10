import React, { useEffect, useState } from 'react'
import { menuLinks } from '../../utils/data';
import styles from'./styles.module.css';

import Image from 'next/image';
import Logo from '../../public/logo_plamilhas.png';
import { useAuthContext } from '../../contexts/auth';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

import MenuIcon from './icons/menu.svg';
import CloseIcon from  './icons/close.svg';
import HomeIcon from './icons/home.svg';
import AccountIcon from './icons/account.svg';
import LogoutIcon from './icons/logout.svg';
import SettingsIcon from './icons/settings.svg';
import SupportIcon from './icons/support.svg';


const Header = () => {

  const { user, setUser } = useAuthContext();
  const [ menuOpen, setMenuOpen ] = useState(false);

  const router = useRouter();

  
  return (<>

    <div className={styles.container}>{/* Header begin */}
      <div className={styles.iconMenu} onClick={() => setMenuOpen(true)}>
        <MenuIcon className={styles.oneIcon} />
      </div>
      
      <div style={{cursor:'pointer'}} onClick={() => router.push('/dashboard')}>
        <Image 
          className={styles.imageLogo}
          src={Logo}
          alt=''
          priority={true}
        />
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

            

            {/* {menuLinks.map((item, index) => 
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
            )} */}

            {/* Menu */}
            <div className={styles.links}>
              
              <div onClick={() => {
                router.push('/dashboard')
                setMenuOpen(false)
                }}>
                <div className={styles.link}>
                  <div className={styles.icon}><HomeIcon/></div>
                  <div className={styles.label}>Página inicial</div>
                </div>
              </div>
              

              <div onClick={() => router.push('/minha-conta')}>
                <div className={styles.link}>
                  <div className={styles.icon}><AccountIcon/></div>
                  <div className={styles.label}>Minha conta</div>
                </div>
              </div>

              <div className={styles.link}>
                <div className={styles.icon}><SettingsIcon/></div>
                <form action={`/api/subscription`} method='POST'>
                  <input className={styles.submit} type="submit" value={'Gerenciar assinatura'}/>
                </form>
              </div>

              <div onClick={() => router.push('')}>
                <div className={styles.link}>
                  <div className={styles.icon}><SupportIcon/></div>
                  <div className={styles.label}>Suporte</div>
                </div>
              </div>

              <div onClick={() => signOut()}>
                <div className={styles.link}>
                  <div className={styles.icon}><LogoutIcon/></div>
                  <div className={styles.label}>Sair</div>
                </div>
              </div>

            </div>
            {/* Menu end's */}

            
            
            
            

          </div>

        </div>
      </div>{/* Content end */}

    </div>{/* Overlay end */}
    
    

  </>)
}

export default Header;

