const express = require('express');
const cors = require('cors');
const routes = require('./routes/editalRoutes');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
const PORT = 3000;
connectDB();

app.use(cors());
app.use(express.json());
app.use('/editais', routes);  
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
