//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const mongoose = require("mongoose")

//DECLARA UMA VARIÁVEL COMO UM SCHEMA A SER DEFINIDO
const Schema = mongoose.Schema

//DECLARA O SCHEMA DA IMAGEM
const PictureSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    src: {
        type: String,
        required: true
    },
})

//EXPORTA O SCHEMA DEFINIDO
module.exports = mongoose.model("Picture", PictureSchema)