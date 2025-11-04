const Produto = require('../model/Produto');

async function getProduto(nome) {
    const todosProdutos = await Produto.buscarTodosProdutos();
    if (todosProdutos) {
        return todosProdutos.find(p => p.nome === nome);
    }
    return null;
}

class ProdutoController {

    async listar(req, res) {
        try {
            const produtos = await Produto.buscarTodosProdutos();
            res.render('produtos/list', {
                produtos: produtos,
                title: 'Lista de Produtos'
            });
        } catch (error) {
            res.status(500).send(`Erro ao listar produtos: ${error.message}`);
        }
    }

    exibirFormulario(req, res) {
        res.render('produtos/form', {
            title: 'Criar Novo Produto'
        });
    }

    // Novo produto == POST /produtos
    async inserir(req, res) {
        const {
            nome,
            preco
        } = req.body;

        try {
            if (!nome || !preco) {
                throw new Error("Nome e preço são obrigatórios.");
            }

            const novoProduto = new Produto(nome, parseFloat(preco));
            await novoProduto.inserirProdutos();

            res.redirect('/produtos');

        } catch (error) {
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
            res.status(500).send(`Erro ao buscar produto: ${error.message}`);
        }
    }

    // Formulário de edição GET == /produtos/:nome/editar
    async exibirEdicao(req, res) {
        const nomeProduto = req.params.nome;

        try {
            const produto = await getProduto(nomeProduto);

            if (!produto) {
                return res.status(404).render('404', {
                    message: 'Produto para edição não encontrado.'
                });
            }

            res.render('produtos/form', {
                item: produto,
                title: `Editar Produto: ${nomeProduto}`
            });
        } catch (error) {
            res.status(500).send(`Erro ao buscar produto para edição: ${error.message}`);
        }
    }

    // Atualização POST == /produtos/:nome
    async atualizar(req, res) {
        const nomeOriginal = req.params.nome;
        const dadosAtualizacao = req.body;

        try {
            await Produto.atualizarProdutos(nomeOriginal, dadosAtualizacao);

            res.redirect('/produtos'); 

        } catch (error) {
            res.render('produtos/form', {
                item: {
                    ...dadosAtualizacao,
                    nome: nomeOriginal
                },
                error: error.message,
                title: `Erro ao Editar Produto: ${nomeOriginal}`
            });
        }
    }

    // Rota POST == /produtos/:nome/deletar
    async deletar(req, res) {
        const nomeProduto = req.params.nome;

        try {
            await Produto.deletarProdutos(nomeProduto);

            res.redirect('/produtos'); 

        } catch (error) {
            res.status(500).send(`Erro ao deletar produto ${nomeProduto}: ${error.message}`);
        }
    }
}

module.exports = new ProdutoController();