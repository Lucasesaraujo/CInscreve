// index.js
const app = require('./app');
const connectDB = require('./config/database');
const logger = require('./config/logger');

const PORT = process.env.PORT || 3002; 

connectDB();

app.listen(PORT, '0.0.0.0',() => {
    logger.info(`Servidor rodando em http://localhost:${PORT}`);
});