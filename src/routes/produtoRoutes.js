const express = require('express');
const router = express.Router();
const ProdutoController = require('../controller/produtoController');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');

router.get('/novo', isLoggedIn, isAdmin, ProdutoController.exibirFormulario);

router.post('/', isLoggedIn, isAdmin, ProdutoController.inserir);

router.get('/:nome/editar', isLoggedIn, isAdmin, ProdutoController.exibirEdicao);

router.post('/:nome', isLoggedIn, isAdmin, ProdutoController.atualizar);

router.post('/:nome/deletar', isLoggedIn, isAdmin, ProdutoController.deletar);

router.get('/', isLoggedIn, ProdutoController.listar);

router.get('/:nome', isLoggedIn, ProdutoController.buscarDetalhes);

module.exports = router;