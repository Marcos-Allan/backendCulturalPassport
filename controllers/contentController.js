//IMPORTAÇÃO DO MODELO DO BANCO DE DADOS
const Content = require("../models/Content")

const fs = require('fs')
const path = require('path')

//ROTA PARA CRIAR UM CONTEUDO
exports.create = async (req, res) => {
    try {
        //PEGA O NOME DO ARQUIVO E O ARQUIVO POR MEIO DO ARQUIVO ENVIADO
        const { filename, originalname } = req.file;

        //LÊ O ARQUIVO E SALVA ELE NO SERVIDOR
        const content = fs.readFileSync(path.join(__dirname, '../uploads', filename), 'utf8');
    
        //CRIA UMA NOVO CONTEUDO
        const newContent = new Content({
            name: originalname,
            archive: content
        });
    
        //SALVA O CONTEUDO NO BANCO DE DADOS
        await newContent.save();
    
        //REMOVE O CONTEUDO QUE FOI SALVO DO SERVIDOR
        fs.unlinkSync(path.join(__dirname, '../uploads', filename));
    
        //RETORNA MENSAGEM DE SUCESSO AO CRIAR O CONTEUDO
        res.status(201).send('Arquivo salvo com sucesso');
    } catch (error) {
        //RETORNA MENSAGEM DE ERRO AO TENTAR CRIAR O CONTEUDO
        console.error('Erro ao salvar o arquivo:', error);
        
        //RETORNA MENSAGEM DE ERRO AO TENTAR CRIAR O CONTEUDO
        res.status(500).send('Erro ao salvar o arquivo');
    }
}

//ROTA PARA LISTAR UM CONTEUDO ESPECIFICO
exports.getOne = async (req, res) => {
    try {
        //PROCURA O CONTEUDO PELO NOME PASSSADO POR PARÂMETRO
        const contents = await Content.findOne({ name: req.params.filename });
        
        //VERIFICA SE O CONTEUDO EXISTE OU NÃO
        if (contents) {
            //RETORNA O CONTEUDO ESPECIFICADO
            res.json({ content: contents.archive });
        }
        
        //RETORNA MENSAGEM DE ERRO 404 USUÁRIO NÃO ENCONTRADO
        return res.status(404).send('Arquivo não encontrado');
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        console.error('Erro ao buscar o arquivo:', error);
        
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).send('Erro ao buscar o arquivo');
    }
}

//ROTA PARA LISTAR TODOS OS CONTEUDOS
exports.listAll = async (req, res) => {
    try {
        //PEGA TODOS OS CONTEUDOS DO BD
        const content = await Content.find()

        //RETORNA TODOS OS CONTEUDOS DO BD
        res.send(content)
    } catch (error) {
        //RETORNA UMA MENSAGEM DE ERRO
        res.status(500).json({ message: "Erro ao listar conteudos." })
    }
}