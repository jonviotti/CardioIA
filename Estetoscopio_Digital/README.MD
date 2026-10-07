# FIAP - Faculdade de Informática e Administração Paulista

<p align="center">
<a href= "https://www.fiap.com.br/"><img src="assets/logo-fiap.png" alt="FIAP - Faculdade de Informática e Administração Paulista" border="0" width=40% height=40%></a>
</p>

<br>

# CardioIA — Estetoscópio Digital (Fase 2, Parte 1)

## Data Health Solutions

## 🎥 Demonstração


👉 **[Vídeo de apresentação no YouTube](#)**

- <a href="https://youtu.be/DTsCyYbRPwU/">Estetoscopio Digital</a>



## 👨‍🎓 Integrantes: 
- <a href="https://www.linkedin.com/in/gabriel-oliveira-b6353a16b/">Gabriel Oliveira dos Santos</a>
- <a href="https://www.linkedin.com/in/arthur-bruttel-7171b8381">Arthur Bruttel Nascimento</a>
- <a href="https://www.linkedin.com/in/jonviotti/">Jonatan Viotti Rodrigues da Silva</a>
- <a href="https://www.linkedin.com/in/eusamuelrocha/">Samuel Nicolas Oliveira Rocha</a>

## 👩‍🏫 Professores:
### Tutor(a) 
- <a href="https://www.linkedin.com/in/leonardoorabona/">Leonardo Ruiz Orabona</a>
### Coordenador(a)
- <a href="https://www.linkedin.com/company/inova-fusca">André Godoi Chiovato</a>


## 📜 Descrição

Ferramenta de apoio ao diagnóstico cardiológico, desenvolvida em Python, que lê relatos de pacientes escritos em linguagem natural, identifica os sintomas descritos e sugere um diagnóstico com base em um mapa de conhecimento. A solução simula, de forma simplificada, os "estetoscópios digitais" usados em centros de diagnóstico: um código simples aliado a dados bem organizados.

**Base de conhecimento (em `src/dataset/`):**

- `sintomas.txt`: 30 relatos sintéticos de pacientes, cada um com o que a pessoa sente, quando começou e como isso afeta a rotina. Os relatos cobrem 12 condições cardiológicas e incluem casos com negação ("não tenho falta de ar") e com sinônimos ("aperto no tórax", "fico zonzo").
- `mapa_conhecimento.csv`: a ontologia no formato pedido (`Sintoma 1 | Sintoma 2 | Doença Associada`), com 33 regras e 12 doenças (Síndrome Coronariana Aguda, Infarto, Anginas, Insuficiência Cardíaca, Hipertensão, Crise Hipertensiva, Arritmia, Fibrilação Atrial, Estenose Aórtica, Pericardite e Miocardite).
- `sinonimos.csv`: dicionário com 90 expressões populares que levam a 17 sintomas padronizados (ex.: "falta de fôlego", "dispneia" e "dificuldade para respirar" → *falta de ar*).
- `gabarito.csv`: o diagnóstico esperado pela equipe para cada relato, usado para medir a concordância do motor.

**Como o motor decide (`src/diagnostico.py`):**

1. **Normalização:** o texto vira minúsculo e perde os acentos, para que "Síncope" e "sincope" sejam iguais.
2. **Extração de sintomas:** cada expressão do dicionário é buscada como palavra inteira (sem casar pedaços de outras palavras) e traduzida para o sintoma padronizado.
3. **Tratamento de negação:** se "sem", "não", "nem" ou "nunca" aparece nas três palavras anteriores ao sintoma, ele é registrado como *negado* e não entra no diagnóstico.
4. **Inferência:** uma doença só é sugerida quando **os dois sintomas** da regra estão presentes no relato. Se várias regras disparam, a doença com mais regras satisfeitas é o diagnóstico principal e as demais aparecem como hipóteses alternativas. Em caso de empate, vale a ordem do mapa.
5. **Validação e auditoria:** o resultado é comparado com o gabarito (concordância atual: **30/30**) e salvo em um log CSV com data e hora, que nunca sobrescreve execuções anteriores.

**Governança de dados:** os relatos são sintéticos e controlados para garantir rastreabilidade de ponta a ponta (da fala do paciente até a regra acionada, registrada no log). O mapa foi construído com base nas diretrizes da Sociedade Brasileira de Cardiologia sobre dor torácica e hipertensão (em `document/`). Por ser baseado em regras e em uma base pequena, o motor não reconhece expressões fora do dicionário e não substitui avaliação médica.


## 📁 Estrutura de pastas

Dentre os arquivos e pastas presentes na raiz do projeto, definem-se:

- <b>assets</b>: elementos não estruturados, como o logo da FIAP.

- <b>document</b>: diretrizes da SBC usadas como base do mapa de conhecimento (`diretriz_dor_toracica.txt`, `diretriz_hipertensao.txt`).

- <b>src</b>: código-fonte e dados.
    - `diagnostico.py`: motor de extração de sintomas e inferência.
    - `dataset/`: `sintomas.txt`, `mapa_conhecimento.csv`, `sinonimos.csv` e `gabarito.csv`.
    - `logs/`: trilha de auditoria gerada a cada execução (`log_diagnosticos_AAAAMMDD_HHMMSS.csv`).

- <b>README.md</b>: este arquivo.

## 🔧 Como executar o código

Pré-requisitos: Python 3.9+ e a biblioteca `pandas`.

```bash
pip install pandas
```

Na raiz do projeto:

```bash
python src/diagnostico.py
```

O script resolve os caminhos a partir da própria pasta, então também funciona se executado de dentro de `src/`. O terminal mostra, para cada paciente, os sintomas identificados, os sintomas negados, as regras acionadas, o diagnóstico sugerido e as hipóteses alternativas. No final, aparece a concordância com o gabarito e o caminho do log gerado em `src/logs/`.

Para testar novos relatos, acrescente frases em `src/dataset/sintomas.txt` (uma por linha). Para ampliar o conhecimento, acrescente regras em `mapa_conhecimento.csv` e novas expressões em `sinonimos.csv`.


## 🗃 Histórico de lançamentos

* 0.2.0 - 07/10/2026
    * Regra passa a exigir os dois sintomas juntos; antes, um sintoma isolado já disparava a doença.
    * Dicionário de sinônimos, tratamento de negação e ranking de hipóteses.
    * Base ampliada para 30 relatos, 33 regras e 12 doenças, com gabarito de validação.
    * Estrutura de pastas no padrão do template FIAP.
* 0.1.0 - 03/10/2026
    * Primeira versão: 10 relatos, 10 regras e log de auditoria.

## 📋 Licença

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/agodoi/template">MODELO GIT FIAP</a> por <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://fiap.com.br">Fiap</a> está licenciado sobre <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution 4.0 International</a>.</p>
