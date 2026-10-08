const usuarioService = require('../services/usuarioService');

async function cadastroUsuario(req, res) {
    try {
        //pega os dados enviando do cliente
        const { nome, email, senha } = req.body;
        //chama service para salvar no banco
        const usuarioCriado = await usuarioService.criarUsuario({ nome, email, senha });
        // devolve erro cliente
        return res.status (201).json(usuarioCriado) 
    } catch (error){
        return res.status(400).json({ error: error.message });
    }
}

module.exports = { cadastroUsuario };