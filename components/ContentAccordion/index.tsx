import React, { ReactElement, useCallback, useState } from 'react'
import styles from './styles.module.css';
import ExpandIcon from './expand_more.svg';

interface DivProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  children?: ReactElement;
  item: any
}

const ContentAccordion: React.FC<DivProps> = ({item, children, ...props}) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((state) => !state)
  },[setIsOpen])

  return (<>
    
    {item.name &&
    <div {...props} className={styles.container}>
      
      {/* Visible content */}
      <div className={styles.row}>
        <div className={styles.column}>
          <div className={styles.doubleColumns}>
            <div className={styles.secundaryTitle}>Nome da conta:</div>
            <div className={styles.text}>{item.name}</div>
          </div>
          <div className={styles.doubleColumns}>
            <div className={styles.secundaryTitle}>Documento CPF:</div>
            <div className={styles.text}>{item.document}</div>
          </div>
        </div> 
      </div>
      {!isOpen &&
        <div onClick={toggle} className={styles.showMore}>
          <div style={{display: 'flex'}}><ExpandIcon /></div>
          <div>Ver mais detalhes</div>
        </div>
      } 

      {/* Invisible content */}
      {isOpen &&
      <div className={styles.dataAccount} >
        <div className={styles.row} >
          <div className={styles.column}>

            {/* Content data title */}
            <div className={styles.tripleColumns} style={{borderBottom: '1px solid #E0E0E0'}}>
              <div className={styles.clubTitle}>Clubes:</div>
              <div className={styles.statusTitle}>Clube ativo:</div>
              <div className={styles.priceTitle}>Valor mensal:</div>
            </div>

            {/* Data: Livelo */}
            <div className={styles.tripleColumns}>
              <div className={styles.clubText}>Livelo</div>
              <div className={styles.statusText}>{item.statusLivelo ? 'SIM':'NÃO'}</div>
              <div className={styles.priceText}>{item.priceLivelo}</div>
            </div>

            {/* Data: Esfera */}
            <div className={styles.tripleColumns}>
              <div className={styles.clubText}>Esfera</div>
              <div className={styles.statusText}>{item.statusEsfera ? 'SIM':'NÃO'}</div>
              <div className={styles.priceText}>{item.priceEsfera}</div>
            </div>

            {/* Data: Azul */}
            <div className={styles.tripleColumns}>
              <div className={styles.clubText}>Tudo Azul</div>
              <div className={styles.statusText}>{item.statusAzul ? 'SIM':'NÃO'}</div>
              <div className={styles.priceText}>{item.priceAzul}</div>
            </div>

            {/* Data: Latam */}
            <div className={styles.tripleColumns}>
              <div className={styles.clubText}>Latam Pass</div>
              <div className={styles.statusText}>{item.statusLatam ? 'SIM':'NÃO'}</div>
              <div className={styles.priceText}>{item.priceLatam}</div>
            </div>

            {/* Data: Smiles */}
            <div className={styles.tripleColumns}>
              <div className={styles.clubText}>Smiles</div>
              <div className={styles.statusText}>{item.statusSmiles ? 'SIM':'NÃO'}</div>
              <div className={styles.priceText}>{item.priceSmiles}</div>
            </div>

          </div>
        </div> 
        {isOpen &&
        <div onClick={toggle} className={styles.showMore}>
          <div style={{display: 'flex', transform: 'rotate(180deg)'}}><ExpandIcon /></div>
          <div>Ver menos detalhes</div>
        </div>
        } 
      </div>

      
      }


    </div> }
    {/* General container */} 

  </>)
}

export default ContentAccordion;
