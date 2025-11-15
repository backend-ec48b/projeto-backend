const express = require('express')
const session = require('express-session');
const app = express()
const port = 3000
const hbs = require('hbs');
const path = require('path');

//Importações necessárias
const logger = require("./logger");
const clienteRouter = require('../src/routes/clienteroutes');
const pedidoRouter = require('../src/routes/pedidoRoutes');
const produtoRouter = require('../src/routes/produtoRoutes');
const inicializarAdminPadrao = require('./admin-setup');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


app.use(session({
    secret: 'SEGREDO_MUITO_SEGURO_E_LONGO',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000
    }
}));


app.get('/', (req, res) => {

    const usuarioLogado = req.session.usuario;

    const isAdministrador = usuarioLogado && usuarioLogado.perfil === 'administrador';

    const stats = {
        totalClientes: 42,
        produtosAtivos: 15
    };

    res.render('home', {
        layout: 'home',
        usuario: usuarioLogado,
        isAdmin: isAdministrador,
        stats: stats
    });
});

app.use('/clientes', clienteRouter);
app.use('/pedidos', pedidoRouter);
app.use('/produtos', produtoRouter);


async function iniciarAplicacao() {

    await inicializarAdminPadrao(); 

    app.listen(port, () => {
        logger.info(`Aplicação rodando na porta: ${port}`)
    });
}

iniciarAplicacao();