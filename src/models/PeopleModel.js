const mongoose = require('mongoose');

// Define o esquema da Pessoa/Cliente
const PessoaSchema = new mongoose.Schema({
    // CPF: Campo único e obrigatório (chave de identificação)
    cpf: {
        type: String,
        required: [true, 'O CPF é obrigatório.'], // Validação o campo obrigatório
        unique: true, // Garante que não haja CPFs duplicados
        trim: true
    },
    // NOME: Campo obrigatório
    nome: {
        type: String,
        required: [true, 'O Nome é obrigatório.'],
        trim: true
    },
    // ENDEREÇO: Campo obrigatório
    endereco: {
        type: String,
        required: [true, 'O Endereço é obrigatório.']
    },
    // Você pode adicionar outros campos, como email, telefone, etc.
}, {
    timestamps: true // Adiciona automaticamente campos createdAt e updatedAt
});

// Cria e exporta o Model
module.exports = mongoose.model('Pessoa', PessoaSchema);