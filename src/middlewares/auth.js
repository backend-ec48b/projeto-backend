const logger = require('../logger');

// Middleware para verificar se o usuário está logado
const isLoggedIn = (req, res, next) => {
    // Verifica se a sessão e o objeto 'usuario' existem
    if (req.session && req.session.usuario) {
        logger.debug(`Usuário logado: CPF ${req.session.usuario.cpf}`);
        // Se estiver logado, continua para a próxima função da rota
        next(); 
    } else {
        logger.warn('Tentativa de acesso não autorizado. Redirecionando para login.');
        // Se não estiver logado, redireciona para a página de login
        res.redirect('/clientes/login'); 
        // 🚨 CORREÇÃO: Garante que a execução do middleware pare após o redirecionamento.
        return; 
    }
};

// Middleware para verificar se o usuário é um administrador
const isAdmin = (req, res, next) => {
    // Requer que o usuário esteja logado E que o perfil seja 'administrador'
    if (req.session && req.session.usuario && req.session.usuario.perfil === 'administrador') {
        logger.debug(`Acesso de Administrador: CPF ${req.session.usuario.cpf}`);
        // Se for admin, continua
        next();
    } else {
        logger.error('Tentativa de acesso a área restrita de Admin.');
        
        // Envia um erro 403 (Proibido) e renderiza a view 'error'
        res.status(403).render('error', { 
            titulo: 'Acesso Negado',
            mensagem: 'Você não tem permissão para acessar esta área. Você precisa de uma conta de administrador.'
        });
        
        // 🚨 CRUCIAL: Garante que a execução do middleware pare após o envio da resposta.
        return; 
    }
};

module.exports = {
    isLoggedIn,
    isAdmin
};