import os
import re
import sys
import unicodedata
from collections import Counter
from datetime import datetime

import pandas as pd

# Limpa o terminal automaticamente antes de exibir qualquer texto
os.system('cls' if os.name == 'nt' else 'clear')

# Códigos de cor ANSI para formatação do terminal
RESET = "\033[0m"
NEGRITO = "\033[1m"
AZUL = "\033[96m"
VERDE = "\033[92m"
AMARELO = "\033[93m"
VERMELHO = "\033[91m"
CINZA = "\033[90m"

# --- RESOLUÇÃO DINÂMICA DE CAMINHOS ---
DIRETORIO_BASE = os.path.dirname(os.path.abspath(__file__))
PASTA_DATASET = os.path.join(DIRETORIO_BASE, 'dataset')
caminho_mapa = os.path.join(PASTA_DATASET, 'mapa_conhecimento.csv')
caminho_sinonimos = os.path.join(PASTA_DATASET, 'sinonimos.csv')
caminho_frases = os.path.join(PASTA_DATASET, 'sintomas.txt')
caminho_gabarito = os.path.join(PASTA_DATASET, 'gabarito.csv')
pasta_logs = os.path.join(DIRETORIO_BASE, 'logs')

# Palavras que, logo antes de um sintoma, indicam que o paciente NÃO o tem
# (ex.: "sem falta de ar", "não tenho febre", "sem tontura ou desmaio")
NEGACOES = {'sem', 'nem', 'nao', 'nunca'}
JANELA_NEGACAO = 3


def normalizar(texto):
    """Minúsculas e sem acentos, para que 'Síncope' e 'sincope' sejam iguais."""
    texto = unicodedata.normalize('NFD', str(texto).lower().strip())
    return ''.join(c for c in texto if unicodedata.category(c) != 'Mn')


def carregar_csv(caminho):
    try:
        return pd.read_csv(caminho, sep=';', encoding='utf-8-sig')
    except FileNotFoundError:
        print(f"{VERMELHO}Erro: arquivo não encontrado em {caminho}{RESET}")
        sys.exit(1)


def negado(texto, inicio):
    """Verifica se há uma negação nas palavras imediatamente anteriores ao sintoma."""
    trecho = texto[:inicio]
    # A negação não atravessa pontuação ("não passa, e sinto febre" não nega a febre)
    trecho = re.split(r'[.,;:!?]', trecho)[-1]
    anteriores = trecho.split()[-JANELA_NEGACAO:]
    return any(palavra in NEGACOES for palavra in anteriores)


def extrair_sintomas(frase, sinonimos):
    """Retorna {sintoma_canonico: expressao_encontrada} presentes (e não negados) na frase."""
    texto = normalizar(frase)
    encontrados, negados = {}, {}
    # Expressões mais longas primeiro: "falta de ar ao deitar" antes de "falta de ar"
    for expressao, sintoma in sorted(sinonimos.items(), key=lambda item: -len(item[0])):
        padrao = r'\b' + re.escape(expressao) + r'\b'
        for ocorrencia in re.finditer(padrao, texto):
            if negado(texto, ocorrencia.start()):
                negados.setdefault(sintoma, expressao)
            else:
                encontrados.setdefault(sintoma, expressao)
    # Um sintoma afirmado em algum ponto da frase prevalece sobre uma negação
    negados = {s: e for s, e in negados.items() if s not in encontrados}
    return encontrados, negados


def inferir(sintomas, regras):
    """Aplica as regras do mapa: a doença só é sugerida se os DOIS sintomas da regra estiverem presentes.

    Quando várias regras disparam, a doença com mais regras satisfeitas é a principal.
    Em caso de empate, vale a ordem do mapa de conhecimento (prioridade clínica).
    """
    disparadas = [r for r in regras if r['s1'] in sintomas and r['s2'] in sintomas]
    if not disparadas:
        return None, [], []
    contagem = Counter(r['doenca'] for r in disparadas)
    ordem = {}
    for i, r in enumerate(regras):
        ordem.setdefault(r['doenca'], i)
    ranking = sorted(contagem, key=lambda d: (-contagem[d], ordem[d]))
    return ranking[0], ranking[1:], disparadas


print("--- Inicializando Sistema de Diagnóstico ---")

# 1. Carregar a base de conhecimento
mapa_df = carregar_csv(caminho_mapa)
sinonimos_df = carregar_csv(caminho_sinonimos)

sinonimos = {normalizar(e): normalizar(s) for e, s in zip(sinonimos_df['Expressão'], sinonimos_df['Sintoma'])}
nomes_sintomas = {normalizar(s): s for s in sinonimos_df['Sintoma']}
regras = [
    {'s1': normalizar(r['Sintoma 1']), 's2': normalizar(r['Sintoma 2']), 'doenca': r['Doença Associada']}
    for _, r in mapa_df.iterrows()
]

# Governança: toda regra do mapa precisa usar sintomas conhecidos pelo dicionário de sinônimos
desconhecidos = {s for r in regras for s in (r['s1'], r['s2'])} - set(sinonimos.values())
if desconhecidos:
    print(f"{VERMELHO}Erro: sintomas do mapa sem sinônimo cadastrado: {desconhecidos}{RESET}")
    sys.exit(1)

print(f"Mapa de conhecimento carregado: {len(regras)} regras, {len(set(r['doenca'] for r in regras))} doenças.")
print(f"Dicionário de sinônimos carregado: {len(sinonimos)} expressões para {len(set(sinonimos.values()))} sintomas.")

# 2. Carregar as frases dos pacientes
try:
    with open(caminho_frases, 'r', encoding='utf-8') as arquivo:
        frases_pacientes = [linha.strip() for linha in arquivo if linha.strip()]
    print(f"Relatos dos pacientes carregados: {len(frases_pacientes)} frases.\n")
except FileNotFoundError:
    print(f"{VERMELHO}Erro: arquivo não encontrado em {caminho_frases}{RESET}")
    sys.exit(1)

# 3. Extração de sintomas e diagnóstico
print(f"{NEGRITO}--- Processando Diagnósticos Automatizados ---{RESET}")
resultados_log = []

for i, frase in enumerate(frases_pacientes, 1):
    sintomas, negados = extrair_sintomas(frase, sinonimos)
    principal, alternativas, disparadas = inferir(sintomas, regras)

    str_sintomas = ', '.join(nomes_sintomas[s] for s in sintomas) or 'Nenhum'
    str_negados = ', '.join(nomes_sintomas[s] for s in negados)
    str_principal = principal or 'Inconclusivo (nenhuma regra com os dois sintomas)'
    str_alternativas = ', '.join(alternativas)
    str_regras = ' | '.join(
        f"{nomes_sintomas[r['s1']]} + {nomes_sintomas[r['s2']]} → {r['doenca']}" for r in disparadas
    )

    resultados_log.append({
        'Paciente': i,
        'Relato': frase,
        'Sintomas Identificados': str_sintomas,
        'Sintomas Negados': str_negados,
        'Regras Acionadas': str_regras,
        'Diagnostico Sugerido': str_principal,
        'Hipoteses Alternativas': str_alternativas,
    })

    print(f"\n{AZUL}{NEGRITO}▶ Paciente {i}:{RESET} '{frase}'")
    print(f"   {AMARELO}↳ Sintomas identificados:{RESET} {str_sintomas}")
    if str_negados:
        print(f"   {CINZA}↳ Sintomas negados pelo paciente: {str_negados}{RESET}")
    if str_regras:
        print(f"   {CINZA}↳ Regras acionadas: {str_regras}{RESET}")
    cor = VERDE if principal else VERMELHO
    print(f"   {cor}↳ Diagnóstico sugerido:{RESET} {NEGRITO}{str_principal}{RESET}")
    if str_alternativas:
        print(f"   {AMARELO}↳ Hipóteses alternativas:{RESET} {str_alternativas}")
    print("-" * 80)

log_df = pd.DataFrame(resultados_log)

# 4. Validação contra o gabarito (diagnóstico esperado definido pela equipe)
if os.path.exists(caminho_gabarito):
    gabarito_df = carregar_csv(caminho_gabarito)
    log_df = log_df.merge(gabarito_df, on='Paciente', how='left')
    log_df['Acertou'] = log_df['Diagnostico Sugerido'] == log_df['Diagnóstico Esperado']
    acertos = int(log_df['Acertou'].sum())
    total = int(log_df['Diagnóstico Esperado'].notna().sum())
    print(f"\n{NEGRITO}--- Validação com o gabarito ---{RESET}")
    print(f"Concordância: {acertos}/{total} ({acertos / total:.0%})")
    for _, linha in log_df[~log_df['Acertou']].iterrows():
        print(f"   {VERMELHO}Paciente {linha['Paciente']}:{RESET} esperado '{linha['Diagnóstico Esperado']}', "
              f"sugerido '{linha['Diagnostico Sugerido']}'")

# 5. Gera o arquivo de log de auditoria em uma pasta dedicada
os.makedirs(pasta_logs, exist_ok=True)
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
caminho_log = os.path.join(pasta_logs, f'log_diagnosticos_{timestamp}.csv')
log_df.to_csv(caminho_log, index=False, encoding='utf-8-sig', sep=';')
print(f"\n{VERDE}{NEGRITO}Concluído! Log de auditoria gerado em:{RESET}")
print(f"{caminho_log}\n")
