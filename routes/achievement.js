//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const express = require("express")
const router = express.Router()

//IMPORTA AS FUNÇÕES DAS ROTAS DAS CONQUISTAS
const AchievementController = require('../controllers/achievementController')

//DECLARA AS ROTAS E AS FUNÇÕES RESPECTIVAMENTE A SEREM UTILIZADAS PELA ROTA
router.get('/achievements', AchievementController.listAll)
router.get('/:title', AchievementController.getOne)
router.post('/upload', AchievementController.create)

//EXPORTA TODAS AS ROTAS
module.exports = router