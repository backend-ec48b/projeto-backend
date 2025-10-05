const connect = require("../db/connection");

class Pedido {
  constructor(notaFiscal, clienteCpf, produtosNome) {
    this._id = notaFiscal;           
    this.clienteCpf = clienteCpf;    
    this.produtosNome = produtosNome;        
    this.data = new Date();          
  }

  async inserirPedido() {
    try {
      if (!this._id) {
        throw new Error();
      }

      const { db, client } = await connect();
      const collection = db.collection("pedidos");

      const existente = await collection.findOne({ _id: this._id });
      if (existente) {
        throw new Error();
      }

      await collection.insertOne({
        _id: this._id,
        clienteCpf: this.clienteCpf,
        produtos: this.produtosNome,
        data: this.data
      });

      console.log("Pedido inserido com sucesso");
      client.close();
    } catch (err) {
      console.error("Erro ao inserir pedido");
    }
  }

  static async buscarPedidos() {
    try {
      const { db, client } = await connect();
      const result = await db.collection("pedidos").find().toArray();
      client.close();
      return result;
    } catch (err) {
      console.error("Erro ao buscar pedidos");
    }
  }

  static async atualizarPedido(notaFiscal, dados) {
    try {
      const { db, client } = await connect();
      const collection = db.collection("pedidos");

      const existente = await collection.findOne({ _id: notaFiscal });
      if (!existente) {
        throw new Error();
      }

      const result = await collection.updateOne(
        { _id: notaFiscal },
        { $set: dados }
      );

      client.close();
      console.log("Pedido atualizado");
      return result;
    } catch (err) {
      console.error("Erro ao atualizar pedido");
    }
  }

  static async deletarPedido(notaFiscal) {
    try {
      const { db, client } = await connect();
      const collection = db.collection("pedidos");

      const result = await collection.deleteOne({ _id: notaFiscal });
      if (result.deletedCount === 0) {
        throw new Error();
      }

      client.close();
      console.log("Pedido deletado");
      return result;
    } catch (err) {
      console.error("Erro ao deletar pedido");
    }
  }
}

module.exports = Pedido;