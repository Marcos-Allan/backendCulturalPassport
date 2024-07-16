//IMPORTAÇÃO DO MODELO DO BANCO DE DADOS
const Simulation = require("../models/Simulation")

//ROTA PARA LISTAR TODOS OS SIMULADOS
exports.getOne = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const matter = req.params.matter;

    try {
        const simulations = await Simulation.findOne({ matter: matter })

        //RETORNA O SIMULADO ESPECIFICADO dO BD
        res.send(simulations)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao pegar simulado." })
    }
}

//ROTA PARA LISTAR TODOS OS SIMULADOS
exports.listAll = async (req, res) => {
    try {
        const simulations = await Simulation.find()

        //RETORNA OS SIMULADOS NO BD
        res.send(simulations)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao listar simulados." })
    }
}

//ROTZ PARA CRIAR ONTEUDO
exports.create = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const { matter, quests } = req.body;

    try {
        //CRIA UM NOVO SIMULADO
        const simulation = new Simulation({
            matter: matter,
            quests: quests.map(q => ({
            question: q.question,
            options: q.options.map(opt => ({
                option: opt.option,
                text: opt.text,
                correct: opt.correct || false  // Define como false se não houver valor definido
            }))
            }))
        });

        //RETORNA O USUÁRIO PARA FEEDBACK
        await simulation.save()

        //RETORNA O SIMULADO CRIADO
        res.send(simulation)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ error: 'Erro ao criar o simulado' });
    }
}

