import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from './Layout.module.css'

const LINKS = [
  { to: '/dashboard', rotulo: 'Dashboard' },
  { to: '/pacientes', rotulo: 'Pacientes' },
  { to: '/agendamentos', rotulo: 'Agendamentos' },
]

export default function Layout() {
  const { usuario, logout } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.marca}>
          <span className={styles.logo} aria-hidden>♥</span>
          <span>
            Cardio<strong>IA</strong>
          </span>
        </div>

        <button
          className={styles.menuBotao}
          onClick={() => setMenuAberto((v) => !v)}
          aria-expanded={menuAberto}
          aria-label="Abrir menu"
        >
          ☰
        </button>

        <nav className={`${styles.nav} ${menuAberto ? styles.navAberto : ''}`}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuAberto(false)}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.ativo : ''}`}
            >
              {link.rotulo}
            </NavLink>
          ))}
          <div className={styles.usuario}>
            <span className={styles.avatar}>{usuario?.nome?.[0] ?? '?'}</span>
            <span className={styles.usuarioInfo}>
              <strong>{usuario?.nome}</strong>
              <small>{usuario?.perfil}</small>
            </span>
            <button className={styles.sair} onClick={logout}>
              Sair
            </button>
          </div>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        CardioIA · Data Health Solutions · FIAP — dados simulados para fins acadêmicos
      </footer>
    </div>
  )
}
