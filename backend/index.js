const express = require('express');
const cors = require('cors');
const routes = require('./routes/editais');
const connectDB = require('./config/database');

const app = express();
const PORT = 3000;
connectDB();

app.use(cors());
app.use(express.json());
app.use('/editais', routes);  

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
