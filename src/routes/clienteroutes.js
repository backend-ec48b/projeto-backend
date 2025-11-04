const express = require('express');
const router = express.Router(); 

const ClienteController = require('../controller/clienteController'); 

// Exibe formulário de novo cliente
// GET == /clientes/novo
router.get('/novo', ClienteController.exibirFormulario); 

// Insere novo cliente (ação do formulário)
// POST == /clientes
router.post('/', ClienteController.inserir); 

// Lista todos os clientes
// GET == /clientes
router.get('/', ClienteController.listar);                 

// Busca e exibe detalhes de um cliente por CPF
// GET == /clientes/:cpf
router.get('/:cpf', ClienteController.buscarDetalhes);     

// Exibe formulário de edição pré-preenchido
// GET == /clientes/:cpf/editar
router.get('/:cpf/editar', ClienteController.exibirEdicao);

// Processa a atualização dos dados do cliente (ação do formulário)
// POST == /clientes/:cpf
router.post('/:cpf', ClienteController.atualizar);         

// Deleta um cliente específico
// POST == /clientes/:cpf/deletar
router.post('/:cpf/deletar', ClienteController.deletar);   

module.exports = router;