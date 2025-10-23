<<<<<<< Updated upstream

const { connectDB, disconnectDB } = require('./db/connection'); 

async function iniciarSistema() {
    let db;
    try {
        db = await connectDB();
        
        const Pessoas = db.collection('Pessoas');
        const Pedidos = db.collection('Pedidos');
        const Produtos = db.collection('Produtos');
        
        // --- OPERAÇÕES DE CRUD (Create, Read, Update, Delete) ---

        // A. CRIAR
        const cpfCliente = '111.222.333-44';

        await Pessoas.updateOne(
            { cpf: cpfCliente },
            { 
                $set: { 
                    nome: 'Silvio Henrique Mendes dos Santos', 
                    endereco: 'Fazenda Cachoeira, PR 218',
                    updatedAt: new Date()
                },
                $setOnInsert: {
                    createdAt: new Date()
                }
            },
            { upsert: true } // Opção: crie se não existir
        );
        
        const p1 = await Pessoas.findOne({ cpf: cpfCliente });

        if (!p1) {
            console.error("ERRO CRÍTICO: Não foi possível ler o documento após a escrita. Verifique a URI e permissões.");
            throw new Error("Falha crítica ao ler documento 'Pessoa'.");
        }

        console.log("Pessoa criada/atualizada:", p1.nome);

        // B. CRIAR um Pedido (vinculado a João pelo CPF)
        const dadosNovoPedido = {
            nf: 1003,
            clienteCpf: p1.cpf, // Vincula ao CPF (String)
            horario: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const pedidoResult = await Pedidos.insertOne(dadosNovoPedido);
        
        const novoPedidoId = pedidoResult.insertedId; 
        
        console.log("Pedido criado NF:", dadosNovoPedido.nf, "ID:", novoPedidoId);


        // C. CRIAR Produtos (vinculados ao Pedido pelo seu ObjectId)
        const produtosParaCriar = [
            {
                nome: 'Monitor UltraWide',
                // Usando o ObjectId do pedido como referência
                pedidoId: novoPedidoId 
            },
            {
                nome: 'Webcam HD',
                pedidoId: novoPedidoId
            }
        ];
        await Produtos.insertMany(produtosParaCriar);
        console.log("Produtos adicionados ao Pedido 1003.");
=======
const Cliente = require("./classes/Cliente");
const Produto = require("./classes/Produto");
const Pedido = require("./classes/Pedido");
const logger = require("./logger");
const { error } = require("winston");


//CLIENTES
async function inserirCliente() {
    try{
  const cliente = new Cliente(
    "12345678910",
    "Fulano da Silva",
    "fulanodasilva@email.com", {
        cidade: "Nova Teste",
        rua: "Rua Teste",
        logradouro: 123
    });
        await cliente.inserirCliente();
        logger.info('Processamento principal concluído com sucesso.');
    } catch (error) {
        logger.error(`A aplicação parou devido ao ${error.message}`);
    }
}
>>>>>>> Stashed changes


        // D. CONSULTAR Pedido (NF 1003)
        const pedidoEncontrado = await Pedidos.findOne({ nf: 1003 });

        if (pedidoEncontrado) {
            // E. CONSULTAR os dados do Cliente (Manual "Populate")
            const cliente = await Pessoas.findOne({ cpf: pedidoEncontrado.clienteCpf });
            
            // F. CONSULTAR os Produtos do Pedido
            const produtosDoPedido = await Produtos.find({ 
                pedidoId: pedidoEncontrado._id 
            }).toArray();

            
            console.log(`\nDetalhes do Pedido NF ${pedidoEncontrado.nf}:`);
            
            if (cliente) {
                 console.log(`- Cliente: ${cliente.nome} (CPF: ${cliente.cpf})`);
            } else {
                 console.log(`- Cliente: CPF ${pedidoEncontrado.clienteCpf} não encontrado.`);
            }

            console.log(`- Produtos neste Pedido:`);
            produtosDoPedido.forEach(prod => {
                console.log(`  > ${prod.nome} (ID Produto: ${prod._id})`);
            });
        }


    } catch (error) {
        console.error("Erro durante a execução das operações:", error);
    } finally {
        await disconnectDB();
    }
}

iniciarSistema();
