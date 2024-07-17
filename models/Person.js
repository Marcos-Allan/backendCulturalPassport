// //IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
// const mongoose = require("mongoose")

// //DECLARA UMA VARIÁVEL COMO UM SCHEMA A SER DEFINIDO
// const Schema = mongoose.Schema

// //DECLARA O SCHEMA DO USUÁRIO
// const PersonSchema = new Schema({
//     name: {
//         type: String,
//         required: false
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     password: {
//         type: String,
//         required: false
//     },
//     img: {
//         type: String,
//         required: false
//     },
//     simulations: [
//         {
//             name: String,
//         },
//         {
//             concluded: Boolean,
//         }
//     ],
//     simulationsConcludeds: {
//         type: Number,
//         required: true,
//     }
// })


//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const mongoose = require("mongoose")

//DECLARA UMA VARIÁVEL COMO UM SCHEMA A SER DEFINIDO
const Schema = mongoose.Schema

//DECLARA O SCHEMA DO USUÁRIO
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
    simulations: {
        type: [SimulationSchema],
        default: []
    },
    simulationsConcludeds: {
        type: Number,
        required: false,
        default: 0,
    }
});
  
//MIDDLEWARE PARA ATUALIZAR O CAMPO simulationsConcludeds ANTES DE SALVAR O ARQUIVO
PersonSchema.pre('save', function (next) {
    this.simulationsConcludeds = this.simulations.filter(sim => sim.concluded).length;
    next();
});

//EXPORTA O SCHEMA DEFINIDO
module.exports = mongoose.model("Person", PersonSchema)

// https://firebasestorage.googleapis.com/v0/b/cultural-passport-78148.appspot.com/o/images%2Favatars%2Favatar-7.jpg?alt=media&token=a355dcc2-9bf4-44f7-aef1-38a660a2b38a