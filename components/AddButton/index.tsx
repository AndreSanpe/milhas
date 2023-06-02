import React from 'react';
import styles from './styles.module.css';
import AddIcon from './add_circle_black.svg';

const AddButton = () => {
  return (
    <>
      <div className={styles.container}>
        <AddIcon className={styles.button}/>
      </div> 
    </>
  )
}

export default AddButton;