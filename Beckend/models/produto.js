modulo.exports = (Sequelize, Sequelize) => {
    const Produto = Sequelize.define('produto', {
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
    return Produto;
}