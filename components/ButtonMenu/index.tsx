import React, { ReactElement } from 'react';
import styles from './styles.module.css';

type Props = {
  link?: string;
  onClick?: () => void;
  children?: ReactElement;
}

const ButtonMenu = ({link, onClick, children}: Props) => {
  return (<>
      <button className={styles.container} onClick={onClick}>
        {children}
      </button>
    
  </>)
}

export default ButtonMenu;