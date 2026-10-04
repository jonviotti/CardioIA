import pandas as pd
import sys
import os
from datetime import datetime

# Limpa o terminal automaticamente antes de exibir qualquer texto
os.system('cls' if os.name == 'nt' else 'clear')

# Códigos de cor ANSI para formatação do terminal
RESET = "\033[0m"
NEGRITO = "\033[1m"
AZUL = "\033[96m"
VERDE = "\033[92m"
AMARELO = "\033[93m"

# --- RESOLUÇÃO DINÂMICA DE CAMINHOS ---
DIRETORIO_BASE = os.path.dirname(os.path.abspath(__file__))
caminho_csv = os.path.join(DIRETORIO_BASE, 'dataset', 'mapa_conhecimento.csv')
caminho_txt = os.path.join(DIRETORIO_BASE, 'dataset', 'sintomas.txt')

print("--- Inicializando Sistema de Diagnóstico ---")

# 1. Carregar o mapa de conhecimento
try:
    mapa_df = pd.read_csv(caminho_csv, sep=';', encoding='utf-8-sig')
    print("Mapa de conhecimento carregado com sucesso!")
except FileNotFoundError:
    print(f"Erro: O arquivo não foi encontrado.\nVerifique se ele está em: {caminho_csv}")
    sys.exit()

# 2. Carregar as frases dos pacientes
try:
    with open(caminho_txt, 'r', encoding='utf-8') as file:
        frases_pacientes = file.readlines()
    print("Relatos dos pacientes carregados com sucesso!\n")
except FileNotFoundError:
    print(f"Erro: O arquivo não foi encontrado.\nVerifique se ele está em: {caminho_txt}")
    sys.exit()

# 3. Lógica de extração e diagnóstico
print(f"{NEGRITO}--- Processando Diagnósticos Automatizados ---{RESET}")
resultados_log = []

for i, frase in enumerate(frases_pacientes, 1):
    frase_limpa = frase.strip().lower()
    if not frase_limpa:
        continue
        
    diagnosticos_encontrados = set()
    sintomas_detectados = []
    
    for index, row in mapa_df.iterrows():
        sintoma1 = str(row['Sintoma 1']).lower()
        sintoma2 = str(row['Sintoma 2']).lower()
        doenca = row['Doença Associada']
        
        # Cruzamento de dados da ontologia com o relato
        if sintoma1 in frase_limpa:
            diagnosticos_encontrados.add(doenca)
            sintomas_detectados.append(sintoma1)
        if sintoma2 in frase_limpa:
            diagnosticos_encontrados.add(doenca)
            sintomas_detectados.append(sintoma2)
            
    # Formatação das listas para exibição e log (removendo duplicatas com set)
    str_sintomas = ', '.join(set(sintomas_detectados)) if sintomas_detectados else 'Nenhum'
    str_diagnosticos = ', '.join(set(diagnosticos_encontrados)) if diagnosticos_encontrados else 'Nenhum'
            
    # Registro para o Log de Auditoria
    resultados_log.append({
        'Paciente': f"Paciente {i}",
        'Relato': frase.strip(),
        'Sintomas Identificados': str_sintomas,
        'Diagnostico Sugerido': str_diagnosticos
    })
    
    # Exibição detalhada e colorida no ecrã
    print(f"\n{AZUL}{NEGRITO}▶ Paciente {i}:{RESET} '{frase.strip()}'")
    print(f"   {AMARELO}↳ Sintomas identificados:{RESET} {str_sintomas}")
    print(f"   {VERDE}↳ Diagnóstico Sugerido:{RESET} {NEGRITO}{str_diagnosticos}{RESET}")
    print("-" * 80)

# 4. Gera o arquivo de Log final em uma pasta dedicada
pasta_logs = os.path.join(DIRETORIO_BASE, 'logs')

# Cria a pasta 'logs' automaticamente se ela não existir na raiz do projeto
if not os.path.exists(pasta_logs):
    os.makedirs(pasta_logs)

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
nome_arquivo_log = f'log_diagnosticos_{timestamp}.csv'
caminho_log = os.path.join(pasta_logs, nome_arquivo_log)

log_df = pd.DataFrame(resultados_log)
log_df.to_csv(caminho_log, index=False, encoding='utf-8-sig', sep=';')
print(f"\n{VERDE}{NEGRITO}Concluído! Log de auditoria gerado com sucesso em:{RESET}")
print(f"{caminho_log}\n")