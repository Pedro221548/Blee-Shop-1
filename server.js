
/**
 * EXEMPLO DE BACKEND NODE.JS (EXPRESS)
 * 
 * Requisitos:
 * npm install express mercadopago cors body-parser
 */

const express = require('express');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// CONFIGURAÇÃO: Access Token de Teste do Usuário
const client = new MercadoPagoConfig({ 
  accessToken: 'TEST-4254129152237411-030503-9ba150eaa55214744a16560ce8ab4d12-493241392' 
});

app.post('/criar-pagamento', async (req, res) => {
  try {
    const { items, shippingPrice, customer } = req.body;

    // Constrói os itens para o Mercado Pago
    const mpItems = [
      ...items.map(item => ({
        id: item.title,
        title: item.title,
        unit_price: Number(item.unit_price),
        quantity: Number(item.quantity),
        currency_id: 'BRL'
      }))
    ];

    // Adiciona o frete como um item de serviço, se houver
    if (shippingPrice > 0) {
      mpItems.push({
        id: 'frete-blee',
        title: 'Frete e Logística Blee Shop',
        unit_price: Number(shippingPrice),
        quantity: 1,
        currency_id: 'BRL'
      });
    }

    const preference = new Preference(client);
    
    const result = await preference.create({
      body: {
        items: mpItems,
        payer: {
          name: customer.name,
          email: customer.email,
        },
        back_urls: {
          success: "https://bleeshop.web.app/#/dashboard",
          failure: "https://bleeshop.web.app/#/cart",
          pending: "https://bleeshop.web.app/#/dashboard"
        },
        auto_return: "approved",
        statement_descriptor: "BLEESHOP",
        payment_methods: {
          installments: 12
        }
      }
    });

    res.json({ preferenceId: result.id });
  } catch (error) {
    console.error("Erro MP:", error);
    res.status(500).json({ error: 'Erro ao gerar preferência de pagamento' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend Blee Shop ativo na porta ${PORT}`);
});
