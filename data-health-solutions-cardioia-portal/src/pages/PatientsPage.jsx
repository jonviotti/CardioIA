import { useMemo, useState } from 'react'
import { usePatients } from '../contexts/PatientsContext'
import PageHeader from '../components/PageHeader'
import PatientCard from '../components/PatientCard'
import Loader from '../components/Loader'
import styles from './PatientsPage.module.css'

const normalizar = (texto) =>
  texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function PatientsPage() {
  const { pacientes, fonte, carregando, erro } = usePatients()
  const [busca, setBusca] = useState('')
  const [risco, setRisco] = useState('todos')

  const filtrados = useMemo(() => {
    const termo = normalizar(busca)
    return pacientes.filter((p) => {
      const casaRisco = risco === 'todos' || p.risco === risco
      const casaBusca =
        !termo ||
        normalizar(p.nome).includes(termo) ||
        normalizar(p.diagnostico).includes(termo) ||
        p.sintomas.some((s) => normalizar(s).includes(termo))
      return casaRisco && casaBusca
    })
  }, [pacientes, busca, risco])

  if (carregando) return <Loader texto="Buscando pacientes..." />
  if (erro) return <p className={styles.erro}>{erro}</p>

  return (
    <>
      <PageHeader titulo="Pacientes" subtitulo={`${pacientes.length} pacientes · fonte: ${fonte}`} />

      <div className={styles.filtros}>
        <input
          type="search"
          className={styles.busca}
          placeholder="Buscar por nome, sintoma ou diagnóstico..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <div className={styles.segmentos} role="group" aria-label="Filtrar por risco">
          {[
            ['todos', 'Todos'],
            ['alto', 'Alto risco'],
            ['baixo', 'Baixo risco'],
          ].map(([valor, rotulo]) => (
            <button
              key={valor}
              className={risco === valor ? styles.segmentoAtivo : ''}
              onClick={() => setRisco(valor)}
              aria-pressed={risco === valor}
            >
              {rotulo}
            </button>
          ))}
        </div>
      </div>

      {filtrados.length === 0 ? (
        <p className={styles.vazio}>Nenhum paciente encontrado.</p>
      ) : (
        <div className={styles.grade}>
          {filtrados.map((p) => (
            <PatientCard key={p.id} paciente={p} />
          ))}
        </div>
      )}
    </>
  )
}
