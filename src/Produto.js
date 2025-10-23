const connect = require("./connection");
const logger = require("./logger");

class Produto{
    constructor(nome, preco){
        this.nome = nome;
        this.preco = preco;
    }

    async inserirProdutos(){
        try{
            if(!this.nome || !this.preco){
                throw new Error("Campos obrigatórios: nome e preço");
            }

            const { db, client } = await connect();
            const collection = db.collection("produtos");
            await collection.insertOne({
                nome: this.nome,
                preco: this.preco
            })
            logger.info(`Produto '${this.nome}' inserido com sucesso`);
            client.close();

        }catch(error){
            logger.error(`Erro ao inserir produto: ${error.message}`);
        }
    }

    static async buscarTodosProdutos() {
        try {
            const { db, client } = await connect();
            const result = await db.collection("produtos").find().toArray();
            client.close();
            return result;

        } catch (error) {
            logger.error(`Erro ao buscar produtos: ${error.message}`);
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
                throw new Error("Produto não encontrado");
            }

            client.close();
            logger.info(`Produto '${nome}' atualizado com sucesso`);
            return result;

        } catch (error) {
            logger.error(`Erro ao atualizar produto: ${error.message}`);
        }  
    } 
    
    static async deletarProdutos(nome) {
        try {
            const { db, client } = await connect();
            const collection = db.collection("produtos");

            const result = await collection.deleteOne({ nome: nome });

            if(result.deletedCount === 0){
                throw new Error("Produto não encontrado");
            }

            client.close();
            logger.info(`Produto '${nome}' deletado com sucesso`);
            return result;

        } catch (error) {
            logger.error(`Erro ao deletar produto: ${error.message}`);
        }
    }
}

module.exports = Produto;
