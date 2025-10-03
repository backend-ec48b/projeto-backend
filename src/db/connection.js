// Arquivo: connection.js

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017/ecommerce";

let dbInstance = null;
let clientInstance = null; 

const connectDB = async () => {
    if (dbInstance) {
        return dbInstance;
    }

    try {
        clientInstance = new MongoClient(uri);
        await clientInstance.connect();
        dbInstance = clientInstance.db();
        console.log("Conectado ao banco e instância armazenada.");
        
        process.on("SIGINT", async () => {
            await disconnectDB();
            process.exit(0);
        });

        return dbInstance;
    } catch (err) {
        console.error("Erro ao se conectar ao banco:", err);
        throw err;
    }
};

const disconnectDB = async () => {
    if (clientInstance) {
        await clientInstance.close();
        dbInstance = null;
        clientInstance = null;
        console.log("Conexão com o banco fechada explicitamente.");
    }
};

module.exports = {
    connectDB,
    disconnectDB,
};