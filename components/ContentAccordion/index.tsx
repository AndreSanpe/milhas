import React, { ReactElement, useCallback, useState } from 'react'
import styles from './styles.module.css';
import ExpandIcon from './expand_more.svg';
import DotsIcon from './more_vert.svg';
import EditIcon from './edit.svg';
import DeleteIcon from './delete.svg';
import { Account } from '../../types/Account';

interface DivProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  children?: ReactElement;
  item: Account;
  menuOpened: number;
  setMenuOpened: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ContentAccordion: React.FC<DivProps> = ({item, children, menuOpened, setMenuOpened, onEdit, onDelete,  ...props}) => {

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
          
          {/* Edit account area */}
          <div className={styles.edit}>
            <div className={styles.iconEdit}>
              <DotsIcon onClick={() => setMenuOpened(item.id as number)}/>
            </div>

            {menuOpened === item.id &&
              <div className={styles.popup}>
                <div className={styles.popupContent}>
                  <div className={styles.popupRow}>
                    <div className={styles.popupColumn} onClick={() => onEdit(item.id as number)}>
                      <EditIcon />
                      <div>Editar</div>
                    </div>
                    <div className={styles.popupColumn} onClick={() => onDelete(item.id as number)}>
                      <DeleteIcon />
                      <div>Deletar</div>
                    </div>
                  </div>
                  
                </div>
              </div>
            }
            
          </div> 
          {/* Edit area end's */}
          
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
            <div className={styles.tripleColumns}>
              <div className={styles.clubTitle}>Clubes:</div>
              <div className={styles.statusTitle}>Clube ativo:</div>
              <div className={styles.priceTitle}>Valor mensal:</div>
            </div>

            {/* Data: Livelo */}
            <div className={styles.tripleColumns}>
              <div className={styles.clubText}>Livelo</div>
              <div className={styles.statusText}>{item.statusLivelo ? 'SIM':'NÃO'}</div>
              <div className={styles.priceText}>{item.priceLivelo.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
            </div>

            {/* Data: Esfera */}
            <div className={styles.tripleColumns}>
              <div className={styles.clubText}>Esfera</div>
              <div className={styles.statusText}>{item.statusEsfera ? 'SIM':'NÃO'}</div>
              <div className={styles.priceText}>{item.priceEsfera.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
            </div>

            {/* Data: Azul */}
            <div className={styles.tripleColumns}>
              <div className={styles.clubText}>Tudo Azul</div>
              <div className={styles.statusText}>{item.statusAzul ? 'SIM':'NÃO'}</div>
              <div className={styles.priceText}>{item.priceAzul.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
            </div>

            {/* Data: Latam */}
            <div className={styles.tripleColumns}>
              <div className={styles.clubText}>Latam Pass</div>
              <div className={styles.statusText}>{item.statusLatam ? 'SIM':'NÃO'}</div>
              <div className={styles.priceText}>{item.priceLatam.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
            </div>

            {/* Data: Smiles */}
            <div className={styles.tripleColumns}>
              <div className={styles.clubText}>Smiles</div>
              <div className={styles.statusText}>{item.statusSmiles ? 'SIM':'NÃO'}</div>
              <div className={styles.priceText}>{item.priceSmiles.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
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
