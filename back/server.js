const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_PATH = path.join(__dirname, '..', 'front');

// Mantém a API disponível também caso o front seja aberto em outra origem.
app.use(cors());
app.use(express.json());
app.use(express.static(FRONTEND_PATH));

// 1. Ler dados do banco - Listar produtos (GET)
app.get('/api/produtos', (req, res) => {
    const sql = 'SELECT * FROM produtos ORDER BY id ASC';

    pool.query(sql, (erro, resultado) => {
        if (erro) {
            console.error('Erro ao buscar produtos:', erro);
            return res.status(500).json({ erro: 'Erro ao buscar produtos no banco de dados' });
        }
        res.json(resultado.rows);
    });
});

// 2. Buscar produto específico por ID (GET)
app.get('/api/produtos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM produtos WHERE id = $1';

    pool.query(sql, [id], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao buscar produto por ID:', erro);
            return res.status(500).json({ erro: 'Erro ao buscar produto no banco de dados' });
        }
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }
        res.json(resultado.rows[0]);
    });
});

// 3. Inserir novo produto no banco (POST)
app.post('/api/produtos', (req, res) => {
    const { nome, preco, descricao } = req.body;

    if (!nome?.trim() || !descricao?.trim() || !Number.isFinite(Number(preco)) || Number(preco) < 0) {
        return res.status(400).json({ erro: 'Informe nome, preço válido e descrição.' });
    }

    const sql = 'INSERT INTO produtos (nome, preco, descricao) VALUES ($1, $2, $3) RETURNING *';

    pool.query(sql, [nome.trim(), Number(preco), descricao.trim()], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao cadastrar produto:', erro);
            return res.status(500).json({ erro: 'Erro ao cadastrar produto no banco de dados' });
        }
        res.status(201).json(resultado.rows[0]);
    });
});

// 4. Excluir produto por ID (DELETE)
app.delete('/api/produtos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM produtos WHERE id = $1 RETURNING *';

    pool.query(sql, [id], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao excluir produto:', erro);
            return res.status(500).json({ erro: 'Erro ao excluir produto no banco de dados' });
        }
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }
        res.json({ mensagem: 'Produto excluído com sucesso!', produto: resultado.rows[0] });
    });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});
