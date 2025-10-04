const connect  = require("../db/connection");

class Cliente {
  constructor(cpf, nome, email, endereco) {
    this._id = cpf; 
    this.nome = nome;
    this.email = email;
    this.endereco = {
      rua: endereco.rua,
      cidade: endereco.cidade,
      logradouro: endereco.logradouro
    }; 
  }

  async inserir() {
    try {
      const { db, client } = await connect();
      const collection = db.collection("clientes");
      const existente = await collection.findOne({ _id: this.cpf });

      if (existente) {
        console.error("Erro: já existe cliente com esse CPF.");
        client.close();
        return;
      }

      await collection.insertOne({
        _id: this._id,
        nome: this.nome,
        email: this.email,
        endereco: this.endereco,
      });

      console.log("Cliente inserido com sucesso");
      client.close();

    } catch (err) {
      console.error("Erro ao inserir cliente");
    }
  }

  static async buscarTodos() {
    try {
      const { db, client } = await connect();
      const result = await db.collection("clientes").find().toArray();
      client.close();
      return result;
    } catch (err) {
      console.error("Erro ao buscar clientes");
    }
  }

  static async buscarPorCpf(cpf) {
    try {
      const { db, client } = await connect();
      const result = await db.collection("clientes").findOne({ _id: cpf });
      client.close();
      return result;
    } catch (err) {
      console.error("Erro ao buscar cliente por CPF");
    }
  }

  static async atualizar(cpf, dados) {
    try {
      const { db, client } = await connect();
      const collection = db.collection("clientes");

      const result = await collection.updateOne(
        { _id: cpf },
        { $set: dados }
      );

      client.close();
      console.log("Cliente atualizado:", result);
      return result;

    } catch (err) {
      console.error("Erro ao atualizar cliente:", err);
    }
  }

  static async deletar(cpf) {
    try {
      const { db, client } = await connect();
      const collection = db.collection("clientes");

      const result = await collection.deleteOne({ _id: cpf });
      client.close();
      console.log("Cliente deletado:", result);
      return result;
    } catch (err) {
      console.error("Erro ao deletar cliente");
    }
  }
}

module.exports = Cliente;