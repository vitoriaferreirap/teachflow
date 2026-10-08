//importação modulo sequelize
const Sequelize = require('sequelize');
require('dotenv').config();

//configura conexo com bd e exporta modelos prontos

//passagens de parâmetros para instanciar o objeto sequelize-ness
//conexão banco
const sequelize = new Sequelize(
    process.env.BD_NAME, 
    process.env.BD_USER,
    process.env.BD_PASS,
    {
        host: 'localhost', dialect: 'postgres'
    });


//cria obj central
//reune tudo que pertence ao banco
//outros arquivos podem reutilizalos
var db = {};
//add instancia concexão com bibli sequelize no obj
db.Sequelize = Sequelize;
//add instancia conexão com bd no obj 
db.sequelize = sequelize;

//add models ao obj db
db.Usuario = require('../models/usuario.js')(sequelize, Sequelize);
db.Produto = require('../models/produto.js')(sequelize, Sequelize);
db.Consumidor = require('../models/consumidor.js')(sequelize, Sequelize);
db.Compra = require('../models/compra.js')(sequelize, Sequelize);
db.ItemCompra = require('../models/itemCompra.js')(sequelize, Sequelize);

//define relação entre objetos/tabelas - bidimencional
//UM PARA MUITOS
db.Usuario.hasMany(db.Compra); // um user pode ter varias compras
db.Compra.belongsTo(db.Usuario); // uma compra só pode ter  1 user

//MUITOS PARA MUITOS
db.Compra.belongsToMany(db.Produto, { through: db.ItemCompra });//uma compra pode ter varios produtos
db.Produto.belongsToMany(db.Compra, { through: db.ItemCompra })// um produto pode aparecer em varias compras


module.exports = db;


