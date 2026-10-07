import styles from './StatCard.module.css'

export default function StatCard({ titulo, valor, descricao, tom = 'neutro' }) {
  return (
    <article className={`${styles.card} ${styles[tom]}`}>
      <span className={styles.titulo}>{titulo}</span>
      <strong className={styles.valor}>{valor}</strong>
      {descricao && <span className={styles.descricao}>{descricao}</span>}
    </article>
  )
}
