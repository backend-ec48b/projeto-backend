const Cliente = require('../Model/Cliente');
const logger = require('../logger');

//Verificar se um campo é vazio
const isVazio = (valor) => !valor || (typeof valor === 'string' && valor.trim() === '');

const validarDadosCliente = (nome, cpf, email, endereco, isUpdate = false) => {
    if (isVazio(cpf)) { 
        throw new Error("O campo CPF é obrigatório."); 
    }
    
    const cpfLimpo = cpf.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
        logger.warn(`Validação falhou: CPF ${cpf} tem tamanho incorreto.`);
        throw new Error("O CPF deve conter exatamente 11 dígitos.");
    }

    if (isVazio(nome)) { throw new Error("O campo Nome é obrigatório."); }
    if (isVazio(email)) { throw new Error("O campo E-mail é obrigatório."); }
    if (!endereco || isVazio(endereco.rua)) { throw new Error("Rua é obrigatório."); }
    if (!endereco || isVazio(endereco.cidade)) { throw new Error("Cidade é obrigatório."); }
    if (!endereco || isVazio(endereco.logradouro)) { throw new Error("Logradouro é obrigatório."); }

    return cpfLimpo;

};


class ClienteController {

    static exibirFormulario(req, res) {
        logger.info('Acessando formulário de cadastro/edição de cliente.');
        res.render('clientes/form', {
            titulo: 'Novo Cliente',
            action: '/clientes'
        });
    }

    static async inserir(req, res) {
        const { cpf, nome, email, endereco } = req.body; 
        let cpfLimpo;

        try {
            logger.info(`Tentativa de inserir novo cliente: ${cpf}`);
            
            cpfLimpo = validarDadosCliente(nome, cpf, email, endereco);

            const novoCliente = new Cliente(cpfLimpo, nome, email, endereco);

            await novoCliente.inserirCliente();
            logger.info(`Cliente ${cpfLimpo} inserido com sucesso.`);
            res.redirect('/clientes');
        } catch (error) {
            logger.error(`Erro ao inserir cliente ${cpf}: ${error.message}`);
            res.status(400).render('clientes/form', {
                titulo: 'Erro no Cadastro',
                erro: `Falha ao cadastrar: ${error.message || 'Erro desconhecido.'}`,
                cliente: {
                    cpf: cpf, 
                    nome,
                    email,
                    endereco
                }
            });
        }
    }

    static async listar(req, res) {
        try {
            logger.info('Buscando lista de todos os clientes.');
            const clientes = await Cliente.buscarCliente();
            logger.info(`Encontrados ${clientes ? clientes.length : 0} clientes.`);

            res.render('clientes/list', {
                titulo: 'Lista de Clientes',
                clientes: clientes
            });
        } catch (error) {
            logger.error(`Erro ao listar clientes: ${error.message}`);
            res.status(500).send("Erro interno ao carregar clientes.");
        }
    }

    static async buscarDetalhes(req, res) {
        const cpf = req.params.cpf;
        try {
            logger.info(`Buscando detalhes do cliente CPF: ${cpf}`);
            const cliente = await Cliente.buscarPorCpf(cpf);

            if (!cliente) {
                logger.warn(`Cliente CPF ${cpf} não encontrado.`);
            }

            res.render('clientes/detail', {
                titulo: `Detalhes do Cliente ${cpf}`,
                cliente: cliente
            });
        } catch (error) {
            logger.error(`Erro ao buscar detalhes do cliente ${cpf}: ${error.message}`);
            res.status(404).send(`Cliente com CPF ${cpf} não encontrado.`);
        }
    }

    static async exibirEdicao(req, res) {
        const cpf = req.params.cpf;
        try {
            logger.info(`Acessando formulário de edição para o cliente CPF: ${cpf}`);
            const cliente = await Cliente.buscarPorCpf(cpf);
            
            if (cliente && !cliente.cpf) {
                cliente.cpf = cliente._id;
            }

            res.render('clientes/form', {
                titulo: `Editar Cliente de CPF: ${cpf}`,
                cliente: cliente,
                action: `/clientes/${cpf}`
            });
        } catch (error) {
            logger.error(`Cliente CPF ${cpf} não encontrado para edição: ${error.message}`);
            res.status(404).send(`Cliente com CPF ${cpf} não encontrado para edição.`);
        }
    }

    static async atualizar(req, res) {
        const cpfOriginal = req.params.cpf;
        const novosDados = req.body;
        const { cpf, nome, email, endereco } = novosDados;

        const cpfParaExibir = cpf || cpfOriginal; 

        try {
            logger.info(`Tentativa de atualização do cliente CPF: ${cpfOriginal}`);
            
            const cpfLimpo = validarDadosCliente(nome, cpf || cpfOriginal, email, endereco, true);
            novosDados.cpf = cpfLimpo; 
            

            await Cliente.atualizarCliente(cpfOriginal, novosDados);
            logger.info(`Cliente ${cpfOriginal} atualizado com sucesso.`);

            res.redirect(`/clientes/${novosDados.cpf}`); 
        } catch (error) {
            if (error.message.includes("não encontrado")) {
                logger.warn(`Tentativa de atualização falhou: Cliente CPF ${cpfOriginal} não encontrado.`);
                return res.status(404).send(`Cliente com CPF ${cpfOriginal} não encontrado.`);
            }

            logger.error(`Erro ao atualizar cliente ${cpfOriginal}: ${error.message}`);
            res.status(500).render('clientes/form', {
                titulo: `Erro ao Editar Cliente: ${cpfOriginal}`,
                erro: `Falha ao atualizar: ${error.message}`,
                cliente: {
                    ...novosDados,
                    cpf: cpfParaExibir,
                    _id: cpfOriginal
                }
            });
        }
    }

    static async deletar(req, res) {
        const cpf = req.params.cpf;
        try {
            logger.info(`Tentativa de deletar cliente CPF: ${cpf}`);
            await Cliente.deletarCliente(cpf);
            logger.info(`Cliente ${cpf} deletado com sucesso.`);

            res.redirect('/clientes');
        } catch (error) {
            logger.error(`Erro ao deletar cliente ${cpf}: ${error.message}`);
            res.status(404).send(`Falha ao deletar: ${error.message}`);
        }
    }
}

module.exports = ClienteController;