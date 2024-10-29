// IMPORTAÇÃO DO MODELO DO BANCO DE DADOS
const Person = require("../models/Person")

// IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt') // Substituído argon2 por bcrypt
const jwt = require('jsonwebtoken')

// INICIA AS VARIÁVEIS DE AMBIENTE PARA SEGURANÇA DA APLICAÇÃO
require('dotenv').config()

// INICIA A VARIAVEL code COMO VAZIA
let code

// CONFIGURAÇÃO DO NODEMAILER E DO SERVIDOR DO GMAIL PARA ENVIAR OS EMAILS
const smtp = nodemailer.createTransport({
    host: process.env.HOST_GMAIL,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.CODE_EMAIL,
    }
})

// FUNÇÃO RESPONSÁVEL POR CRIAR NÚMEROS ALEATÓRIOS
function randomNumber() {
    //RETORNA NÚMERO ALEATÓRIO ENTRE 0 E 10
    return Math.floor(Math.random() * 10)
}

// FUNÇÃO RESPONSÁVEL POR ENVIAR EMAIL
function sendEmail(emailReceiver, code) {
    smtp.sendMail({
        from: "Allan Menezes <allanmenezes880@gmail.com>",
        to: emailReceiver,
        subject: "recuperação de senha da sua conta do Cultural Passport",
        html: `<h1>Código de confirmação ${code}</h1>`,
        text: `Código de confirmação ${code}`
    })
    .then(() => {
        //ESCREVE NO CONSOLE MENSAGEM DE SUCESSO
        console.log("Email enviado com sucesso!")
        return
    }).catch((error) => {
        //ESCREVE NO CONSOLE MENSAGEM DE ERRO
        console.log("Algo deu errado no envio do email: ", error)
        return
    })
}

// FUNÇÃO PARA FAZER HASH DA SENHA
async function hashPassword(password) {
    try {
        //DEFINE O NÍVEL DE DIFICULDADE DA SENHA
        const saltRounds = 10

        //GERA A DIFICULDADE DA SENHA
        const salt = await bcrypt.genSalt(saltRounds)

        //GERA A SENHA HASHEADA
        const hash = await bcrypt.hash(password, salt)

        //RETORNA A SENHA HASHEADA
        return hash
    } catch (err) {
        //ESCREVE O ERRO NO CONSOLE
        console.error("Erro ao hashear a senha:", err)

        //RETORNA O ERRO AO TENTAR HASHEAR A SENHA
        throw new Error('Erro ao hashear a senha')
    }
}

// FUNÇÃO PARA VERIFICAR A SENHA
async function verifyPassword(password, hash) {
    try {
        //FAZ A VERIFICAÇÃO DA SENHA HASEHADA SALVA NO BD E DA SENHA FORNECIDA PELO USUÁRIO
        const isMatch = await bcrypt.compare(password, hash)
        //RETORNA O RESULTADO 
        return isMatch
    } catch (err) {
        //ESCREVE O ERRO NO CONSOLE
        console.error("Erro ao verificar a senha:", err)

        //RETORNA O ERRO AO TENTAR COMPARAR A SENHA
        throw new Error('Erro ao verificar a senha')
    }
}

// MIDDLEWARE DE VERIFICAÇÃO DE TOKEN
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        res.send('Acesso negado man')
        return
    }

    try {
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()
    } catch (error) {
        res.send('token invalido')
    }
}

// ROTA PARA FAZER SIGN-UP
exports.signUp = async (req, res) => {
    //PEGA OS VALORES POR CORPO DA REQUISIÇÃO
    const email = req.body.email
    const name = req.body.name
    const password = req.body.password

    //VERIFICA SE O CAMPO FOI PASSADO SE NÃO COLOCA UMA VALOR PADRÃO
    const img = req.body.img || 'https://w7.pngwing.com/pngs/213/343/png-transparent-computer-icons-user-background-icon-cdr-monochrome-name.png'

    //VERIFICA SE O CAMPO FOI PASSADO
    if (!email) { 
        res.send('Por favor infomre o email')
        return
    }

    //VERIFICA SE O CAMPO FOI PASSADO
    if (!name) {
        res.send('Por favor informe o seu nome')
        return
    }
    
    //VERIFICA SE O CAMPO FOI PASSADO
    if (!password) {
        res.send('Por favor informe uma senha')
        return
    }

    //BUSCA PELO USUÁRIO NO BANCO DE DADOS
    const person = await Person.findOne({ email: email })
    
    //VERIFICA SE O USUÁRIO ESTÁ CADASTRADO
    if (person) {
        //RETORNA MENSAGEM DE ERRO
        res.send('Usuário já cadastrado com este email')
        return
    } else {
        //CRIA O HASH DA SENHA
        const passwordHash = await hashPassword(password)

        //CRIA UM NOVO USUÁRIO
        const person = new Person({
            name: name,
            email: email,
            password: passwordHash,
            img: img
        })

        //SALVA O USUÁRIO NO BANCO DE DADOS
        await person.save()

        //RETORNA O USUÁRIO
        res.send(person)

        return
    }
}

// ROTA PARA FAZER SIGN-IN
exports.signIn = async (req, res) => {
    //PEGA OS VALORES POR CORPO DA REQUISIÇÃO
    const emailPesq = req.body.email
    const password = req.body.password

    //VERIFICA SE O CAMPO FOI PASSADO
    if (!emailPesq) {
        //RETORNA MENSAGEM DE ERRO
        res.send('Por favor insira um email')
        return
    }

    //VERIFICA SE O CAMPO FOI PASSADO
    if (!password) {
        //RETORNA MENSAGEM DE ERRO
        res.send('Por favor insira sua senha')
        return
    }

    //BUSCA PELO USUÁRIO NO BANCO DE DADOS
    const person = await Person.findOne({ email: emailPesq })

    //VERIFICA SE O USUÁRIO ESTÁ CADASTRADO
    if (person) {
        //VERIFICA SE O USUÁRIO TEM SENHA OU NÃO
        if (person.password) {
            //VERIFICA SE A SENHA DO USUÁRIO É IGUAL A SENHA CADASTRADA NO BANCO DE DADOS
            const checkPassword = await verifyPassword(password, person.password)

            //EXECUTA SE A SENHA FOR IGUAL A DO BANCO DE DADOS
            if (checkPassword == true) {

                //RETORNA DADOS DA CONTA
                res.send(person)
                // const secret = process.env.SECRET

                // // Cria o token de acesso do usuário
                // const token = jwt.sign({ id: person._id }, secret)
                // res.send({ msg: 'token', token: token })
            } else {
                //RETORNA MENSAGEM DE ERRO
                res.send('Senha incorreta')
            }
        } else {
            //RETORNA MENSAGEM DE ERRO
            res.send('Usuário cadastrado com a conta do google')
            return
        }
    } else {
        //RETORNA MENSAGEM DE ERRO
        res.send('Usuario não encontrado no sistema')
    }
}

// ROTA PARA FAZER SIGN-IN CASO JA TENHA CONTA OU SIGN-UP CASO NÃO TENHA CONTA UTILIZANDO O GOOGLE
exports.signInGoogle = async (req, res) => {
    //PEGA OS VALORES POR CORPO DA REQUISIÇÃO
    const emailPesq = req.body.email
    const name = req.body.name

    //VERIFICA SE O CAMPO FOI PASSADO SE NÃO COLOCA UMA VALOR PADRÃO
    const img = req.body.img || sortAvatar(avatares)

    //VERIFICA SE O CAMPO FOI PASSADO
    if (!emailPesq) {
        //RETORNA MENSAGEM DE ERRO
        res.send('Por favor insira um email')
        return
    }

    //VERIFICA SE O CAMPO FOI PASSADO
    if (!name) {
        //RETORNA MENSAGEM DE ERRO
        res.send('Por favor insira um nome')
        return
    }

    //BUSCA PELO USUÁRIO NO BANCO DE DADOS
    const person = await Person.findOne({ email: emailPesq })

    //VERIFICA SE O USUÁRIO ESTÁ CADASTRADO
    if (person) {
        //VERIFICA SE O USUÁRIO TEM SENHA OU NÃO
        if (person.password) {
            //RETORNA MENSAGEM DE ERRO
            res.send('Conta já cadastrada com email e senha')
            return
        } else {
            //RETORNA DADOS DA CONTA
            res.send(person)
        }
    } else {
        //CRIA UM NOVO USUÁRIO
        const person = new Person({
            name: name,
            email: emailPesq,
            img: img,
            login_type: 'google'
        })

        //SALVA O USUÁRIO NO BANCO DE DADOS
        await person.save()

        //RETORNA DADOS DA CONTA
        res.send(person)
    }
}

// EXEMPLO DE ROTA PRIVADA PARA
exports.searchUserById = async (req, res) => {
    //PEGA OS VALORES POR CORPO DA REQUISIÇÃO
    const id = req.params.id
    const person = await Person.findById(id, '-password')

    //VERIFICA SE O USUÁRIO ESTÁ CADASTRADO
    if (person) {
        //RETORNA DADOS DA CONTA
        res.send(person)
    } else {
        //RETORNA MENSAGEM DE ERRO
        res.send("Usuário não encontrado")
    }
}

// REQUISIÇÃO DE TESTE
exports.teste = async (req, res) => {
    //RETORNA MENSAGEM
    res.send('/teste')
}

// REQUISIÇÃO DE TESTE DE ENVIO DE EMAILS
exports.forgoutPassword = async (req, res) => {
    //PEGA OS VALORES POR CORPO DA REQUISIÇÃO
    const email = req.params.email

    //BUSCA PELO USUÁRIO NO BANCO DE DADOS
    const person = await Person.findOne({ email: email })

    //VERIFICA SE O USUÁRIO ESTÁ CADASTRADO
    if (person) {
        //VERIFICA SE O USUÁRIO TEM SENHA OU NÃO
        if (person.password) {
            //GERA O CÓDIGO DE VERIFICAÇÃO
            code = `${randomNumber()}${randomNumber()}${randomNumber()}-${randomNumber()}${randomNumber()}${randomNumber()}`
            sendEmail(email, code)
            
            //ENVIA A MENSAGEM E O USUÁRIO
            res.send({ message: 'Código enviado para o email informado', user: person })
            return
        } else {
            //ENVIA MENSAGEM DE ERRO
            res.send('Conta já cadastrada com email e senha')
            return
        }
    } else {
        //ENVIA MENSAGEM DE ERRO
        res.send('Usuário não encontrado')
        return
    }
}

// REQUISIÇÃO DE TESTE DE ENVIO DE EMAILS
exports.verifyCode = async (req, res) => {
    //PEGA OS VALORES POR CORPO DA REQUISIÇÃO
    const codeUser = req.params.code

    if (code == codeUser) {
        //ENVIA MENSAGEM DE ERRO
        res.send('Código de verificação correto')
        return
    } else {
        //ENVIA MENSAGEM DE ERRO
        res.send('Código de verificação errado')
        return
    }
}

// LISTA TODOS OS USUÁRIOS CADASTRADOS NO BANCO DE DADOS
exports.searchUsers = async (req, res) => {
    //BUSCA POR TODOS OS USUÁRIOS CADASTRADOS NO BD
    const person = await Person.find()
    //RETORNA DADOS DA CONTA
    res.send(person)
}

// PROCURA POR USUÁRIO ESPECIFICO
exports.searchUserByEmail = async (req, res) => {
    //PEGA OS VALORES POR CORPO DA REQUISIÇÃO
    const email = req.params.email
    const person = await Person.findOne({ email: email })

    //VERIFICA SE O USUÁRIO ESTÁ CADASTRADO
    if (person) {
        //RETORNA DADOS DA CONTA
        res.send(person)
        return
    } else {
        //ENVIA MENSAGEM DE ERRO
        res.send('Usuário não encontrado')
        return
    }
}

// ROTA PARA ATUALIZAR USUÁRIO
exports.updateUserById = async (req, res) => {
    // PEGA OS VALORES POR CORPO DA REQUISIÇÃO
    const id = req.params.id
    const { name, email, img, password, simulation, cronogram, timeCronograma, soundAlert } = req.body

    // CRIA UM NOVO HASH DE SENHA SE A SENHA FOR PASSADA, SE NÃO DEIXA A SENHA DO USUÁRIO
    const passwordHash = password ? await hashPassword(password) : password

    // VERIFICA SE O USUÁRIO ESTÁ CADASTRADO
    const person = await Person.findById(id)

    // VERIFICA SE O USUÁRIO NÃO ESTÁ CADASTRADO
    if (!person) {
        return res.send('Usuário não encontrado')
    }

    // VERIFICA SE O CAMPO FOI PASSADO
    if (name) person.name = name
    if (email) person.email = email
    if (img) person.img = img
    if (password) person.password = passwordHash
    if (simulation) person.simulation = simulation
    if (cronogram) person.cronogram = cronogram
    if (timeCronograma) person.timeCronograma = timeCronograma
    if (soundAlert) person.soundAlert = soundAlert

    // SALVA O USUÁRIO NO BANCO DE DADOS
    await person.save()

    // RETORNA DADOS DA CONTA
    res.send(person)
}


exports.deleteUserById = async (req, res) => {
    try {
        //PEGA OS VALORES POR CORPO DA REQUISIÇÃO
        const id = req.params.id

        //BUSCA PELO USUÁRIO NO BANCO DE DADOS
        const person = await Person.findByIdAndDelete(id)

        //VERIFICA SE O USUÁRIO NÃO ESTÁ CADASTRADO
        if (!person) {
            //ENVIA MENSAGEM DE ERRO
            return res.status(404).send('Usuário não encontrado')
        }

        //ENVIA MENSAGEM DE SUCESSO
        res.status(200).send({ message: 'Usuário excluído com sucesso', user: person })
    } catch (error) {
        //ENVIA MENSAGEM DE ERRO
        res.status(500).send({ message: 'Erro ao excluir o usuário', error: error.message })
    }
}