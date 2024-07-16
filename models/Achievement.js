//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const mongoose = require("mongoose")

//DECLARA UMA VARIÁVEL COMO UM SCHEMA A SER DEFINIDO
const Schema = mongoose.Schema

//DECLARA O SCHEMA DA IMAGEM
const AchievementSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    imgURL: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    porcentage: {
        type: Number,
        required: true
    }
})

//EXPORTA O SCHEMA DEFINIDO
module.exports = mongoose.model("Achievement", AchievementSchema)