const express = require('express');
const router = express.Router(); 
const ProdutoController = require('../controller/produtoController'); 
const { isLoggedIn, isAdmin } = require('../middlewares/auth'); 

// ===============================================
// 💼 ROTAS DE ADMIN (CRUD - Escrita e Exclusão)
// Devem vir antes da rota genérica de detalhes (/produtos/:nome)
// ===============================================

// 1. Exibe formulário de novo produto
// Rota == GET /produtos/novo
router.get('/novo', isLoggedIn, isAdmin, ProdutoController.exibirFormulario); 

// 2. Insere novo produto
// Rota == POST /produtos
router.post('/', isLoggedIn, isAdmin, ProdutoController.inserir); 

// 3. Exibir formulário de edição pré-preenchido
// Rota == GET /produtos/:nome/editar
router.get('/:nome/editar', isLoggedIn, isAdmin, ProdutoController.exibirEdicao);

// 4. Processar a atualização dos dados do produto
// Rota == POST /produtos/:nome
router.post('/:nome', isLoggedIn, isAdmin, ProdutoController.atualizar); 	 	 

// 5. Deletar um produto específico
// Rota == POST /produtos/:nome/deletar
router.post('/:nome/deletar', isLoggedIn, isAdmin, ProdutoController.deletar); 	

// ===============================================
// 🛒 ROTAS DE CLIENTE (Leitura)
// Protegidas por isLoggedIn para garantir que apenas usuários logados acessem
// ===============================================

// 6. Lista todos os produtos
// Rota == GET /produtos
router.get('/', isLoggedIn, ProdutoController.listar);

// 7. Busca e exibe detalhes de um produto específico
// Rota == GET /produtos/:nome
router.get('/:nome', isLoggedIn, ProdutoController.buscarDetalhes); 	

module.exports = router;