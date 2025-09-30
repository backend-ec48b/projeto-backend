const mongoose = require('mongoose');

// Sub-esquema para representar um item dentro do pedido
const ItemPedidoSchema = new mongoose.Schema({
    // Referência ao ID do Produto (Relacionamento com a coleção Produto)
    produto_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
        required: true
    },
    quantidade: {
        type: Number,
        required: true,
        min: 1
    }
}, { _id: false }); // Não gera _id para os sub-documentos (os itens)


const PedidoSchema = new mongoose.Schema({
    // NF (Nota Fiscal): Campo obrigatório e único
    nf: {
        type: String,
        required: [true, 'O número da Nota Fiscal (NF) é obrigatório.'],
        unique: true,
        trim: true
    },
    // HORARIO: O Mongoose usa o campo 'createdAt' (gerado por timestamps: true)
    // para gravar a data/hora do pedido, que é mais preciso.

    // Relacionamento: Pedido deve ser vinculado a uma Pessoa (Cliente)
    cliente_cpf: {
        type: String,
        ref: 'Pessoa', // Referência ao Model Pessoa
        required: [true, 'O CPF do cliente é obrigatório para o pedido.']
    },
    
    // Lista de Produtos no pedido (Array de ItemPedidoSchema)
    itens: {
        type: [ItemPedidoSchema],
        required: [true, 'O pedido deve conter pelo menos um item.']
    },

    
    valor_total: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true // Armazena a data/hora da criação (HORARIO)
});

module.exports = mongoose.model('Pedido', PedidoSchema);