const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 3000;

// Habilita o CORS para permitir requisições vindas do front-end
app.use(cors());
app.use(express.json());

// 1. Ler dados do banco - Listar produtos (GET)
app.get('/produtos', (req, res) => {
    const sql = 'SELECT * FROM produtos ORDER BY id ASC';

    pool.query(sql, (erro, resultado) => {
        if (erro) {
            console.error('Erro ao buscar produtos:', erro);
            return res.status(500).json({ erro: 'Erro ao buscar produtos no banco de dados' });
        }
        res.json(resultado.rows);
    });
});

// 2. Inserir novo produto no banco (POST)
app.post('/produtos', (req, res) => {
    const { nome, preco, descricao } = req.body;
    const sql = 'INSERT INTO produtos (nome, preco, descricao) VALUES ($1, $2, $3) RETURNING *';

    pool.query(sql, [nome, preco, descricao], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao cadastrar produto:', erro);
            return res.status(500).json({ erro: 'Erro ao cadastrar produto no banco de dados' });
        }
        res.status(201).json(resultado.rows[0]);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});