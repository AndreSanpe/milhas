import styles from './styles.module.css';
import { navigatorLinks } from '../../utils/data';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import HomeIcon from './home.svg';
import PersonIcon from './person.svg';
import FavoritesIcon from './favorites.svg';
import FinancesIcon from './finances.svg';
import NewplanIcon from './plans.svg';
import CalendrIcon from './calendar.svg';
import PlayIcon from './play.svg';
import ExtraIcon from './extra.svg';
import ListIcon from './list.svg';
import ArrowLeftIcon from './arrow_left.svg';
import ArrowRightIcon from './arrow_right.svg';

const SidebarTeste = () => {

const [isOpen, setIsOpen] = useState < Boolean > (true);
const router = useRouter(); 

const toggle = () => {
  setIsOpen(!isOpen);
  }

  return (
    <div className={styles.aux}>
    
      <div className={styles.container} style={{ width: isOpen ? '240px' : '88px'}}> {/* begin container */}

        <div className={styles.sidebar} style={{ width: isOpen ? '240px' : '88px'}}>
          <ul>
            {navigatorLinks.map((link, index) => (
              <li key={index}  className={router.pathname === link.path ? styles.itemActive : styles.item}  >  
                <Link href={link.path} >
                  <div className={styles.icon} style={{ paddingLeft: !isOpen ? '8px' : 'none' }}>
                    {link.icon === 'home' && <HomeIcon className={styles.oneIcon}/>}
                    {link.icon === 'person' && <PersonIcon className={styles.oneIcon}/>}
                    {link.icon === 'favorites' && <FavoritesIcon className={styles.oneIcon}/>}
                    {link.icon === 'finances' && <FinancesIcon className={styles.oneIcon}/>}
                    {link.icon === 'plans' && <NewplanIcon className={styles.oneIcon}/>}
                    {link.icon === 'calendar' && <CalendrIcon className={styles.oneIcon}/>}
                    {link.icon === 'play' && <PlayIcon className={styles.oneIcon}/>}
                    {link.icon === 'list' && <ListIcon className={styles.oneIcon}/>}
                    {link.icon === 'extra' && <ExtraIcon className={styles.oneIcon}/>}
                  </div>
                  <span className={styles.label}  style={{ fontSize: isOpen ? '15px' : '0' }} >{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.auxBtn}>
          <button onClick={toggle} className={styles.btn} style={{ width: isOpen ? '240px' : '88px'}}>
            {isOpen && <ArrowLeftIcon className={styles.oneIcon} /> }
            {!isOpen && <ArrowRightIcon className={styles.oneIcon} /> }
          <div className={styles.btnLabel} style={{ fontSize: isOpen ? '15px' : '0px' }}>
            Recolher
          </div>
          </button>
        </div>

      </div> {/* end container */}
      
    </div> /* div aux for border */
  )
}

export default SidebarTeste;