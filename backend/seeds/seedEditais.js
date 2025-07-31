require('dotenv').config();

const mongoose = require('mongoose');
const Edital = require('../models/edital');

const seedEditais = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) throw new Error('MONGO_URI não definida no .env');

    await mongoose.connect(MONGO_URI);
    console.log('Conectado ao MongoDB');

    await Edital.deleteMany({});
    console.log('Coleção de editais limpa');

    const categorias = ['Audiovisual', 'Ciência', 'Cultura', 'Educação', 'Emprego',
    'Esporte', 'Inovação', 'Meio Ambiente', 'Saúde', 'Tecnologia'];

    const baseUrl = 'https://exemplo.com/edital';
    const imagemPath = '/frontend/public/img.jpg';

    const editais = Array.from({ length: 40 }, (_, i) => ({
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
      anexos: i % 3 === 0 ? [`edital${i + 1}.pdf`] : [],
      imagem: imagemPath
    }));

    await Edital.insertMany(editais);
    console.log('20 editais inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao rodar o seed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  }
};

seedEditais();
