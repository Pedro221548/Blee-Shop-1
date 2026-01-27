
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 999,
    name: "Produto Teste Mercado Pago",
    description: "Item simbólico para testar o fluxo de pagamento e cálculo de frete. Valor real de apenas 1 Real.",
    price: 1.00,
    category: "Testes",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&h=600&auto=format&fit=crop",
    rating: 5.0,
    reviews: 0,
    width: 15,
    height: 5,
    length: 15,
    weight: 0.1,
    mlUrl: "https://www.mercadolivre.com.br"
  },
  {
    id: 1,
    name: "Headphone Premium Wireless",
    description: "Som cristalino com cancelamento de ruído ativo e 40 horas de bateria.",
    price: 1299.90,
    category: "Eletrônicos",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&h=600&auto=format&fit=crop",
    rating: 4.8,
    reviews: 124,
    mlUrl: "https://www.mercadolivre.com.br",
    shopeeUrl: "https://shopee.com.br",
    width: 20,
    height: 10,
    length: 20,
    weight: 0.8
  },
  {
    id: 2,
    name: "Smartwatch Sport V2",
    description: "Monitoramento de saúde avançado, GPS integrado e resistência à água 5ATM.",
    price: 899.00,
    category: "Acessórios",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&h=600&auto=format&fit=crop",
    rating: 4.5,
    reviews: 89,
    mlUrl: "https://www.mercadolivre.com.br",
    shopeeUrl: "https://shopee.com.br",
    width: 12,
    height: 8,
    length: 12,
    weight: 0.3
  }
];
