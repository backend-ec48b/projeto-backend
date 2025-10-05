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
            console.error("Erro ao inserir produto", err);
        }
    }

    static async buscarTodosProdutos() {
        try {
            const { db, client } = await connect();
            const result = await db.collection("produtos").find().toArray();
            client.close();
            return result;
        } catch (err) {
            console.error("Erro ao buscar produtos", err);
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

            client.close();
            console.log("Produto atualizado:", result);
            return result;

        } catch (err) {
            console.error("Erro ao atualizar produto", err);
        }  
    } 
    
    static async deletar(nome) {
        try {
            const { db, client } = await connect();
            const collection = db.collection("produtos");

            const result = await collection.deleteOne({ nome: nome });
            if(!nome){
                console.log("Produto não encontrado");
                return
            }
            client.close();
            console.log("Produto deletado:", result);

            return result;
        } catch (err) {
            console.error("Erro ao deletar produto", err);
        }
    }
}

module.exports = Produto;
