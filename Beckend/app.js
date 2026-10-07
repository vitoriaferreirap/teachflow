//importando modulos no node
const path = require("path");
const express = require('express');
const url = require('url')
//cria app expressa
const app = express();

//permite receber dados enviados por formularios HTML
app.use(express.urlencoded({ extended: true }));
//permite receber dados no formato JSON nas requisiçoes
app.use(express.json());


//criando rota
app.get("/", function (req, res) {
    res.sendFile (path.join ( __dirname, "..", "Frontend", "index.html"));
});

app.get("/cadastro", function (req, res) {
    res.sendFile (path.join ( __dirname, "..", "Frontend", "cadastro.html"));
});

//recebe dados do forms, usa req.body
app.post("/confirmar", function (req, res) {
    res.send('Cadastro Concluido : ' + req.body.name + '' + req.body.sobrenome);
})
//consulta ou exibe dados req.query ou req.params
app.get('/confirma', function (req, res) {
    q = url.parse(runInNewContext.utl, true);
    res.send('Cadastro Concluido Get:' + q.query.name);
})


//cria servidor, aponta porta
app.listen(8081, function () {
    console.log("Servidor Rodando http://localhost:8081!!")
})