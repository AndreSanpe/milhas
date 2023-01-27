import React, { InputHTMLAttributes, useCallback, useState } from 'react';
import { cep, currency, miles, cpf, date } from './mask';
import styles from './styles.module.css';
import IconOn from './visibilityOn.svg';
import IconOff from './visibilityOff.svg';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  mask?: 'cep' | 'currency' | 'miles' | 'cpf' | 'date';
  onSet: (newValue: any) => void;
  warning?: boolean;
  password?: boolean;
}

const Input: React.FC<InputProps> = ({ password, warning, onSet, mask, ...props }) => {

  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleIcon = () => setShowPassword(!showPassword);
   
  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    switch (mask) {
      case 'cep':
        cep(e);
        break;
      case 'currency':
        currency(e);
        break;
      case 'miles':
        miles(e);
        break;
      case 'cpf':
        cpf(e);
        break;
      case 'date':
        date(e);
        break;
    }

    onSet(e)

  }, [mask, onSet]);
  
  
  return (
    <div className={styles.container} /* Fake input start...Real input be inside */
      style={{
      border: !warning ? (focused ? '#BA87FF 1px solid' : '#EEE1FF 1px solid') : '#ff0000 1px solid',
    }}>
      
      <input 
        {...props} 
        className={styles.input} 
        type={password ? (showPassword ? 'text' : 'password') : 'text' }
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      {/* Controls of visibility icon for passwords */}
      {password && 
        <div 
          className={styles.icon}
          onClick={toggleIcon}
        >
          {showPassword && <IconOn color='#8F8F8F' />}
          {!showPassword && <IconOff color='#8F8F8F' />}
        </div>
      }

    </div>
  )
}

export default Input;