// Db/db.js

const { Sequelize } = require('sequelize');
require('dotenv').config();  

const sequelize = new Sequelize(
  process.env.DB_NAME,  
  process.env.DB_USER,  
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,  
    dialect: 'mysql',  
    logging: false, 
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion MySQL réussie');
  } catch (err) {
    console.error('Erreur de connexion:', err);
    process.exit(1);  
  }
};

module.exports = { connectDB, sequelize };
