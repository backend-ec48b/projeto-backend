const Cliente = require("./classes/Cliente");
const Produto = require("./classes/Produto");
const Pedido = require("./classes/Pedido");


//CLIENTES
async function inserirCliente() {
  const cliente = new Cliente(
    "12345678910",
    "Fulano da Silva",
    "fulanodasilva@email.com", {
        cidade: "Nova Teste",
        rua: "Rua Teste",
        logradouro: 123
    });
  await cliente.inserirCliente();
}

async function buscarClientePorCpf(cpf) {
    const cliente = await Cliente.buscarPorCpf(cpf);

    if(!cliente){
        return;
    }

    console.log("Clientes cadastrado:", cliente);
}

async function buscarTodosClientes() {
    const clientes = await Cliente.buscarCliente();
    console.log("Clientes cadastrados no banco:", clientes);
}

async function atualizarCliente(cpf, dados) {
    await Cliente.atualizarCliente(cpf, dados);
    const atualizado = await Cliente.buscarPorCpf(cpf);

    if(!atualizado){
        return;
    }

    console.log("Dados atualizados do cliente:", atualizado);
}

async function deletarPorCpf(cpf) {
    await Cliente.deletarCliente(cpf);
    const deletado = await Cliente.buscarCliente();
    console.log("Clientes restantes no banco:", deletado);
}


//PRODUTOS
async function inserirProdutos() {
    const produto = new Produto("Computador Gamer", 5500.0);
    await produto.inserirProdutos();
}

async function buscarTodosProdutos() {
    const produtos = await Produto.buscarTodosProdutos();
    console.log("Produtos cadastrados:", produtos);
}

async function atualizarProduto(nome, dados) {
    const atualizado = await Produto.atualizarProdutos(nome, dados);
    if(!atualizado){
        return;
    }
    console.log("Dados atualizados do produto:", atualizado);
}

async function deletarProduto(nome){
    await Produto.deletarProdutos(nome);
    const deletado = await Produto.buscarTodosProdutos();
    console.log("Produtos restantes no banco:", deletado);
}


//PEDIDOS
async function inserirPedido() {
  const pedido = new Pedido(
    "NF-4436524323",
    "12345678910",
    ["Computador Gamer", "Geladeira"] 
  );
    await pedido.inserirPedido();
}

async function buscarTodosPedidos() {
    const pedidos = await Pedido.buscarPedidos();
    console.log("Pedidos cadastrados no banco:", pedidos);
}

async function atualizarPedido(notaFiscal, dados) {
    await Pedido.atualizarPedido(notaFiscal, dados);
    const atualizado = await Pedido.buscarPedidos();
    console.log("Dados atualizados do pedido:", atualizado);
}

async function deletarPedido(notaFiscal) {
    await Pedido.deletarPedido(notaFiscal);
    const deletado = await Pedido.buscarPedidos();
    console.log("Pedidos restantes no banco:", deletado);
}


//TESTE CRUD DE CLIENTES

//inserirCliente();
//buscarTodosClientes();
//buscarClientePorCpf("12345678910");
//atualizarCliente("12345678910", { email: "fulanodasilvateste@email.com" });
//deletarPorCpf("12345678910");


//TESTE CRUD DE PRODUTOS

//inserirProdutos();
//buscarTodosProdutos();
//atualizarProduto("Computador Gamer", { preco: 4000.0 });
//deletarProduto("Computador Gamer");


//TESTE CRUD DE PEDIDOS

//inserirPedido();
//buscarTodosPedidos();
//atualizarPedido("NF-4436524323", { produtos: ["Computador Gamer"] });
//deletarPedido("NF-4436524323");

