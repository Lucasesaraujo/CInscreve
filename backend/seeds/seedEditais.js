require('dotenv').config();
const mongoose = require('mongoose');
const { criarEditalService } = require('../services/editalServices');
const Edital = require('../models/edital');
const User = require('../models/user'); // Ajuste o caminho se necessário

const seedEditais = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) throw new Error('MONGO_URI não definida no .env');

    await mongoose.connect(MONGO_URI);
    console.log('Conectado ao MongoDB');

    await Edital.deleteMany({});
    console.log('Coleção de editais limpa');

    const usuario = await User.findOne({ email: 'ong1@gmail.com' });
    if (!usuario) {
      throw new Error('Usuário com email ong1@gmail.com não encontrado no banco.');
    }

    const categorias = [
      'Audiovisual', 'Ciência', 'Cultura', 'Educação', 'Emprego',
      'Esporte', 'Inovação', 'Meio Ambiente', 'Saúde', 'Tecnologia'
    ];

    const baseUrl = 'https://exemplo.com/edital';

    for (let i = 0; i < 100; i++) {
      const dados = {
        nome: `Edital ${i + 1} - ${categorias[i % categorias.length]}`,
        categoria: categorias[i % categorias.length],
        organizacao: `Organização ${i + 1}`,
        descricao: `Descrição detalhada do edital ${i + 1}, contendo informações importantes para os participantes.`,
        periodoInscricao: {
          inicio: new Date(`2025-08-${(i % 28 + 1).toString().padStart(2, '0')}T00:00:00`),
          fim: new Date(`2025-09-${(i % 28 + 1).toString().padStart(2, '0')}T23:59:59`),
        },
        link: `${baseUrl}/${i + 1}`,
        validado: i % 2 === 0,
        anexos: i % 3 === 0 ? [`edital${i + 1}.pdf`] : []
        // imagem será preenchida automaticamente no service
      };

      await criarEditalService(dados, usuario._id);
    }

    console.log('100 editais criados com sucesso via service!');
  } catch (error) {
    console.error('Erro ao rodar o seed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  }
};

seedEditais();
