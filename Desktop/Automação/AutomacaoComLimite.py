from instagrapi import Client
import time
import random

# ====== CONFIGURAÇÕES ======
USUARIO = "hoop.table"
SENHA = "@Brooklin9984995360"
POST_URL = "https://www.instagram.com/p/DPW2cBgkVV8/"
MENSAGEM = "Comente no post agora! E não perca o acesso ao VIP HOOP. Seja EXCLUSIVO e garanta antes de todos."
# ============================

# Login
cl = Client()
cl.login(USUARIO, SENHA)

# Obter o ID do post
media_id = cl.media_pk_from_url(POST_URL)

# Pegar lista de usuários que curtiram
likers = cl.media_likers(media_id)
user_ids = [user.pk for user in likers]

print(f"Total de usuários que curtiram: {len(user_ids)}")

# Contador
enviadas = 0

# Enviar mensagens
for i, user_id in enumerate(user_ids, start=1):
    try:
        cl.direct_send(MENSAGEM, [user_id])
        enviadas += 1
        print(f"✅ [{i}/{len(user_ids)}] Mensagem enviada para ID: {user_id}")

        # Delay aleatório entre mensagens (30 a 90 segundos)
        time.sleep(random.randint(30, 60, ))

        # A cada 20 mensagens, pausa de 1 hora
        if enviadas % 20 == 0:
            print("⏸️ Pausa de 1 hora para evitar bloqueio...")
            time.sleep(60)  # 1 hora em segundos

    except Exception as e:
        print(f"❌ Erro ao enviar para {user_id}: {e}")
        time.sleep(60)
