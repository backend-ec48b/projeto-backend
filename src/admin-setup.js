const Cliente = require('./model/Cliente');
const logger = require('./logger'); 
const bcrypt = require('bcryptjs'); // <--- Importe o bcrypt

const CPF_ADMIN = '00000000000';
const SENHA_ADMIN_PURA = 'adm1010'; // <--- Senha em texto puro

async function inicializarAdminPadrao() {
    try {
        const adminExistente = await Cliente.buscarPorCpf(CPF_ADMIN);

        if (adminExistente) {
            logger.info('Usuário administrador padrão já existe. Ignorando a criação.');
            return;
        }

        // 🚨 NOVO PASSO: Gere o hash da senha em texto puro antes de usá-la.
        const hashSenha = await bcrypt.hash(SENHA_ADMIN_PURA, 10);

        const novoAdmin = new Cliente(
            CPF_ADMIN,
            'Administrador Padrão',
            'admin@meuapp.com',
            { rua: 'Rua Principal', logradouro: '100', cidade: 'Cidade Admin' },
            hashSenha, // <--- Use o HASH gerado
            'administrador'
        );

        await novoAdmin.inserirCliente();
        logger.info('Usuário administrador padrão criado com sucesso: 00000000000 / adm1010');

    } catch (error) {
        logger.error('Erro ao inicializar o usuário administrador padrão:', error.message);
    }
}

module.exports = inicializarAdminPadrao;