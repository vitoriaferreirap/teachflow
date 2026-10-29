
require('dotenv').config();                            // carrega as variáveis do .env (precisa vir antes de tudo)
const routes = require('./routers/route');
const handlebars = require('express-handlebars');
const express = require('express');
const app = express();
const mongoose = require('mongoose');                  // biblioteca do MongoDB
const StringCon = require('./config/db_mongoose');
const db = require('./config/db_sequelize');          // PostgreSQL (Sequelize)
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const { usuarioNasViews } = require('./middlewares/auth');

// config templete engine
app.engine('handlebars', handlebars.engine({
  defaultLayout: 'main',
  helpers: {
    eq: (a, b) => a === b                               // uso: {{#if (eq tipo 1)}}
  }
}));
app.set('view engine','handlebars');

// arquivos do Bootstrap (instalado via npm) ficam acessíveis em /bootstrap
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
// arquivos próprios (CSS, imagens, JS) ficam em /public
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------
// SESSÃO DE LOGIN
// Precisa vir ANTES de app.use(routes): os middlewares rodam na ordem
// em que aparecem aqui, e as rotas precisam de req.session já pronta.
//
// Caminho de cada requisição:
//   navegador envia cookie "sid"
//     -> session() busca os dados dessa sessão no Postgres e coloca em req.session
//     -> usuarioNasViews() repassa req.session.usuario para as views
//     -> routes: exigirLogin / exigirProfessora decidem se pode entrar
//     -> controller
//
// A sessão fica no PostgreSQL (tabela "session", criada sozinha),
// para não deslogar todo mundo quando o servidor reiniciar.
// ---------------------------------------------------------------------
app.use(session({
  store: new PgSession({
    conObject: {
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD
    },
    createTableIfMissing: true
  }),
  name: 'sid',                                         // nome do cookie no navegador
  secret: process.env.SESSION_SECRET,                  // assina o cookie: se alguém alterar o id, o servidor percebe
  resave: false,
  saveUninitialized: false,                            // só cria sessão depois do login
  cookie: {
    httpOnly: true,                                    // JavaScript da página não consegue ler o cookie
    sameSite: 'lax',                                   // dificulta requisições forjadas vindas de outros sites
    secure: process.env.NODE_ENV === 'production',     // em produção, só envia o cookie por HTTPS
    maxAge: 1000 * 60 * 60 * 8                         // 8 horas
  }
}));
app.use(usuarioNasViews);

app.use(routes);

app.use(
    express.urlencoded({
      extended: true
    })
)

// Conecta aos bancos PRIMEIRO; só sobe o servidor se os dois derem certo
db.sequelize.authenticate()
  .then(() => {
    console.log('Conectado ao PostgreSQL | banco:', db.sequelize.config.database);
    return db.sequelize.sync();           //cria tabelas que ainda não existem             // cria as tabelas que ainda não existem
  })
  .then(() => {
    console.log('Tabelas sincronizadas');
    return mongoose.connect(StringCon.connection);
  })
  .then(() => {
    console.log('Conectado ao MongoDB Atlas | banco:', mongoose.connection.name);

    const PORT = process.env.PORT || 8081;
    app.listen(PORT, function () {
      console.log('Servidor no http://localhost:' + PORT);
    });
  })
  .catch((erro) => {
    console.error('Erro ao conectar no banco:', erro.message);
  });