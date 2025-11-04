const express = require('express');
const router = express.Router(); 
const ProdutoController = require('../controller/produtoController'); 

// Lista todos os produtos
// Rota == GET /produtos
router.get('/', ProdutoController.listar);

// Exibe formulário de novo produto
// Rota == GET /produtos/novo
router.get('/novo', ProdutoController.exibirFormulario); 

// Insere novo produto
// Rota == POST /produtos
router.post('/', ProdutoController.inserir); 

// Busca e exibe detalhes de um produto específico
// Rota == GET /produtos/:nome
router.get('/:nome', ProdutoController.buscarDetalhes);     

// Exibir formulário de edição pré-preenchido
// Rota == GET /produtos/:nome/editar
router.get('/:nome/editar', ProdutoController.exibirEdicao);

// Processar a atualização dos dados do produto
// Rota == POST /produtos/:nome
router.post('/:nome', ProdutoController.atualizar);         

// Deletar um produto específico
// Rota == POST /produtos/:nome/deletar
router.post('/:nome/deletar', ProdutoController.deletar);   

module.exports = router;