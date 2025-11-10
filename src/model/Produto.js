const connect = require("../connection");
const logger = require("../logger");

class Produto {
    constructor(nome, preco) {
        this.nome = nome;
        this.preco = preco;
    }

    static async contarAtivos() {
        let client;
        try {
            const dbConnection = await connect();
            const db = dbConnection.db;
            client = dbConnection.client;
            
            const count = await db.collection("produtos").countDocuments({
                ativo: true
            });
            return count;

        } catch (error) {
            logger.error(`Erro ao contar produtos ativos: ${error.message}`);
            return 0;
        } finally {
            if (client) client.close();
        }
    }

    async inserirProdutos() {
        let client;
        try {
            if (!this.nome || !this.preco) {
                throw new Error("Campos obrigatórios: nome e preço");
            }

            const dbConnection = await connect();
            const db = dbConnection.db;
            client = dbConnection.client;
            const collection = db.collection("produtos");
            
            await collection.insertOne({
                nome: this.nome,
                preco: this.preco
            })
            
            logger.info(`Produto '${this.nome}' inserido com sucesso`);

        } catch (error) {
            logger.error(`Erro ao inserir produto: ${error.message}`);
            throw error; 
        } finally {
            if (client) client.close();
        }
    }

    static async buscarTodosProdutos() {
        let client;
        try {
            const dbConnection = await connect();
            const db = dbConnection.db;
            client = dbConnection.client;
            
            const result = await db.collection("produtos").find().toArray();
            return result;

        } catch (error) {
            logger.error(`Erro ao buscar produtos: ${error.message}`);
            throw error; 
        } finally {
            if (client) client.close();
        }
    }

    static async atualizarProdutos(nome, dados) {
        let client;
        try {
            const dbConnection = await connect();
            const db = dbConnection.db;
            client = dbConnection.client;
            const collection = db.collection("produtos");

            const result = await collection.updateOne({
                nome: nome
            }, {
                $set: dados
            });

            if (result.modifiedCount === 0) {
                throw new Error("Produto não encontrado");
            }
            
            logger.info(`Produto '${nome}' atualizado com sucesso`);
            return result;

        } catch (error) {
            logger.error(`Erro ao atualizar produto: ${error.message}`);
            throw error; 
        } finally {
            if (client) client.close();
        }
    }

    static async deletarProdutos(nome) {
        let client;
        try {
            const dbConnection = await connect();
            const db = dbConnection.db;
            client = dbConnection.client;
            const collection = db.collection("produtos");

            const result = await collection.deleteOne({
                nome: nome
            });

            if (result.deletedCount === 0) {
                throw new Error("Produto não encontrado");
            }

            logger.info(`Produto '${nome}' deletado com sucesso`);
            return result;

        } catch (error) {
            logger.error(`Erro ao deletar produto: ${error.message}`);
            throw error; 
        } finally {
            if (client) client.close();
        }
    }
}

module.exports = Produto;