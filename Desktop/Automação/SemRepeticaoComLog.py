from instagit branchgrapi import Client
import time
import random
import os
from datetime import datetime

# ====== CONFIGURAÇÕES ======
USUARIO = "hoop.table"
SENHA = "@Brooklin9984995360"
POST_URL = "https://www.instagram.com/p/DPW2cBgkVV8/"

# Mensagens possíveis (serão escolhidas aleatoriamente)
MENSAGENS = [
    "Fala cmg! Botei fé na sua curtida no nosso post! Comente 'Sou hoop' na foto fixada para acessar a lista VIP?. Conteúdo exclusivo, promoções e adquirir a sua peça antes?",
    "Opa! Obrigado por curtiu minha última foto! Quer um convite pra minha lista VIP? É só voltar lá e comentar 'Sou Hoop'. Fechado?",
    "Não perca a chance do DESCONTO EXCLUSIVO | ACESSO ANTECIPADO | CONTEÚDO EXCLUSIVO, basta comentar 'Sou hoop' na foto fixada para acessar a lista VIP!",
    "Ultimas horas para acessar a LISTA VIP! comente 'Sou hoop' no post fixado e garanta sua EXCLUSIVIDADE..."
]

# Arquivo de log
ARQUIVO_LOG = "log_enviados.txt"
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
