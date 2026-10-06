const express = require('express');
const app = express();

//criando rota
app.get("/", function (req, res) {
    res.send("Pagina Inicial");
});

//cria servidor, aponta porta
app.listen(8081, function () {
    console.log("Servidor Rodando!!")
})