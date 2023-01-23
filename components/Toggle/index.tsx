import { useState } from 'react';
import styles from './styles.module.css';

type Props = {
  initialValue: boolean;
  onChange: (newValue: boolean) => void;
}

const Toggle = ({ initialValue, onChange }: Props) => {

  return (
    <label className={styles.label}>
      <input className={styles.input} 
        type='checkbox' 
        checked={initialValue}
        onChange={e => onChange(e.target.checked)}
      />
      
      <span className={styles.span}/>
      {initialValue && 
        <strong className={styles.active}>{'ATIVO'}</strong>}
      {!initialValue && 
        <strong className={styles.disable}>{'INATIVO'}</strong>} 
    </label>
  )
}

export default Toggle;