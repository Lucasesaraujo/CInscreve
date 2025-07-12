const express = require('express');
const cors = require('cors');
const editalRoutes = require('./routes/editalRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = 3000;
connectDB();

app.use(cors());
app.use(express.json());
app.use('/editais', editalRoutes);  
app.use('/user', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});