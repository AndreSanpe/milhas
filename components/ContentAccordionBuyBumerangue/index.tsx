import React, { ReactElement, useCallback, useState } from 'react'
import styles from './styles.module.css';
import ExpandIcon from './expand_more.svg';
import DotsIcon from './more_vert.svg';
import EditIcon from './edit.svg';
import DeleteIcon from './delete.svg';
import { BuyBumerangue } from '../../types/BuyBumerangue';

interface DivProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  children?: ReactElement;
  item: BuyBumerangue;
  menuOpened: string;
  setMenuOpened: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ContentAccordionBuyBumerangue: React.FC<DivProps> = ({item, children, menuOpened, setMenuOpened, onEdit, onDelete, ...props}) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((state) => !state)
  },[setIsOpen])

  /* const date = item.createdAt.toString();
  const validDate = new Date(date); */

  return (<>
    
    {item.pointsQuantity &&
    <div {...props} className={styles.container}>
      
      {/* Visible content */}
      <div className={styles.row}>
        <div className={styles.column}>

          {/* Edit account area */}
          <div className={styles.edit}>
            <div className={styles.iconEdit}>
              <DotsIcon onClick={() => setMenuOpened(item.id as string)}/>
            </div>

            {menuOpened === item.id &&
              <div className={styles.popup}>
                <div className={styles.popupContent}>
                  <div className={styles.popupRow}>
                    <div className={styles.popupColumn} onClick={() => onEdit(item.id as string)}>
                      <EditIcon />
                      <div>Editar</div>
                    </div>
                    <div className={styles.popupColumn} onClick={() => onDelete(item.id as string)}>
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
            <div className={styles.values}>{item.dateBuy ? item.dateBuy : ''}</div>
          </div>
          <div className={styles.doubleColumns}>
            <div className={styles.secundaryTitle}>Pontos/milhas compradas:</div>
            <div className={styles.values}>{item.pointsQuantity ? item.pointsQuantity.toLocaleString('pt-Br') : ''}</div>
          </div> 
          <div className={styles.doubleColumns}>
            <div className={styles.secundaryTitle}>Valor investido:</div>
            <div className={styles.values}>{item.price ? item.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
          </div>
          
          
          
          <div className={styles.doubleColumns}>
            <div className={styles.secundaryTitle}>Conta utilizada:</div>
            <div className={styles.values}>{item.selectedAccount ? item.selectedAccount : ''}</div>
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
            <div className={styles.secundaryTitle}>Programa da compra:</div>
            <div className={styles.values}>{item.program ? item.program : ''}</div>
          </div>
            
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Transferência para:</div>
              <div className={styles.values}>{item.destinyOne ? item.destinyOne : ''}</div>
            </div>
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Bônus da transferência:</div>
              <div className={styles.values}>{item.percentage ? item.percentage.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%' : ''}</div>
            </div> 
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Total após transferência:</div>
              <div className={styles.values}>{item.miles ? item.miles.toLocaleString('pt-Br') : ''}</div>
            </div>
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Bônus de retorno a Livelo:</div>
              <div className={styles.values}>{item.returnPercentage ? item.returnPercentage.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%' : ''}</div>
            </div>
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Pontos retornados a Livelo:</div>
              <div className={styles.values}>{item.points ? item.points.toLocaleString('pt-Br') : ''}</div>
            </div> 
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Nova transferência para:</div>
              <div className={styles.values}>{item.destinyTwo ? item.destinyTwo : ''}</div>
            </div>
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Bônus da transferência:</div>
              <div className={styles.values}>{item.percentageTwo ? item.percentageTwo.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%' : ''}</div>
            </div>                                 
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Total após transferência:</div>
              <div className={styles.values}>{item.milesTwo ? item.milesTwo.toLocaleString('pt-Br') : ''}</div>
            </div> 
          </div> 
        </div>

      </div>
      </>}

      <div className={styles.doubleColumns}>
        <div className={styles.secundaryTitle} style={{fontWeight: '600', fontSize:'13px'}}>Milhas totais acumuladas:</div>
        <div className={styles.values} style={{color: '#6A9000', fontWeight: '600', fontSize: '14px'}}>{item.totalMiles.toLocaleString('pt-BR')}</div>
      </div>   

      <div className={styles.doubleColumns}>
        <div className={styles.secundaryTitle} style={{fontWeight: '600', fontSize:'14px'}}>Valor final do milheiro:</div>
        <div className={styles.values} style={{color: '#6A9000', fontWeight: '600', fontSize: '14px'}}>{item.finalPrice.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
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

export default ContentAccordionBuyBumerangue;
