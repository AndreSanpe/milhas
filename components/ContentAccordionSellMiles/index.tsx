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
            <div className={styles.secundaryTitle}>Milhas vendidas:</div>
            <div className={styles.values}>{item.pointsQuantity ? item.pointsQuantity.toLocaleString('pt-BR') : ''}</div>
          </div>
          <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Programa da venda:</div>
              <div className={styles.values}>{item.program ? item.program : ''}</div>
            </div> 
          <div className={styles.doubleColumns}>
            <div className={styles.secundaryTitle}>Data da venda:</div>
            <div className={styles.values}>{item.dateSell ? item.dateSell : ''}</div>
          </div>
          <div className={styles.doubleColumns}>
            <div className={styles.secundaryTitle}>Conta utilizada:</div>
            <div className={styles.values}>{item.selectedAccount}</div>
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
              <div className={styles.secundaryTitle}>Documento CPF:</div>
              <div className={styles.values}>{item.cpf ? item.cpf : ''}</div>
            </div>
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Valor investido:</div>
              <div className={styles.values}>{item.priceBuy ? item.priceBuy.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
            </div>
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Valor recebido pela venda:</div>
              <div className={styles.values}>{item.priceSell ? item.priceSell.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
            </div>
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Vendido para:</div>
              <div className={styles.values}>{item.programBuyer ? item.programBuyer : ''}</div>
            </div>
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Prazo de recebimento:</div>
              <div className={styles.values}>{item.receipt ? item.receipt+' dias' : ''}</div>
            </div>
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Data de recebimento:</div>
              <div className={styles.values}>{item.dateReceipt ? item.dateReceipt : ''}</div>
            </div>                   

            {item.percentageProfit > 0 ?
              <div className={styles.doubleColumns}>
                <div className={styles.secundaryTitle}>Em percentual:</div>
                <div className={styles.values} style={{color: '#6A9000'}}>{item.percentageProfit ? '+'+item.percentageProfit.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%' : ''}</div>
              </div> : ''
            }

            {item.percentageProfit == 0 ?
              <div className={styles.doubleColumns}>
                <div className={styles.secundaryTitle}>Em percentual:</div>
                <div className={styles.values} style={{color: '#F29E05'}}>{item.percentageProfit.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%' }</div>
              </div> : ''
            }
            
            {item.percentageProfit < 0 ?
              <div className={styles.doubleColumns}>
                <div className={styles.secundaryTitle}>Em percentual:</div>
                <div className={styles.values} style={{color: '#D92B05'}}>{item.percentageProfit ? item.percentageProfit.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%' : ''}</div>
              </div> : ''
            }
            
          </div> 
        </div>

      </div>
      </>}

      {item.profit > 0  && 
        <div className={styles.doubleColumns}>
          <div className={styles.secundaryTitle} style={{fontWeight: '600', fontSize:'14px'}}>Lucro estimado:</div>
          <div className={styles.values} style={{color: '#6A9000', fontWeight: '600', fontSize: '14px'}}>{item.profit.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
        </div>        
      }

      {item.profit == 0  && 
        <div className={styles.doubleColumns}>
          <div className={styles.secundaryTitle} style={{fontWeight: '600', fontSize:'14px'}}>Lucro estimado:</div>
          <div className={styles.values} style={{color: '#F29E05', fontWeight: '600', fontSize: '14px'}}>{item.profit.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
        </div>        
      }

      {item.profit < 0  && 
        <div className={styles.doubleColumns}>
          <div className={styles.secundaryTitle} style={{fontWeight: '600', fontSize:'14px'}}>Prejuízo estimado:</div>
          <div className={styles.values} style={{color: '#D92B05', fontWeight: '600', fontSize: '14px'}}>{item.profit.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
        </div>        
      }
      
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
