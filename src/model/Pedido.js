const connect = require("../connection");
const logger = require("../logger");

class Pedido {
    constructor(notaFiscal, clienteCpf, produtosNome) {
        this._id = notaFiscal;
        this.clienteCpf = clienteCpf;
        this.produtos = produtosNome;
        this.data = new Date();
        // this.status = 'Aguardando Pagamento'; // Opcional
    }

    async inserirPedido() {
        let client;
        try {
            if (!this._id || !this.clienteCpf || !this.produtos) {
                throw new Error("Campos obrigatórios ausentes: nota fiscal, CPF ou produtos.");
            }

            const dbConnection = await connect();
            const db = dbConnection.db;
            client = dbConnection.client;
            const collection = db.collection("pedidos");

            const existente = await collection.findOne({ _id: this._id });
            if (existente) {
                throw new Error("Já existe um pedido com essa nota fiscal.");
            }

            await collection.insertOne({
                _id: this._id,
                clienteCpf: this.clienteCpf,
                produtos: this.produtos,
                data: this.data
            });

            logger.info("Pedido criado com sucesso");

        } catch (error) {
            logger.error(`Erro ao inserir pedido: ${error.message}`);
            throw error;
        } finally {
            if (client) client.close();
        }
    }

    // 🎯 MÉTODO ADICIONADO
    static async buscarPedidosPorCpf(cpf) {
        let client;
        try {
            const dbConnection = await connect();
            const db = dbConnection.db;
            client = dbConnection.client;

            return await db.collection("pedidos").find({ clienteCpf: cpf }).toArray();

        } catch (error) {
            logger.error(`Erro ao buscar pedidos por CPF ${cpf}: ${error.message}`);
            throw error;
        } finally {
            if (client) client.close();
        }
    }

    // 🎯 MÉTODO ADICIONADO
    static async buscarPorNotaFiscal(notaFiscal) {
        let client;
        try {
            const dbConnection = await connect();
            const db = dbConnection.db;
            client = dbConnection.client;

            return await db.collection("pedidos").findOne({ _id: notaFiscal });

        } catch (error) {
            logger.error(`Erro ao buscar pedido por nota fiscal ${notaFiscal}: ${error.message}`);
            throw error;
        } finally {
            if (client) client.close();
        }
    }

    static async buscarPedidos() {
        let client;
        try {
            const dbConnection = await connect();
            const db = dbConnection.db;
            client = dbConnection.client;
            
            return await db.collection("pedidos").find().toArray();

        } catch (error) {
            logger.error(`Erro ao buscar pedidos: ${error.message}`);
            throw error;
        } finally {
            if (client) client.close();
        }
    }

    static async atualizarPedido(notaFiscal, dados) {
        let client;
        try {
            const dbConnection = await connect();
            const db = dbConnection.db;
            client = dbConnection.client;
            const collection = db.collection("pedidos");

            const existente = await collection.findOne({ _id: notaFiscal });
            if (!existente) {
                throw new Error("Pedido não encontrado");
            }

            const result = await collection.updateOne(
                { _id: notaFiscal },
                { $set: dados }
            );

            logger.info(`Pedido ${notaFiscal} atualizado com sucesso.`);
            return result;

        } catch (error) {
            logger.error(`Erro ao atualizar pedido: ${error.message}`);
            throw error;
        } finally {
            if (client) client.close();
        }
    }

    static async deletarPedido(notaFiscal) {
        let client;
        try {
            const dbConnection = await connect();
            const db = dbConnection.db;
            client = dbConnection.client;
            const collection = db.collection("pedidos");

            const result = await collection.deleteOne({ _id: notaFiscal });
            if (result.deletedCount === 0) {
                throw new Error("Pedido não encontrado");
            }

            logger.info(`Pedido ${notaFiscal} excluído com sucesso.`);
            return result;

        } catch (error) {
            logger.error(`Erro ao deletar pedido: ${error.message}`);
            throw error;
        } finally {
            if (client) client.close();
        }
    }
}

module.exports = Pedido;