const Cliente = require('../model/Cliente');
const logger = require('../logger');
const bcrypt = require('bcryptjs');

const isVazio = (valor) => !valor || (typeof valor === 'string' && valor.trim() === '');

const limparECpfValido = (cpf) => {
    if (isVazio(cpf)) {
        throw new Error("O campo CPF é obrigatório.");
    }
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
        logger.warn(`Validação falhou: CPF ${cpf} tem tamanho incorreto.`);
        throw new Error("O CPF deve conter exatamente 11 dígitos.");
    }
    return cpfLimpo;
};

const validarDadosCompletos = (nome, cpf, email, endereco) => {
    const cpfLimpo = limparECpfValido(cpf);

    if (isVazio(nome)) { throw new Error("O campo Nome é obrigatório."); }
    if (isVazio(email)) { throw new Error("O campo E-mail é obrigatório."); }
    if (!endereco || isVazio(endereco.rua)) { throw new Error("Rua é obrigatório."); }
    if (!endereco || isVazio(endereco.cidade)) { throw new Error("Cidade é obrigatório."); }
    if (!endereco || isVazio(endereco.logradouro)) { throw new Error("Logradouro é obrigatório."); }

    return cpfLimpo;
};

class ClienteController {

    static cadastroForm(req, res) {
        res.render('clientes/cadastro', {
            titulo: 'Cadastre-se',
            action: '/clientes/cadastrar'
        });
    }

    static async cadastrarCliente(req, res) {
        const { nome, cpf, email, endereco, senha } = req.body;
        let cpfLimpo;

        try {
            if (isVazio(senha)) {
                throw new Error("Senha é obrigatória.");
            }
            
            cpfLimpo = validarDadosCompletos(nome, cpf, email, endereco); 
            
            logger.info(`Tentativa de cadastro completo: ${cpfLimpo}`);
            
            const hashedPassword = await bcrypt.hash(senha, 10);
            
            const novoCliente = new Cliente(cpfLimpo, nome, email, endereco, hashedPassword, 'cliente');

            await novoCliente.inserirCliente();
            
            logger.info(`Cliente ${cpfLimpo} cadastrado com sucesso.`);
            res.redirect('/clientes/login');

        } catch (error) {
            logger.error(`Erro ao cadastrar cliente ${cpf}: ${error.message}`);
            const erroMsg = error.message.includes("já cadastrado") ? "Este CPF já está registrado." : error.message;
            
            const clienteDados = { cpf, nome, email, endereco };

            res.status(400).render('clientes/cadastro', {
                titulo: 'Erro no Cadastro',
                erro: `Falha ao cadastrar: ${erroMsg}`,
                cliente: clienteDados
            });
        }
    }

    static loginForm(req, res) {
        if (req.session && req.session.usuario) {
            return res.redirect('/');
        }
        res.render('clientes/login', { titulo: 'Login' });
    }

    static async login(req, res) {
        const { cpf, senha } = req.body;
        const loginErrorMsg = "CPF ou senha incorretos.";

        try {
            if (isVazio(cpf) || isVazio(senha)) {
                return res.render('clientes/login', { erro: "CPF e Senha são obrigatórios.", dadosAnteriores: { cpf } });
            }

            const cpfLimpo = cpf.replace(/\D/g, '');
            // Assumimos que Cliente.buscarPorCpf retorna o objeto completo, incluindo nome
            const cliente = await Cliente.buscarPorCpf(cpfLimpo);

            if (!cliente || !cliente.senha || !(await bcrypt.compare(senha, cliente.senha))) {
                return res.render('clientes/login', { 
                    erro: loginErrorMsg,
                    dadosAnteriores: { cpf }
                });
            }

            // 🚨 CORREÇÃO AQUI: Adicionando cliente.nome ao objeto de sessão
            req.session.usuario = {
                _id: cliente._id,
                cpf: cliente._id,
                nome: cliente.nome, // <-- Adicionado para exibir na home
                perfil: cliente.perfil
            };
            
            logger.info(`Login de sucesso. Perfil: ${cliente.perfil}. CPF: ${cliente._id}`);

            const redirectPath = cliente.perfil === 'administrador' ? '/pedidos/listar' : '/';
            res.redirect(redirectPath);

        } catch (error) {
            logger.error(`Erro no processo de login para CPF ${cpf}: ${error.message}`);
            res.status(500).render('clientes/login', { 
                erro: "Erro interno do servidor ao tentar fazer login. Por favor, tente novamente mais tarde."
            });
        }
    }
    
    static logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                logger.error('Erro ao encerrar sessão:', err);
            }
            res.redirect('/clientes/login');
        });
    }

    static exibirFormulario(req, res) {
        res.render('clientes/form', {
            titulo: 'Novo Cliente (Admin)',
            action: '/clientes'
        });
    }

    static async inserir(req, res) {
        const { cpf, nome, email, endereco, senha, perfil } = req.body; 
        
        try {
            logger.info(`Tentativa de inserir novo cliente (Admin): ${cpf}`);
            
            const cpfLimpo = validarDadosCompletos(nome, cpf, email, endereco);
            
            if (isVazio(senha)) {
                throw new Error("Senha é obrigatória no cadastro completo.");
            }
            
            const hashedPassword = await bcrypt.hash(senha, 10);
            
            const novoCliente = new Cliente(cpfLimpo, nome, email, endereco, hashedPassword, perfil || 'cliente');

            await novoCliente.inserirCliente();
            logger.info(`Cliente ${cpfLimpo} inserido com sucesso (Admin).`);
            res.redirect('/clientes');
        } catch (error) {
            logger.error(`Erro ao inserir cliente ${cpf}: ${error.message}`);
            res.status(400).render('clientes/form', {
                titulo: 'Erro no Cadastro',
                erro: `Falha ao cadastrar: ${error.message || 'Erro desconhecido.'}`,
                cliente: { cpf, nome, email, endereco }
            });
        }
    }

    static async listar(req, res) {
        try {
            const clientes = await Cliente.buscarCliente(); 
            
            const clientesSemSenha = clientes.map(c => {
                const { senha, ...rest } = c;
                return rest;
            });

            res.render('clientes/list', {
                titulo: 'Lista de Clientes',
                clientes: clientesSemSenha
            });
        } catch (error) {
            logger.error(`Erro ao listar clientes: ${error.message}`);
            res.status(500).send("Erro interno ao carregar clientes.");
        }
    }

    static async buscarDetalhes(req, res) {
        const cpf = req.params.cpf;
        try {
            const cliente = await Cliente.buscarPorCpf(cpf);
            
            if (cliente) {
                delete cliente.senha; 
                cliente.cpf = cliente._id; 
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
            const cliente = await Cliente.buscarPorCpf(cpf);
            
            if (cliente) {
                delete cliente.senha; 
                cliente.cpf = cliente._id; 
            }

            res.render('clientes/form', {
                titulo: `Editar Cliente: ${cpf}`,
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
        const { nome, email, endereco, senha, perfil } = novosDados;
        const cpf = novosDados.cpf || cpfOriginal; 

        try {
            logger.info(`Tentativa de atualização do cliente CPF: ${cpfOriginal}`);
            
            const cpfLimpo = validarDadosCompletos(nome, cpf, email, endereco);
            novosDados.cpf = cpfLimpo;
            novosDados._id = cpfLimpo;
            
            novosDados.perfil = perfil || 'cliente'; 

            if (senha) {
                novosDados.senha = await bcrypt.hash(senha, 10);
            } else {
                delete novosDados.senha; 
            }

            await Cliente.atualizarCliente(cpfOriginal, novosDados);
            logger.info(`Cliente ${cpfOriginal} atualizado com sucesso.`);

            res.redirect(`/clientes/${cpfLimpo}`); 
        } catch (error) {
            logger.error(`Erro ao atualizar cliente ${cpfOriginal}: ${error.message}`);
            
            const clientData = { ...novosDados, cpf: cpf, _id: cpfOriginal };
            delete clientData.senha; 
            
            res.status(500).render('clientes/form', {
                titulo: `Erro ao Editar Cliente: ${cpfOriginal}`,
                erro: `Falha ao atualizar: ${error.message}`,
                cliente: clientData
            });
        }
    }

    static async deletar(req, res) {
        const cpf = req.params.cpf;
        try {
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