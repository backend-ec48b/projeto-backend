const connect = require("./connection");
const logger = require("./logger");

class Pedido {
  constructor(notaFiscal, clienteCpf, produtosNome) {
    this._id = notaFiscal;           
    this.clienteCpf = clienteCpf;    
    this.produtosNome = produtosNome;        
    this.data = new Date();          
  }

  async inserirPedido() {
    try {
      if (!this._id || !this.clienteCpf || !this.produtosNome) {
        throw new Error("Campos obrigatórios ausentes: nota fiscal, CPF ou produtos.");
      }

      const { db, client } = await connect();
      const collection = db.collection("pedidos");

      const existente = await collection.findOne({ _id: this._id });
      if (existente) {
        throw new Error("Já existe um pedido com essa nota fiscal.");
      }

      await collection.insertOne({
        _id: this._id,
        clienteCpf: this.clienteCpf,
        produtos: this.produtosNome,
        data: this.data
      });

      logger.info("Pedido criado com sucesso");
      client.close();

    } catch (error) {
        logger.error("Erro ao inserir pedido", error);
    }
  }

  static async buscarPedidos() {
    try {
      const { db, client } = await connect();
      const result = await db.collection("pedidos").find().toArray();
      client.close();
      return result;

    } catch (error) {
        logger.error(`Erro ao buscar pedidos: ${error.message}`);
    }
  }

  static async atualizarPedido(notaFiscal, dados) {
    try {
      const { db, client } = await connect();
      const collection = db.collection("pedidos");

      const existente = await collection.findOne({ _id: notaFiscal });
      if (!existente) {
        throw new Error("Pedido não encontrado");
      }

      const result = await collection.updateOne(
        { _id: notaFiscal },
        { $set: dados }
      );

      client.close();
      logger.info(`Pedido ${notaFiscal} atualizado com sucesso.`);
      return result;

    } catch (error) {
      logger.error(`Erro ao atualizar pedido: ${error.message}`);
    }
  }

  static async deletarPedido(notaFiscal) {
    try {
      const { db, client } = await connect();
      const collection = db.collection("pedidos");

      const result = await collection.deleteOne({ _id: notaFiscal });
      if (result.deletedCount === 0) {
        throw new Error("Pedido não encontrado");
      }

      client.close();
      logger.info(`Pedido ${notaFiscal} excluído com sucesso.`);
      return result;

    } catch (error) {
      logger.error(`Erro ao deletar pedido: ${error.message}`);
    }
  }
}

module.exports = Pedido;