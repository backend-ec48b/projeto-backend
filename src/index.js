const express = require('express')
const app = express()
const port = 3000
const hbs = require('hbs');
const path = require('path');

//Importação do logger e classes de Rotas usadas.
const logger = require("./logger");
const clienteRouter = require('../src/Routes/clienteroutes');
const pedidoRouter = require('../src/routes/pedidoRoutes');
const produtoRouter = require('../src/routes/produtoRoutes');


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));



// Pagina principal
app.get('/', (req, res) => {
    res.render('home', {
        layout: 'home'
    });
});
//Rotas para clientes
app.use('/clientes', clienteRouter);
//Rotas para pedidos
app.use('/pedidos', pedidoRouter);
//Rotas para produtos
app.use('/produtos', produtoRouter);

app.listen(port, () => {
    logger.info(`Aplicação rodando na porta: ${port}`)
})