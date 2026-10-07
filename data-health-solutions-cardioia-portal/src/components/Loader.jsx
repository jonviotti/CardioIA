import styles from './Loader.module.css'

export default function Loader({ texto = 'Carregando...' }) {
  return (
    <div className={styles.loader} role="status">
      <span className={styles.pulso} aria-hidden>♥</span>
      {texto}
    </div>
  )
}
