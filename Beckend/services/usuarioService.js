//contém as regras de negócio.
const db = require('../config/bd');

async function criarUsuario(dados) {
    const novoUsuario = await db.Usuario.create({
            nome: dados.nome,
            email: dados.email,
            senha: dados.senha
    });
    return novoUsuario;
}

module.exports = { criarUsuario };