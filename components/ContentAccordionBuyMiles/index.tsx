import React, { ReactElement, useCallback, useState } from 'react'
import styles from './styles.module.css';
import ExpandIcon from './expand_more.svg';
import DotsIcon from './more_vert.svg';
import EditIcon from './edit.svg';
import DeleteIcon from './delete.svg';
import { SellMiles } from '../../types/SellMiles';

interface DivProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  children?: ReactElement;
  item: SellMiles;
  menuOpened: number;
  setMenuOpened: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ContentAccordionSellMiles: React.FC<DivProps> = ({item, children, menuOpened, setMenuOpened, onEdit, onDelete, ...props}) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((state) => !state)
  },[setIsOpen])

  const date = item.createdAt.toString();
  const validDate = new Date(date);

  return (<>
    
    {item.pointsQuantity &&
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
            <div className={styles.secundaryTitle}>Data da compra:</div>
            <div className={styles.values}>{validDate.toLocaleDateString('pt-BR')}</div>
          </div>
          <div className={styles.doubleColumns}>
            <div className={styles.secundaryTitle}>Produto:</div>
            <div className={styles.values}>...</div>
          </div>
          <div className={styles.doubleColumns}>
            <div className={styles.secundaryTitle}>Preço do produto:</div>
            <div className={styles.values}>{item.priceBuy ? item.priceBuy.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
          </div>
        </div> 
      </div>

      

      {/* Invisible content */}
      {isOpen &&
      <>
      <div className={styles.dataAccount} >
        <div className={styles.row}>
          
          {/* Fixed items////////////////////////////////////////////////////////// */}
          <div className={styles.column}>
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Pontos ganhos por real:</div>
              <div className={styles.values}>...</div>
            </div>
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Programa de acúmulo:</div>
              <div className={styles.values}>{item.program}</div>
            </div>          

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Percentual de desconto:</div>
              <div className={styles.values} style={{color: '#F25C05'}}>{item.percentageProfit ? item.percentageProfit.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%' : ''}</div>
            </div>
            
          </div> 
        </div>

      </div>
      </>}

      <div className={styles.doubleColumns}>
        <div className={styles.secundaryTitle} style={{fontWeight: '600', fontSize:'14px'}}>Preço final do produto:</div>
        <div className={styles.values} style={{color: '#6A9000', fontWeight: '600', fontSize: '14px'}}>{item.profit ? item.profit.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
      </div>
      
      {!isOpen &&
        <div onClick={toggle} className={styles.showMore}>
          <div style={{display: 'flex'}}><ExpandIcon /></div>
          <div>Ver mais detalhes</div>
        </div>
      } 
      {/* Button see more / see less*/}
      {isOpen &&
        <div onClick={toggle} className={styles.showMore}>
          <div style={{display: 'flex', transform: 'rotate(180deg)'}}><ExpandIcon /></div>
          <div>Ver menos detalhes</div>
        </div>
        } 


    </div> }
    {/* General container */} 

  </>)
}

export default ContentAccordionSellMiles;
