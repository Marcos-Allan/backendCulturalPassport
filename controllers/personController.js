// IMPORTAÇÃO DO MODELO DO BANCO DE DADOS
const Person = require("../models/Person")

// IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
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
        console.log("Email enviado com sucesso!")
    }).catch((error) => {
        console.log("Algo deu errado no envio do email: ", error)
    })
}

// FUNÇÃO PARA FAZER HASH DA SENHA
async function hashPassword(password) {
    try {
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(password, salt)
        return hash
    } catch (err) {
        console.error("Erro ao hashear a senha:", err)
        throw new Error('Erro ao hashear a senha')
    }
}

// FUNÇÃO PARA VERIFICAR A SENHA
async function verifyPassword(password, hash) {
    try {
        const isMatch = await bcrypt.compare(password, hash)
        return isMatch
    } catch (err) {
        console.error("Erro ao verificar a senha:", err)
        throw new Error('Erro ao verificar a senha')
    }
}

// MIDDLEWARE DE VERIFICAÇÃO DE TOKEN
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        res.send('Acesso negado')
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
    const { email, name, password, img } = req.body

    if (!email || !name || !password) {
        return res.send('Por favor informe todos os campos')
    }

    const person = await Person.findOne({ email: email })
    if (person) {
        return res.send('Usuário já cadastrado com este email')
    } else {
        const passwordHash = await hashPassword(password)

        const newPerson = new Person({
            name,
            email,
            password: passwordHash,
            img: img || 'https://w7.pngwing.com/pngs/213/343/png-transparent-computer-icons-user-background-icon-cdr-monochrome-name.png',
            timeCronograma: [0, 0], // valor padrão
            soundAlert: '' // valor padrão
        })

        await newPerson.save()

        res.send({
            name: newPerson.name,
            email: newPerson.email,
            img: newPerson.img,
            timeCronograma: newPerson.timeCronograma,
            soundAlert: newPerson.soundAlert
        })
    }
}

// ROTA PARA FAZER SIGN-IN
exports.signIn = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.send('Por favor informe email e senha')
    }

    const person = await Person.findOne({ email: email })
    if (person) {
        const checkPassword = await verifyPassword(password, person.password)
        if (checkPassword) {
            res.send({
                name: person.name,
                email: person.email,
                img: person.img,
                timeCronograma: person.timeCronograma,
                soundAlert: person.soundAlert
            })
        } else {
            res.send('Senha incorreta')
        }
    } else {
        res.send('Usuario não encontrado no sistema')
    }
}

// ROTA PARA FAZER SIGN-IN CASO JA TENHA CONTA OU SIGN-UP CASO NÃO TENHA CONTA UTILIZANDO O GOOGLE
exports.signInGoogle = async (req, res) => {
    const { email, name, img } = req.body

    if (!email || !name) {
        return res.send('Por favor informe email e nome')
    }

    let person = await Person.findOne({ email: email })

    if (person) {
        res.send({
            name: person.name,
            email: person.email,
            img: person.img,
            timeCronograma: person.timeCronograma,
            soundAlert: person.soundAlert
        })
    } else {
        const newPerson = new Person({
            name,
            email,
            img: img || 'https://w7.pngwing.com/pngs/213/343/png-transparent-computer-icons-user-background-icon-cdr-monochrome-name.png',
            login_type: 'google',
            timeCronograma: [0, 0], // valor padrão
            soundAlert: '' // valor padrão
        })

        await newPerson.save()

        res.send({
            name: newPerson.name,
            email: newPerson.email,
            img: newPerson.img,
            timeCronograma: newPerson.timeCronograma,
            soundAlert: newPerson.soundAlert
        })
    }
}

// ROTA PARA ATUALIZAR USUÁRIO
exports.updateUserById = async (req, res) => {
    const id = req.params.id
    const { name, email, img, password, simulation, cronogram, timeCronograma, soundAlert } = req.body

    const person = await Person.findById(id)
    if (!person) {
        return res.send('Usuário não encontrado')
    }

    if (name) person.name = name
    if (email) person.email = email
    if (img) person.img = img
    if (password) person.password = await hashPassword(password)
    if (simulation) person.simulation = simulation
    if (cronogram) person.cronogram = cronogram
    if (timeCronograma) person.timeCronograma = timeCronograma
    if (soundAlert) person.soundAlert = soundAlert

    await person.save()

    res.send({
        name: person.name,
        email: person.email,
        img: person.img,
        timeCronograma: person.timeCronograma,
        soundAlert: person.soundAlert
    })
}
