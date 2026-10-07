import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <div className={styles.pagina}>
      <h1>404</h1>
      <p>Página não encontrada.</p>
      <Link to="/dashboard">Voltar ao portal</Link>
    </div>
  )
}
