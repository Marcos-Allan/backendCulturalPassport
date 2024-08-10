//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const express = require("express")
const router = express.Router()

//IMPORTA AS FUNÇÕES DAS ROTAS DAS CONQUISTAS
const MatterController = require('../controllers/matterController')

//DECLARA AS ROTAS E AS FUNÇÕES RESPECTIVAMENTE A SEREM UTILIZADAS PELA ROTA
router.get('/matters', MatterController.listAll)
router.get('/:matter', MatterController.getOne)
router.post('/upload', MatterController.create)

//EXPORTA TODAS AS ROTAS
module.exports = router