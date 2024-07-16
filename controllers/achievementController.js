//IMPORTAÇÃO DO MODELO DO BANCO DE DADOS
const Achievement = require("../models/Achievement")

//ROTA PARA LISTAR TODOS OS SIMULADOS
exports.getOne = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const title = req.params.title;

    try {
        const simulations = await Achievement.findOne({ title: title })

        //RETORNA O SIMULADO ESPECIFICADO dO BD
        res.send(simulations)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao procurar por  conquista." })
    }
}

//ROTA PARA SALVAR ARQUIVO NO  SERVIDOR
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

//ROTA PARA CRIAR CONQUISTA
exports.listAll = async (req, res) => {
    try {
        const achievements = await Achievement.find()

        //RETORNA O SIMULADO ESPECIFICADO DO BD
        res.send(achievements)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao listar conquistas." })
    }
}
