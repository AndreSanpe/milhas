import React, { useState } from 'react'
import styles from './styles.module.css';
import IconOn from './visibilityOn.svg';
import IconOff from './visibilityOff.svg';

type Props = {
  placeholder?: string;
  value: string;
  onChange: (newValue: string) => void;
  password?: boolean;
  borderRadius?: string;
  type?: string;
  warning?: boolean;
  argRegExp?: RegExp | undefined
  argRegExp2?: string
}

const InputField = ({ placeholder, value, onChange, password, borderRadius, type, warning, argRegExp, argRegExp2} : Props) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleIcon = () => setShowPassword(!showPassword);
  
  return (
    <div className={styles.container}
      style={{
        borderRadius: borderRadius,
        border: !warning ? (focused ? '#292929 1px solid' : '#E0E0E0 1px solid') : '#ff0000 1px solid',
      }}
    >
      <input 
        type={password ? (showPassword ? 'text' : 'password') : type}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange((e.target.value).replace(argRegExp as RegExp, argRegExp2 as string))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
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

export default InputField;