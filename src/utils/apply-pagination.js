export function applyPagination(documents, page, rowsPerPage) {
  if (!Array.isArray(documents)) {
    // Se não for uma array, retornar um array vazio ou lançar um erro, dependendo do que faz mais sentido para o seu caso.
    // Exemplo: return [];
    throw new Error("A lista de documentos não é uma array.");
  }

  // Agora podemos usar a função slice() com segurança.
  return documents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
