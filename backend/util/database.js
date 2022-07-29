const Sequelize= require('sequelize');

const sequelize= new Sequelize('expense-tracker', 'root', 'Buka&#5225', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;