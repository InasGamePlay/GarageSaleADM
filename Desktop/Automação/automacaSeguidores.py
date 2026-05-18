from instagrapi import Client
import time
import random
import os
from datetime import datetime

# ====== CONFIGURAÇÕES ======
USUARIO = "hoop.table"
SENHA = "@Brooklin9984995360"

# Mensagens possíveis (serão escolhidas aleatoriamente)
MENSAGENS = [
    "Fala comigoo, o drop foi oficialmente lançado ontem!! Já acessou o site? E conferiu as peças.",
    "Oii hooplover kkkk, já conferiu o drop novo la no site da hooptable.com.br?",
    "drop foi oficialmente lançado ontem vida!! Olha o site la na bio, deixa de ser besta!!!",
    ]

# Arquivo de log
ARQUIVO_LOG = "log_seguidores.txt"
# ============================

def enviar_para_seguidores():
    cl = Client()
    cl.login(USUARIO, SENHA)

    # Coleta todos os seguidores da conta logada
    seguidores = cl.user_followers(cl.user_id)
    user_ids = list(seguidores.keys())

    # Carregar log existente
    if os.path.exists(ARQUIVO_LOG):
        with open(ARQUIVO_LOG, "r", encoding="utf-8") as f:
            enviados = set(line.strip().split(" | ")[0] for line in f.readlines())
    else:
        enviados = set()

    enviadas_total = 0

    for i, user_id in enumerate(user_ids, start=1):
        if str(user_id) in enviados:
            continue  # pular quem já recebeu mensagem

        try:
            mensagem = random.choice(MENSAGENS)  # escolhe mensagem aleatória
            cl.direct_send(mensagem, [user_id])
            enviadas_total += 1
            print(f"✅ [{i}/{len(user_ids)}] Mensagem enviada para seguidor ID: {user_id} | Mensagem: {mensagem}")

            # Salvar log (ID + mensagem + data/hora)
            with open(ARQUIVO_LOG, "a", encoding="utf-8") as f:
                data_hora = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
                f.write(f"{user_id} | {mensagem} | {data_hora}\n")

            # Delay humano entre mensagens (30 a 90 segundos)
            time.sleep(random.randint(30, 90))

            # Pausa de segurança a cada 30 mensagens
            if enviadas_total % 30 == 0:
                print("⏸️ Pausa de segurança: aguardando 30 minutos para evitar bloqueio...")
                time.sleep(600)  # 30 minutos

        except Exception as e:
            print(f"❌ Erro ao enviar para {user_id}: {e}")
            time.sleep(60)

# Executa
if __name__ == "__main__":
    enviar_para_seguidores()
