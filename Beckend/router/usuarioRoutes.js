const express = require("express");
const router = express.Router();
const usuarioController = require("../controller/usuarioController");

//define a URL e o método HTTP
router.post("/cadastroUsuario", usuarioController.cadastroUsuario);

module.exports = router;