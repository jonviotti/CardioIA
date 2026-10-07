import { useMemo, useState } from 'react'
import { useAppointments } from '../contexts/AppointmentsContext'
import { usePatients } from '../contexts/PatientsContext'
import PageHeader from '../components/PageHeader'
import AppointmentForm from '../components/AppointmentForm'
import AppointmentList from '../components/AppointmentList'
import Loader from '../components/Loader'
import styles from './AppointmentsPage.module.css'

const FILTROS = [
  ['agendada', 'Agendadas'],
  ['concluida', 'Concluídas'],
  ['cancelada', 'Canceladas'],
  ['todas', 'Todas'],
]

export default function AppointmentsPage() {
  const { carregando } = usePatients()
  const { consultas } = useAppointments()
  const [filtro, setFiltro] = useState('agendada')

  const lista = useMemo(
    () =>
      consultas
        .filter((c) => filtro === 'todas' || c.status === filtro)
        .sort((a, b) => `${a.data}${a.hora}`.localeCompare(`${b.data}${b.hora}`)),
    [consultas, filtro],
  )

  if (carregando) return <Loader />

  return (
    <>
      <PageHeader titulo="Agendamentos" subtitulo="Marque e acompanhe as consultas dos pacientes." />

      <div className={styles.grade}>
        <AppointmentForm />

        <section className={styles.lista}>
          <div className={styles.abas} role="tablist">
            {FILTROS.map(([valor, rotulo]) => (
              <button
                key={valor}
                role="tab"
                aria-selected={filtro === valor}
                className={filtro === valor ? styles.abaAtiva : ''}
                onClick={() => setFiltro(valor)}
              >
                {rotulo} ({valor === 'todas' ? consultas.length : consultas.filter((c) => c.status === valor).length})
              </button>
            ))}
          </div>
          <AppointmentList consultas={lista} />
        </section>
      </div>
    </>
  )
}
