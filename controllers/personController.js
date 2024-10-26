// IMPORTAÇÃO DO MODELO DO BANCO DE DADOS
const Person = require("../models/Person");

// IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); // Substituído argon2 por bcrypt
const jwt = require('jsonwebtoken');

// INICIA AS VARIÁVEIS DE AMBIENTE PARA SEGURANÇA DA APLICAÇÃO
require('dotenv').config();

// INICIA A VARIAVEL code COMO VAZIA
let code;

// CONFIGURAÇÃO DO NODEMAILER E DO SERVIDOR DO GMAIL PARA ENVIAR OS EMAILS
const smtp = nodemailer.createTransport({
    host: process.env.HOST_GMAIL,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.CODE_EMAIL,
    }
});

// FUNÇÃO RESPONSÁVEL POR CRIAR NÚMEROS ALEATÓRIOS
function randomNumber() {
    return Math.floor(Math.random() * 10);
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
        console.log("Email enviado com sucesso!");
        return;
    }).catch((error) => {
        console.log("Algo deu errado no envio do email: ", error);
        return;
    });
}

// FUNÇÃO PARA FAZER HASH DA SENHA
async function hashPassword(password) {
    try {
        // Utiliza o bcrypt para hashear a senha
        const saltRounds = 10; // número de rounds para gerar o salt
        return await bcrypt.hash(password, saltRounds);
    } catch (err) {
        throw new Error('Erro ao hashear a senha');
    }
}

// FUNÇÃO PARA VERIFICAR A SENHA
async function verifyPassword(hash, password) {
    try {
        // Verifica se a senha digitada é igual a senha hasheada
        return await bcrypt.compare(password, hash);
    } catch (err) {
        throw new Error('Erro ao verificar a senha');
    }
}

// MIDDLEWARE DE VERIFICAÇÃO DE TOKEN
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.send('Acesso negado man');
        return;
    }

    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret);
        next();
    } catch (error) {
        res.send('token invalido');
    }
}

// ROTAS

// ROTA PARA FAZER SIGN-UP
exports.signUp = async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    const img = req.body.img || 'https://w7.pngwing.com/pngs/213/343/png-transparent-computer-icons-user-background-icon-cdr-monochrome-name.png';

    if (!email) { 
        res.send('Por favor infomre o email');
        return;
    }

    if (!name) {
        res.send('Por favor informe o seu nome');
        return;
    }

    if (!password) {
        res.send('Por favor informe uma senha');
        return;
    }

    const person = await Person.findOne({ email: email });

    if (person) {
        res.send('Usuário já cadastrado com este email');
        return;
    } else {
        const passwordHash = await hashPassword(password);

        const person = new Person({
            name: name,
            email: email,
            password: passwordHash,
            img: img
        });

        await person.save();
        res.send(person);
        return;
    }
};

// ROTA PARA FAZER SIGN-IN
exports.signIn = async (req, res) => {
    const emailPesq = req.body.email;
    const password = req.body.password;

    if (!emailPesq) {
        res.send('Por favor insira um email');
        return;
    }

    if (!password) {
        res.send('Por favor insira sua senha');
        return;
    }

    const person = await Person.findOne({ email: emailPesq });

    if (person) {
        if (person.password) {
            const checkPassword = await verifyPassword(person.password, password);

            if (checkPassword) {
                const secret = process.env.SECRET;

                // Cria o token de acesso do usuário
                const token = jwt.sign({ id: person._id }, secret);
                res.send({ msg: 'token', token: token });
            } else {
                res.send('Senha incorreta');
            }
        } else {
            res.send('Usuário cadastrado com a conta do google');
            return;
        }
    } else {
        res.send('Usuario não encontrado no sistema');
    }
};

// ROTA PARA FAZER SIGN-IN CASO JA TENHA CONTA OU SIGN-UP CASO NÃO TENHA CONTA UTILIZANDO O GOOGLE
exports.signInGoogle = async (req, res) => {
    const emailPesq = req.body.email;
    const name = req.body.name;

    const img = req.body.img || sortAvatar(avatares);

    if (!emailPesq) {
        res.send('Por favor insira um email');
        return;
    }

    if (!name) {
        res.send('Por favor insira um nome');
        return;
    }

    const person = await Person.findOne({ email: emailPesq });

    if (person) {
        if (person.password) {
            res.send('Conta já cadastrada com email e senha');
            return;
        } else {
            res.send(person);
        }
    } else {
        const person = new Person({
            name: name,
            email: emailPesq,
            img: img,
            login_type: 'google'
        });

        await person.save();
        res.send(person);
    }
};

// EXEMPLO DE ROTA PRIVADA PARA
exports.searchUserById = async (req, res) => {
    const id = req.params.id;
    const person = await Person.findById(id, '-password');

    if (person) {
        res.send(person);
    } else {
        res.send("Usuário não encontrado");
    }
};

// REQUISIÇÃO DE TESTE
exports.teste = async (req, res) => {
    res.send('/teste');
};

// REQUISIÇÃO DE TESTE DE ENVIO DE EMAILS
exports.forgoutPassword = async (req, res) => {
    const email = req.params.email;
    const person = await Person.findOne({ email: email });

    if (person) {
        if (person.password) {
            code = `${randomNumber()}${randomNumber()}${randomNumber()}-${randomNumber()}${randomNumber()}${randomNumber()}`;
            sendEmail(email, code);
            res.send({ message: 'Código enviado para o email informado', user: person });
            return;
        } else {
            res.send('Conta já cadastrada com email e senha');
            return;
        }
    } else {
        res.send('Usuário não encontrado');
        return;
    }
};

// REQUISIÇÃO DE TESTE DE ENVIO DE EMAILS
exports.verifyCode = async (req, res) => {
    const codeUser = req.params.code;

    if (code == codeUser) {
        res.send('Código de verificação correto');
        return;
    } else {
        res.send('Código de verificação errado');
        return;
    }
};

// LISTA TODOS OS USUÁRIOS CADASTRADOS NO BANCO DE DADOS
exports.searchUsers = async (req, res) => {
    const person = await Person.find();
    res.send(person);
};

// PROCURA POR USUÁRIO ESPECIFICO
exports.searchUserByEmail = async (req, res) => {
    const email = req.params.email;
    const person = await Person.findOne({ email: email });

    if (person) {
        res.send(person);
        return;
    } else {
        res.send('Usuário não encontrado');
        return;
    }
};

// ROTA PARA ATUALIZAR USUÁRIO
exports.updateUserById = async (req, res) => {
    const id = req.params.id;
    const { name, email, img, password, simulation, cronogram } = req.body;

    const passwordHash = password ? await hashPassword(password) : password;

    const person = await Person.findById(id);

    if (!person) {
        return res.send('Usuário não encontrado');
    }

    if (name) person.name = name;
    if (email) person.email = email;
    if (img) person.img = img;
    if (password) person.password = passwordHash;
    if (simulation) person.simulation = simulation;
    if (cronogram) person.cronogram = cronogram;

    await person.save();
    res.send(person);
};

exports.deleteUserById = async (req, res) => {
    try {
        // Obtém o ID do usuário a ser excluído a partir dos parâmetros da requisição
        const id = req.params.id;

        // Tenta encontrar e deletar o usuário no banco de dados
        const person = await Person.findByIdAndDelete(id);

        // Verifica se o usuário foi encontrado e excluído
        if (!person) {
            return res.status(404).send('Usuário não encontrado');
        }

        // Retorna uma resposta de sucesso
        res.status(200).send({ message: 'Usuário excluído com sucesso', user: person });
    } catch (error) {
        // Captura qualquer erro e retorna uma mensagem de erro
        res.status(500).send({ message: 'Erro ao excluir o usuário', error: error.message });
    }
};