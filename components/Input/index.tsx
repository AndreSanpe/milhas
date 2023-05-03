import React, { InputHTMLAttributes, useCallback, useState } from 'react';
import { cep, currency, miles, cpf, date, percentage, decimal, twoDigits, cellphone } from './mask';
import styles from './styles.module.css';
import IconOn from './visibilityOn.svg';
import IconOff from './visibilityOff.svg';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  mask?: 'cep' | 'currency' | 'miles' | 'cpf' | 'date' | 'percentage' | 'decimal' | 'twoDigits' | 'cellphone';
  onSet: (inputValue: React.FormEvent<HTMLInputElement>) => void;
  warning?: boolean;
  password?: boolean;
}

const Input: React.FC<InputProps> = ({ password, warning, onSet, mask, ...props }) => {

  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleIcon = () => setShowPassword(!showPassword);
  
  /* onChange from the input triggers this function that handles the masks and passes the value inside the custom onSet function. This function (onSet) receives the event (e) and sets the "e.target.value" to a state. Example usage outside the component: onSet={(e) => {setState(e.target.value)}}. Thus, at each change in the input, onChange activates the masks, returns the value inside the onSet that will be set in a state */
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
      case 'percentage':
        percentage(e);
        break;
      case 'decimal':
        decimal(e)
        break;
      case 'twoDigits':
        twoDigits(e)
        break;
      case 'cellphone':
        cellphone(e)
        break;
    }

    onSet(e)

  }, [mask, onSet]);
  
  
  return (
    <div className={styles.container} /* Fake input start...Real input be inside */
      style={{
      border: !warning ? (focused ? '#FFAD7D 1px solid' : '#DCE7FF 1px solid') : '#D92B05 1px solid',
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