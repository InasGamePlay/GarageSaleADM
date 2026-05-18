# Entrega-Inicial---Automacao-para-o-IntagraM

----- AUTOGRAM -----
___________________________________________________________________________
descrição:

Envio de mensagens automáticas com início manual para seguidores e usuários da página do Instagram.

____________________________________________________________________________

porposta da solução:

Um cli de ativação manual de automação para o Instagram com mensagens na DM para usuários que curtiram sua post/reels, ou mesmo para seus seguidores... Dessa forma, tirando o ato de enviar mensagem manualmente para cada usuário que é seu seguidor ou interagiu com sua página.
____________________________________________________________________________

Público alvo:

Empreededores no Instagram.
____________________________________________________________________________

Funcionalidades principais:

Envio automático de mensagem.

____________________________________________________________________________

Tecnologia usada:

instagrapi - py

____________________________________________________________________________

Intrução de instalação: 

- criação de uma pasta
- adicione na pasta o arquivo arquivo py e o "log.txt"

____________________________________________________________________________

Intrução de execução:

- Dentro do codigo
- altere o ("COLOQUE_O_USER_AQUI") na linha 8 para usuário do instagram
- altere o ("COLOQUE_A_SENHA_DO_USER_AQUI") na linha 9 para a senha do usuário
- na linha 10 o ("COLOQUE_O_LINK_DO_POST_AQUI") para o link do post queira mandar mensagem para aqueles que curtiram
- linha 13 em (MENSAGENS = [) coloque variantes de mensagens que deseja enviar
- após isso, basta rodar o código
____________________________________________________________________________

linting:

O código é funcional e legível, mas apresenta problemas como uso de credenciais no código, tratamento genérico de erros e falta de modularização. Também há pequenas ineficiências no uso de arquivos e inconsistências de tipos. No geral, funciona, mas pode melhorar em segurança, organização e boas práticas.
____________________________________________________________________________

testes:

- validar se o log está sendo salvo corretamente
- validar se usuários duplicados não recebem mensagem
- validar escolha aleatória de mensagens
____________________________________________________________________________

versão:
1.0.0
____________________________________________________________________________

autor: Inácio Barros de Sousa 
____________________________________________________________________________
LINK REPOSITORIO: https://github.com/ibdev3/Entrega-Inicial---Automa-o-para-o-Intagram
