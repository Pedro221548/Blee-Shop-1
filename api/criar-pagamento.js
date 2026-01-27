import { MercadoPagoConfig, Preference } from "mercadopago";

export default async function handler(req, res) {
  // 1. Validação do Método
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método não permitido. Use POST." });
  }

  // 2. Validação do Token
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken || accessToken === "") {
    console.error("ERRO: MP_ACCESS_TOKEN não configurado no ambiente.");
    return res.status(500).json({ 
      error: "Token de acesso não configurado. Verifique as variáveis de ambiente no Vercel.",
      details: "UNAUTHORIZED_ENV_VAR"
    });
  }

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const { items, shipping, customer } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Carrinho vazio." });
    }

    // 3. Formatação dos itens para a API
    const mpItems = items.map(item => ({
      id: String(item.id),
      title: item.name,
      quantity: Number(item.quantity),
      unit_price: Number(item.price), // Garantir que seja Number
      currency_id: "BRL"
    }));

    // Adiciona o frete como um item se houver custo
    if (shipping && shipping.cost > 0) {
      mpItems.push({
        id: "shipping-fee",
        title: "Frete / Entrega",
        quantity: 1,
        unit_price: Number(shipping.cost),
        currency_id: "BRL"
      });
    }

    const preference = new Preference(client);

    // 4. Criação da preferência
    const response = await preference.create({
      body: {
        items: mpItems,
        payer: {
          name: customer?.name || "Cliente Blee",
          email: customer?.email || "comprador@bleeshop.com.br"
        },
        back_urls: {
          success: "https://blee-shop-1.vercel.app/#/pedido-sucesso",
          failure: "https://blee-shop-1.vercel.app/#/pedido-erro",
          pending: "https://blee-shop-1.vercel.app/#/pedido-pendente"
        },
        auto_return: "approved",
        external_reference: `ORDER-${Date.now()}`
      }
    });

    // 5. Retorno do link
    if (response && response.init_point) {
      return res.status(200).json({
        link: response.init_point
      });
    } else {
      throw new Error("Resposta da API do Mercado Pago não contém init_point.");
    }

  } catch (error) {
    // Melhoria sugerida: log detalhado do erro da API
    console.error("Erro completo da API Mercado Pago:", error);
    
    // Tenta extrair a mensagem de erro da resposta oficial do MP
    const errorMsg = error.message || "Erro interno ao processar pagamento.";
    
    return res.status(500).json({
      error: errorMsg,
      code: error.status || 500,
      details: error.cause || null
    });
  }
}