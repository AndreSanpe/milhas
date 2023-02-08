import React, { InputHTMLAttributes } from 'react';
import styles from './styles.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSet?: (newValue: any) => void;
  warning?: boolean;
  optionOne?: string;
  labelOne?: string;
}

const InputSelect: React.FC<InputProps> = ({optionOne, labelOne, ...props}) => {
  return (<>
    <div className={styles.container}>
      <select className={styles.select}
      defaultValue= 'Escolha uma opção:'
      >
        <option className={styles.teste} selected disabled>Escolha uma opção:</option>
        <option value={optionOne}>{optionOne}</option>
        <option value={optionOne}>{optionOne}</option>
        <option value={optionOne}>{optionOne}</option>
      </select>
    </div>

  
  
  </>)
}

export default InputSelect;