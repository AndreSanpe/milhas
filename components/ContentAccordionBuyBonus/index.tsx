import React, { ReactElement, useCallback, useState } from 'react'
import styles from './styles.module.css';
import ExpandIcon from './expand_more.svg';
import { BuyBonus } from '../../types/BuyBonus';

interface DivProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  children?: ReactElement;
  item: BuyBonus;
}

const ContentAccordion: React.FC<DivProps> = ({item, children, ...props}) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((state) => !state)
  },[setIsOpen])

  const date = item.createdAt.toString();
  const validDate = new Date(date);

  return (<>
    
    {item.product &&
    <div {...props} className={styles.container}>
      
      {/* Visible content */}
      <div className={styles.row}>
        <div className={styles.column}>
          <div className={styles.doubleColumns}>
            <div className={styles.secundaryTitle}>Data da compra:</div>
            <div className={styles.values}>{validDate.toLocaleDateString('pt-BR')}</div>
          </div>
          <div className={styles.doubleColumns}>
            <div className={styles.secundaryTitle}>Produto:</div>
            <div className={styles.values}>{item.product}</div>
          </div>
          <div className={styles.doubleColumns}>
            <div className={styles.secundaryTitle}>Preço do produto:</div>
            <div className={styles.values}>{item.price ? item.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
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
      <>
      <div className={styles.dataAccount} >
        <div className={styles.row}>
          
          {/* Fixed items////////////////////////////////////////////////////////// */}
          <div className={styles.column}>
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Pontos ganhos por real:</div>
              <div className={styles.values}>{item.pointsForReal}</div>
            </div>
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Programa de acúmulo:</div>
              <div className={styles.values}>{item.program}</div>
            </div>
            
            {/* O cartão utilizado acumula pontos? If True: ///////////////////////*/}
            {item.pointsCardQuantity ? <>
              <div className={styles.doubleColumns}>
                <div className={styles.secundaryTitle}>Pontos acumulados pelo cartão:</div>
                <div className={styles.values}>{item.pointsCardQuantity ? item.pointsCardQuantity.toLocaleString('pt-BR') : ''}</div>
              </div>
              <div className={styles.doubleColumns}>
                <div className={styles.secundaryTitle}>Total de pontos Produto + Cartão:</div>
                <div className={styles.values}>{item.totalpoints ? item.totalpoints.toLocaleString('pt-BR') : ''}</div>
              </div> </> : ''
            } 

            {item.destiny ? <>
              <div className={styles.doubleColumns}>
                <div className={styles.secundaryTitle}>Transferência para:</div>
                <div className={styles.values}>{item.destiny}</div>
              </div>
              <div className={styles.doubleColumns}>
                <div className={styles.secundaryTitle}>Bônus da transferência:</div>
                <div className={styles.values}>{item.percentage ? item.percentage.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%' : ''}</div>
              </div>
              <div className={styles.doubleColumns}>
                <div className={styles.secundaryTitle}>Total após transferência:</div>
                <div className={styles.values}>{item.miles ? item.miles.toLocaleString('pt-BR') : ''}</div>
              </div>
            </> : ''}

            {/* Fixed items////////////////////////////////////////////////////////// */}
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Valor recuperado na venda das milhas:</div>
              <div className={styles.values} style={{color: '#F25C05'}}>{item.priceMiles ? item.priceMiles.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
            </div>

            {item.secureValue ? <>
              <div className={styles.doubleColumns}>
                <div className={styles.secundaryTitle}>Seguro proteção de preço:</div>
                <div className={styles.values} style={{color: '#F25C05'}}>{item.secureValue ? item.secureValue.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
              </div>
            </> : ''
            }

            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle}>Percentual de desconto:</div>
              <div className={styles.values} style={{color: '#F25C05'}}>{item.percentageProfit ? item.percentageProfit.toLocaleString('pt-BR', {maximumFractionDigits: 2})+'%' : ''}</div>
            </div>
            <div className={styles.doubleColumns}>
              <div className={styles.secundaryTitle} style={{fontWeight: '600', fontSize:'14px'}}>Preço final do produto:</div>
              <div className={styles.values} style={{color: '#6A9000', fontWeight: '600', fontSize: '14px'}}>{item.finalPrice ? item.finalPrice.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}) : ''}</div>
            </div>
          </div> 
        </div>

        {/* Button see more / see less*/}
        {isOpen &&
        <div onClick={toggle} className={styles.showMore}>
          <div style={{display: 'flex', transform: 'rotate(180deg)'}}><ExpandIcon /></div>
          <div>Ver menos detalhes</div>
        </div>
        } 

      </div>

      
      </>}


    </div> }
    {/* General container */} 

  </>)
}

export default ContentAccordion;
