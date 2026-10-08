//importação modulo sequelize
const Sequelize = require('sequelize');
const env = require('dotenv').config();

//passagens de parâmetros para instanciar o objeto sequelize-ness
//conexão banco
const sequelize = new Sequelize(
    process.env.BD_NAME, 
    process.env.BD_USER,
    process.env.BD_PASS,
    {
        host: 'localhost', dialect: 'postgres'
    });

module.exports = sequelize;


