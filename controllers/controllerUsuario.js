    const db = require('../config/db_sequelize');

    module.exports = {
        // GET /login -> mostra a tela de login
        async getLogin(req, res) {
            // se já está logado, não faz sentido ver o login de novo
            if (req.session.usuario) return res.redirect('/home');
            res.render('usuario/login', { layout: 'noMenu.handlebars' });
        },

        // POST /login -> recebe login e senha do formulário
        //
        // FLUXO DO LOGIN:
        //   1. procura no banco um usuário com aquele login
        //   2. compara a senha digitada com o hash salvo (bcrypt)
        //   3. se algo der errado, volta para o login com mensagem de erro
        //   4. se der certo, guarda o usuário na SESSÃO e vai para /home
        //
        // O QUE É A SESSÃO?
        //   O HTTP não "lembra" de nada entre uma página e outra.
        //   A sessão resolve isso: o servidor guarda os dados (no Postgres,
        //   tabela "session") e manda para o navegador só um cookie "sid"
        //   com um id aleatório. Em cada página nova, o navegador envia
        //   esse cookie e o express-session busca os dados de volta em
        //   req.session. Por isso, depois do login, req.session.usuario
        //   existe em todas as requisições.
        async postLogin(req, res) {
            try {
                // 1. busca o usuário pelo login
                const usuario = await db.Usuario.findOne({ where: { login: req.body.login } });

                // 2. "usuario &&" evita erro se não achou ninguém (usuario = null)
                const ok = usuario && await usuario.senhaConfere(req.body.senha);

                // 3. falhou
                if (!ok) {
                    // mesma mensagem para login ou senha errados, para não revelar quais logins existem
                    return res.status(401).render('usuario/login', {
                        layout: 'noMenu.handlebars',
                        erro: 'Login ou senha inválidos.',
                        login: req.body.login   // devolve o login para não precisar digitar de novo
                    });
                }

                // 4. deu certo
                // regenerate() troca o id da sessão no momento do login.
                // Isso evita o ataque de "fixação de sessão" (alguém plantar
                // um id de sessão no seu navegador antes de você logar).
                req.session.regenerate((err) => {
                    if (err) return res.status(500).send('Erro ao iniciar sessão.');

                    // guardamos só o necessário; NUNCA a senha
                    req.session.usuario = { id: usuario.id, login: usuario.login, tipo: usuario.tipo };
                    res.redirect('/home');
                });
            } catch (err) {
                console.log(err);
                res.status(500).send('Erro ao fazer login.');
            }
        },

        // POST /logout -> encerra a sessão
        async postLogout(req, res) {
            // destroy() apaga a sessão do banco; clearCookie() apaga o cookie do navegador
            req.session.destroy(() => {
                res.clearCookie('sid');
                res.redirect('/');
            });
        },

        // GET /usuarioCreate (só professora, ver routers/route.js)
        async getCreate(req, res) {
            res.render('usuario/usuarioCreate');
        },

        // POST /usuarioCreate (só professora)
        async postCreate(req, res) {
            // a senha vai "pura" aqui, mas o hook beforeSave do model
            // transforma em hash antes de gravar no banco
            db.Usuario.create({
                login:req.body.login,
                senha:req.body.senha,
                tipo:req.body.tipo
                }).then(() => {
                    res.redirect('/usuarioList');
                }).catch((err) => {
                    console.log(err);
                    // erro de "unique": já existe alguém com esse login
                    if (err.name === 'SequelizeUniqueConstraintError') {
                        return res.status(400).render('usuario/usuarioCreate', { erro: 'Já existe um usuário com esse login.' });
                    }
                    res.status(500).send('Erro ao cadastrar usuário: ' + err.message);
                });
        },

        // GET /usuarioList (só professora)
        async getList(req, res) {
            // attributes: escolhe as colunas buscadas. A senha (hash) nem sai do banco.
            db.Usuario.findAll({ attributes: ['id', 'login', 'tipo'] }).then (usuarios => {
                res.render('usuario/usuarioList', {usuarios: usuarios.map(user => user.toJSON())});
            }).catch((err) => {
                console.log(err);
                res.status(500).send('Erro ao listar usuários: ' + err.message);
            });
        }
    }
