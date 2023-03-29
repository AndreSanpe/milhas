import styles from './styles.module.css';
import BackIcon from './arrow_back.svg';
import { useRouter } from 'next/router';

type Props = {
  route: string;
}

const ButtonBack = ({route}: Props) => {

  const router = useRouter();

  return (
    <div className={styles.back} onClick={() => router.push(route)}> 
      <BackIcon />
    </div>
  )
}

export default ButtonBack;