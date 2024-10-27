//IMPORTAÇÃO DO MODELO DO BANCO DE DADOS
const Feedback = require("../models/Feedback")

//ROTA PARA SALVAR ARQUIVO NO  SERVIDOR
exports.getOne = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const title = req.params.title;

    try {
        //BUSCA PELOS FEEDBACKS NO BANCO DE DADOS
        const feedbacks = await Feedback.findOne({ title: title })

        //RETORNA O FEEDBACK ESPECIFICADO dO BD
        res.send(feedbacks)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao procurar por feedback." })
    }
}

//ROTA PARA CRIAR CONQUISTA
exports.create = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const { userID, message, raiting, data, name, userImg } = req.body

    try {
        //CRIA UM NOVO FEEDBACK
        const feedback = new Feedback({
            userID:  userID,
            message:  message,
            raiting: raiting,
            data: data,
            name:  name,
            userImg: userImg
        })

        //SALVA O FEEDBACK NO BANCO DE DADOS
        await feedback.save();

        //RETORNA O FEEDBACK CRIADO NO BD
        res.send(feedback)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao criar feedback." })
    }
}

//ROTA PARA LISTAR TODOS OS FEEDBACKS
exports.listAll = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()

        //RETORNA O FEEDBACK ESPECIFICADO DO BD
        res.send(feedbacks)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao listar os feedbacks." })
    }
}
