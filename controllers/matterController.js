//IMPORTAÇÃO DO MODELO DO BANCO DE DADOS
const Matter = require("../models/Matter")

//ROTA PARA LISTAR TODOS OS SIMULADOS
exports.getOne = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const matterName = req.params.matter;

    try {
        //BUSCA PELA MATÉRIA NO BANCO DE DADOS
        const matter = await Matter.findOne({ matter: matterName })

        //RETORNA O SIMULADO ESPECIFICADO dO BD
        res.send(matter)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao procurar por matéria." })
    }
}

//ROTA PARA LISTAR TODOS OS SIMULADOS
exports.listAll = async (req, res) => {
    try {
        //BUSCA PELAS MATÉRIAS NO BANCO DE DADOS
        const matters = await Matter.find()

        //RETORNA AS MATÉRIAS CADASTRADAS NO BD
        res.send(matters)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao listar matérias." })
    }
}

//ROTZ PARA CRIAR ONTEUDO
exports.create = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const { matter, contents } = req.body;

    try {
        //CRIA UM NOVO SIMULADO
        const mat = new Matter({
            matter: matter,
            contents: contents.map(cont => ({
                text: cont.text,
            }))
        });

        //RETORNA O USUÁRIO PARA FEEDBACK
        await mat.save()

        //RETORNA O SIMULADO CRIADO
        res.send(mat)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ error: 'Erro ao criar a matéria' });
    }
}

