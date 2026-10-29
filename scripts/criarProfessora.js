// Cria (ou redefine a senha de) uma conta de professora.
// Uso: npm run criar-professora -- <login> <senha>

require('dotenv').config({ quiet: true });
const db = require('../config/db_sequelize');
const { TIPO_PROFESSORA } = require('../middlewares/auth');

const [login, senha] = process.argv.slice(2);

if (!login || !senha) {
    console.log('Uso: npm run criar-professora -- <login> <senha>');
    process.exit(1);
}

(async () => {
    try {
        await db.sequelize.sync();

        const existente = await db.Usuario.findOne({ where: { login } });
        if (existente) {
            existente.senha = senha;                     // o hook do model gera o hash
            existente.tipo = TIPO_PROFESSORA;
            await existente.save();
            console.log(`Usuário "${login}" atualizado: agora é professora, com a nova senha.`);
        } else {
            await db.Usuario.create({ login, senha, tipo: TIPO_PROFESSORA });
            console.log(`Professora "${login}" criada.`);
        }
    } catch (err) {
        console.error('Erro:', err.message);
        process.exitCode = 1;
    } finally {
        await db.sequelize.close();
    }
})();
