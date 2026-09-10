const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());

const cors = require(`cors`);
app.use(cors());

//Ler dados do banco - Listar produtos - function minhaFuncao()
app.get('/produtos', (req, res)=>{
    const sql = 'select * from produtos';

    pool.query(sql, (erro, resultado) => {
        console.log(resultado);
        console.log(erro);
        res.json(resultado.rows);
    });

});

app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});