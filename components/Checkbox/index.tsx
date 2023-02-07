import React, { InputHTMLAttributes } from 'react';
import styles from './styles.module.css';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  initialValue: boolean;
  onSet: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, initialValue, onSet, ...props }) => {

  return (<>
    <label className={styles.container}>{label}
      
      <input 
        {...props}
        type="checkbox" 
        checked={initialValue} 
        onChange={(e) => onSet(e)}
      />
      
      <span className={styles.checkmark} />
    
    </label>
  </>)
}

export default Checkbox;



/* //////////Use exemple 

<Checkbox 
  name='azul'
  label='Tudo Azul'
  initialValue={values.azul}
  onSet={(e) => handleValuesBooleans(e)}
/> 

 ////////Function that handles booleans values

 const handleValuesBooleans = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setValues({
    ...values,
    [e.target.name]: e.target.checked
  }) 
}, [values])

*/