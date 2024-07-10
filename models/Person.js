//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const mongoose = require("mongoose")

//DECLARA UMA VARIÁVEL COMO UM SCHEMA A SER DEFINIDO
const Schema = mongoose.Schema

//DECLARA O SCHEMA DO USUÁRIO
const PersonSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    img: {
        type: String,
        required: false
    },
})

//EXPORTA O SCHEMA DEFINIDO
module.exports = mongoose.model("Person", PersonSchema)