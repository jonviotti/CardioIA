import styles from './RiskBadge.module.css'

export default function RiskBadge({ risco }) {
  const alto = risco === 'alto'
  return (
    <span className={`${styles.badge} ${alto ? styles.alto : styles.baixo}`}>
      {alto ? 'Alto risco' : 'Baixo risco'}
    </span>
  )
}
