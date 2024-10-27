//IMPORTAÇÃO DO MODELO DO BANCO DE DADOS
const Achievement = require("../models/Achievement")

//ROTA PARA SALVAR ARQUIVO NO  SERVIDOR
exports.getOne = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const title = req.params.title;

    try {
        //BUSCA PELA CONQUISTA NO BANCO DE DADOS
        const achievements = await Achievement.findOne({ title: title })

        //RETORNA O SIMULADO ESPECIFICADO dO BD
        res.send(achievements)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao procurar por  conquista." })
    }
}

//ROTA PARA CRIAR CONQUISTA
exports.create = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const { title, message, imgURL, level, porcentage } = req.body

    try {
        //CRIA UMA NOVA CONQUISTA
        const achievement = new Achievement({
            title:  title,
            message:  message,
            imgURL:  imgURL,
            level:  level,
            porcentage:  porcentage,
        })

        //SALVA A CONQUISTA NO BANCO DE DADOS
        await achievement.save();

        //RETORNA O SIMULADOCRIADO NO BD
        res.send(achievement)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao criar conquistas." })
    }
}

//ROTA PARA LISTAR TODOS OS SIMULADOS
exports.listAll = async (req, res) => {
    try {
        //BUSCA PELAS CONQUISTAS NO BANCO DE DADOS
        const achievements = await Achievement.find()

        //RETORNA O SIMULADO ESPECIFICADO DO BD
        res.send(achievements)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao listar conquistas." })
    }
}
