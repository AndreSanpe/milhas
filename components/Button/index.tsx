import styles from './styles.module.css';
import React, { useState } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  backgroundColor?: string;
  backgroundColorHover?: string;
  label: string;
}

const Button: React.FC<ButtonProps> = ({color, backgroundColor, backgroundColorHover, label, ...props}) => {

  const [btnColor, setBtnColor] = useState(backgroundColor);

  return (
    <button
      {...props} 
      className={styles.btn}
      style={{
        backgroundColor: btnColor,
        color: color,
      }}
      onMouseOver={() => setBtnColor(backgroundColorHover)}
      onMouseOut={() => setBtnColor(backgroundColor)}
    >
      {label}
    </button>
  )
}

export default Button;