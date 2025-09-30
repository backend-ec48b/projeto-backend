const PessoaModel = require('../models/PessoaModel');
// Importe a classe de logs para o critério de avaliação, se aplicável

/**
 * Classe de Acesso a Dados (DAO) para a entidade Pessoa/Cliente.
 * Implementa os métodos CRUD.
 */
class PessoaDAO {
    // 1. Método de INSERÇÃO (CRIAR)
    async inserir(dadosPessoa) {
        try {
            const novaPessoa = new PessoaModel(dadosPessoa);
            const pessoaSalva = await novaPessoa.save();
            return pessoaSalva;
        } catch (error) {
            // Tratamento de exceções (Critério: Tratamento de excessões)
            if (error.name === 'ValidationError') {
                throw new Error(`Erro de Validação (Campos Obrigatórios): ${error.message}`);
            }
            if (error.code === 11000) { // Código de erro para duplicidade (CPF já existe)
                throw new Error("Erro: O CPF informado já está cadastrado.");
            }
            throw new Error(`Falha ao inserir cliente: ${error.message}`);
        }
    }

    // 2. Método de BUSCA (LER)
    async buscarPorCpf(cpf) {
        try {
            // Busca o cliente pelo CPF (identificador único)
            const pessoa = await PessoaModel.findOne({ cpf: cpf });
            return pessoa;
        } catch (error) {
            throw new Error(`Falha ao buscar cliente: ${error.message}`);
        }
    }

    // 3. Método de DELEÇÃO (DELETAR)
    async deletar(cpf) {
        try {
            // Usa findOneAndDelete para buscar pelo CPF e remover
            const resultado = await PessoaModel.findOneAndDelete({ cpf: cpf });
            
            if (!resultado) {
                return { deleted: false, message: "Cliente não encontrado para deleção." };
            }
            return { deleted: true, pessoaDeletada: resultado };
            
        } catch (error) {
            throw new Error(`Falha ao deletar cliente: ${error.message}`);
        }
    }
    
    // Método extra para buscar todos os clientes
    async buscarTodos() {
        return PessoaModel.find({});
    }
}

module.exports = PessoaDAO;