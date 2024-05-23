const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Pergunta = require('./database/pergunta')
const Resposta = require('./database/resposta')

connection
  .authenticate()
  .then(() => {
    console.log('Conexão feita com o banco de dados!')
  })
  .catch((err) => {
    console.log(err)
  })

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  Pergunta.findAll({
    raw: true, order: [
      ['id', 'DESC']
    ]
  }).then((perguntas) => {
    res.render("index", {
      msg: null,
      perguntas: perguntas
    })
  })
})

app.get('/sucesso/:msg', (req, res) => {
  const msg = req.params.msg
  Pergunta.findAll({
    raw: true, order: [
      ['id', 'desc']
    ]
  }).then(perguntas => {
    res.render("index", {
      msg: msg.split('-').join(' '),
      perguntas: perguntas
    })
  })
})

app.get('/perguntar', (req, res) => {
  res.render("perguntar")
})

app.get('/pergunta/:id', (req, res) => {
  const id = req.params.id
  Pergunta.findOne({
    where: { id: id }
  }).then(pergunta => {
    Resposta.findAll({
      raw: true,
      order: [
        ['id', 'desc']
      ],
      where: { perguntaId: id }
    }).then(respostas => {
      if (pergunta != undefined) {
        res.render("pergunta", {
          pergunta: pergunta,
          resposta: respostas
        })
      } else {
        res.redirect('/')
      }
    })
  })
})

app.post(`/salvarpergunta`, (req, res) => {
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;
  Pergunta.create({
    titulo: titulo,
    descricao: descricao
  }).then(() => {
    res.redirect('/sucesso/Pergunta-enviada')
  })
})

app.post(`/responder`, (req, res) => {
  const corpo = req.body.corpo;
  const pergunta = req.body.pergunta;

  console.log(corpo, pergunta)
  Resposta.create({
    corpo: corpo,
    perguntaId: pergunta
  }).then(() => {
    res.redirect('/pergunta/' + pergunta)
  })
})

app.listen(8080, (err) => {
  if (err) {
    console.log('Ocorreu um erro: ', err)
  } else {
    console.log('Servidor iniciado com sucesso')
  }
})