# 🛒 Sistema de Gestão de Pedidos (E-commerce Simples)

Um projeto de **back-end em Node.js/Express** para gestão de **clientes**, **produtos** e **pedidos**.  
Simula o fluxo básico de um e-commerce, permitindo que clientes façam pedidos e que administradores gerenciem produtos e visualizem todas as transações.

---

## ✨ Funcionalidades Principais

### 👤 Clientes
- Cadastro  
- Login  
- Visualização de seus próprios pedidos  

### 📦 Produtos (Admin)
- CRUD completo: **Criar, Ler, Atualizar, Excluir**  
- Acesso restrito ao administrador

### 🛍️ Pedidos
- Clientes podem criar pedidos selecionando produtos e quantidades.

### 🔐 Controle de Acesso
- Separação de rotas e permissões para **Clientes** e **Administradores**.

---

## 🚀 Como Testar o Projeto (Passos)

### 1. Pré-requisitos
Certifique-se de ter o ambiente configurado:

- **Node.js v18+** e **npm**
- **MongoDB** (local ou Atlas)
- Dependências instaladas:
  ```bash
  npm install
  nodemon
  express
  winston
  hbs
  bcrypt
## 🧪 Fluxo de Teste para o Cliente

Este fluxo simula toda a experiência de um cliente, desde o cadastro até a visualização de seus pedidos.

---

### 📌 Etapas do Fluxo

#### **1. Cadastro**
- **Rota:** `/clientes/cadastrar`  
- **Ação:** Preencha os dados e crie uma nova conta de cliente.  
- **Resultado Esperado:** Conta criada com sucesso.

---

#### **2. Login**
- **Rota:** `/clientes/login`  
- **Ação:** Informe e-mail e senha cadastrados.  
- **Resultado Esperado:** Login realizado e redirecionamento para o painel do cliente.

---

#### **3. Acessar Tela de Novo Pedido**
- **Rota:** `/pedidos/novo`  
- **Ação:** Entrar na página onde o cliente visualiza os produtos disponíveis.  
- **Resultado Esperado:** Lista de produtos carregada corretamente.

---

#### **4. Fazer Pedido**
- **Rota (POST):** `/pedidos`  
- **Ação:** Selecionar produtos com **quantidade > 0** e clicar em **Finalizar Pedido**.  
- **Resultado Esperado:** Pedido registrado com sucesso.

---

#### **5. Ver Meus Pedidos**
- **Rota:** `/pedidos`  
- **Ação:** Visualizar a lista de todos os pedidos feitos pelo cliente.  
- **Resultado Esperado:** O pedido recém-criado deve aparecer listado.

---
