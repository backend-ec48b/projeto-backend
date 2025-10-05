const connect = require("../db/connection");

class Produto{
    constructor(nome, preco){
        this.nome = nome;
        this.preco = preco;
    }

    async inserirProdutos(){
        try{
            const { db, client } = await connect();
            const collection = db.collection("produtos");
            await collection.insertOne({
                nome: this.nome,
                preco: this.preco
            })
            console.log("Produto inserido com sucesso");
            client.close();
        }catch(error){
            console.error("Erro ao inserir produto");
        }
    }

    static async buscarTodosProdutos() {
        try {
            const { db, client } = await connect();
            const result = await db.collection("produtos").find().toArray();
            client.close();
            return result;
        } catch (err) {
            console.error("Erro ao buscar produtos");
        }
    }

    static async atualizarProdutos(nome, dados) {
        try {
            const { db, client } = await connect();
            const collection = db.collection("produtos");

            const result = await collection.updateOne(
                { nome: nome },
                { $set: dados }
            ); 
            
            if(result.modifiedCount === 0){
                throw new Error();
            }

            client.close();
            console.log("Produto atualizado");
            return result;

        } catch (err) {
            console.error("Erro ao atualizar produto");
        }  
    } 
    
    static async deletarProdutos(nome) {
        try {
            const { db, client } = await connect();
            const collection = db.collection("produtos");

            const result = await collection.deleteOne({ nome: nome });

            if(result.deletedCount === 0){
                throw new Error();
            }

            client.close();
            console.log("Produto deletado");
            return result;
        } catch (err) {
            console.error("Erro ao deletar produto");
        }
    }
}

module.exports = Produto;
