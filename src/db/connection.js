const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017/ecommerce";

const connectDB = async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Conectado ao banco");
    const db =  client.db(); 
    return db
  } catch (err) {
    console.error("Erro ao se conectar ao banco", err);
  }
};

module.exports = connectDB;