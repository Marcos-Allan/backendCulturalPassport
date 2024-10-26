//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const mongoose = require("mongoose")

//DECLARA UMA VARIÁVEL COMO UM SCHEMA A SER DEFINIDO
const Schema = mongoose.Schema

//DECLARA O SCHEMA DA IMAGEM
const FeedbackSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    raiting: {
        type: Number,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    userImg: {
        type: String,
        required: true
    }
})

//EXPORTA O SCHEMA DEFINIDO
module.exports = mongoose.model("Feedback", FeedbackSchema)