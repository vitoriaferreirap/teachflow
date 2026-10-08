//importando modulos no node
const express = require('express');
const db = require("./config/bd");
//cria app expressa
const app = express();
//permite receber dados enviados por formularios HTML
app.use(express.urlencoded({ extended: true }));
//permite receber dados no formato JSON nas requisiçoes
app.use(express.json());


//IMPORTAÇÃO ROTAS
const usuarioRoutes = require("./router/usuarioRoutes");

//REGISTRA ROTAS ESPRESS
app.use("/cadastrarUsuarios", usuarioRoutes);
app.use("/usuarios", usuarioRoutes);

//cria e sincroniza as tabelas com base nos models e relacionamento
db.sequelize.sync().then(() => {
    console.log('Banco de dados sincronizado com sucesso!');
    app.listen(8081, function () {
        console.log("Servidor Rodando http://localhost:8081!!");
    });
});



/*APENAS TESTA conexão com o banco antes de iniciar o servidor
sequelize.authenticate()
    .then(() => {
        console.log("Banco de dados conectado!");
        //cria servidor, aponta porta
        app.listen(8081, function () {
            console.log("Servidor Rodando http://localhost:8081!!");
        });
    })
        .catch((error) => {
            console.error("Erro com a conexão do banco", error.mesage);
        });
*/

