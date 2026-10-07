import styles from './PageHeader.module.css'

export default function PageHeader({ titulo, subtitulo, children }) {
  return (
    <div className={styles.cabecalho}>
      <div>
        <h1 className={styles.titulo}>{titulo}</h1>
        {subtitulo && <p className={styles.subtitulo}>{subtitulo}</p>}
      </div>
      {children && <div className={styles.acoes}>{children}</div>}
    </div>
  )
}
