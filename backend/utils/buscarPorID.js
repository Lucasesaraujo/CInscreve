async function buscarDocumentoPorId(Modelo, id, nome = 'Documento') {
  const documento = await Modelo.findById(id);
  if (!documento) {
    const erro = new Error(`${nome} não encontrado`);
    erro.status = 404;
    throw erro;
  }
  return documento;
}

module.exports = { buscarDocumentoPorId };
