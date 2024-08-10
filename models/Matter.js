//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const mongoose = require("mongoose")

//DECLARA UMA VARIÁVEL COMO UM SCHEMA A SER DEFINIDO
const Schema = mongoose.Schema

//DECLARA O SCHEMA DAS OPÇÕES DO SIMULADO
const ContentSchema = new Schema({
    text: String,
});

//DECLARA O SCHEMA DO SIMULADO
const MatterSchema = new Schema({
    matter: {
        type: String,
        required: true
    },
    contents: [ContentSchema],
});

module.exports = mongoose.model('Matter', MatterSchema);