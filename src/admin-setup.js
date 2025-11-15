const Cliente = require('./model/Cliente');
const logger = require('./logger'); 

const CPF_ADMIN = '00000000000';
const HASH_SENHA_ADMIN = '$2a$10$gNfD7S9j8Z5bQcWw9w5nO8B6rE2xU3yA5vT1mC0kL0jI7hGf2a3';

async function inicializarAdminPadrao() {
    try {
        const adminExistente = await Cliente.buscarPorCpf(CPF_ADMIN);

        if (adminExistente) {
            logger.info('Usuário administrador padrão já existe. Ignorando a criação.');
            return;
        }

        const novoAdmin = new Cliente(
            CPF_ADMIN,
            'Administrador Padrão',
            'admin@meuapp.com',
            { rua: 'Rua Principal', logradouro: '100', cidade: 'Cidade Admin' },
            HASH_SENHA_ADMIN,
            'administrador'
        );

        await novoAdmin.inserirCliente();
        logger.info('Usuário administrador padrão criado com sucesso: 00000000000 / adm1010');

    } catch (error) {
        logger.error('Erro ao inicializar o usuário administrador padrão:', error.message);
    }
}

module.exports = inicializarAdminPadrao;