const { default: mongoose } = require('mongoose');
require('dotenv').config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conexão realizada com sucesso!")    

    } catch (error) {
        console.error('ERRO ao conectar!', error.message)
    }

}

module.exports = connectDB;