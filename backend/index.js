const express = require('express');
const cors = require('cors');
const editalRoutes = require('./routes/editalRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/editais', editalRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
