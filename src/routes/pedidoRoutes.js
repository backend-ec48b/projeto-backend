const express = require('express');
const router = express.Router(); 
const PedidoController = require('../controller/pedidoController'); 
const { isLoggedIn, isAdmin } = require('../middlewares/auth'); 

// ===============================================
// 🛒 ROTAS DE CLIENTE (Requerem 'isLoggedIn')
// ===============================================

// 1. Lista os pedidos do usuário logado (GET /pedidos)
router.get('/', isLoggedIn, PedidoController.listarMeusPedidos); 

// 2. Exibe formulário de novo pedido (GET /pedidos/novo)
router.get('/novo', isLoggedIn, PedidoController.exibirFormulario); 

// 3. Insere novo pedido (POST /pedidos)
router.post('/', isLoggedIn, PedidoController.inserir); 

// 4. Busca e exibe detalhes de um pedido específico pelo ID (GET /pedidos/:id)
router.get('/:id', isLoggedIn, PedidoController.buscarDetalhes);     

// ===============================================
// 💼 ROTAS DE ADMIN (Requerem 'isLoggedIn' E 'isAdmin')
// ===============================================

// 5. Lista TODOS os pedidos (GET /pedidos/listar)
// 🚨 Adicionado isLoggedIn
router.get('/listar', isLoggedIn, isAdmin, PedidoController.listar);

// 6. Exibe formulário de edição pré-preenchido (GET /pedidos/:id/editar)
// 🚨 Adicionado isLoggedIn
router.get('/:id/editar', isLoggedIn, isAdmin, PedidoController.exibirEdicao);

// 7. Atualização dos Pedidos (POST /pedidos/:id)
// 🚨 Adicionado isLoggedIn
router.post('/:id', isLoggedIn, isAdmin, PedidoController.atualizar);         

// 8. Deleta um pedido específico (POST /pedidos/:id/deletar)
// 🚨 Adicionado isLoggedIn
router.post('/:id/deletar', isLoggedIn, isAdmin, PedidoController.deletar);   

// 9. Atualizar status (POST /pedidos/:id/status)
// 🚨 Adicionado isLoggedIn
router.post('/:id/status', isLoggedIn, isAdmin, PedidoController.atualizarStatus);

module.exports = router;