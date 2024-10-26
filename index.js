/**
 * MIT License with Additional Restrictions
 * 
 * Copyright (c) 2024 Marcos Allan Santos Menezes
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * 1. The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * 2. The Software may not be used, modified, or distributed without the prior
 * written permission of the copyright holder.
 * 
 * 3. The Software is provided "as is", without warranty of any kind, express or
 * implied, including but not limited to the warranties of merchantability,
 * fitness for a particular purpose and noninfringement. In no event shall the
 * authors or copyright holders be liable for any claim, damages or other
 * liability, whether in an action of contract, tort or otherwise, arising from,
 * out of or in connection with the Software or the use or other dealings in the
 * Software.
 * 
 * By using the Software, you agree to these terms and conditions.
 */

//IMPORTA AS BIBLIOTECAS BAIXADAS E NECESSÁRIAS PARA RODAR A APLICAÇÃO
const express = require('express')
const cors = require('cors')
const http = require('http');
const axios = require('axios')

//INICIA A APLICAÇÃO USANDO A BIBLIOTECA EXPRESS
const app = express()

//CRIA UMA INSTÂNCIA DO SERVIDOR
const server = http.createServer(app);

//DISPONIBILIZA A PASTA DE ARQUIVOS COMO PÚBLICA
app.use('/uploads', express.static('uploads'))

//INICIA AS VARIÁVEIS DE AMBIENTE PARA SEGURANÇA DA APLICAÇÃO
require('dotenv').config()

//IMPORTAÇÃO DOS MEUS ARQUIVOS SEPARADOS
require("./db")

//IMPORTAÇÃO DA BIBLIOTECA DO WebSocket
const WebSocket = require('ws');

//INICAIALIZAÇÃO DO SERVIÇO WebSocket
const wss = new WebSocket.Server({ server });

//INICIA A VARIAVEL PORTA COM O VALOR DA VARIAVEL DE AMBIENTE OU NA 8080
const port = process.env.PORT || 3000

//DISPONIBILIZA O USO DA API EM OUTROS DOMINIOS
app.use(cors())

//DA PERMISSÃO PARA LER JSON EM REQUISIÇÕES
app.use(express.json())

//IMPORTAÇÃO DAS ROTAS SEPARADAS POR MODELS
const pictureRouter = require('./routes/picture')
const personRouter = require('./routes/person')
const contentRouter = require('./routes/content')
const simulationRouter = require('./routes/simulation')
const achievementRouter = require('./routes/achievement')
const exerciseRouter = require('./routes/exercise')
const matterRouter = require('./routes/matter')
const feedbackRouter = require('./routes/feedback')

//DETERMINA A ROTA PADRÃO E UTILIZA A PARTIR DA ROTA DEFINIDA
app.use('/pictures', pictureRouter)
app.use('/content', contentRouter)
app.use('/simulation', simulationRouter)
app.use('/achievement', achievementRouter)
app.use('/exercise', exerciseRouter)
app.use('/matter', matterRouter)
app.use('/feedback', feedbackRouter)
app.use('/', personRouter)

//FUNÇÃO RESPONSÁVEL POR SALVAR OS FEEDBACKS
const postData = async (id, message, name) => {
  try {
    const response = await axios.post('http://localhost:3000/feedback/upload', {
      userID: id,
      message: message,
      name: name
    });

    console.log(response.data);
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
};

//ROTA PARA EVITAR PEGAR A IMAGEM INEXISTENTE
app.get('/favicon.png', (req, res) => {
  res.status(204)
})

//ROTA PARA EVITAR PEGAR A IMAGEM INEXISTENTE
app.get('/favicon.ico', (req, res) => {
  res.status(204)
})

//LÓGICA WebSocket
wss.on('connection', (ws) => {
    console.log('conectado');

    //EVENTO DE MENSAGEM WebSocket
    ws.on('message', (message) => {
      console.log(`WebSocket mensagem recebida: ${message}`);
      wss.clients.forEach((client) => client.send(message))

      //SALVA NO BANCO DE DADOS OS FEEDBACKS DO USUÁRIO
      postData(JSON.parse(message).id, JSON.parse(message).text, JSON.parse(message).user)
    });
  
    //EVENTO DE FECHAR CONEXÃO WebSocket
    ws.on('close', () => {
      console.log('disconectado');
    });

    //ENVIAR MENSAGEM PARA O CLIENTE APÓS ALGUM EVENTO NO SERVIDOR
    ws.send('Mensagem do servidor para o cliente');
  });

//RODA O SERVIDOR NA PORTA ESPECIFICADA
server.listen(port, () => {
    //RETORNA FEEDBACK PARA O USÁRIO
    console.log(`servidor rodando na porta ${port}`)
})