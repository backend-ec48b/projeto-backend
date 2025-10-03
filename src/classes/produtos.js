const connectDB = require("../db/connection");

class Produtos {
    constructor() {
        this.collection = "produtos";
    }

    async inserir(produtos) {
        try {
            if (!produtos.nome || !produtos.preco) {
                throw new Error("Campos obrigatórios: nome e preco");
            }
            const db = await connectDB();
            await db.produtos.insertOne(produto);
            console.log("Produto inserido");
        } catch (err) {
            console.error("Erro ao inserir", err);
        }
    }

    async buscar(){
        try {
            const db = await connectDB();
            return await db.produtos.find().toArray();
        } catch (err) {
            console.error("Erro ao buscar produtos", err);
        }
    }

    async atualizar(id, dados) {
        try {
            const db = await connectDB();
            await db.produtos.updateOne(
                { _id: id },
                { $set: dados }
            );
            console.log("Produto atualizado");
        } catch (err) {
            console.error("Erro ao atualizar produto", err);
        }
    }

    async deletar(id) {
        try {
            const db = await connectDB();
            await db.produtos.deleteOne({ _id: id });
            console.log("Produto deletado");
        } catch (err) {
            console.error("Erro ao deletar produto", err);
        }
    }
}

module.exports = Produtos;