const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017/ecommerce";
const dbName = "ecommerce";

async function connect() {
  try{
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);
    return { db, client };
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err);
    throw err;
  } 
}

module.exports = connect;