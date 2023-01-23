import styles from './styles.module.css';
import React, { useState } from 'react'

type Props = {
  color?: string;
  backgroundColor?: string;
  backgroundColorHover?: string;
  label: string;
  borderRadius?: string;
  onClick: () => void;
}

const ButtonSmall = ({color, backgroundColor, backgroundColorHover, label, borderRadius, onClick}: Props) => {

  const [btnColor, setBtnColor] = useState(backgroundColor);

  return (
    <button 
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

export default ButtonSmall;