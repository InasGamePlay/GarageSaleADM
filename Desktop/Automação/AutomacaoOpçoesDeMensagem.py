from instagrapi import Client
import time
import random

# ====== CONFIGURAÇÕES ======
USUARIO = "hoop.table"
SENHA = "@Brooklin9984995360"
POST_URL = "https://www.instagram.com/p/DPW2cBgkVV8/"

# Várias opções de mensagem
MENSAGENS = [
    "Oi! Botei fé na sua curtida no nosso post! Comente 'Sou hoop' na foto fixada para acessar a lista VIP?. Conteúdo exclusivo, promoções e adquirir a sua peça antes?",
    "Oi! Obrigado por curtiu minha última foto! Quer um convite pra minha lista VIP? É só voltar lá e comentar 'Sou Hoop'. Fechado?",
    "Não perca a chance do DESCONTO EXCLUSIVO | ACESSO ANTECIPADO | CONTEÚDO EXCLUSIVO, basta comentar 'Sou hoop' na foto fixada para acessar a lista VIP!",
    "Ultimas horas para acessar a LISTA VIP! comente 'Sou hoop' no post fixado e garanta sua EXCLUSIVIDADE..."

]
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
        # Escolhe uma mensagem aleatória
        mensagem = random.choice(MENSAGENS)

        # Envia a mensagem
        cl.direct_send(mensagem, [user_id])
        enviadas += 1
        print(f"✅ [{i}/{len(user_ids)}] Mensagem enviada para ID: {user_id}")

        # Delay aleatório entre mensagens (30 a 90 segundos)
        time.sleep(random.randint(30, 90))

        # Pausa automática a cada 20 mensagens
        if enviadas % 25 == 0:
            print("⏸️ Pausa de 10 minutos para evitar bloqueio...")
            time.sleep(600)

    except Exception as e:
        print(f"❌ Erro ao enviar para {user_id}: {e}")
        time.sleep(60)
