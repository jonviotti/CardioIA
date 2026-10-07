# FIAP - Faculdade de Informática e Administração Paulista

<p align="center">
<a href= "https://www.fiap.com.br/"><img src="assets/logo-fiap.png" alt="FIAP - Faculdade de Informática e Administração Paulista" border="0" width=40% height=40%></a>
</p>

<br>

# Classificador de Triagem

## 🎥 Demonstração do Projeto
👉 **[Vídeo de apresentação no YouTube](#)**

- <a href="https://youtu.be/gbRPb4SRKmI/">Classificador de Texto</a>



---

## Grupo: Data Health Solutions

## 👨‍🎓 Integrantes: 
- <a href="https://www.linkedin.com/in/gabriel-oliveira-b6353a16b/">Gabriel Oliveira dos Santos</a>
- <a href="https://www.linkedin.com/in/arthur-bruttel-7171b8381/">Arthur Bruttel Nascimento</a>
- <a href="https://www.linkedin.com/in/jonviotti/">Jonatan Viotti Rodrigues da Silva</a>
- <a href="https://www.linkedin.com/in/eusamuelrocha/">Samuel Nicolas Oliveira Rocha</a>

### Tutor(a) 
- <a href="https://www.linkedin.com/in/leonardoorabona/">Leonardo Ruiz Orabona</a>
### Coordenador(a)
- <a href="https://www.linkedin.com/company/inova-fusca">André Godoi Chiovato</a>

---

## 📜 Descrição do Classificador

Este módulo contempla a **Parte 2** do projeto CardioIA, com o objetivo de classificar o nível de gravidade de queixas clínicas ("Alto Risco" ou "Baixo Risco") para priorização de filas de atendimento, simulando o comportamento de motores de software médico.

*   **Engenharia de Dados (TF-IDF):** Implementação da técnica *Term Frequency-Inverse Document Frequency* para transformar o corpus textual narrativo em vetores matemáticos, isolando o peso de termos críticos (ex: "irradia", "síncope", "falta de ar").
*   **Modelo de Classificação:** Utilização do algoritmo **Logistic Regression** (Regressão Logística) através da biblioteca *Scikit-learn*. A escolha justifica-se pela sua excelência no processamento de matrizes textuais esparsas e capacidade de generalização em problemas binários.
*   **Validação Clínica (Governança):** As 30 frases do *dataset* de treino (`dataset_triagem.csv`) foram geradas através de engenharia reversa do **Protocolo de Manchester**, garantindo que o modelo aprenda padrões de emergência validados mundialmente, rejeitando a utilização de bases ruidosas não-estruturadas.

---

## 📊 Resultados do Modelo (ML)

Após a vetorização e o treinamento com divisão estratificada (Treino/Teste), o modelo de Regressão Logística demonstra forte capacidade de generalização para novos pacientes, apresentando a seguinte avaliação em ambiente de validação:

```text
Acurácia Global do Modelo: 88.89%

Relatório Analítico de Classificação:
              precision    recall  f1-score   support

  alto risco       1.00      0.80      0.89         5
 baixo risco       0.80      1.00      0.89         4

    accuracy                           0.89         9
```
*A execução do Jupyter Notebook também gera visualmente uma Matriz de Confusão em mapa de calor (Heatmap) para auditoria rápida de Falsos Positivos e Falsos Negativos.*

---

## 📁 Estrutura de Pastas

O projeto utiliza resolução dinâmica de caminhos, garantindo portabilidade entre ambientes.

```text
CardioIA/
└── Classificador_de_Texto/             # Módulo da Parte 2 (Machine Learning)
    ├── classificador.ipynb             # Notebook Jupyter com TF-IDF e ML
    └── assets/
        ├── dataset_triagem.csv         # Dataset rotulado (Protocolo de Manchester)
```

---

## ⚙ Pré-requisitos e Execução

O projeto foi desenvolvido em ambiente Python e requer as seguintes bibliotecas:
```bash
pip install pandas scikit-learn matplotlib seaborn
```

### Execução do Classificador
Abra a pasta `Classificador_de_Texto` no VS Code ou Jupyter Notebook e execute as células do ficheiro `classificador.ipynb`. O código apresentará sequencialmente a vetorização, o treinamento, as métricas de avaliação e a Matriz de Confusão.

---

## 📋 Licença

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/agodoi/template">MODELO GIT FIAP</a> por <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://fiap.com.br">Fiap</a> está licenciado sobre <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution 4.0 International</a>.</p>