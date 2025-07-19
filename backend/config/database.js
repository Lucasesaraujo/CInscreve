const { default: mongoose } = require('mongoose');
const logger = require('./logger');

require('dotenv').config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info("Conexão realizada com sucesso!");    

    } catch (error) {
        logger.error('ERRO ao conectar!', error.message, error);
    }

}

module.exports = connectDB;