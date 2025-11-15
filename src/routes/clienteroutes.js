const express = require('express');
const router = express.Router(); 
const ClienteController = require('../controller/clienteController'); 
const { isLoggedIn, isAdmin } = require('../middlewares/auth'); 

router.get('/cadastrar', ClienteController.cadastroForm); 

router.post('/cadastrar', ClienteController.cadastrarCliente); 

router.get('/login', ClienteController.loginForm); 

router.post('/login', ClienteController.login); 

router.get('/logout', ClienteController.logout); 

router.get('/novo', isLoggedIn, isAdmin, ClienteController.exibirFormulario); 

router.post('/', isLoggedIn, isAdmin, ClienteController.inserir); 

router.get('/', isLoggedIn, isAdmin, ClienteController.listar);                 

router.get('/:cpf', isLoggedIn, isAdmin, ClienteController.buscarDetalhes);     

router.get('/:cpf/editar', isLoggedIn, isAdmin, ClienteController.exibirEdicao);

router.post('/:cpf', isLoggedIn, isAdmin, ClienteController.atualizar);         

router.post('/:cpf/deletar', isLoggedIn, isAdmin, ClienteController.deletar);   

module.exports = router;