# FIAP - Faculdade de Informática e Administração Paulista

<p align="center">
<a href= "https://www.fiap.com.br/"><img src="assets/docs/logo-fiap.png" alt="FIAP - Faculdade de Informática e Admnistração Paulista" border="0" width=40% height=40%></a>
</p>

<br>

# Fase 2: Diagnóstico Automatizado – IA no Estetoscópio Digital
## Parte 1 – Frases de sintomas e extração de informações (NLP)

## Grupo: Data Health Solutions

## 👨‍🎓 Integrantes: 

- <a href="https://www.linkedin.com/in/gabriel-oliveira-b6353a16b/">Gabriel Oliveira dos Santos</a>
- <a href="https://www.linkedin.com/in/arthur-bruttel-7171b8381">Arthur Bruttel Nascimento</a>
- <a href="https://www.linkedin.com/in/jonviotti/">Jonatan Viotti Rodrigues da Silva</a>
- <a href="https://www.linkedin.com/in/eusamuelrocha/">Samuel Nicolas Oliveira Rocha</a>



### Tutor(a) 
- <a href="https://www.linkedin.com/in/leonardoorabona/">Leonardo Ruiz Orabona</a>
### Coordenador(a)
- <a href="https://www.linkedin.com/company/inova-fusca">André Godoi Chiovato</a>

---

## 📜 Descrição do Projeto

Este projeto consiste numa ferramenta automatizada de apoio ao diagnóstico cardiológico, desenvolvida em Python para processar relatos em linguagem natural de pacientes e extrair patologias clinicamente mapeadas. 

A arquitetura foi estruturada com foco rigoroso em **Governança de Dados** e **Rastreabilidade**, refletindo os padrões de segurança, imutabilidade e auditoria exigidos em integrações de sistemas hospitalares reais (como prontuários eletrónicos).

### Arquitetura de Dados e Governança

Para garantir a integridade da inferência e a qualidade dos dados (*Data Quality*), a solução separa o motor de processamento de texto das regras de negócio clínico:

1. **Origem dos Dados e Metodologia de Teste (Mock Data):**
   O desenvolvimento deste motor envolveu uma etapa prévia de exploração e filtragem em bases públicas de NLP médico, como o *dataset* <a href="https://huggingface.co/datasets/Larxel/healthqa-br">healthqa-br</a> (Hugging Face). Durante a fase de limpeza de dados (*Data Cleaning*), o grupo constatou que o uso direto de *datasets* abertos do SUS introduzia variáveis não controladas (jargões laboratoriais complexos, anotações de enfermagem e ruídos de outras especialidades) que reduziam a precisão determinística da inferência clínica proposta para esta fase.
   
   Para garantir o rigor técnico e o pilar de Qualidade (*Data Quality*), a equipe evoluiu a estratégia: em vez de forçar a adaptação de dados ruidosos, projetamos um ambiente de validação baseado em **dados sintéticos controlados** (*Mock Data*). 
   
   As 10 narrativas do ficheiro <a href="assets/dataset/sintomas.txt">sintomas.txt</a> foram meticulosamente elaboradas através de engenharia reversa dos protocolos da Sociedade Brasileira de Cardiologia (SBC). Cada frase espelha a estrutura semântica real de um paciente em triagem, mas com variáveis controladas. Esta decisão arquitetónica garante que o sistema seja testado num ambiente de alta fidelidade, livre de vieses estruturais e com 100% de rastreabilidade desde a fala do paciente até à ontologia oficial.

2. **Ontologia Clínica (Fonte de Verdade):**
   O motor de regras (<a href="assets/dataset/mapa_conhecimento.csv">mapa_conhecimento.csv</a>) foi fundamentado nos protocolos da **Sociedade Brasileira de Cardiologia (SBC)**. Utilizamos as Diretrizes de Dor Torácica e Hipertensão (disponíveis na pasta `/docs`) como lastro documental para o cruzamento exato entre sintomas extraídos e diagnósticos sugeridos.

---

## 📁 Estrutura de Pastas

O projeto utiliza resolução dinâmica de caminhos (`os.path`), garantindo portabilidade entre ambientes sem necessidade de reconfiguração manual.

    Estetoscopio_Digital/
    │
    ├── diagnostico.py                  # Script principal: Motor de NLP e inferência
    ├── docs/                           # Documentação e base teórica             
    │   ├── diretriz_dor_toracica.txt   # Fonte de verdade para Síndrome Coronariana
    │   └── diretriz_hipertensao.txt    # Fonte de verdade para Hipertensão e Insuficiência
    ├── dataset/                        # Base de dados estruturada e não estruturada
    │   ├── mapa_conhecimento.csv       # Ontologia clínica (regras SBC)
    │   └── sintomas.txt                # Relatos sintéticos dos pacientes
    └── logs/                           # Trilha de auditoria gerada automaticamente
        └── log_diagnosticos_*.csv      # Logs imutáveis com carimbo de tempo

---

## 🔧 Pré-requisitos e Execução

O algoritmo foi desenvolvido em Python e requer a biblioteca `pandas` para a formatação e exportação da trilha de auditoria.

**1. Instalação da dependência:**
    pip install pandas


**2. Como executar o motor de diagnóstico:**
No terminal, navegue até à pasta do projeto e execute o script principal. A interface do terminal utilizará códigos ANSI para exibir os diagnósticos sugeridos de forma limpa e categorizada por cores.

    python diagnostico.py


---

## 🔐 Trilha de Auditoria (Logs Imutáveis)

Em conformidade com as boas práticas de segurança da informação em saúde, a solução possui um sistema de registo *append-only* que nunca sobrescreve resultados anteriores. 

A cada execução do `diagnostico.py`, o código verifica a infraestrutura de pastas e gera automaticamente um ficheiro de auditoria na pasta `logs/`. Utilizando a biblioteca `datetime`, cada registo é carimbado cronologicamente no formato `log_diagnosticos_YYYYMMDD_HHMMSS.csv`, garantindo o histórico completo de todas as análises clínicas processadas pela IA.

---

## 📋 Licença

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/agodoi/template">MODELO GIT FIAP</a> por <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://fiap.com.br">Fiap</a> está licenciado sobre <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution 4.0 International</a>.</p>