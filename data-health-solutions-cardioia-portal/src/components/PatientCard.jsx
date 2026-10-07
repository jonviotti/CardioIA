import RiskBadge from './RiskBadge'
import styles from './PatientCard.module.css'

export default function PatientCard({ paciente }) {
  return (
    <article className={styles.card}>
      <header className={styles.topo}>
        <div>
          <h3 className={styles.nome}>{paciente.nome}</h3>
          <span className={styles.meta}>
            {paciente.idade} anos · {paciente.sexo === 'F' ? 'Feminino' : 'Masculino'} · {paciente.cidade}
          </span>
        </div>
        <RiskBadge risco={paciente.risco} />
      </header>

      <blockquote className={styles.relato}>“{paciente.relato}”</blockquote>

      <div className={styles.sintomas}>
        {paciente.sintomas.map((s) => (
          <span key={s} className={styles.tag}>{s}</span>
        ))}
      </div>

      <footer className={styles.rodape}>
        <span>
          Diagnóstico sugerido: <strong>{paciente.diagnostico}</strong>
        </span>
        <span className={styles.contato}>{paciente.email} · {paciente.telefone}</span>
      </footer>
    </article>
  )
}
