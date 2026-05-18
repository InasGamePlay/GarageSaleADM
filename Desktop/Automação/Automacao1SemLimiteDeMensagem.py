from instagrapi import Client
import time
import random

# ====== CONFIGURAÇÕES ======
USUARIO = "cursometodofanart_"  # coloque seu @ aqui
SENHA = "oioi0909"  # senha da sua conta
POST_URL = "https://www.instagram.com/p/CBzvehtDQFz/" # URL do post
MENSAGEM = "Fala, tudo certo? Obrigado por curtir meu post! 🚀 Tenho uma novidade que pode te interessar."
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

# Enviar mensagens
for user_id in user_ids:
    try:
        cl.direct_send(MENSAGEM, [user_id])
        print(f"✅ Mensagem enviada para ID: {user_id}")

        # Delay aleatório entre 30 e 90 segundos
        time.sleep(random.randint(30, 90, ))

    except Exception as e:
        print(f"❌ Erro ao enviar para {user_id}: {e}")
        time.sleep(60)  # espera extra em caso de erro
