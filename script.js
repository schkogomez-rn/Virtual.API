// A URL da nossa API
const url = "http://localhost:3000/produtos";

/**
 * 1. BUSCAR PRODUTOS (GET)
 * 1. Comece sua função com async
 * 2. Use o fetch para ir buscar os dados na API
 * 3. Coloque o await antes do fetch para garantir que o código só vai continuar quando os dados chegarem na sua mão!
 */
async function buscarProdutos() {
    try {
        console.log("Buscando produtos na API...");

        // 1. O 'await' pausa o código aqui até a API responder
        const resposta = await fetch(url);

        // 2. O 'await' pausa novamente até converter a resposta em JSON
        const produtos = await resposta.json();

        // 3. Pegamos a div no HTML onde os produtos serão inseridos
        const lista = document.getElementById("lista-produtos");
        lista.innerHTML = ""; // Limpa a lista antes de renderizar

        // 4. Se não houver produtos, exibe uma mensagem amigável
        if (produtos.length === 0) {
            lista.innerHTML = "<p>Nenhum produto cadastrado ainda.</p>";
            return;
        }

        // 5. Percorremos os produtos e criamos os cards na tela
        produtos.forEach((produto) => {
            const card = document.createElement("div");
            card.className = "produto-card";
            card.innerHTML = `
                <h3>${produto.nome}</h3>
                <p class="preco">R$ ${Number(produto.preco).toFixed(2)}</p>
                <p>${produto.descricao || ""}</p>
            `;
            lista.appendChild(card);
        });

        console.log("Produtos carregados com sucesso:", produtos);
    } catch (erro) {
        console.error("Ops, não conseguimos buscar os produtos:", erro.message);
        const lista = document.getElementById("lista-produtos");
        lista.innerHTML = "<p style='color: red;'>Erro ao conectar com o servidor. Verifique se o backend está ligado.</p>";
    }
}

/**
 * 2. SALVAR NOVO PRODUTO (POST)
 */
const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault(); // Impede o recarregamento da página

    // Pega os valores digitados nos inputs
    const nome = document.getElementById("nome").value;
    const preco = document.getElementById("preco").value;
    const descricao = document.getElementById("descricao").value;

    const novoProduto = {
        nome: nome,
        preco: parseFloat(preco),
        descricao: descricao
    };

    try {
        console.log("Enviando novo produto para a API...", novoProduto);

        // O 'await' pausa até o POST ser enviado e respondido
        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoProduto)
        });

        if (resposta.ok) {
            console.log("Produto cadastrado com sucesso!");
            formulario.reset(); // Limpa os campos do formulário
            await buscarProdutos(); // Atualiza a lista na tela automaticamente
        } else {
            console.error("Erro ao salvar produto:", resposta.statusText);
        }
    } catch (erro) {
        console.error("Erro ao cadastrar produto:", erro.message);
    }
});

// Executa a busca de produtos assim que a página abre
buscarProdutos();