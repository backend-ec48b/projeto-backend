const express = require('express');
const router = express.Router(); 
const ClienteController = require('../controller/clienteController'); 
// Importa as funções de segurança
const { isLoggedIn, isAdmin } = require('../middlewares/auth'); 

// ===============================================
// 🔑 ROTAS DE AUTENTICAÇÃO (Acesso Público)
// Estas rotas não requerem autenticação
// ===============================================

// 1. Exibe o formulário de cadastro simplificado (CPF e Senha)
// GET /clientes/cadastrar
router.get('/cadastrar', ClienteController.cadastroForm); 

// 2. Processa a criação do novo cliente
// POST /clientes/cadastrar
router.post('/cadastrar', ClienteController.cadastrarCliente); 

// 3. Exibe o formulário de login
// GET /clientes/login
router.get('/login', ClienteController.loginForm); 

// 4. Processa a autenticação e inicia a sessão
// POST /clientes/login
router.post('/login', ClienteController.login); 

// 5. Encerra a sessão
// GET /clientes/logout
router.get('/logout', ClienteController.logout); 


// ===============================================
// 💼 ROTAS DE GERENCIAMENTO (CRUD - Área de Administrador)
// Todas estas rotas requerem isLoggedIn E isAdmin
// ===============================================

// Exibe formulário de novo cliente (Cadastro Completo/Admin)
// GET /clientes/novo
router.get('/novo', isLoggedIn, isAdmin, ClienteController.exibirFormulario); 

// Insere novo cliente (ação do formulário completo/Admin)
// POST /clientes
router.post('/', isLoggedIn, isAdmin, ClienteController.inserir); 

// Lista todos os clientes
// GET /clientes
router.get('/', isLoggedIn, isAdmin, ClienteController.listar);                 

// Busca e exibe detalhes de um cliente por CPF
// GET /clientes/:cpf
router.get('/:cpf', isLoggedIn, isAdmin, ClienteController.buscarDetalhes);     

// Exibe formulário de edição pré-preenchido
// GET /clientes/:cpf/editar
router.get('/:cpf/editar', isLoggedIn, isAdmin, ClienteController.exibirEdicao);

// Processa a atualização dos dados do cliente (ação do formulário)
// POST /clientes/:cpf
router.post('/:cpf', isLoggedIn, isAdmin, ClienteController.atualizar);         

// Deleta um cliente específico
// POST /clientes/:cpf/deletar
router.post('/:cpf/deletar', isLoggedIn, isAdmin, ClienteController.deletar);   

module.exports = router;