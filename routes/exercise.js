//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const express = require("express")
const router = express.Router()

//IMPORTA AS FUNÇÕES DAS ROTAS DAS CONQUISTAS
const ExerciseController = require('../controllers/exerciseController')

//DECLARA AS ROTAS E AS FUNÇÕES RESPECTIVAMENTE A SEREM UTILIZADAS PELA ROTA
router.get('/exercises', ExerciseController.listAll)
router.get('/:matter', ExerciseController.getOne)
router.post('/upload', ExerciseController.create)

//EXPORTA TODAS AS ROTAS
module.exports = router