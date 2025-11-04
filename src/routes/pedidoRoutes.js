const express = require('express');
const router = express.Router(); 
const PedidoController = require('../controller/pedidoController'); 

// Exibe formulário de novo pedido
// GET ==  /pedidos/novo
router.get('/novo', PedidoController.exibirFormulario); 

// Insere novo pedido POST == /pedidos
router.post('/', PedidoController.inserir); 

// Lista todos os pedidos
// GET == /pedidos
router.get('/', PedidoController.listar);

// Busca e exibe detalhes de um pedido específico pelo ID
// GET == /pedidos/:id
router.get('/:id', PedidoController.buscarDetalhes);     

// Exibe formulário de edição pré-preenchido
// GET == /pedidos/:id/editar
router.get('/:id/editar', PedidoController.exibirEdicao);

// Atualização dos Pedidos
// POST == /pedidos/:id
router.post('/:id', PedidoController.atualizar);         

// Deleta um pedido específico
// POST == /pedidos/:id/deletar
router.post('/:id/deletar', PedidoController.deletar);   

/*// Rota Adicional: Atualizar status
// POST /pedidos/:id/status
router.post('/:id/status', PedidoController.atualizarStatus);
*/
module.exports = router;