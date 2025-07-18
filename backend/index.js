const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
require('dotenv').config();

const editalRoutes = require('./routes/editalRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 3000;
connectDB();

app.use(cors({
  origin: 'http://localhost:5173', //localhost do frontend
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/editais', editalRoutes);  
app.use('/user', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});