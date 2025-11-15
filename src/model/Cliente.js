const connect = require("../connection");
const logger = require("../logger");

class Cliente {
    constructor(cpf, nome, email, endereco, senha, perfil = 'cliente') {
        this._id = cpf; 
        this.nome = nome;
        this.email = email;
        this.endereco = endereco;
        this.senha = senha;      
        this.perfil = perfil;    
    }

    static async buscarPorCpf(cpf) {
        let client;
        try {
            const { db, client: dbClient } = await connect();
            client = dbClient;
            
            const result = await db.collection("clientes").findOne({ _id: cpf });

            return result; 

        } catch (error) {
            logger.error(`Erro ao buscar cliente por CPF: ${error.message}`);
            throw error; 
        } finally {
            if (client) client.close();
        }
    }
    
    async inserirCliente() {
        let client;
        try {
            if (!this._id || this._id.length < 11) {
                throw new Error("CPF inválido.");
            }
            if (!this.senha) {
                throw new Error("Senha é obrigatória.");
            }

            const { db, client: dbClient } = await connect();
            client = dbClient;
            const collection = db.collection("clientes");
            
            const existente = await collection.findOne({ _id: this._id });
            if (existente) {
                throw new Error("Cliente já cadastrado");
            }
            
            await collection.insertOne({
                _id: this._id,
                nome: this.nome || 'Não Informado',
                email: this.email || 'Não Informado',
                endereco: this.endereco || 'Não Informado',
                senha: this.senha,     
                perfil: this.perfil,    
            });

            logger.info(`Cliente inserido com sucesso: ${this.nome} (${this._id}), Perfil: ${this.perfil}`);

        } catch (error) {
            logger.error(`Erro ao criar cliente: ${error.message}`);
            throw error;
        } finally {
            if (client) client.close();
        }
    }


    static async contarTotal() {
        let client;
        try {
            const { db, client: dbClient } = await connect();
            client = dbClient;
            const count = await db.collection("clientes").countDocuments({});
            return count;

        } catch (error) {
            logger.error(`Erro ao contar clientes: ${error.message}`);
            return 0; 
        } finally {
            if (client) client.close();
        }
    }

    static async buscarCliente() {
        let client;
        try {
            const { db, client: dbClient } = await connect();
            client = dbClient;
            
            const result = await db.collection("clientes")
                .find({}, { projection: { senha: 0 } }) 
                .toArray(); 
            return result;

        } catch (error) {
            logger.error(`Erro ao buscar clientes: ${error.message}`);
            throw error;
        } finally {
            if (client) client.close();
        }
    }

    static async atualizarCliente(cpf, dados) {
        let client;
        try {
            const { db, client: dbClient } = await connect();
            client = dbClient;
            const collection = db.collection("clientes");

            const existente = await collection.findOne({ _id: cpf });
            if (!existente) {
                throw new Error("Cliente não encontrado");
            }
            
            const result = await collection.updateOne({ _id: cpf }, { $set: dados });

            logger.info(`Cliente atualizado com sucesso: ${cpf}`);
            return result;

        } catch (error) {
            logger.error(`Erro ao atualizar cliente: ${error.message}`);
            throw error;
        } finally {
            if (client) client.close();
        }
    }

    static async deletarCliente(cpf) {
        let client;
        try {
            const { db, client: dbClient } = await connect();
            client = dbClient;
            const collection = db.collection("clientes");

            const result = await collection.deleteOne({ _id: cpf });
            
            if (result.deletedCount === 0) {
                throw new Error("Cliente não encontrado");
            }
            
            logger.info(`Cliente deletado com sucesso: ${cpf}`);
            return result;

        } catch (error) {
            logger.error(`Erro ao deletar cliente: ${error.message}`);
            throw error; 
        } finally {
            if (client) client.close();
        }
    }
}

module.exports = Cliente;