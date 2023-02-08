import React, { useState } from 'react';
import styles from './styles.module.css';
import ExpandMore from './expand_more.svg';

type DropwdownProps = {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  options: string[];
}

const Dropdown = ({selected, setSelected, options}: DropwdownProps) => {

  const [ isActive, setIsActive ] = useState<boolean>(false);

  return (
    <div className={styles.dropdown}>

      <div className={styles.dropdownBtn} onClick={e => setIsActive(!isActive)}>
        
        {selected ? <span style={{color: '#292929', fontWeight: '400'}}>{selected}</span> : 'Escolha uma opção:'}
        <ExpandMore />
      </div>

      {isActive &&
        <div className={styles.content}>
          {options.map((item, index) => (
            <div className={styles.item} 
            onClick={e => {
              setSelected(item)
              setIsActive(false)
            }} key={index}
            >
              {item}
            </div>
          ))}
        </div>
      }
      
    </div>
  )
}

export default Dropdown;