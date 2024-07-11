//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const express = require("express")
const router = express.Router()
const upload = require("../config/multer")

//IMPORTA AS FUNÇÕES DAS ROTAS DO USUÁRIO
const PictureController = require('../controllers/pictureController')

//DECLARA AS ROTAS E AS FUNÇÕES RESPECTIVAMENTE A SEREM UTILIZADAS PELA ROTA
router.post('/', upload.single("file"), PictureController.create)
router.get('/', upload.single("file"), PictureController.listAll)
router.get('/image/:name', upload.single("file"), PictureController.getOne)

//EXPORTA TODAS AS ROTAS
module.exports = router