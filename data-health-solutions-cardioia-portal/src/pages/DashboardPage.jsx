import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { usePatients } from '../contexts/PatientsContext'
import { useAppointments } from '../contexts/AppointmentsContext'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import AppointmentList from '../components/AppointmentList'
import Loader from '../components/Loader'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  const { usuario } = useAuth()
  const { pacientes, carregando } = usePatients()
  const { consultas } = useAppointments()

  const metricas = useMemo(() => {
    const agendadas = consultas.filter((c) => c.status === 'agendada')
    const altoRisco = pacientes.filter((p) => p.risco === 'alto')
    const comConsulta = new Set(agendadas.map((c) => c.pacienteId))
    const altoRiscoSemConsulta = altoRisco.filter((p) => !comConsulta.has(p.id))

    const porDiagnostico = pacientes.reduce((acc, p) => {
      acc[p.diagnostico] = (acc[p.diagnostico] ?? 0) + 1
      return acc
    }, {})

    const proximas = [...agendadas]
      .sort((a, b) => `${a.data}${a.hora}`.localeCompare(`${b.data}${b.hora}`))
      .slice(0, 5)

    return {
      totalPacientes: pacientes.length,
      agendadas: agendadas.length,
      concluidas: consultas.filter((c) => c.status === 'concluida').length,
      altoRisco: altoRisco.length,
      altoRiscoSemConsulta,
      porDiagnostico: Object.entries(porDiagnostico).sort((a, b) => b[1] - a[1]),
      proximas,
    }
  }, [pacientes, consultas])

  if (carregando) return <Loader texto="Carregando painel..." />

  const maior = metricas.porDiagnostico[0]?.[1] ?? 1

  return (
    <>
      <PageHeader
        titulo={`Olá, ${usuario?.nome?.split(' ').slice(0, 2).join(' ')}`}
        subtitulo="Resumo do atendimento cardiológico de hoje."
      />

      <section className={styles.metricas}>
        <StatCard titulo="Pacientes" valor={metricas.totalPacientes} descricao="triados pela IA" />
        <StatCard titulo="Consultas agendadas" valor={metricas.agendadas} tom="alerta" descricao="aguardando atendimento" />
        <StatCard titulo="Consultas concluídas" valor={metricas.concluidas} tom="sucesso" />
        <StatCard titulo="Alto risco" valor={metricas.altoRisco} tom="primario" descricao={`${metricas.altoRiscoSemConsulta.length} sem consulta`} />
      </section>

      <section className={styles.grade}>
        <div className={styles.painel}>
          <div className={styles.painelTopo}>
            <h2>Próximas consultas</h2>
            <Link to="/agendamentos">Ver todas</Link>
          </div>
          <AppointmentList consultas={metricas.proximas} compacta />
        </div>

        <div className={styles.painel}>
          <h2>Diagnósticos sugeridos</h2>
          <ul className={styles.barras}>
            {metricas.porDiagnostico.map(([diagnostico, total]) => (
              <li key={diagnostico}>
                <div className={styles.barraRotulo}>
                  <span>{diagnostico}</span>
                  <strong>{total}</strong>
                </div>
                <div className={styles.barraTrilho}>
                  <div className={styles.barra} style={{ width: `${(total / maior) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {metricas.altoRiscoSemConsulta.length > 0 && (
        <section className={`${styles.painel} ${styles.alerta}`}>
          <h2>Pacientes de alto risco sem consulta</h2>
          <ul className={styles.listaAlerta}>
            {metricas.altoRiscoSemConsulta.map((p) => (
              <li key={p.id}>
                <strong>{p.nome}</strong> · {p.diagnostico}
              </li>
            ))}
          </ul>
          <Link to="/agendamentos" className={styles.cta}>Agendar agora</Link>
        </section>
      )}
    </>
  )
}
