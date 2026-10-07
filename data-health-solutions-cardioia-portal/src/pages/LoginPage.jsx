import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const { login, autenticado } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destino = location.state?.from?.pathname ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (autenticado) return <Navigate to={destino} replace />

  const entrar = async (e) => {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await login(email, senha)
      navigate(destino, { replace: true })
    } catch (err) {
      setErro(err.message)
      setEnviando(false)
    }
  }

  const preencherDemo = () => {
    setEmail('medico@cardioia.com')
    setSenha('cardio123')
  }

  return (
    <div className={styles.pagina}>
      <section className={styles.apresentacao}>
        <span className={styles.logo}>♥</span>
        <h1>
          Cardio<strong>IA</strong>
        </h1>
        <p>Portal de diagnóstico assistido por IA em cardiologia.</p>
        <ul>
          <li>Pacientes triados pelo Estetoscópio Digital</li>
          <li>Agendamento de consultas</li>
          <li>Painel com métricas do atendimento</li>
        </ul>
      </section>

      <form className={styles.form} onSubmit={entrar}>
        <h2>Entrar</h2>
        <p className={styles.subtitulo}>Acesse com suas credenciais de profissional.</p>

        <label className={styles.campo}>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="medico@cardioia.com"
            autoComplete="username"
            required
          />
        </label>
        <label className={styles.campo}>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </label>

        {erro && <p className={styles.erro} role="alert">{erro}</p>}

        <button type="submit" className={styles.botao} disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>

        <button type="button" className={styles.demo} onClick={preencherDemo}>
          Usar conta de demonstração
        </button>
      </form>
    </div>
  )
}
