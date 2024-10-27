//IMPORTAÇÃO DO MODELO DO BANCO DE DADOS
const Exercise = require("../models/Exercise")

//ROTA PARA LISTAR EXERCICIO ESPECIÍICO
exports.getOne = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const matter = req.params.matter;

    try {
        //BUSCA PELOS EXERCICIOS NO BANCO DE DADOS
        const exercises = await Exercise.findOne({ matter: matter })

        //RETORNA O SIMULADO ESPECIFICADO dO BD
        res.send(exercises)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao procurar peo exercicio." })
    }
}

//ROTA PARA SALVAR ARQUIVO NO  SERVIDOR
exports.create = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const { matter, title, description } = req.body

    try {
        //CRIA UM NOVO EXERCICIO
        const exercise = new Exercise({
            matter:  matter,
            title:  title,
            description: description
        })

        //SALVA O EXERCICIO NO BANCO DE DADOS
        await exercise.save();

        //RETORNA O EXERCICIO CRIADO NO BD
        res.send(exercise)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao criar exercicio." })
    }
}

//ROTA PARA LISTAR TODOS OS EXERCICIOS
exports.listAll = async (req, res) => {
    try {
        //BUSCA PELOS EXERCICIOS NO BANCO DE DADOS
        const exercicios = await Exercise.find()

        //RETORNA O SIMULADO ESPECIFICADO DO BD
        res.send(exercicios)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao listar exercicios." })
    }
}