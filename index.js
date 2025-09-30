// index.js

const connectDB = require('./db'); // Sua função de conexão
const PessoaDAO = require('./classes/PessoaDAO');
const ProdutoDAO = require('./classes/ProdutoDAO');
const PedidoDAO = require('./classes/PedidoDAO');

const pessoaDAO = new PessoaDAO();
const produtoDAO = new ProdutoDAO();
const pedidoDAO = new PedidoDAO();

async function runApplication() {
    await connectDB(); // Conecta ao MongoDB

    try {
        console.log("\n--- TESTE DE INSERÇÃO ---");
        
        // 1. Cadastrar um Cliente (Pessoa)
        const cliente = await pessoaDAO.inserir({
            cpf: "12345678900",
            nome: "João Teste",
            endereco: "Rua Exemplo, 123"
        });
        console.log(`Cliente Cadastrado: ${cliente.nome} (ID: ${cliente._id})`);

        // 2. Cadastrar um Produto
        const produto = await produtoDAO.inserir({
            nome: "Fone de Ouvido Bluetooth",
            preco: 120.00,
            estoque: 50
        });
        console.log(`Produto Cadastrado: ${produto.nome} (ID: ${produto._id})`);

        // 3. Criar um Pedido (usando as IDs dos itens acima)
        const novoPedido = await pedidoDAO.inserir({
            nf: "NF0001",
            cliente_cpf: "12345678900", // CPF do cliente recém-criado
            itens: [{
                produto_id: produto._id,
                quantidade: 2
            }],
            valor_total: 240.00 // 2 x 120.00
        });
        console.log(`Pedido Criado: NF ${novoPedido.nf}`);

        console.log("\n--- TESTE DE BUSCA ---");
        const buscaPedido = await pedidoDAO.buscarPorNf("NF0001");
        console.log("Busca por NF0001:", buscaPedido);

    } catch (error) {
        // Log das exceções capturadas (Critério: Armazenamento de arquivos de log)
        console.error(`\nERRO CAPTURADO NA APLICAÇÃO: ${error.message}`);
        // Aqui você chamaria sua função para gravar o log em arquivo!
    } finally {
        // Se você quiser fechar a conexão automaticamente após o teste
        // await mongoose.connection.close(); 
    }
}

runApplication();