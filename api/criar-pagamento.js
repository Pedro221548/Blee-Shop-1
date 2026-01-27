import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {
  // Apenas aceita requisições POST para segurança e envio de dados
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método não permitido. Use POST." });
  }

  try {
    const { items, shipping } = req.body;

    // Mapeia os itens do carrinho para o formato esperado pelo Mercado Pago
    const mpItems = items.map(item => ({
      id: String(item.id),
      title: item.name,
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
      currency_id: "BRL"
    }));

    // Adiciona o frete como um item de serviço, se houver custo calculado
    if (shipping && shipping.cost > 0) {
      mpItems.push({
        id: "shipping-fee",
        title: "Frete / Taxa de Entrega",
        quantity: 1,
        unit_price: Number(shipping.cost),
        currency_id: "BRL"
      });
    }

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: mpItems,
        back_urls: {
          success: "https://blee-shop-1.vercel.app/#/pedido-sucesso",
          failure: "https://blee-shop-1.vercel.app/#/pedido-erro",
          pending: "https://blee-shop-1.vercel.app/#/pedido-pendente"
        },
        auto_return: "approved",
        // Identificador único para conciliação (opcional)
        external_reference: `ORDER-${Date.now()}`
      }
    });

    // Retorna o link oficial do Checkout Pro
    res.status(200).json({
      link: response.init_point
    });

  } catch (error) {
    console.error("Erro MP API:", error);
    res.status(500).json({
      error: error.message
    });
  }
}