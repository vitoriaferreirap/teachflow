//importando modulos no node
const express = require('express');
const alunoRoutes = require("./router/alunoRoutes");
const sequelize = require("./banco/bd");
//cria app expressa
const app = express();
//permite receber dados enviados por formularios HTML
app.use(express.urlencoded({ extended: true }));
//permite receber dados no formato JSON nas requisiçoes
app.use(express.json());

app.use("/cadastrar", alunoRoutes);
app.use("/alunos", alunoRoutes);

//Testar conexão com o banco antes de iniciar o servidor
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

