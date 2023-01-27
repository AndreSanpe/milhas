import styles from './styles.module.css';
import React, { useState } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
  backgroundColor?: string;
  backgroundColorHover?: string;
  label: string;
  borderRadius?: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({color, backgroundColor, backgroundColorHover, label, borderRadius, onClick, ...props}) => {

  const [btnColor, setBtnColor] = useState(backgroundColor);

  return (
    <button
      {...props} 
      className={styles.btn}
      onClick={onClick}
      style={{
        backgroundColor: btnColor,
        color: color,
        borderRadius: borderRadius,
      }}
      onMouseOver={() => setBtnColor(backgroundColorHover)}
      onMouseOut={() => setBtnColor(backgroundColor)}
    >
      {label}
    </button>
  )
}

export default Button;