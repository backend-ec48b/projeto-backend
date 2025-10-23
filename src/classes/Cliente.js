const {
  error
} = require("winston");
const connect = require("../db/connection");
const logger = require("../logger");

class Cliente {
  constructor(cpf, nome, email, endereco) {
    logger.info(`Novo objeto Cliente criado: ${nome}`)
    this._id = cpf;
    this.nome = nome;
    this.email = email;
    this.endereco = {
      rua: endereco.rua,
      cidade: endereco.cidade,
      logradouro: endereco.logradouro
    };
  }

  async inserirCliente() {

    let client;

    try {
      if (!this._id || this._id.length !== 11) {
        throw new Error(`CPF inválido. O valor ${this._id} precisa ter 11 dígitos.`);
      }

      const conn = await connect();
      const db = conn.db;
      client = conn.client
      const collection = db.collection("clientes");
      const existente = await collection.findOne({
        _id: this.cpf
      });

      if (existente) {
        throw new Error();
      }

      await collection.insertOne({
        _id: this._id,
        nome: this.nome,
        email: this.email,
        endereco: this.endereco,
      });

      logger.info(`Cliente ${this.nome} cadastrado.`);

    } catch (error) {

      let messageError = error.message;
      if (error.code == 11000) {
        messageError = `Erro: O CPF (${this._id}) já esta cadastrado`;
      }

      logger.error(`Falha ao cadastrar Cliente ${this.nome}.`);
      throw new Error(messageError);
    } finally {
      if (client) {
        client.close();
      }
    }
  }

  static async buscarCliente() {
    try {
      const {
        db,
        client
      } = await connect();
      const result = await db.collection("clientes").find().toArray();
      client.close();

      return result;

    } catch (err) {
      logger.error("Erro ao buscar clientes no DB.", {
        stack: err.stack
      });
      throw err;
    }
  }

  static async buscarPorCpf(cpf) {
    try {
      const {
        db,
        client
      } = await connect();
      const result = await db.collection("clientes").findOne({
        _id: cpf
      });
      client.close();

      if (!result) {
        throw new Error();
      }

      return result;

    } catch (err) {
      logger.error("Erro ao buscar cliente por CPF"), {
        erro: error.message
      };
    }
  }

  static async atualizarCliente(cpf, dados) {
    try {
      const {
        db,
        client
      } = await connect();
      const collection = db.collection("clientes");

      const existente = await collection.findOne({
        _id: cpf
      });
      if (!existente) {
        throw new Error();
      }

      const result = await collection.updateOne({
        _id: cpf
      }, {
        $set: dados
      });

      client.close();
      console.log("Cliente atualizado");
      return result;

    } catch (err) {
      console.error("Erro ao atualizar cliente");
    }
  }

  static async deletarCliente(cpf) {
    try {
      const {
        db,
        client
      } = await connect();
      const collection = db.collection("clientes");

      const existente = await collection.findOne({
        _id: cpf
      });
      if (!existente) {
        throw new Error();
      }

      const result = await collection.deleteOne({
        _id: cpf
      });
      client.close();
      console.log("Cliente deletado");
      return result;

    } catch (err) {
      console.error("Erro ao deletar cliente");
    }
  }
}

module.exports = Cliente;