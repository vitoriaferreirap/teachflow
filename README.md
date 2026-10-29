# TeachFlow

Sistema web para uma professora de inglês que dá aulas remotas. Tem duas partes:

- **Site público (portfólio):** apresentação da professora, como funcionam as aulas, planos e contato.
- **Área logada:** professora e alunos entram com login e senha, e cada um vê só o que tem permissão para ver.

A ideia é substituir, aos poucos, o Google Agenda e o WhatsApp que a professora usa hoje para organizar as aulas.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Servidor | Node.js + Express |
| Páginas | Handlebars (`express-handlebars`) + Bootstrap 5 |
| Usuários e sessões | PostgreSQL com Sequelize |
| Comentários | MongoDB Atlas com Mongoose |
| Login | `express-session` + `connect-pg-simple` (sessão salva no Postgres) |
| Senhas | `bcryptjs` (só o hash é salvo) |
| Configuração | `dotenv` (arquivo `.env`) |

## Como rodar

### 1. Pré-requisitos

- Node.js 18 ou mais novo
- PostgreSQL rodando, com um banco criado (ex.: `web2_db`)
- Uma conexão do MongoDB Atlas (ou um MongoDB local)

### 2. Instalar

```bash
git clone https://github.com/vitoriaferreirap/teachflow.git
cd teachflow
npm install
```

### 3. Configurar o `.env`

Copie o modelo e preencha com seus dados:

```bash
cp .env.example .env
```

| Variável | Para que serve |
|---|---|
| `PG_HOST`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD` | Conexão com o PostgreSQL |
| `MONGO_URI` | Conexão com o MongoDB |
| `PORT` | Porta do servidor (padrão `8081`) |
| `SESSION_SECRET` | Chave que assina o cookie de login. Use um texto aleatório e longo |

O `.env` está no `.gitignore` e **nunca** deve ir para o Git.

### 4. Criar a conta da professora

```bash
npm run criar-professora -- login senha
```

Se o login já existir, o script redefine a senha e transforma a conta em professora.

### 5. Subir o servidor

```bash
npm start
```

Acesse http://localhost:8081. Ao subir, o servidor cria as tabelas que faltam no Postgres (`sequelize.sync()`) e mostra "Tabelas sincronizadas" no terminal.

## Estrutura do projeto

```
teachflow/
├── app.js                  # Ponto de entrada: .env, Handlebars, estáticos, sessão, rotas e bancos
├── .env.example            # Modelo das variáveis de ambiente (sem senhas)
├── config/
│   ├── db_sequelize.js     # Conexão com o PostgreSQL
│   └── db_mongoose.js      # Conexão com o MongoDB
├── models/
│   ├── relational/usuario.js   # Tabela usuarios (com hash de senha)
│   └── noSql/comentario.js     # Coleção de comentários
├── middlewares/auth.js     # exigirLogin, exigirProfessora e usuário nas views
├── controllers/            # Lógica das páginas de usuário e de comentário
├── routers/route.js        # Lista de rotas e a proteção de cada uma
├── views/
│   ├── layouts/            # main (área logada), noMenu (login), site (portfólio)
│   ├── partials/           # navbar, navbarSite, footer
│   ├── site/inicio.handlebars  # Página de portfólio
│   ├── usuario/            # Login, cadastro e lista de alunos
│   └── comentario/         # Cadastro e lista de comentários
├── public/css/style.css    # CSS próprio, carregado depois do Bootstrap
└── scripts/criarProfessora.js  # Cria a primeira conta de professora
```

### Layouts e partials

- Cada **layout** é o molde de um tipo de página. Todos carregam o Bootstrap (servido pelo próprio Express em `/bootstrap`, sem depender de internet) e depois o `style.css`.
- Os **partials** guardam o que se repete em várias páginas, como o menu e o rodapé. Editar um partial muda todas as páginas que o usam. No layout, o uso é `{{> navbar}}`.
- A cor principal do site fica na variável `--bs-primary`, no topo do `style.css`.

## Rotas e permissões

| Rota | Quem acessa |
|---|---|
| `/` | Todos (portfólio) |
| `/login`, `/logout` | Todos |
| `/home`, `/comentarioCreate`, `/comentarioList` | Usuário logado (aluno ou professora) |
| `/usuarioCreate`, `/usuarioList` | Só a professora |

Tipos de usuário: `1` = professora, `2` = aluno.

## Segurança

Cada requisição passa por estas etapas:

1. **Sessão:** o `express-session` lê o cookie `sid` e busca os dados na tabela `session` do Postgres.
2. **`exigirLogin`:** quem não tem sessão é redirecionado para `/login`.
3. **`exigirProfessora`:** um aluno que tenta abrir uma rota da professora recebe `403 Acesso negado`.
4. **Controller:** só roda se passou pelas etapas anteriores.

Esconder um link no menu não protege nada. Quem bloqueia de verdade é o middleware, no servidor.

Outros cuidados:

- **Senhas:** o hook `beforeSave` do model troca a senha por um hash bcrypt antes de gravar. No login, `senhaConfere()` compara a senha digitada com o hash.
- **Login:** quando o login falha, a mensagem é sempre "Login ou senha inválidos.", para não revelar quais logins existem. Quando dá certo, `req.session.regenerate()` troca o id da sessão (evita fixação de sessão) e só `{ id, login, tipo }` vai para a sessão, nunca a senha.
- **Logout:** `POST /logout` apaga a sessão no banco e o cookie no navegador.
- **Cookie:** `httpOnly`, `sameSite: 'lax'`, `secure` em produção e duração de 8 horas. Com `saveUninitialized: false`, a sessão só é criada depois do login.
- **Listagem de alunos:** busca só `id`, `login` e `tipo`, então o hash nem sai do banco.

## Próximos passos

- [ ] Agenda de aulas: tabela `aulas` (aluno, data e hora, duração, status, link da chamada)
- [ ] Tela "Agenda" para a professora e "Minhas aulas" para o aluno
- [ ] Comentários virando recados e materiais, com o autor vindo da sessão
- [ ] Lembretes por e-mail
- [ ] Docker na hora de publicar
