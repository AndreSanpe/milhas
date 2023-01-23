import React, { ReactElement } from 'react';
import styles from './styles.module.css';
import CloseIcon from './close.svg';

type Props = {
  children?: ReactElement;
  maxWidth: string;
  maxHeight: string;
  closeButton?: boolean;
  handleClick?: () => void;
}

const FormModal = ({children, maxHeight, maxWidth, closeButton, handleClick}: Props) => {
  return (<>
    <div className={styles.overlay}>
      <div className={styles.container}
      style={{
        maxHeight: maxHeight,
        maxWidth: maxWidth
      }}
      >{closeButton &&
        <div className={styles.closeIcon}>
          <div className={styles.iconArea}>
            <CloseIcon 
            onClick={handleClick}
            />
          </div>
        </div>}
        {children}
      </div>
    </div>
    
    </>)
}

export default FormModal;