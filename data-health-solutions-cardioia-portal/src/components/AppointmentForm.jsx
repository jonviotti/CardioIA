import { useReducer, useState } from 'react'
import { usePatients } from '../contexts/PatientsContext'
import { ACOES, useAppointments } from '../contexts/AppointmentsContext'
import medicos from '../data/medicos.json'
import styles from './AppointmentForm.module.css'

const hoje = () => new Date().toISOString().slice(0, 10)

const FORM_INICIAL = {
  pacienteId: '',
  medicoId: '',
  data: '',
  hora: '',
  tipo: 'Primeira consulta',
  observacoes: '',
}

// Reducer do formulário: concentra todas as mudanças de campo em um só lugar
function formReducer(estado, acao) {
  switch (acao.type) {
    case 'CAMPO':
      return { ...estado, [acao.campo]: acao.valor }
    case 'RESETAR':
      return FORM_INICIAL
    default:
      return estado
  }
}

function validar(form, consultas) {
  const erros = {}
  if (!form.pacienteId) erros.pacienteId = 'Selecione o paciente.'
  if (!form.medicoId) erros.medicoId = 'Selecione o médico.'
  if (!form.data) erros.data = 'Informe a data.'
  else if (form.data < hoje()) erros.data = 'A data não pode estar no passado.'
  if (!form.hora) erros.hora = 'Informe o horário.'
  else if (form.hora < '07:00' || form.hora > '19:00') erros.hora = 'Atendimento das 07:00 às 19:00.'

  const conflito = consultas.some(
    (c) =>
      c.status === 'agendada' &&
      c.medicoId === Number(form.medicoId) &&
      c.data === form.data &&
      c.hora === form.hora,
  )
  if (conflito) erros.hora = 'Este médico já tem consulta neste horário.'
  return erros
}

export default function AppointmentForm() {
  const { pacientes } = usePatients()
  const { consultas, dispatch } = useAppointments()
  const [form, dispatchForm] = useReducer(formReducer, FORM_INICIAL)
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState('')

  const alterar = (e) => {
    dispatchForm({ type: 'CAMPO', campo: e.target.name, valor: e.target.value })
    setErros((atual) => ({ ...atual, [e.target.name]: undefined }))
    setMensagem('')
  }

  const enviar = (e) => {
    e.preventDefault()
    const novosErros = validar(form, consultas)
    setErros(novosErros)
    if (Object.keys(novosErros).length > 0) return

    const paciente = pacientes.find((p) => p.id === Number(form.pacienteId))
    const medico = medicos.find((m) => m.id === Number(form.medicoId))

    dispatch({
      type: ACOES.AGENDAR,
      payload: {
        ...form,
        pacienteId: paciente.id,
        pacienteNome: paciente.nome,
        risco: paciente.risco,
        medicoId: medico.id,
        medicoNome: medico.nome,
        especialidade: medico.especialidade,
      },
    })
    dispatchForm({ type: 'RESETAR' })
    setMensagem(`Consulta de ${paciente.nome} agendada com sucesso!`)
  }

  const pacienteSelecionado = pacientes.find((p) => p.id === Number(form.pacienteId))

  return (
    <form className={styles.form} onSubmit={enviar} noValidate>
      <h2 className={styles.titulo}>Nova consulta</h2>

      <label className={styles.campo}>
        Paciente
        <select name="pacienteId" value={form.pacienteId} onChange={alterar}>
          <option value="">Selecione...</option>
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} {p.risco === 'alto' ? '(alto risco)' : ''}
            </option>
          ))}
        </select>
        {erros.pacienteId && <span className={styles.erro}>{erros.pacienteId}</span>}
      </label>

      {pacienteSelecionado && (
        <p className={styles.dica}>
          Diagnóstico sugerido pela IA: <strong>{pacienteSelecionado.diagnostico}</strong>
          {pacienteSelecionado.risco === 'alto' && ' — priorize uma data próxima.'}
        </p>
      )}

      <label className={styles.campo}>
        Médico
        <select name="medicoId" value={form.medicoId} onChange={alterar}>
          <option value="">Selecione...</option>
          {medicos.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome} — {m.especialidade}
            </option>
          ))}
        </select>
        {erros.medicoId && <span className={styles.erro}>{erros.medicoId}</span>}
      </label>

      <div className={styles.linha}>
        <label className={styles.campo}>
          Data
          <input type="date" name="data" min={hoje()} value={form.data} onChange={alterar} />
          {erros.data && <span className={styles.erro}>{erros.data}</span>}
        </label>
        <label className={styles.campo}>
          Horário
          <input type="time" name="hora" min="07:00" max="19:00" step="900" value={form.hora} onChange={alterar} />
          {erros.hora && <span className={styles.erro}>{erros.hora}</span>}
        </label>
      </div>

      <label className={styles.campo}>
        Tipo
        <select name="tipo" value={form.tipo} onChange={alterar}>
          <option>Primeira consulta</option>
          <option>Retorno</option>
          <option>Exame (ECG)</option>
          <option>Teleconsulta</option>
        </select>
      </label>

      <label className={styles.campo}>
        Observações
        <textarea name="observacoes" rows="3" value={form.observacoes} onChange={alterar} placeholder="Opcional" />
      </label>

      <div className={styles.acoes}>
        <button type="button" className={styles.secundario} onClick={() => dispatchForm({ type: 'RESETAR' })}>
          Limpar
        </button>
        <button type="submit" className={styles.primario}>
          Agendar
        </button>
      </div>

      {mensagem && <p className={styles.sucesso} role="status">{mensagem}</p>}
    </form>
  )
}
