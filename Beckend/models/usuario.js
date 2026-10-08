module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define('usuario', {
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

    return Usuario;
};