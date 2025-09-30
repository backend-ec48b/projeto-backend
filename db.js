// Carrega as variáveis de ambiente do arquivo .env
require ('dotenv').config();

// Importa o mongoose para conectar ao MongoDB
const mongoose = require('mongoose');

// Obtém a URI do MongoDB a partir das variáveis de ambiente e acessa ela
const MONGO_URI = process.env.MONGO_URI;

