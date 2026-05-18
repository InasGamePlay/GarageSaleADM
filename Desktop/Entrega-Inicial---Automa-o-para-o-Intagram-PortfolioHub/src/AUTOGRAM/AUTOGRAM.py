from instagrapi import Client
import time
import random
import os
from datetime import datetime

# ====== CONFIGURAÇÕES ======
USUARIO = "COLOQUE_O_USER_AQUI"
SENHA = "COLOQUE_A_SENHA_DO_USER_AQUI"
POST_URL = "COLOQUE_O_LINK_DO_POST_AQUI"

# Mensagens possíveis (serão escolhidas aleatoriamente)
MENSAGENS = [
    "AQUI ESCREVA UMA MENSAGEM",
    "AQUI ESCREVA UMA SEGUNDA VARIAÇÃO DA MENSAGEM",
    "AQUI ESCREVA UMA TERCEIRA VARIAÇÃO",
    "AQUI A QUARTA VARIAÇÃO."
]

# Arquivo de log
ARQUIVO_LOG = "log.txt"
# ============================

def enviar_mensagens():
    cl = Client()
    cl.login(USUARIO, SENHA)

    # Pegar curtidores do post
    media_id = cl.media_pk_from_url(POST_URL)
    likers = cl.media_likers(media_id)
    user_ids = [user.pk for user in likers]

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
            print(f"✅ [{i}/{len(user_ids)}] Mensagem enviada para ID: {user_id} | Mensagem: {mensagem}")

            # Salvar log (ID + mensagem enviada + data/hora)
            with open(ARQUIVO_LOG, "a", encoding="utf-8") as f:
                data_hora = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
                f.write(f"{user_id} | {mensagem} | {data_hora}\n")

            # Delay humano entre mensagens
            time.sleep(random.randint(30, 90))

            # Pausa de segurança a cada 30 mensagens
            if enviadas_total % 30 == 0:
                print("⏸️ Pausa de segurança: aguardando 10 minutos para evitar bloqueio...")
                time.sleep(600)  # 600 segundos = 10 minutos

        except Exception as e:
            print(f"❌ Erro ao enviar para {user_id}: {e}")
            time.sleep(60)

# Executa
if __name__ == "__main__":
    enviar_mensagens()
