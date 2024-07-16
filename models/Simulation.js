//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const mongoose = require("mongoose")

//DECLARA UMA VARIÁVEL COMO UM SCHEMA A SER DEFINIDO
const Schema = mongoose.Schema

//DECLARA O SCHEMA DAS OPÇÕES DO SIMULADO
const OptionSchema = new Schema({
    option: String,
    text: String,
    correct: Boolean,
});

//DECLARA O SCHEMA DAS QUESTÕES DO SIMULADO
const QuestionSchema = new Schema({
    question: String,
    options: [OptionSchema],
});

//DECLARA O SCHEMA DO SIMULADO
const SimulationSchema = new Schema({
    matter: {
        type: String,
        required: true
    },
    quests: [QuestionSchema],
});

module.exports = mongoose.model('Simulation', SimulationSchema);