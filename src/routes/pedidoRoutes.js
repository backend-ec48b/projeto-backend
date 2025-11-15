const express = require('express');
const router = express.Router(); 
const PedidoController = require('../controller/pedidoController'); 
const { isLoggedIn, isAdmin } = require('../middlewares/auth'); 

router.get('/listar', isLoggedIn, isAdmin, PedidoController.listar);

router.get('/:id/editar', isLoggedIn, isAdmin, PedidoController.exibirEdicao);

router.post('/:id', isLoggedIn, isAdmin, PedidoController.atualizar);         

router.post('/:id/deletar', isLoggedIn, isAdmin, PedidoController.deletar);   

router.post('/:id/status', isLoggedIn, isAdmin, PedidoController.atualizarStatus);

router.get('/novo', isLoggedIn, PedidoController.exibirFormulario); 

router.post('/', isLoggedIn, PedidoController.inserir); 

router.get('/:id', isLoggedIn, PedidoController.buscarDetalhes);     

router.get('/', isLoggedIn, PedidoController.listarMeusPedidos); 

module.exports = router;