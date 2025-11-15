const logger = require('../logger');

const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.usuario) {
        logger.debug(`Usuário logado: CPF ${req.session.usuario.cpf}`);
        next(); 
    } else {
        logger.warn('Tentativa de acesso não autorizado. Redirecionando para login.');
        res.redirect('/clientes/login'); 
        return; 
    }
};

const isAdmin = (req, res, next) => {
    if (req.session && req.session.usuario && req.session.usuario.perfil === 'administrador') {
        logger.debug(`Acesso de Administrador: CPF ${req.session.usuario.cpf}`);
        next();
    } else {
        logger.error('Tentativa de acesso a área restrita de Admin.');
        
        res.status(403).render('error', { 
            titulo: 'Acesso Negado',
            mensagem: 'Você não tem permissão para acessar esta área. Você precisa de uma conta de administrador.'
        });        
        return; 
    }
};

module.exports = {
    isLoggedIn,
    isAdmin
};