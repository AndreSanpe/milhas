import React from 'react';
import styles from './styles.module.css';
import LoaderIcon from './loader.svg';

const Loader = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.overlay}>
          <LoaderIcon />
        </div>
        
      </div> 
    </>
  )
}

export default Loader;