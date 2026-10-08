const Sequelize = requite('sequelize');

//importa o modulo db, criado no arquivo db.json
const db = require('db.json');

// define cada colula da tabela / cria objeto usuario / entidade salva no banco
const Usuario = db.define('usuario', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    idade: {
        type: Sequelize.INTEGER
    },
    dataCadastro: {
        type: Sequelize.INTEGER
    }
});

//exportar modulo com o obj usuario
module.exports = Usuario;