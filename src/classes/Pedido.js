const connect = require("../db/connection");

class Pedido {
  constructor(notaFiscal, clienteCpf, produtos) {
    this._id = notaFiscal;           
    this.clienteCpf = clienteCpf;    
    this.produtos = produtos;        
    this.data = new Date();          
  }

  async inserirPedido() {
    try {
      const { db, client } = await connect();
      const collection = db.collection("pedidos");

      await collection.insertOne({
        _id: this._id,
        clienteCpf: this.clienteCpf,
        produtos: this.produtos,
        data: this.data
      });

      console.log("Pedido inserido com sucesso");
      client.close();
    } catch (err) {
      console.error("Erro ao inserir pedido", err);
    }
  }

  static async buscarPedidos() {
    try {
      const { db, client } = await connect();
      const result = await db.collection("pedidos").find().toArray();
      client.close();
      return result;
    } catch (err) {
      console.error("Erro ao buscar pedidos", err);
    }
  }

  static async atualizarPedido(notaFiscal, dados) {
    try {
      const { db, client } = await connect();
      const collection = db.collection("pedidos");

      const result = await collection.updateOne(
        { _id: notaFiscal },
        { $set: dados }
      );

      client.close();
      console.log("Pedido atualizado", result);
      return result;
    } catch (err) {
      console.error("Erro ao atualizar pedido", err);
    }
  }

  static async deletarPedido(notaFiscal) {
    try {
      const { db, client } = await connect();
      const collection = db.collection("pedidos");

      const result = await collection.deleteOne({ _id: notaFiscal });
      client.close();
      console.log("Pedido deletado", result);

      return result;
    } catch (err) {
      console.error("Erro ao deletar pedido", err);
    }
  }
}

module.exports = Pedido;