//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const mongoose = require("mongoose")

//DECLARA UMA VARIÁVEL COMO UM SCHEMA A SER DEFINIDO
const Schema = mongoose.Schema

//DECLARA O SCHEMA DO CONTEUDO
const ContentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    archive: {
        type: String,
        required: true
    },
})

//EXPORTA O SCHEMA DEFINIDO
module.exports = mongoose.model("Content", ContentSchema)