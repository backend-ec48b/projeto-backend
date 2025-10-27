const connect  = require("../connection");
const logger = require("../logger");

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

  async inserirCliente() {
    try {
        if (!this._id || this._id.length !== 11) {
          throw new Error("CPF inválido. Deve conter 11 dígitos");
        }

        const { db, client } = await connect();
        const collection = db.collection("clientes");
        const existente = await collection.findOne({ _id: this.cpf });

        if (existente) {
          throw new Error();
        }

        await collection.insertOne({
          _id: this._id,
          nome: this.nome,
          email: this.email,
          endereco: this.endereco,
        });

        logger.info(`Cliente inserido com sucesso: ${this.nome} (${this._id})`);
        client.close();

    } catch (error) {
        logger.error(`Erro ao criar cliente: ${error.message}`);
    }
  }

  static async buscarCliente() {
    try {
        const { db, client } = await connect();
        const result = await db.collection("clientes").find().toArray();
        client.close();
        
        return result;

    } catch (err) {
        console.error(`Erro ao buscar clientes: ${error.message}`);
    }
  }

  static async buscarPorCpf(cpf) {
    try {
        const { db, client } = await connect();
        const result = await db.collection("clientes").findOne({ _id: cpf });
        client.close();

        if (!result) {
          throw new Error("Cliente não encontrado");
        }

        return result;

    } catch (error) {
        logger.error(`Erro ao buscar cliente por CPF: ${error.message}`);
    }
  }

  static async atualizarCliente(cpf, dados) {
    try {
        const { db, client } = await connect();
        const collection = db.collection("clientes");

        const existente = await collection.findOne({ _id: cpf });
        if (!existente) {
          throw new Error("Cliente não encontrado");
        }

        const result = await collection.updateOne({ _id: cpf },{ $set: dados });

        client.close();
        logger.info(`Cliente atualizado com sucesso: ${cpf}`);
        return result;

    } catch (error) {
        logger.error(`Erro ao atualizar cliente: ${error.message}`);
    }
  }

  static async deletarCliente(cpf) {
    try {
        const { db, client } = await connect();
        const collection = db.collection("clientes");

        const existente = await collection.findOne({ _id: cpf });
        if (!existente) {
          throw new Error("Cliente não encontrado");
        }

        const result = await collection.deleteOne({ _id: cpf });
        client.close();
        logger.info(`Cliente deletado com sucesso: ${cpf}`);
        return result;

    } catch (error) {
        logger.error(`Erro ao deletar cliente: ${error.message}`);
    }
  }
}

module.exports = Cliente;