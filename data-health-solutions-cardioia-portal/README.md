# FIAP - Faculdade de Informática e Administração Paulista

<p align="center">
<a href= "https://www.fiap.com.br/"><img src="assets/logo-fiap.png" alt="FIAP - Faculdade de Informática e Administração Paulista" border="0" width=40% height=40%></a>
</p>

<br>

# CardioIA Portal — Ir Além 1: Interface do CardioIA

## Data Health Solutions

## 🎥 Demonstração

👉 **[Link para o vídeo no YouTube (não listado)](#)**

## 👨‍🎓 Integrantes: 
- <a href="https://www.linkedin.com/in/gabriel-oliveira-b6353a16b/">Gabriel Oliveira dos Santos</a> — RM567166
- <a href="https://www.linkedin.com/in/arthur-bruttel-7171b8381">Arthur Bruttel Nascimento</a> — RM568484
- <a href="https://www.linkedin.com/in/jonviotti/">Jonatan Viotti Rodrigues da Silva</a> — RM566787
- <a href="https://www.linkedin.com/in/eusamuelrocha/">Samuel Nicolas Oliveira Rocha</a> — RM568552

## 👩‍🏫 Professores:
### Tutor(a) 
- <a href="https://www.linkedin.com/in/leonardoorabona/">Leonardo Ruiz Orabona</a>
### Coordenador(a)
- <a href="https://www.linkedin.com/company/inova-fusca">André Godoi Chiovato</a>


## 📜 Descrição

Portal web responsivo em **React + Vite** que simula a rotina de um portal de diagnóstico em cardiologia: login de profissionais, listagem de pacientes triados pela IA, agendamento de consultas e um dashboard com métricas. Todos os dados são simulados e não há back-end.

Os pacientes reaproveitam os dados da Fase 2: os relatos vêm do `sintomas.txt` do **Estetoscópio Digital**, os diagnósticos do `mapa_conhecimento.csv` e o nível de risco segue os rótulos do **Classificador de Texto** ("alto risco" / "baixo risco").

**Requisitos atendidos:**

| Requisito do enunciado | Onde está |
| --- | --- |
| Autenticação simulada via Context API com JWT fake no `localStorage` | `src/contexts/AuthContext.jsx`, `src/services/authService.js` |
| Listagem de pacientes com API fake (JSONPlaceholder) ou base simulada | `src/services/patientService.js`, `src/contexts/PatientsContext.jsx`, `src/pages/PatientsPage.jsx` |
| Formulário de agendamento com `useState` e `useReducer` | `src/components/AppointmentForm.jsx`, `src/contexts/AppointmentsContext.jsx` |
| Dashboard com contagem de pacientes e consultas agendadas | `src/pages/DashboardPage.jsx` |
| Proteção de rotas com AuthContext | `src/components/ProtectedRoute.jsx`, `src/App.jsx` |
| Estilização com CSS Modules | arquivos `*.module.css` ao lado de cada componente e página |

**Hooks utilizados:**

- **useState**: campos de login, filtros, mensagens e erros de validação.
- **useReducer**: estado do formulário de agendamento (`formReducer`) e lista global de consultas (`consultasReducer`, com as ações `AGENDAR`, `CANCELAR` e `CONCLUIR`).
- **useEffect**: busca dos pacientes na API (com `AbortController`), gravação das consultas no `localStorage` e logout automático quando o JWT expira.
- **useContext**: `useAuth`, `usePatients` e `useAppointments` expõem os três contextos da aplicação.
- **useMemo / useCallback**: cálculo das métricas do dashboard, filtros da listagem e funções estáveis do contexto de autenticação.

**Autenticação simulada:** o login confere e-mail e senha em `src/data/usuarios.json` e gera um token no formato JWT (`header.payload.assinatura`, em Base64URL) com validade de 1 hora, gravado no `localStorage` (`cardioia_token`). O `AuthContext` lê o token ao iniciar e encerra a sessão quando ele expira. O `ProtectedRoute` envolve as páginas internas: sem token válido, a pessoa vai para `/login` e, depois de entrar, volta para a página que tentou abrir. O token é **fake**, sem assinatura criptográfica real.

**Consumo de API:** `listarPacientes()` busca `https://jsonplaceholder.typicode.com/users` e combina os 10 usuários (nome, e-mail, telefone e cidade) com os 10 registros clínicos de `src/data/pacientes.json` (relato, sintomas, diagnóstico e risco). Se a API falhar ou demorar mais de 5 segundos, o portal usa só a base local, e a página de pacientes informa a fonte em uso.

**Páginas:**

- **/login**: tela de acesso.
- **/dashboard**: total de pacientes, consultas agendadas e concluídas, pacientes de alto risco, próximas consultas, distribuição dos diagnósticos sugeridos e alerta de pacientes de alto risco sem consulta.
- **/pacientes**: cards com relato, sintomas, diagnóstico sugerido e risco, com busca (nome, sintoma ou diagnóstico) e filtro por risco.
- **/agendamentos**: formulário com validação (campos obrigatórios, data no passado, horário das 07:00 às 19:00 e conflito de horário do médico) e lista de consultas com as ações de concluir e cancelar. As consultas ficam salvas no `localStorage`.


## 📁 Estrutura de pastas

Dentre os arquivos e pastas presentes na raiz do projeto, definem-se:

- <b>assets</b>: elementos não estruturados, como o logo da FIAP.

- <b>public</b>: arquivos estáticos servidos pelo Vite (ícone da aba).

- <b>src</b>: código-fonte da aplicação.
    - `components/`: Layout, ProtectedRoute, AppointmentForm, AppointmentList, PatientCard, StatCard, RiskBadge, PageHeader e Loader (com seus `.module.css`).
    - `contexts/`: AuthContext, PatientsContext e AppointmentsContext.
    - `data/`: JSON simulados de pacientes, médicos e usuários.
    - `pages/`: LoginPage, DashboardPage, PatientsPage, AppointmentsPage e NotFoundPage.
    - `services/`: authService (JWT fake), patientService (API) e storage (`localStorage`).
    - `styles/`: `global.css` com as variáveis de cor.
    - `App.jsx` (rotas e providers) e `main.jsx` (ponto de entrada).

- <b>index.html</b>, <b>package.json</b> e <b>vite.config.js</b>: configuração do projeto Vite.

- <b>README.md</b>: este arquivo.

## 🔧 Como executar o código

Pré-requisito: **Node.js 20.19+** (ou 22.12+).

```bash
npm install
npm run dev
```

Abra o endereço exibido no terminal (normalmente http://localhost:5173) e entre com uma das contas de demonstração. A tela de login também tem o botão "Usar conta de demonstração".

| E-mail | Senha | Perfil |
| --- | --- | --- |
| medico@cardioia.com | cardio123 | Médica |
| recepcao@cardioia.com | cardio123 | Recepção |

Para gerar a versão de produção, use `npm run build` e depois `npm run preview`.


## 🗃 Histórico de lançamentos

* 0.1.0 - 07/10/2026
    * Primeira versão: login com JWT fake, rotas protegidas, listagem de pacientes, agendamento e dashboard.

## 📋 Licença

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/agodoi/template">MODELO GIT FIAP</a> por <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://fiap.com.br">Fiap</a> está licenciado sobre <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution 4.0 International</a>.</p>
