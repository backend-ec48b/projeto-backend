// routes/clientes.js

const express = require('express');
// Cria um novo objeto Router do Express para as rotas de cliente
const router = express.Router(); 

// Importa o Controller que contém a lógica de manipulação das requisições
const ClienteController = require('../controller/clienteController'); 

// ==========================================================
// ROTAS DE CLIENTES
// ==========================================================

// C - CREATE: Exibir formulário de novo cliente
// GET /clientes/novo
router.get('/novo', ClienteController.exibirFormulario); 

// C - CREATE: Inserir novo cliente (ação do formulário)
// POST /clientes
router.post('/', ClienteController.inserir); 

// R - READ: Listar todos os clientes
// GET /clientes
router.get('/', ClienteController.listar);                 

// R - READ: Buscar e exibir detalhes de um cliente específico por CPF
// GET /clientes/:cpf
router.get('/:cpf', ClienteController.buscarDetalhes);     

// U - UPDATE: Exibir formulário de edição pré-preenchido
// GET /clientes/:cpf/editar
router.get('/:cpf/editar', ClienteController.exibirEdicao);

// U - UPDATE: Processar a atualização dos dados do cliente (ação do formulário)
// POST /clientes/:cpf
router.post('/:cpf', ClienteController.atualizar);         

// D - DELETE: Deletar um cliente específico
// POST /clientes/:cpf/deletar
router.post('/:cpf/deletar', ClienteController.deletar);   

// Exporta o roteador para ser usado no arquivo principal do Express
module.exports = router;