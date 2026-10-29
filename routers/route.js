const express = require('express');
const db = require('../config/db_sequelize');
const controllerUsuario = require('../controllers/controllerUsuario');
const controllerComentario = require('../controllers/controllerComentario');
const { exigirLogin, exigirProfessora } = require('../middlewares/auth');
const route = express.Router();

module.exports = route;


// LER UMA ROTA PROTEGIDA
//   route.get("/home", exigirLogin, controller)
//                       1º roda     2º roda só se o 1º chamar next()
// O Express executa as funções da esquerda para a direita.
// O middleware (exigirLogin / exigirProfessora) decide se o controller roda.
// Ver middlewares/auth.js

//Rotas públicas (qualquer pessoa, sem login) 
//Site público (portfólio da professora)
route.get("/", function (req, res) { res.render('site/inicio', { layout: 'site' }) });

//Usuario - Login e Logout
route.get("/login", controllerUsuario.getLogin);
route.post("/login", controllerUsuario.postLogin);
route.post("/logout", controllerUsuario.postLogout);

//Rotas para qualquer usuário logado (aluno ou professora)

//Home (área logada)
route.get("/home", exigirLogin, function (req, res) { res.render('home') });

//Comentarios-CRUD
route.get("/comentarioCreate", exigirLogin, controllerComentario.getCreate);
route.post("/comentarioCreate", exigirLogin, controllerComentario.postCreate);
route.get("/comentarioList", exigirLogin, controllerComentario.getList);

// Rotas só da professora 
// Protegemos o GET (ver a página) E o POST (enviar o formulário):
// sem proteger o POST, alguém poderia enviar o formulário por fora da página.

//Usuario - CRUD
route.get("/usuarioCreate", exigirProfessora, controllerUsuario.getCreate);
route.post("/usuarioCreate", exigirProfessora, controllerUsuario.postCreate);
route.get("/usuarioList", exigirProfessora, controllerUsuario.getList);
