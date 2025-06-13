const Edital = require('../models/edital');

const buscarEdital = async (req, res) => {
    try{

        const { id } = req.params;
        const editalBuscado = await Edital.findById(id);

        if(!editalBuscado){
            return res.status(404).json({erro: 'Edital não encontrado.'});
        };

        res.json(editalBuscado);

    } catch(error) {
        res.status(500).json({erro: "Erro ao procurar edital."});
    };
};

module.exports = { buscarEdital };