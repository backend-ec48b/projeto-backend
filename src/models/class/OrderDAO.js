const PedidoModel = require('../models/PedidoModel');
const ProdutoModel = require('../models/ProdutoModel'); // Necessário para validação/cálculo
const PessoaModel = require('../models/PessoaModel');   // Necessário para validação

/**
 * Classe de Acesso a Dados (DAO) para a entidade Pedido.
 * Implementa os métodos CRUD.
 */
class PedidoDAO {
    // 1. Método de INSERÇÃO (CRIAR)
    async inserir(dadosPedido) {
        // Validação adicional: Verifica se o cliente existe antes de criar o pedido
        const clienteExiste = await PessoaModel.findOne({ cpf: dadosPedido.cliente_cpf });
        if (!clienteExiste) {
            throw new Error("Erro: Cliente com o CPF informado não está cadastrado.");
        }
        
        // Simulação de cálculo de valor total (deve ser feito de forma mais robusta em produção)
        if (!dadosPedido.valor_total) {
             // **NOTA:** Em produção, o valor_total seria calculado
             // buscando o preço de cada produto no banco de dados.
             dadosPedido.valor_total = 0; // Previne erro de campo obrigatório se o valor for 0
        }

        try {
            const novoPedido = new PedidoModel(dadosPedido);
            const pedidoSalvo = await novoPedido.save();
            return pedidoSalvo;
        } catch (error) {
            // Tratamento de exceções
            if (error.name === 'ValidationError') {
                throw new Error(`Erro de Validação (Campos Obrigatórios/Itens): ${error.message}`);
            }
            if (error.code === 11000) {
                throw new Error("Erro: O número da Nota Fiscal (NF) já existe.");
            }
            throw new Error(`Falha ao criar pedido: ${error.message}`);
        }
    }

    // 2. Método de BUSCA (LER)
    async buscarPorNf(nf) {
        try {
            // Busca o pedido pela Nota Fiscal e "popula" as referências (o nome do cliente)
            const pedido = await PedidoModel.findOne({ nf: nf })
                                            .populate('itens.produto_id', 'nome preco'); // Traz nome e preco do produto
            return pedido;
        } catch (error) {
            throw new Error(`Falha ao buscar pedido por NF: ${error.message}`);
        }
    }

    // 3. Método de DELEÇÃO (DELETAR)
    async deletar(nf) {
        try {
            const resultado = await PedidoModel.findOneAndDelete({ nf: nf });
            
            if (!resultado) {
                return { deleted: false, message: "Pedido não encontrado para deleção." };
            }
            return { deleted: true, pedidoDeletado: resultado };
            
        } catch (error) {
            throw new Error(`Falha ao deletar pedido: ${error.message}`);
        }
    }
}

module.exports = PedidoDAO;