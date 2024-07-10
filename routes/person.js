//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const express = require("express")
const router = express.Router()

//IMPORTA AS FUNÇÕES DAS ROTAS DO USUÁRIO
const PersonController = require('../controllers/personController')

//DECLARA AS ROTAS E AS FUNÇÕES RESPECTIVAMENTE A SEREM UTILIZADAS PELA ROTA
router.post('/signup', PersonController.signUp)
router.post('/signin', PersonController.signIn)
router.post('/signin_google', PersonController.signInGoogle)
router.get('/user/:id', PersonController.searchUserById)
router.get('/', PersonController.teste)
router.get('/forgoutpassword/:email', PersonController.forgoutPassword)
router.get('/verifycode/:code', PersonController.verifyCode)
router.get('/users', PersonController.searchUsers)
router.get('/users/:email', PersonController.searchUserByEmail)
router.put('/users/update/:id', PersonController.updateUserById)
router.delete('/users/delete/:id', PersonController.deleteUserById)

//EXPORTA TODAS AS ROTAS
module.exports = router