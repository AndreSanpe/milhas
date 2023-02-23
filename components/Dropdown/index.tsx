import React, { HTMLAttributes, InputHTMLAttributes, useState } from 'react';
import styles from './styles.module.css';
import ExpandMore from './expand_more.svg';

interface DropwdownProps extends InputHTMLAttributes<HTMLInputElement>  {
  onSet?: (newValue: any) => void;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  setIndice?: React.Dispatch<React.SetStateAction<number>>;
  options: string[];
}

const Dropdown = ({selected, setSelected, setIndice, options, onSet, ...props}: DropwdownProps) => {

  const [ isActive, setIsActive ] = useState<boolean>(false);

  return (
    <div className={styles.dropdown}>

      <div className={styles.dropdownBtn} style={ isActive ? {borderColor: '#FFAD7D'} : {borderColor: '#DCE7FF'}} onClick={e => setIsActive(!isActive)} {...props}>
        
        {selected ? <span style={{color: '#292929', fontWeight: '400'}}>{selected}</span> : 'Escolha uma opção:'}
        <ExpandMore />
      </div>

      {isActive &&
        <div className={styles.content}>
          {options.map((item, index) => (
            <div className={styles.item} 
              onClick={e => {
              setSelected(item)
              if(setIndice) {
                setIndice(index)
              }
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