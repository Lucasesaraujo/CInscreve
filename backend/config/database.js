const { default: mongoose } = require('mongoose');
const logger = require('./logger');

require('dotenv').config();

async function connectDB() {
    while (true) {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            logger.info("Conexão realizada com sucesso!");
            break; // Sai do loop quando conectar
        } catch (error) {
            logger.error('ERRO ao conectar!', error.message, error);
            logger.info('Tentando novamente em 5 segundos...');
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

module.exports = connectDB;