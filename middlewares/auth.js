// MIDDLEWARES DE AUTENTICAÇÃO E PERMISSÃO
//   É uma função que roda ANTES do controller. Ela recebe (req, res, next):
//     - req  = a requisição (o que o navegador pediu, incluindo a sessão)
//     - res  = a resposta (o que vamos devolver)
//     - next = "pode seguir para o próximo passo" (o próximo middleware ou o controller)
//   Se o middleware chama next(), a requisição continua.
//   Se ele faz res.redirect() ou res.render(), a requisição PARA ali
//   e o controller nunca é executado. É assim que bloqueamos rotas.
//
// Onde eles são usados?
//   - usuarioNasViews: em app.js, roda em TODAS as requisições
//   - exigirLogin / exigirProfessora: em routers/route.js, rota por rota


// Tipos de usuário (campo "tipo" da tabela usuarios).
// Usar constantes evita espalhar números "mágicos" (1, 2) pelo código.
const TIPO_PROFESSORA = 1;
const TIPO_ALUNO = 2;

module.exports = {
    TIPO_PROFESSORA,
    TIPO_ALUNO,

    
    // Coloca o usuário logado à disposição de TODAS as views.
    // Tudo que está em res.locals pode ser usado direto no handlebars,
    // por isso a navbar consegue fazer {{usuario.login}} e {{#if ehProfessora}}
    // sem que cada controller precise passar isso no res.render().
    
    usuarioNasViews(req, res, next) {
        // req.session.usuario só existe se a pessoa fez login (ver controllerUsuario.postLogin)
        res.locals.usuario = req.session.usuario;
        // o "?." evita erro quando não há ninguém logado (usuario = undefined)
        res.locals.ehProfessora = req.session.usuario?.tipo === TIPO_PROFESSORA;
        next(); // segue normalmente, este middleware nunca bloqueia
    },

    
    // BLOQUEIO DE ROTA: só deixa passar quem está logado.
    // Uso na rota: route.get("/home", exigirLogin, ...)
    exigirLogin(req, res, next) {
        if (req.session.usuario) return next(); // logado: pode seguir
        res.redirect('/login');                 // não logado: volta para o login
    },

    
    // PERMISSÃO POR TIPO: só deixa passar a professora.
    // Uso na rota: route.get("/usuarioList", exigirProfessora, ...)
    exigirProfessora(req, res, next) {
        // 1º: não está logado? manda para o login
        if (!req.session.usuario) return res.redirect('/login');

        // 2º: está logado E é professora? pode seguir
        if (req.session.usuario.tipo === TIPO_PROFESSORA) return next();

        // 3º: está logado mas é aluno: mostra "acesso negado".
        // 403 é o código HTTP para "sei quem você é, mas você não tem permissão".
        res.status(403).render('erro', {
            titulo: 'Acesso negado',
            mensagem: 'Esta página é exclusiva da professora.'
        });
    }
};

// IMPORTANTE: esconder o link na navbar NÃO é segurança.
// Um aluno poderia digitar /usuarioList direto na barra do navegador.
// Quem impede de verdade é o exigirProfessora aqui, que roda no servidor.
