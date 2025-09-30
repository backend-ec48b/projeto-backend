const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({

    //Pedro, quando formos implementar a parte de pedidos, temos que lembrar: que a NF deve ser
    // Uma referencia do pedido e não a NF do produto.

    // NF (Número da Nota Fiscal): Deve ser referenciado pelo Pedido, não pelo Produto.
    // Produto deve ter apenas seu NOME.

    nome: {
        type: String,
        required: [true, 'O nome do Produto é obrigatório.'],
        trim: true
    },
    // Outros campos 
    preco: {
        type: Number,
        required: [true, 'O preço é obrigatório.'],
        min: [0, 'O preço não pode ser negativo.']
    },
    estoque: {
        type: Number,
        required: [true, 'O estoque é obrigatório.'],
        min: [0, 'Estoque não pode ser negativo.'],
        default: 0
    }
});

module.exports = mongoose.model('Produto', ProdutoSchema);