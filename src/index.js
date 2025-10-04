const Cliente = require("./classes/Cliente");
const Produto = require("./classes/Produto");
const Pedido = require("./classes/Pedido")
const connect = require("./db/connection");


//CLIENTES
async function inserirCliente() {
  const cliente = new Cliente(
    "03245618332",
    "Julius Diddy",
    "juliusdiddy@email.com", {
        cidade: "Leopolis",
        rua: "Rua Brasil",
        logradouro: 467
    }
  
  );

  await cliente.inserir();

  const clientes = await Cliente.buscarTodos();
  console.log("Clientes cadastrados no banco:", clientes);
}

async function buscarClientePorCpf(cpf) {
    const cliente = await Cliente.buscarPorCpf(cpf);
    console.log("Cliente encontrado:", cliente);
}

async function atualizarCliente(cpf, dados) {
    const resultado = await Cliente.atualizar(cpf, dados);
    console.log("Cliente atualizado:", resultado);
    const atualizado = await Cliente.buscarPorCpf(cpf);
    console.log("Dados atualizados do cliente:", atualizado);
}

async function buscarTodosClientes() {
    const clientes = await Cliente.buscarTodos();
    console.log("Clientes cadastrados no banco:", clientes);
}

async function deletarPorCpf(cpf) {
    const result = await Cliente.deletar(cpf);
    console.log("Cliente deletado:", result);
    const clientesRestantes = await Cliente.buscarTodos();
    console.log("Clientes restantes no banco:", clientesRestantes);
}




//PRODUTOS

async function inserirProdutos() {
    const produto = new Produto("IPad", 2999.99);
    await produto.inserirProdutos();

    const produtos = await Produto.buscarTodosProdutos();
    console.log("Produtos cadastrados no banco:", produtos);
}

async function deletarProduto(){
    const resultado = await Produto.deletar("Cfewr");
    console.log("Produto deletado:", resultado);
    const deletado = await Produto.buscarTodosProdutos();
    console.log("Produtos restantes no banco:", deletado);
}

async function atualizarProduto(nome, dados) {
    const resultado = await Produto.atualizarProdutos(nome, dados);
    console.log("Produto atualizado:", resultado);
    const atualizado = await Produto.buscarTodosProdutos();
    console.log("Dados atualizados do produto:", atualizado);
}

async function buscarTodosProdutos() {
    const produtos = await Produto.buscarTodosProdutos();
    console.log("Produtos encontrados:", produtos);
}


//INSERIR PEDIDO
async function inserirPedido() {
    const pedido = new Pedido(
        123456, 
        "03245618332", 
        [
            { nome: "iPhone" },
            { nome: "MacBook Pro" }
        ]
    );

    await pedido.inserirPedido();

    const pedidos = await Pedido.buscarPedidos();
    console.log("Pedidos cadastrados no banco:", pedidos);
}

buscarTodosProdutos();

//atualizarProduto("Geladeira", { nome: "Fogão" });

//deletarPorCpf("03245618332");

//inserirPedido();

//atualizarCliente("03245618332", { nome: "Julius D. Caesar", email: "julius.caesar@email.com" });

//buscarClientePorCpf("03245618332");

//buscarTodosClientes();

//deletarProduto();

//inserirCliente();

//inserirProdutos();