import React, { ReactElement } from 'react'
import styles from './styles.module.css';

interface DivProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  children: ReactElement;
}

const Content: React.FC<DivProps> = ({children, ...props}) => {
  return (
    <div {...props} className={styles.container}>
      {children}
    </div>
  )
}

export default Content;