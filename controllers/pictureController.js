//IMPORTAÇÃO DO MODELO DO BANCO DE DADOS
const Picture = require("../models/Picture")

//ROTA PARA SALVAR ARQUIVO NO  SERVIDOR
exports.create = async (req, res) => {
    try {
        //PEGA OS DADOS PELA REQUISIÇÃO
        const { name } = req.body
        
        //PEGA O ARQUIVO PELA REQUISIÇÃO
        const file = req.file

        //CRIA UMA NOVA IMAGEM
        const picture = new Picture({
            name,
            src: file.path,
        })

        //SALVA A IMAGEM NO BANCO DE DADOS
        await picture.save()
        
        //RETORNA OS DADOS DA IMAGEM SALVA E UMA MENSAGEM DE SUCESSO
        res.json({ picture, message: "Imagem salva com sucesso" })
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao salvar imagem." })
    }
}

exports.listAll = async (req, res) => {
    try {
        const pictures = await Picture.find()
        res.send(pictures)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao listar imagem." })
    }
}