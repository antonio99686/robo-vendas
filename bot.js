const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({

    authStrategy: new LocalAuth(),

    puppeteer: {
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox"
        ]
    }

});


// QR CODE
client.on("qr", (qr) => {

    console.log("📱 Escaneie o QR Code com o WhatsApp:");

    qrcode.generate(qr, {
        small: true
    });

});


// CONECTADO
client.on("ready", () => {

    console.log("");
    console.log("=================================");
    console.log("🤖 ROBÔ DE VENDAS");
    console.log("✅ WHATSAPP CONECTADO!");
    console.log("=================================");
    console.log("");

});


// MENSAGENS
client.on("message", async (msg) => {

    const texto = msg.body.toLowerCase().trim();

    console.log("Mensagem:", texto);


    if (texto === "oi" || texto === "olá" || texto === "ola") {

        await msg.reply(
`👋 Olá! Seja bem-vindo!

🤖 Sou o assistente virtual da nossa loja.

Digite:

*menu* - Ver opções
*produtos* - Ver produtos
*atendente* - Falar com atendente`
        );

        return;
    }


    if (texto === "menu") {

        await msg.reply(
`🛒 *MENU*

1️⃣ Produtos
2️⃣ Promoções
3️⃣ Atendente

Digite *produtos* para ver nossos produtos.`
        );

        return;
    }


    if (texto === "atendente") {

        await msg.reply(
`👨‍💼 Vou encaminhar você para um atendente.

Aguarde um momento.`
        );

        return;
    }

});


// INICIAR
client.initialize();