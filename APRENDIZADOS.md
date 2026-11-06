# Domínio de Negócio

## Quem usa o sistema
- Administrador (dev)
- Professor
- Aluno

## O que cada um pode fazer?
- Cadastrar novo professor (Administrador) *(hoje feito pela professora; vou mudar no código)*
- Cadastrar novo aluno (Professor)
- Cadastrar aulas (Professor) *(planejado)*
- Cadastrar comentários (Aluno)
- Publicar posts (Professor) *(planejado)*

## Quais regras existem?
- Aluno não pode acessar páginas exclusivas do professor
- Todas as senhas são salvas criptografadas (nunca em texto puro)
- O usuário continua logado enquanto navega
- O comentário sempre sai em nome de quem está logado

# Padrão Arquitetural MVC

## 1 View
- Camada de apresentação: mostra o que o usuário vê (HTML) e não tem regra de negócio. Usa-se aqui o Handlebars como ferramenta para fazer essa camada.
- Cada página do sistema é uma view (login, lista de usuários, página inicial).

-> PÁGINA LOGIN
-> AO CLICAR NO BOTÃO, O NAVEGADOR CRIA A REQUISIÇÃO (POST /login) E ENVIA OS DADOS ->

## 2 Middleware
- Definição: função que fica no meio do caminho, entre a requisição chegar e a resposta sair. Ela recebe (req, res, next) e pode:
  - ler ou preparar a requisição e chamar next() para seguir adiante;
  - ou barrar a requisição e responder ela mesma (ex.: redirecionar para /login).
- Middlewares globais (rodam em toda requisição, ANTES do router):
  - express.json / express.urlencoded: leem os dados do formulário e colocam em req.body
  - express-session: lê o cookie e recupera a sessão em req.session
  - usuarioNasViews: deixa o usuário logado disponível para todas as views
- Middlewares de guarda (rodam só em algumas rotas, DEPOIS do router achar a rota):
  - exigirLogin: sem sessão → redireciona para /login
  - exigirProfessora: aluno tentando entrar → bloqueia (403)

## 3 Router
- Interliga URL + MÉTODO HTTP (ex.: POST /login)
- Direciona para a função correta do controller (passando antes pelas guardas, quando a rota tiver)

## 4 Controller
- Lê a requisição, chama o MODEL e decide a resposta
- Coordena, mas não guarda regra de negócio

## 5 Model
- Salva e busca dados
- Tem regras de dados (ex.: criptografia da senha antes de salvar)

## 6 Volta (resposta)
- O Model devolve os dados ao Controller
- O Controller escolhe a View (res.render) ou redireciona (res.redirect)
- O HTML pronto volta para o navegador

# Segurança
- Autenticação (quem é você?): conferência de senha com bcrypt e sessão salva no PostgreSQL
- Autorização (o que você pode fazer?): middlewares exigirLogin e exigirProfessora
- Todos os logins têm sessão (cookie sid + dados guardados no PostgreSQL)

# app.js
- Ponto de entrada do sistema
- O que faz, em ordem:
  1. Configura o Express e o Handlebars (template engine das views)
  2. Registra os middlewares globais, NA ORDEM (a ordem importa!)
  3. Registra as rotas
  4. Conecta no PostgreSQL, roda sequelize.sync() e conecta no MongoDB
  5. Só depois disso começa a ouvir a porta (app.listen)

# Express
- O que é: framework do NodeJS para criar servidores web.
- Me dá três coisas principais:
  - rotas (ligar URL + método HTTP a uma função)
  - middlewares (funções no meio do caminho, com req, res e next)
  - os objetos req (o que chegou) e res (o que vou responder)

# Cookies e Sessão
- HTTP não guarda estado: cada requisição chega "sem lembrar" das anteriores.
- Cookie: pequeno dado que o servidor manda e o navegador devolve em toda requisição.
- No meu sistema: o navegador guarda só o cookie sid (um id assinado com o SESSION_SECRET);
  os dados da sessão ficam guardados no PostgreSQL.
- ENTREGA 2 MUDA PARA TOKEN

# POO
- O que já tenho:
  - Model Usuario guarda dado + comportamento juntos (encapsulamento)
  - Hook beforeSave criptografa a senha
  - Método senhaConfere no protótipo
  - Herança vinda do ORM (Model do Sequelize e do Mongoose)

# Testes

# Relacionamentos
- 1:N Um aluno tem várias aulas; uma aula é de um aluno.
- 1:N Um aluno faz vários comentários; um comentário tem um autor.
- 1:N Uma aula tem vários conteúdos (PDFs/links); um material é de uma aula.
- N:N Uma aula trabalha vários conteúdos; um conteúdo aparece em várias aulas.