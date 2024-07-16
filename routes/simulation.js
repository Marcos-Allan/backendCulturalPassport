//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const express = require("express")
const router = express.Router()

//IMPORTA AS FUNÇÕES DAS ROTAS DOS SIMULADOS
const SimulationController = require('../controllers/simulationController')

//DECLARA AS ROTAS E AS FUNÇÕES RESPECTIVAMENTE A SEREM UTILIZADAS PELA ROTA
router.get('/simulations', SimulationController.listAll)
router.get('/:matter', SimulationController.getOne)
router.post('/upload', SimulationController.create)

//EXPORTA TODAS AS ROTAS
module.exports = router