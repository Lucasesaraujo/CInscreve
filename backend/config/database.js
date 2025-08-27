const { default: mongoose } = require('mongoose');
const logger = require('./logger');

require('dotenv').config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // Configurações de timeout
            serverSelectionTimeoutMS: 30000, // 30 segundos para selecionar servidor
            socketTimeoutMS: 45000, // 45 segundos para operações
            connectTimeoutMS: 30000, // 30 segundos para conectar
            
            // Configurações de buffer e pool
            bufferMaxEntries: 0, // Desabilita buffering que causa timeout
            maxPoolSize: 10, // Máximo de conexões simultâneas
            minPoolSize: 1, // Mínimo de conexões no pool
            
            // Configurações de retry
            retryWrites: true,
            w: 'majority',
            
            // Para ambientes Docker
            family: 4, // Força IPv4
        });
        
        logger.info("Conexão realizada com sucesso!");    

    } catch (error) {
        logger.error('ERRO ao conectar!', error.message);
        // Não fazer process.exit(1) em ambiente Docker
        // process.exit(1);
    }
}

// Configurar eventos de conexão
mongoose.connection.on('connected', () => {
    logger.info('Mongoose conectado ao MongoDB');
});

mongoose.connection.on('error', (err) => {
    logger.error('Erro de conexão do Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
    logger.warn('Mongoose desconectado');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        logger.info('Conexão MongoDB fechada');
        process.exit(0);
    } catch (err) {
        logger.error('Erro ao fechar conexão:', err);
        process.exit(1);
    }
});

module.exports = connectDB;