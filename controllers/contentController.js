//IMPORTAÇÃO DO MODELO DO BANCO DE DADOS
const Content = require("../models/Content")

//ROTA PARA SALVAR ARQUIVO NO  SERVIDOR
exports.create = async (req, res) => {
    try {
        //PEGA OS DADOS PELA REQUISIÇÃO
        const { name } = req.body
        
        //PEGA O ARQUIVO PELA REQUISIÇÃO
        const file = req.file

        //CRIA UMA NOVO CONTEUDO
        const content = new Content({
            name,
            archive: file.path,
        })

        //SALVA A IMAGEM NO BANCO DE DADOS
        await content.save()
        
        //RETORNA OS DADOS DA IMAGEM SALVA E UMA MENSAGEM DE SUCESSO
        res.json({ content, message: "Conteudo salvo com sucesso" })
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao salvar conteudo." })
    }
}

exports.listAll = async (req, res) => {
    try {
        const content = await Content.find()
        res.send(content)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao listar conteudos." })
    }
}

exports.getOne = async (req, res) => {
    try {
        //PEGA OS DADOS PELA REQUISIÇÃO
        const name = req.params.name

        //PROCURA POR UM USUARIO COM O CAMPO ESPECIFICADO
        const content = await Content.findOne({ name: name })

        if(content){
            //RETORNA O CONTEUDO ESPECIFICADO
            res.send(content)
            
            return
        }else{
            //RETORNA ERRO DE CONTEUDO NÃO ENCONTRADO
            res.send('Conteudo não encontrado')
            
            return
        }
        
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao procurar imagem." })
    }
}