const Cliente = require("./classes/Cliente");
const Produto = require("./classes/Produto");
const Pedido = require("./classes/Pedido");


//CLIENTES
async function inserirCliente() {
  const cliente = new Cliente(
    "12345678910",
    "Isadora Costa",
    "isadoracosta@email.com", {
        cidade: "Porto Alegre",
        rua: "Rua Alagoas",
        logradouro: 445
    }
  
  );
  await cliente.inserir();
}

async function buscarClientePorCpf(cpf) {
    const cliente = await Cliente.buscarPorCpf(cpf);

    if(!cliente){
        return;
    }

    console.log("Cliente encontrado:", cliente);
}

async function atualizarCliente(cpf, dados) {
    await Cliente.atualizar(cpf, dados);
    const atualizado = await Cliente.buscarPorCpf(cpf);

    if(!atualizado){
        return;
    }

    console.log("Dados atualizados do cliente:", atualizado);
}

async function buscarTodosClientes() {
    const clientes = await Cliente.buscarTodos();
    console.log("Clientes cadastrados no banco:", clientes);
}

async function deletarPorCpf(cpf) {
    await Cliente.deletar(cpf);
    const clientesRestantes = await Cliente.buscarTodos();
    console.log("Clientes restantes no banco:", clientesRestantes);
}


//PRODUTOS
async function inserirProdutos() {
    const produto = new Produto("Fogão", 1500.0);
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


//PEDIDOS
async function inserirPedido() {
  const produtos = await Produto.buscarTodosProdutos();
  const pedido = new Pedido(
    "NF-4436347223",
    "11502972980",
    ["Fogão", "Geladeira"] 
  );

    await pedido.inserirPedido();
    const pedidos = await Pedido.buscarPedidos();
    console.log("Pedidos cadastrados no banco:", pedidos);
}

async function atualizarPedido(notaFiscal, dados) {
    const resultado = await Pedido.atualizarPedido(notaFiscal, dados);
    console.log("Pedido atualizado:", resultado);
    const atualizado = await Pedido.buscarPedidos();
    console.log("Dados atualizados do pedido:", atualizado);
}

async function deletarPedido(notaFiscal) {
    const result = await Pedido.deletarPedido(notaFiscal);
    console.log("Pedido deletado:", result);
    const pedidosRestantes = await Pedido.buscarPedidos();
    console.log("Pedidos restantes no banco:", pedidosRestantes);
}


//buscarTodosProdutos();

//atualizarProduto("Geladeira", { preco: 2200.0 });


//inserirPedido();

//atualizarCliente("11502972980", { email: "carolschemeiske@email.com" });

//buscarClientePorCpf("03245618332");



//deletarProduto();



//TESTE CRUD DE CLIENTES

//inserirCliente();
//buscarTodosClientes();
//buscarClientePorCpf("12345678910");
//atualizarCliente("123455438910", { email: "isadoracostabaia@email.com" });
//deletarPorCpf("12345678910");



//inserirProdutos();

//inserirPedido();

//deletarPedido("NF-4436347223");

//atualizarPedido("NF-4431223", { clienteCpf: "12345678901" });
