require("dotenv").config();

const https = require("https");

const SITE_ID = "MLB";

const ACCESS_TOKEN = process.env.MERCADOLIVRE_ACCESS_TOKEN;


// ==========================================
// PESQUISAR MERCADO LIVRE
// ==========================================

function pesquisarMercadoLivre(produto, quantidade = 5) {

    return new Promise((resolve, reject) => {

        if (!ACCESS_TOKEN) {

            reject(
                new Error(
                    "Access Token do Mercado Livre não encontrado no arquivo .env"
                )
            );

            return;
        }


        const termo = encodeURIComponent(produto);

        const caminho =
            `/sites/${SITE_ID}/search?q=${termo}&limit=${quantidade}`;


        const opcoes = {

            hostname: "api.mercadolibre.com",

            path: caminho,

            method: "GET",

            headers: {

                "Authorization": `Bearer ${ACCESS_TOKEN}`,

                "Accept": "application/json"

            }

        };


        const requisicao = https.request(opcoes, (resposta) => {

            let dados = "";


            resposta.on("data", (parte) => {

                dados += parte;

            });


            resposta.on("end", () => {

                try {

                    const resultado = JSON.parse(dados);


                    if (resposta.statusCode !== 200) {

                        console.log("Resposta do Mercado Livre:");

                        console.log(resultado);


                        reject(
                            new Error(
                                `Mercado Livre retornou HTTP ${resposta.statusCode}`
                            )
                        );

                        return;
                    }


                    const produtos = resultado.results.map((produto) => {

                        return {

                            id: produto.id,

                            titulo: produto.title,

                            preco: produto.price,

                            moeda: produto.currency_id,

                            link: produto.permalink,

                            imagem: produto.thumbnail,

                            vendedor:
                                produto.seller?.nickname ||
                                "Não informado",

                            condicao: produto.condition,

                            estoque: produto.available_quantity

                        };

                    });


                    resolve(produtos);


                } catch (erro) {

                    reject(erro);

                }

            });

        });


        requisicao.on("error", (erro) => {

            reject(erro);

        });


        requisicao.end();

    });

}


// ==========================================
// TESTE
// ==========================================

async function testar() {

    console.log("");
    console.log("=================================");
    console.log("🛒 BUSCA MERCADO LIVRE");
    console.log("=================================");
    console.log("");


    try {

        const produtos =
            await pesquisarMercadoLivre("PS5", 5);


        if (produtos.length === 0) {

            console.log("❌ Nenhum produto encontrado.");

            return;
        }


        console.log(
            `✅ ${produtos.length} produtos encontrados!`
        );

        console.log("");


        produtos.forEach((produto, index) => {

            console.log("---------------------------------");

            console.log(`🛒 PRODUTO ${index + 1}`);

            console.log(`📌 ${produto.titulo}`);

            console.log(
                `💰 R$ ${Number(produto.preco).toFixed(2)}`
            );

            console.log(
                `📦 Estoque: ${produto.estoque}`
            );

            console.log(
                `👤 Vendedor: ${produto.vendedor}`
            );

            console.log(
                `🔗 ${produto.link}`
            );

            console.log("---------------------------------");

        });


    } catch (erro) {

        console.log("");

        console.log("❌ ERRO:");

        console.log(erro.message);

        console.log("");

    }

}


// ==========================================
// EXECUTAR TESTE
// ==========================================

if (require.main === module) {

    testar();

}


// ==========================================
// EXPORTAR
// ==========================================

module.exports = {
    pesquisarMercadoLivre
};