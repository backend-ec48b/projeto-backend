
const Cliente = require('../Model/Cliente'); 

class ClienteController {

    /**
     * Exibe o formulário vazio de cadastro. (GET /clientes/novo)
     */
    static exibirFormulario(req, res) {
        // Renderiza a view 'clientes/formulario.hbs'
        res.render('clientes/form', { 
            titulo: 'Novo Cliente', 
            action: '/clientes' // A URL de destino do POST
        });
    }

    /**
     * Processa a submissão do formulário e insere um novo cliente. (POST /clientes)
     */
    static async inserir(req, res) {
        const { cpf, nome, email, endereco } = req.body; 

        const novoCliente = new Cliente(cpf, nome, email, endereco);

        try {
            await novoCliente.inserirCliente();            
            res.redirect('/clientes'); 
        } catch (error) {
            // Em caso de erro (CPF inválido, duplicado, etc.), re-renderiza o formulário
            res.status(400).render('clientes/form', {
                titulo: 'Erro no Cadastro',
                erro: `Falha ao cadastrar: ${error.message || 'CPF duplicado ou inválido.'}`,
                cliente: { _id: cpf, nome, email, endereco } 
            });
        }
    }
    static async listar(req, res) {
        try {
            const clientes = await Cliente.buscarCliente(); 
            
            // Renderiza a view 'clientes/listagem.hbs'
            res.render('clientes/list', { 
                titulo: 'Lista de Clientes', 
                clientes: clientes
            });
        } catch (error) {
            res.status(500).send("Erro interno ao carregar clientes.");
        }
    }

    static async buscarDetalhes(req, res) {
        const cpf = req.params.cpf;
        try {
            const cliente = await ClienteDAO.buscarPorCpf(cpf); 
            
            // Renderiza a view 'clientes/detail.hbs' (assumindo que você a criou)
            res.render('clientes/detail', { 
                titulo: `Detalhes do Cliente ${cpf}`,
                cliente: cliente 
            });
        } catch (error) {
            // Erro 404 para "Cliente não encontrado"
            res.status(404).send(`Cliente com CPF ${cpf} não encontrado.`);
        }
    }

    static async exibirEdicao(req, res) {
        const cpf = req.params.cpf;
        try {
            const cliente = await Cliente.buscarPorCpf(cpf);
            
            res.render('clientes/form', {
                titulo: `Editar Cliente: ${cpf}`,
                cliente: cliente, // Passa o objeto completo para preencher os campos
                action: `/clientes/${cpf}` // A URL de destino do POST para atualização
            });
        } catch (error) {
            res.status(404).send(`Cliente com CPF ${cpf} não encontrado para edição.`);
        }
    }

    static async atualizar(req, res) {
        const cpf = req.params.cpf;
        const novosDados = req.body; 

        try {
            await Cliente.atualizarCliente(cpf, novosDados); 
            
            // Redireciona para os detalhes do cliente após a atualização
            res.redirect(`/clientes/${cpf}`); 
        } catch (error) {
            if (error.message.includes("não encontrado")) {
                 return res.status(404).send(`Cliente com CPF ${cpf} não encontrado.`);
            }
            res.status(500).send(`Erro ao atualizar cliente: ${error.message}`);
        }
    }

    static async deletar(req, res) {
        const cpf = req.params.cpf;
        try {
            // Chama o método DAO de exclusão
            await Cliente.deletarCliente(cpf); 
            
            // Redireciona para a lista após a exclusão
            res.redirect('/clientes');
        } catch (error) {
            res.status(404).send(`Falha ao deletar: ${error.message}`);
        }
    }
}

module.exports = ClienteController;