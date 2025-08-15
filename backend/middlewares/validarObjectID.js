const mongoose = require('mongoose');

function validarObjectId(param = 'id') {
  return (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
      return res.status(400).json({ erro: 'ID inválido' });
    }
    next();
  };
}

module.exports = validarObjectId;
