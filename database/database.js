const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas', 'root', 'joao1802', {
  host: 'localhost',
  dialect: 'mysql'
})

module.exports = connection;
