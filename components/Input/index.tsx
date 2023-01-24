import React, { InputHTMLAttributes, useCallback, useState } from 'react';
import styles from './styles.module.css';
import { cep, currency } from './mask';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  mask: 'cep' | 'currency',
  onSet: (newValue: any) => void,
}

const Input: React.FC<InputProps> = ({ onSet, mask, ...props }) => {
 
  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    switch (mask) {
      case 'cep':
        cep(e);
        onSet(e)
        break;
      case 'currency':
        currency(e);
        onSet(e)
        break;
    }
    
  }, [mask, onSet]);
  
  
  return (
    <div className={styles.container}>
      <input className={styles.input} {...props} onChange={handleChange}/>
    </div>
  )
}

export default Input;