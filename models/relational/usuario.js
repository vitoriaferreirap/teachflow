// =====================================================================
// MODEL USUARIO (tabela "usuarios" no PostgreSQL)
// =====================================================================
// SENHA CRIPTOGRAFADA (hash)
//   Nunca guardamos a senha como o usuário digitou ("1234").
//   Guardamos um HASH, gerado pelo bcrypt, algo como:
//     $2b$10$N9qo8uLOickgx2ZMRZoMye...
//   O hash é de "mão única": dá para gerar o hash a partir da senha,
//   mas NÃO dá para descobrir a senha a partir do hash.
//   Assim, mesmo que alguém veja o banco, não descobre as senhas.
//
//   Como o login funciona então? Na hora do login, o bcrypt pega a
//   senha digitada e verifica se ela gera aquele hash (senhaConfere).
// =====================================================================

const bcrypt = require('bcryptjs');

module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define('usuario', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true, allowNull: false, primaryKey: true
        },
        login: {
            // unique: o banco não aceita dois usuários com o mesmo login
            type: Sequelize.STRING, allowNull: false, unique: true
        },
        senha: {
            type: Sequelize.STRING, allowNull: false   // aqui fica o HASH, nunca a senha pura
        },
        tipo: {
            type: Sequelize.INTEGER, allowNull: false   // 1 = professora, 2 = aluno (ver middlewares/auth.js)
        }
    }, {
        hooks: {
            // Hook = função que o Sequelize roda automaticamente em certos momentos.
            // beforeSave roda ANTES de todo create() e save().
            // Por isso nenhum controller precisa lembrar de criptografar: acontece sozinho.
            async beforeSave(usuario) {
                // só gera hash se a senha foi alterada; senão, ao salvar outro campo,
                // faríamos hash do hash e a senha deixaria de funcionar
                if (usuario.changed('senha')) {
                    // 10 = "custo": quanto maior, mais lento para gerar,
                    // e mais difícil para um atacante testar milhões de senhas
                    usuario.senha = await bcrypt.hash(usuario.senha, 10);
                }
            }
        }
    });

    // Método disponível em cada usuário encontrado no banco.
    // Uso: const ok = await usuario.senhaConfere('1234');  -> true ou false
    Usuario.prototype.senhaConfere = function (senhaDigitada) {
        return bcrypt.compare(senhaDigitada, this.senha);
    };

    return Usuario;
}
