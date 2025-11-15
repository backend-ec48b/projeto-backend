const Produto = require('../model/Produto');
const logger = require('../logger');

async function getProduto(nome) {
    try {
        const todosProdutos = await Produto.buscarTodosProdutos();
        return todosProdutos.find(p => p.nome === nome);
    } catch (error) {
        logger.error(`Erro na busca auxiliar de produto: ${error.message}`);
        return null;
    }
}

class ProdutoController {

    async listar(req, res) {
        logger.info('Listando todos os produtos');
        try {
            const produtos = await Produto.buscarTodosProdutos();
            res.render('produtos/list', {
                produtos: produtos,
                title: 'Lista de Produtos',
                is_admin: req.session.usuario && req.session.usuario.perfil === 'administrador'
            });
        } catch (error) {
            logger.error(`Erro ao listar produtos: ${error.message}`);
            res.status(500).send(`Erro ao listar produtos: ${error.message}`);
        }
    }

    exibirFormulario(req, res) {
        if (!req.session.usuario || req.session.usuario.perfil !== 'administrador') {
            return res.status(403).send('Acesso negado. Apenas administradores podem cadastrar produtos.');
        }
        res.render('produtos/form', {
            title: 'Criar Novo Produto'
        });
    }

    async inserir(req, res) {
        if (!req.session.usuario || req.session.usuario.perfil !== 'administrador') {
            return res.status(403).send('Acesso negado. Apenas administradores podem inserir produtos.');
        }
        const {
            nome,
            preco
        } = req.body;

        try {
            if (!nome || !preco) {
                logger.warn('Nome ou preço do produto não fornecidos.');
                throw new Error("Nome e preço são obrigatórios.");
            }

            const novoProduto = new Produto(nome, parseFloat(preco));
            await novoProduto.inserirProdutos();

            res.redirect('/produtos');

        } catch (error) {
            logger.error(`Erro ao inserir produto ${nome}: ${error.message}`);
            res.render('produtos/form', {
                title: 'Criar Novo Produto',
                error: error.message,
                dadosAnteriores: req.body
            });
        }
    }

    async buscarDetalhes(req, res) {
        const nomeProduto = req.params.nome;

        try {
            const produto = await getProduto(nomeProduto);

            if (!produto) {
                return res.status(404).render('404', {
                    message: 'Produto não encontrado.'
                });
            }

            res.render('produtos/detail', {
                item: produto,
                title: `Detalhe do Produto: ${nomeProduto}`
            });

        } catch (error) {
            logger.error(`Erro ao buscar produto: ${error.message}`);
            res.status(500).send(`Erro ao buscar produto: ${error.message}`);
        }
    }

    async exibirEdicao(req, res) {
        if (!req.session.usuario || req.session.usuario.perfil !== 'administrador') {
            return res.status(403).send('Acesso negado. Apenas administradores podem editar produtos.');
        }
        const nomeProduto = req.params.nome;

        try {
            const produto = await getProduto(nomeProduto);

            if (!produto) {
                logger.warn(`Produto ${nomeProduto} não encontrado para edição.`);
                return res.status(404).render('404', {
                    message: 'Produto para edição não encontrado.'
                });
            }

            res.render('produtos/form', {
                item: produto,
                title: `Editar Produto: ${nomeProduto}`
            });
        } catch (error) {
            logger.error(`Erro ao buscar produto para edição: ${error.message}`);
            res.status(500).send(`Erro ao buscar produto para edição: ${error.message}`);
        }
    }

    async atualizar(req, res) {
        if (!req.session.usuario || req.session.usuario.perfil !== 'administrador') {
            return res.status(403).send('Acesso negado. Apenas administradores podem atualizar produtos.');
        }
        const nomeOriginal = req.params.nome;
        const dadosAtualizacao = req.body;
        const {
            nome,
            preco
        } = dadosAtualizacao;

        try {
            if (!nome || !preco) {
                logger.warn(`Validação de atualização falhou para "${nomeOriginal}": Nome e preço são obrigatórios.`);
                throw new Error("Nome e preço são obrigatórios.");
            }

            await Produto.atualizarProdutos(nomeOriginal, dadosAtualizacao);

            res.redirect('/produtos');

        } catch (error) {
            logger.error(`Erro ao atualizar produto "${nomeOriginal}": ${error.message}`);
            const item = {
                ...dadosAtualizacao,
                nome: nomeOriginal
            };
            
            res.render('produtos/form', {
                item: item,
                error: error.message,
                title: `Erro ao Editar Produto: ${nomeOriginal}`
            });
        }
    }

    async deletar(req, res) {
        if (!req.session.usuario || req.session.usuario.perfil !== 'administrador') {
            return res.status(403).send('Acesso negado. Apenas administradores podem deletar produtos.');
        }
        const nomeProduto = req.params.nome;

        try {
            await Produto.deletarProdutos(nomeProduto);

            logger.info(`Produto ${nomeProduto} deletado com sucesso.`);
            res.redirect('/produtos');

        } catch (error) {
            logger.error(`Erro ao deletar produto ${nomeProduto}: ${error.message}`);
            res.status(500).send(`Erro ao deletar produto ${nomeProduto}: ${error.message}`);
        }
    }
}

module.exports = new ProdutoController();