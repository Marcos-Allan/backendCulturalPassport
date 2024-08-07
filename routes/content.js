//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const express = require("express")
const router = express.Router()
const upload = require("../config/multer")

//IMPORTA AS FUNÇÕES DAS ROTAS DO CONTEUDO
const ContentController = require('../controllers/contentController')

//DECLARA AS ROTAS E AS FUNÇÕES RESPECTIVAMENTE A SEREM UTILIZADAS PELA ROTA
router.post('/upload', upload.single("file"), ContentController.create)
router.get('/:filename', ContentController.getOne)
router.get('/cont/all', ContentController.listAll)

//EXPORTA TODAS AS ROTAS
module.exports = router