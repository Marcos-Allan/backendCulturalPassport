//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')


//INICIA AS VARIÁVEIS DE AMBIENTE PARA SEGURANÇA DA APLICAÇÃO
require('dotenv').config()

//INICIA A VARIAVEL PORTA COM O VALOR DA VARIAVEL DE AMBIENTE OU NA 8080
const port = process.env.PORT || 3000

//INICIA A APLICAÇÃO USANDO A BIBLIOTECA EXPRESS
const app = express()

//DISPONIBILIZA O USO DA API EM OUTROS DOMINIOS
app.use(cors())

//DA PERMISSÃO PARA LER JSON EM REQUISIÇÕES
app.use(express.json())

//MODELO DO OBJETO DO BANCO DE DADOS
const Person = mongoose.model('Person', {
    name: String,
    email: String,
    img: String,
});

//MÉTODO DE SIGN-IN
app.post('/signup', async (req, res) => {

    //PEGA OS DADOS PELA REQUISIÇÃO
    const name = req.body.name
    const email = req.body.email
    const img = req.body.img

    //CRIA UM NOVO USUÁRIO
    const person = new Person({
        name: name,
        email: email,
        img: img
    });

    //SALVA O USUÁRIO NO BANCO DE DADOS
    await person.save()

    //RETORNA O USUÁRIO PARA FEEDBACK
    res.send(person)
})

app.post('/signin', async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const emailPesq = req.body.email

    //PROCURA POR UM USUARIO COM O CAMPO ESPECIFICADO
    const person = await Person.findOne({ email: emailPesq })

    //VERIFICA SE A CONTA ESTÁ CADASTRADA
    if(person){
        //RETORNA DADOS DA CONTA COMO FEEDBACK
        res.send(person)
    }else{
        //RETORNA FEEDBACK NEGATIVO PARA O USUÁRIO
        res.send('Usuario não encontrado, esse atribulado não está cadastrado')
    }
})

//REQUISIÇÃO DE TESTE
app.get('/', (req, res) => {
    res.send('/')
})

//LISTA TODOS OS USUÁRIOS CADASTRADOS NO BANCO DE DADOS
app.get('/users', async (req, res) => {
    //PEGA OS DADOS DE TODOS OS USUARIOS E LISTA UM POR UM
    const person = await Person.find()
    
    //RETORNA OS USUÁRIOS PARA O USUÁRIO
    res.send(person)
})

//RODA O SERVIDOR NA PORTA ESPECIFICADA
app.listen(port, () => {

    //FAZ A CONEXÃO COM O MONGO DB
    mongoose.connect(process.env.MONGODB_CONECTION);

    //RETORNA FEEDBACK PARA O USÁRIO
    console.log('servidor rodando')
})