//IMPORTAÇÃO DO MODELO DO BANCO DE DADOS
const Person = require("../models/Person")

//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const nodemailer = require('nodemailer')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

//INICIA AS VARIÁVEIS DE AMBIENTE PARA SEGURANÇA DA APLICAÇÃO
require('dotenv').config()

//INICIA A VARIAVEL code COMO VAZIA
let code

//CONFIGURAÇÃO DO NODEMAILER E DO SERVIDOR DO GMAIL PARA ENVIAR OS EMAILS
const smtp = nodemailer.createTransport({
    host: process.env.HOST_GMAIL,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.CODE_EMAIL,
    }
})

//FUNÇÃO RESPONSÁVEL POR CRIAR NÚMEROS ALEATÓRIOS
function randomNumber(){
    return Math.floor(Math.random() * 10)
}

//FUNÇÃO RESPONSÁVEL POR ENVIAR EMAIL
function sendEmail(emailReceiver, code) {

    //FUNÇÃO QUE ENVIA O EMAIL COM A CONFIGURAÇÃO ABAIXO
    smtp.sendMail({ 
        from: "Allan Menezes <allanmenezes880@gmail.com>",
        to: emailReceiver,
        subject: "recuperação de senha da sua conta do Cultural Passport",
        html: `<h1>Código de confirmação ${code}</h1>`,
        text: `Código de confirmação ${code}`
    })
    .then(() => {
        //CASO O EMAIL FOR ENVIADO ELE MOSTRA EESSA MENSAGEM
        console.log("Email enviado com sucesso!")
        return
    }).catch((error) => {
        //CASO O EMAIL NÃO FOR ENVIADO MOSTRA ESSA MENSAGEM
        console.log("Algo deu errado no envio do email: ", error)
        return
    })
}

//FUNÇÃO PARA FAZER HASH DA SENHA
async function hashPassword(password) {
    try {
        //RETORNA A SENHA HASHEADA
        return await argon2.hash(password);
    } catch (err) {
        //RETORNA O ERRO DO PROCESSO DE HASHEAR SENHA
        throw new Error('Erro ao hashear a senha');
    }
}
  
//FUNÇÃO PARA VERIFICAR A SENHA
async function verifyPassword(hash, password) {
    try {
        //VERIFICA SE A SENHA HASHEADA É IGUAL A SENHA DIGITADA
        return await argon2.verify(hash, password);
    } catch (err) {
        //RETORNA ERRO DE SENHA NÃO CONFERE
        throw new Error('Erro ao verificar a senha');
    }
}

//MIDDLEWARE DE VERIFICAÇÃO DE TOKEN
function ckeckToken(req, res, next) {

    //PEGA NOS HEADERS DA REQUISIÇÃO A AUTORIZAÇÃO PASSADA
    const authHeader = req.headers['authorization']
    
    //EXTRAI O TOKEN DE TODO TEXTO DA AUTORIZAÇÃO
    const token = authHeader && authHeader.split(" ")[1]

    //CASO NÃO TENHA UM TOKEN
    if(!token){
        //RETORNA UUM FEEDBACK PARA O USUÁRIO
        res.send('Acesso negado man')
    }
    
    try {
        //PEGA NOVAMENTE O SECRET DA APLICAÇÃO
        const secret = process.env.SECRET

        //VERIFICA SE O TOKEN E O SECRET DA APLICAÇÃO ESTÃO CORRETOS
        jwt.verify(token, secret)

        //LIBERA O ACESSO PARA CONTINUIDADE DO PROCESSO DE APLICAÇÃO
        next()
    } catch (error) {
        //RETORNA MENSAGEM DE TOKEN INVÁLIDO
        res.send('token invalido')
    }

}

//ROTAS

//ROTA PARA FAZER SIGN-UP
exports.signUp = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const email = req.body.email
    const name = req.body.name
    const password = req.body.password
    
    //SE NÃO TIVER IMAGEM ESPECIFICADA PEGA UMA ALEATÓRIA DOS AVATARES
    const img = req.body.img || 'https://w7.pngwing.com/pngs/213/343/png-transparent-computer-icons-user-background-icon-cdr-monochrome-name.png'

    //MANDA MSG DE EMAIL NÃO INFORMADO
    if(!email){ 
        res.send('Por favor infomre o email')
        return
    }
    
    //MANDA MSG DE NOME NÃO INFORMADO
    if(!name){
        res.send('Por favor informe o seu nome')
        return
    }
    
    //MANDA MSG DE PASSWORD NÃO INFORMADO
    if(!password){
        res.send('Por favor informe uma senha')
        return
    }


    //PROCURA POR UM USUARIO COM O CAMPO ESPECIFICADO
    const person = await Person.findOne({ email: email })

    //VERIFICA SE A CONTA JÁ ESTÁ CADASTRADA NO BANCO DE DADOS
    if(person){
        //RETORNA ERRO DE CONTA JA CRIADA
        res.send('Usuário já cadastrado com este email')
        
        return
    }else{
        //USA A FUNÇÃO DE HASHEAR SENHA
        const passwordHash = await hashPassword(password)

        //CRIA UM NOVO USUÁRIO
        const person = new Person({
            name: name,
            email: email,
            password: passwordHash,
            img: img
        });

        //SALVA O USUÁRIO NO BANCO DE DADOS
        await person.save()

        //RETORNA O USUÁRIO PARA FEEDBACK
        res.send(person)
        
        return
    }
}
//ROTA PARA FAZER SIGN-IN
exports.signIn = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const emailPesq = req.body.email
    const password = req.body.password

    //RETORNA MENSAGEM DE EMAIL NÃO INFORMADO
    if(!emailPesq){
        res.send('Por favor insira um email')
        return
    }
    
    //RETORNA MENSAGEM DE SENHA NÃO INFORMADA
    if(!password){
        res.send('Por favor insira sua senha')
        return
    }

    //PROCURA POR UM USUARIO COM O CAMPO ESPECIFICADO
    const person = await Person.findOne({ email: emailPesq })

    //VERIFICA SE A CONTA ESTÁ CADASTRADA
    if(person){
        if(person.password){
            //VERIFICA SE A SENHA É IGUAL A CADASTRADA QUE ESTÁ HASHEADA NO BANCO DE DADOS
            const checkPassword = await verifyPassword(person.password, password)

            //CASO A SENHA FOR CORRETA
            if(checkPassword){
                
                //PEGA O SECRET DA APLICAÇÃO
                const secret = process.env.SECRET

                //CRIA O TOKEN DE ACESSO DO USUÁRIO
                // const token = jwt.sign({ id: person._id }, secret)

                // res.send({msg: 'token', token: token})

                //RETORNA DADOS DA CONTA COMO FEEDBACK
                res.send(person)

            }else{
                //RETORNA MENSAGEM DE SENHA INCORRETA
                res.send('Senha incorreta')
            }
        }else{
            //VÊ SE O MÉTODO DE AUTENTICAÇÃO FOI COM O 'GOOGLE'
            res.send('Usuário cadastrado com a conta do google')
            return
        }
    }else{
        //RETORNA FEEDBACK NEGATIVO PARA O USUÁRIO
        res.send('Usuario não encontrado no sistema')
    }
}

//ROTA PARA FAZER SIGN-IN CASO JA TENAHA CONTA OU SIGN-UP CASO NÃO TENHA CONTA UTILIZANDO O GOOGLE
exports.signInGoogle = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const emailPesq = req.body.email
    const name = req.body.name

    //SE NÃO TIVER IMAGEM ESPECIFICADA PEGA UMA ALEATÓRIA DOS AVATARES
    const img = req.body.img || sortAvatar(avatares)

    //RETORNA MENSAGEM DE EMAIL NÃO INFORMADO
    if(!emailPesq){
        res.send('Por favor insira um email')
        return
    }
    
    //RETORNA MENSAGEM DE NOME NÃO INFORMADO
    if(!name){
        res.send('Por favor insira um nome')
        return
    }

    //PROCURA POR UM USUARIO COM O CAMPO ESPECIFICADO
    const person = await Person.findOne({ email: emailPesq })

    //VERIFICA SE A CONTA ESTÁ CADASTRADA
    if(person){
        
        //RETORNA DADOS DA CONTA COMO FEEDBACK
        res.send(person)
        
    }else{
        //CRIA UM NOVO USUÁRIO
        const person = new Person({
            name: name,
            email: emailPesq,
            img: img
        });

        //SALVA O USUÁRIO NO BANCO DE DADOS
        await person.save()

        //RETORNA DADOS DA CONTA COMO FEEDBACK
        res.send(person)
    }
}

//EXEMPLO DE ROTA PRIVADA PARA 
exports.searchUserById = async (req, res) => {
    //PEGA O ID PASSADO PELOS PARÂMETROS DA REQUISIÇÃO
    const id = req.params.id

    //VÊ SE O USUÁRIO EXISTE OU NÃO
    const person = await Person.findById(id, '-password')

    if(person){
        //RETORNA OS DADOS PARA O USUÁRIO
        res.send(person)
    }else{
        //RETORNA MENSAGEM DE ERRO DO USUÁRO NÃO ENCONTRADO
        res.send("Usuário não encontrado")
    }
}

//REQUISIÇÃO DE TESTE
exports.teste = async (req, res) => {
    res.send('/teste')
}

//REQUISIÇÃO DE TESTE DE ENVIO DE EMAILS
exports.forgoutPassword = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const email = req.params.email

    //PROCURA POR UM USUARIO COM O CAMPO ESPECIFICADO
    const person = await Person.findOne({ email: email })

    //VERIFICA SE A CONTA JÁ ESTÁ CADASTRADA NO BANCO DE DADOS
    if(person){
        //GERA UM CÓDIGO DE VERIFICAÇÃO
        code = `${randomNumber()}${randomNumber()}${randomNumber()}-${randomNumber()}${randomNumber()}${randomNumber()}`
        
        //CAMA A FUNÇÃO QUE MANDA EMAIL
        sendEmail(email, code)

        //RETORNA MENSAGEM PARA O USUÁRIO
        res.send({ message: 'Código enviado para o email informado', user: person })
        
        return
    }else{
        //RETORNA ERRO DE CONTA NÃO ENCONTRADA
        res.send('Usuário não encontrado')
        
        return
    }
}

//REQUISIÇÃO DE TESTE DE ENVIO DE EMAILS
exports.verifyCode = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const codeUser = req.params.code
    
    //VERIFICA SE O CÓDIGO ESTÁ CORRETO
    if(code == codeUser){
        //RETORNA MENSAGEM DE SUCESSO PARA O USUÁRIO
        res.send('Código de verificação correto')
        return
    }else{
        //RETORNA MENSAGEM DE ERRO PARA O USUÁRIO
        res.send('Código de verificação errado')
        return
    }
}

//LISTA TODOS OS USUÁRIOS CADASTRADOS NO BANCO DE DADOS
exports.searchUsers = async (req, res) => {
    //PEGA OS DADOS DE TODOS OS USUARIOS E LISTA UM POR UM
    const person = await Person.find()
    
    //RETORNA OS USUÁRIOS PARA O USUÁRIO
    res.send(person)
}

//PROCURA POR USUÁRIO ESPECIFICO
exports.searchUserByEmail = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const email = req.params.email

    //PROCURA POR UM USUARIO COM O CAMPO ESPECIFICADO
    const person = await Person.findOne({ email: email })

    //VERIFICA SE A CONTA JÁ ESTÁ CADASTRADA NO BANCO DE DADOS
    if(person){
        //RETORNA O USUÁRIO ESPECIFICADO
        res.send(person)
        
        return
    }else{
        //RETORNA ERRO DE CONTA NÃO FOR ENCONTRADA
        res.send('Usuário não encontrado')
        
        return
    }
}

//ROTA PARA ATUALIZAR USUÁRIO
exports.updateUserById = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const id = req.params.id
    const { name, email, img, password } = req.body

    //USA A FUNÇÃO DE HASHEAR SENHA
    const passwordHash = password ? await hashPassword(password) : password

    //PROCURA POR UM USUARIO COM O CAMPO ESPECIFICADO E ATUALIZA
    const person = await Person.findByIdAndUpdate(id, { name, email, img, password : passwordHash }, { new: true })

    //RETORNA O RESULTADO DA REQUISIÇÃO
    res.send(person)
}

//ROTA PARA DELETAR USUÁRIO
exports.deleteUserById = async (req, res) => {
    //PEGA OS DADOS PELA REQUISIÇÃO
    const id = req.params.id
    
    //PROCURA POR UM USUARIO COM O CAMPO ESPECIFICADO  E DELETA
    const person = await Person.findByIdAndDelete(id)
    
    //RETORNA O RESULTADO DA REQUISIÇÃO
    res.send(person)
}