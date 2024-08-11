//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const express = require("express")
const router = express.Router()

//IMPORTA AS FUNÇÕES DAS ROTAS DAS CONQUISTAS
const FeedbackController = require('../controllers/feedbackController')

//DECLARA AS ROTAS E AS FUNÇÕES RESPECTIVAMENTE A SEREM UTILIZADAS PELA ROTA
router.get('/feedbacks', FeedbackController.listAll)
router.get('/:id', FeedbackController.getOne)
router.post('/upload', FeedbackController.create)

//EXPORTA TODAS AS ROTAS
module.exports = router