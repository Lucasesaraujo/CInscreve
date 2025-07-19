// index.js
const app = require('./app');
const connectDB = require('./config/database');

const PORT = 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
