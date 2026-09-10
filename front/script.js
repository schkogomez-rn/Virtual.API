// A API é entregue pelo mesmo servidor do front-end.
const url = "/api/produtos";

/**
 * Função auxiliar para renderizar os produtos na tela
 */
function renderizarProdutos(produtos) {
    const lista = document.getElementById("lista-produtos");
    lista.innerHTML = ""; // Limpa a lista antes de renderizar

    if (!produtos || produtos.length === 0) {
        lista.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }

    // Percorremos os produtos e criamos os cards na tela
    produtos.forEach((produto) => {
        const card = document.createElement("div");
        card.className = "produto-card";
        card.innerHTML = `
            <h3>#${produto.id} - ${produto.nome}</h3>
            <p class="preco">R$ ${Number(produto.preco).toFixed(2)}</p>
            <p>${produto.descricao || ""}</p>
            <button class="btn-excluir" onclick="excluirProduto(${produto.id})">Excluir</button>
        `;
        lista.appendChild(card);
    });
}

/**
 * 1. BUSCAR TODOS OS PRODUTOS (GET)
 */
async function buscarProdutos() {
    try {
        console.log("Buscando produtos na API...");

        const resposta = await fetch(url);
        const produtos = await resposta.json();

        renderizarProdutos(produtos);
        console.log("Produtos carregados com sucesso:", produtos);
    } catch (erro) {
        console.error("Ops, não conseguimos buscar os produtos:", erro.message);
        const lista = document.getElementById("lista-produtos");
        lista.innerHTML = "<p style='color: red;'>Erro ao conectar com o servidor. Verifique se o backend está ligado.</p>";
    }
}

/**
 * 2. BUSCAR PRODUTO ESPECÍFICO POR ID (GET)
 */
async function buscarProdutoPorId() {
    const idInput = document.getElementById("busca-id");
    const id = idInput.value.trim();

    if (!id) {
        alert("Por favor, digite o ID do produto para buscar.");
        return;
    }

    try {
        console.log(`Buscando produto com ID ${id}...`);
        const resposta = await fetch(`${url}/${id}`);

        if (resposta.status === 404) {
            const lista = document.getElementById("lista-produtos");
            lista.innerHTML = `<p style='color: red;'>Produto com ID ${id} não encontrado.</p>`;
            return;
        }

        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.statusText}`);
        }

        const produto = await resposta.json();
        renderizarProdutos([produto]);
        console.log("Produto encontrado:", produto);
    } catch (erro) {
        console.error("Ops, não conseguimos buscar o produto:", erro.message);
        const lista = document.getElementById("lista-produtos");
        lista.innerHTML = "<p style='color: red;'>Erro ao buscar o produto no servidor.</p>";
    }
}

/**
 * 3. SALVAR NOVO PRODUTO (POST)
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

/**
 * 4. EXCLUIR PRODUTO (DELETE)
 */
async function excluirProduto(id) {
    const confirmacao = confirm(`Deseja realmente excluir o produto #${id}?`);
    if (!confirmacao) return;

    try {
        console.log(`Excluindo produto com ID ${id}...`);
        const resposta = await fetch(`${url}/${id}`, {
            method: "DELETE"
        });

        if (resposta.ok) {
            console.log(`Produto ${id} excluído com sucesso!`);
            alert("Produto excluído com sucesso!");

            const idInput = document.getElementById("busca-id");
            if (idInput && idInput.value == id) {
                idInput.value = "";
            }

            await buscarProdutos(); // Atualiza a lista na tela
        } else {
            const erroData = await resposta.json().catch(() => ({}));
            alert(erroData.mensagem || "Erro ao excluir o produto.");
        }
    } catch (erro) {
        console.error("Erro ao excluir produto:", erro.message);
        alert("Erro ao conectar com o servidor para excluir o produto.");
    }
}

// Botões de buscar e listar
const btnBuscar = document.getElementById("btn-buscar");
if (btnBuscar) {
    btnBuscar.addEventListener("click", buscarProdutoPorId);
}

const btnListar = document.getElementById("btn-listar");
if (btnListar) {
    btnListar.addEventListener("click", () => {
        const idInput = document.getElementById("busca-id");
        if (idInput) idInput.value = "";
        buscarProdutos();
    });
}

const inputBuscaId = document.getElementById("busca-id");
if (inputBuscaId) {
    inputBuscaId.addEventListener("keypress", function (evento) {
        if (evento.key === "Enter") {
            evento.preventDefault();
            buscarProdutoPorId();
        }
    });
}

// Executa a busca de produtos assim que a página abre
buscarProdutos();
