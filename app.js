
// inicia com ./ diz: a partir desta pasta
// inciar sem ./ é: biblioteca, NODE procura dentro no node_modules onde o npm install colocou
// carrega as variáveis do .env e coloca dentro da process.env (precisa vir antes de tudo)
require('dotenv').config(); 
const routes = require('./routers/route');
const handlebars = require('express-handlebars');
const express = require('express');
// servidor se cria
const app = express();
const mongoose = require('mongoose');                  // biblioteca do MongoDB
const StringCon = require('./config/db_mongoose');
const db = require('./config/db_sequelize');          // PostgreSQL (Sequelize)
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const { usuarioNasViews } = require('./middlewares/auth');

// engine instala e config templete/moldura engine
// handlebars so testa verdadeiro ou falso, se for igual retorna true
app.engine('handlebars', handlebars.engine({
  defaultLayout: 'main',
  helpers: {
    eq: (a, b) => a === b                               // uso: {{#if (eq tipo 1)}}
  }
}));
app.set('view engine', 'handlebars');//set torna ferramenta como padrao

// express.statica - entrega arquivos prontos sem passar por camadas
// arquivos do Bootstrap (instalado via npm) ficam acessíveis em /bootstrap
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
// arquivos próprios (CSS, imagens, JS) ficam em /public
app.use(express.static(__dirname + '/public'));

//tranforma o formulário em req.body
//dados normalmente trafegam em texto puro ex: login=ana&senha=123 chamado de formato urlencoded
//controller quer objeto JavaScript, então os middlewares (express.json e urlencoded fazem essa conversão) 
// req.body = { login: 'ana', senha: '123' }, agora controller consegue ler req.body.login 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//GUAARDA VOLUMES DE ACESSO AO SISTEMA 
/**
 * 1) dados da sessãao : quem é o ususario, o tipo
 * 2) lugar onde sessão fica guardadaa: PostgreSQL, tabela session
 * 3) como localizar na tabela: cookie sid, que fica o navegador (manda automatico to requisicaao em req.session)
 * 
 * aqui eu configuro a sessão; quem cria o req.session é a biblioteca, e quem usa é o controller e o middleware.
 */
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
app.use(usuarioNasViews); //somente copia user da sessão nas views

app.use(routes);

app.use(
    express.urlencoded({
      extended: true
    })
)

// Conecta aos bancos PRIMEIRO; só sobe o servidor se os dois derem certo
//Testa conexao com banco
db.sequelize.authenticate()
  .then(() => { // garante a ordem, cada passo so começa quando o anterior terminar, se falhar vai para o catch
    console.log('Conectado ao PostgreSQL | banco:', db.sequelize.config.database);
    return db.sequelize.sync();  //sync - cria tabelas que ainda não existem
  })
  .then(() => {
    console.log('Tabelas sincronizadas');
    return mongoose.connect(StringCon.connection);
  })
  .then(() => {
    console.log('Conectado ao MongoDB Atlas | banco:', mongoose.connection.name);

    const PORT = process.env.PORT || 8081;
    app.listen(PORT, function () { //servidor sobe
      console.log('Servidor no http://localhost:' + PORT);
    });
  })
  .catch((erro) => {
    console.error('Erro ao conectar no banco:', erro.message);
  });