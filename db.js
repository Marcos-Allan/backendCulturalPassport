//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const mongoose = require("mongoose")

//INICIA AS VARIÁVEIS DE AMBIENTE PARA SEGURANÇA DA APLICAÇÃO
require('dotenv').config()

//DEFINE O MODO DAS QUERIES COMO strict
// mongoose.set("strictQuery", true)

async function main() {
    //FAZ A CONEXÃO COM O MONGO DB
    await mongoose.connect(process.env.MONGODB_URI);

    //MENSAGEM DE CONEXÃO BEM SUCEDIDA
    console.log('Conectado ao MongoDB')
}

//EXECUÇÃO DA FUNÇÃO QUE FAZ A CONEXÃO AO BD
main().catch((error) => console.log(error))

//EXPORTAÇÃO DO MÉTODO DE CONEXÃO
module.exports = main