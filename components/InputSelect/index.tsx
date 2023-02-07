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
    <div>
      <select className={styles.select}>
        <option value={optionOne}>{optionOne}</option>
      </select>
    </div>
  
  
  </>)
}

export default InputSelect;