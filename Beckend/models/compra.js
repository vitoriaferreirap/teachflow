module.exports = ( sequelize, Sequelize) => {
    const Compra = sequelize.define('compra', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        valor_total: {
            type: Sequelize.DOUBLE,
            allowNull: false
        }
    });
    return Compra;
}