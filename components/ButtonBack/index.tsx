import styles from './styles.module.css';
import BackIcon from './arrow_back.svg';
import { useRouter } from 'next/router';

const ButtonBack = () => {

  const router = useRouter();

  return (
    <div className={styles.back} onClick={() => router.push('/dashboard')}> 
      <BackIcon />
      <span style={{paddingLeft: '4px'}}>voltar</span> 
    </div>
  )
}

export default ButtonBack;