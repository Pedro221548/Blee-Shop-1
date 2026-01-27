
import { ShippingOption } from './types';

const MELHOR_ENVIO_TOKEN = 'oltW9NvTntgmmrb3WwaCPqd9chkEcKgAwNqmGSts';
const STORE_ORIGIN_CEP = '01001000'; // Exemplo: São Paulo Centro

interface ShipmentItem {
  id: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  insurance_value: number;
  quantity: number;
}

/**
 * Calcula frete real via Melhor Envio com Fallback Instantâneo e Dimensões Dinâmicas
 */
export async function calculateShippingRates(
  cep: string, 
  items: ShipmentItem[] = []
): Promise<ShippingOption[]> {
  const cleanCep = (cep || '').replace(/\D/g, '');
  if (cleanCep.length < 8) throw new Error("CEP Inválido");

  // Se nenhum item for passado, usamos um padrão mínimo para evitar erro
  const shipmentProducts = items.length > 0 ? items : [{
    id: "default",
    width: 15,
    height: 15,
    length: 15,
    weight: 0.3,
    insurance_value: 30.00,
    quantity: 1
  }];

  // Fallback Inteligente
  const getFallbackRates = (multiplier: number) => [
    { id: 'me_sedex', name: 'SEDEX Express', company: 'Correios', price: 22.90 * multiplier, delivery_time: multiplier > 1.2 ? 5 : 2 },
    { id: 'me_jadlog', name: '.Package', company: 'Jadlog', price: 16.50 * multiplier, delivery_time: multiplier > 1.2 ? 8 : 4 }
  ];

  try {
    const response = await fetch('https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MELHOR_ENVIO_TOKEN}`,
        'User-Agent': 'BleeShop Integration'
      },
      body: JSON.stringify({
        "from": { "postal_code": STORE_ORIGIN_CEP },
        "to": { "postal_code": cleanCep },
        "products": shipmentProducts
      })
    });

    if (!response.ok) throw new Error("API Indisponível");

    const data = await response.json();
    
    const validServices = data
      .filter((service: any) => !service.error && service.price)
      .map((service: any) => ({
        id: service.id.toString(),
        name: service.name,
        company: service.company.name,
        price: parseFloat(service.price),
        delivery_time: service.delivery_time
      }));

    if (validServices.length === 0) throw new Error("Vazio");
    return validServices;

  } catch (error) {
    console.warn("[Blee Logística] Utilizando motor de cálculo interno (Fallback).");
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const prefix = parseInt(cleanCep.substring(0, 2)) || 10;
    const multiplier = (prefix >= 1 && prefix <= 19) ? 1 : 1.4;

    return getFallbackRates(multiplier);
  }
}
