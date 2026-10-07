import { ACOES, useAppointments } from '../contexts/AppointmentsContext'
import RiskBadge from './RiskBadge'
import styles from './AppointmentList.module.css'

const ROTULO_STATUS = {
  agendada: 'Agendada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
}

const formatarData = (data) => data.split('-').reverse().join('/')

export default function AppointmentList({ consultas, compacta = false }) {
  const { dispatch } = useAppointments()

  if (consultas.length === 0) {
    return <p className={styles.vazio}>Nenhuma consulta para exibir.</p>
  }

  return (
    <ul className={styles.lista}>
      {consultas.map((c) => (
        <li key={c.id} className={`${styles.item} ${styles[c.status]}`}>
          <div className={styles.quando}>
            <strong>{formatarData(c.data)}</strong>
            <span>{c.hora}</span>
          </div>
          <div className={styles.detalhes}>
            <div className={styles.linhaNome}>
              <strong>{c.pacienteNome}</strong>
              <RiskBadge risco={c.risco} />
            </div>
            <span className={styles.meta}>
              {c.tipo} · {c.medicoNome}
            </span>
            {!compacta && c.observacoes && <span className={styles.obs}>{c.observacoes}</span>}
          </div>
          <div className={styles.lado}>
            <span className={`${styles.status} ${styles['s_' + c.status]}`}>{ROTULO_STATUS[c.status]}</span>
            {!compacta && c.status === 'agendada' && (
              <div className={styles.botoes}>
                <button onClick={() => dispatch({ type: ACOES.CONCLUIR, id: c.id })}>Concluir</button>
                <button onClick={() => dispatch({ type: ACOES.CANCELAR, id: c.id })}>Cancelar</button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
