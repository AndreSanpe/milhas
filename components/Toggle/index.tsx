import { InputHTMLAttributes } from 'react';
import styles from './styles.module.css';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  initialValue: boolean;
  onSet: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Toggle: React.FC<CheckboxProps> = ({ initialValue, onSet, ...props }) => {

  return (
    <label className={styles.label}>
      <input className={styles.input} 
        {...props}
        type='checkbox' 
        checked={initialValue}
        onChange={(e) => onSet(e)}
      />
      
      <span className={styles.span}/>
      {initialValue && 
        <strong className={styles.active}>{'SIM'}</strong>}
      {!initialValue && 
        <strong className={styles.disable}>{'NÃO'}</strong>} 
    </label>
  )
}

export default Toggle;