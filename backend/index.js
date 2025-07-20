// index.js
const app = require('./app');
const connectDB = require('./config/database');
const logger = require('./config/logger');

const PORT = process.env.PORT || 3000; 

connectDB();

app.listen(PORT, () => {
    logger.info(`Servidor rodando em http://localhost:${PORT}`);
});