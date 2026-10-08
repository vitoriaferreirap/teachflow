
//sequelize passa como parametro, logo não precisa do require
module.exports = (sequelize, Sequelize) => {
    const Consumidor = sequelize.define('pessoa', {
        // ex atributo e comportamento
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nome: {
            type: Sequelize.STRING,
            allowNull: false
        }
    });
    return Consumidor;
}