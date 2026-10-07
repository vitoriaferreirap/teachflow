const path = require("path");
function cadastrar(req, res) {
    res.sendFile(
        path.join(__dirname, "..", "..", "frontend", "cadastro.html")
)};

function confirmar(req, res) {
    const { name, sobrenome } = req.body;
    res.send (`Cadastro Concluido: ${name} ${sobrenome}`);
}

//consulta ou exibe dados req.query ou req.params
function listaConfirmacao(req, res) {
    const name = req.query.name;
    res.send('Cadastro Concluido Get:' + name);
};

module.exports = { confirmar, cadastrar, listaConfirmacao };