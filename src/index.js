const express = require('express')
const app = express()
const port = 3000
const hbs = require('hbs');
const path = require('path');

const logger = require("./logger");
const clienteRouter = require('../src/Routes/clienteroutes');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home', {
        layout: 'home'
    });
});

app.use('/clientes', clienteRouter);
//app.use('/pedido', pedidoRouter);
//app.use('produto', produtoRouter);

app.listen(port, () => {
    logger.info(`Aplicação rodando na porta: ${port}`)
})