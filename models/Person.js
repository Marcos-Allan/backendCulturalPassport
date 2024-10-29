// IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const mongoose = require("mongoose");

// DECLARA UMA VARIÁVEL COMO UM SCHEMA A SER DEFINIDO
const Schema = mongoose.Schema;

// DECLARA O SCHEMA DOS SIMULADOS DO USUÁRIO
const SimulationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    concluded: {
        type: Boolean,
        required: true
    }
});
  
// DECLARA O SCHEMA DO USUÁRIO
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
    login_type: {
        type: String,
        default: 'local'
    },
    simulations: {
        type: [SimulationSchema],
        default: []
    },
    cronogram: {
        type: String,
        default: ''
    },
    simulationsConcludeds: {
        type: Number,
        required: false,
        default: 0,
    },
    timeCronograma: {
        type: [Number],
        validate: {
            validator: function (arr) {
                return arr.length === 2;
            },
            message: 'timeCronograma must contain exactly two numbers.'
        },
        default: [0, 0]
    },
    soundAlert: {
        type: String,
        required: false,
        default: ''
    }
});
  
// MIDDLEWARE PARA ATUALIZAR O CAMPO simulationsConcludeds ANTES DE SALVAR O ARQUIVO
PersonSchema.pre('save', function (next) {
    this.simulationsConcludeds = this.simulations.filter(sim => sim.concluded).length;
    next();
});

// EXPORTA O SCHEMA DEFINIDO
module.exports = mongoose.model("Person", PersonSchema);
