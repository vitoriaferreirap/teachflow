const express = require("express");
const router = express.Router();
const alunoController = require("../controller/alunoController");

router.get("/cadastro", alunoController.cadastrar);
router.post("/confirmar", alunoController.confirmar);
router.get("/confirmar", alunoController.listaConfirmacao);

module.exports = router;