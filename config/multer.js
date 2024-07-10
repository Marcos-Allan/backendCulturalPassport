//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const multer = require('multer')
const path = require('path')

//CONFIGURAÇÃP DO ARMAZENAMENTO DOS ARQUIVOS
const storage = multer.diskStorage({
    //SETA O DESTINO DOS ARQUIVOS SALVOS
    destination: function(req, file, cb) {
        cb(null, "uploads/")
    },
    //CONFIGURAÇÃO DO NOME DO ARQUIVO SALVO NO SERVIDOR
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

//DECLARA COMO UMA VARIAVEL PARA SER EXPORTADA
const upload = multer({storage})

//EXPORTA A VARIAVEL
module.exports = upload