
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 401,
    name: "Enfeite De Natal Criativo",
    description: "Deixe sua decoração de Natal mais divertida e única! As bolinhas decorativas com perninhas trazem um toque moderno e lúdico para sua árvore.",
    price: 35.90,
    category: "Decoração",
    image: "https://http2.mlstatic.com/D_Q_NP_727464-MLB80584487693_112024-F.webp",
    rating: 4.8,
    reviews: 12,
    mlUrl: "https://www.mercadolivre.com.br"
  },
  {
    id: 402,
    name: "Marcador De Página Kit C/3",
    description: "Kit com 3 marcadores de livro exclusivos. Design de borboleta em relevo, perfeito para leitores que buscam estilo e organização.",
    price: 24.90,
    category: "Decoração",
    image: "https://http2.mlstatic.com/D_Q_NP_824792-MLB79354714644_092024-F.webp",
    rating: 5.0,
    reviews: 8,
    mlUrl: "https://www.mercadolivre.com.br"
  },
  {
    id: 403,
    name: "Kit 2 Ganchos Para Porta",
    // Fix: removed the invalid property 'padding' and updated 'description' with the more complete text
    description: "Prático gancho duplo para organização de ambientes, ideal para portas sem necessidade de furos. Design minimalista e resistente.",
    price: 42.00,
    category: "Decoração",
    image: "https://http2.mlstatic.com/D_Q_NP_888496-MLB78310156372_082024-F.webp",
    rating: 5.0,
    reviews: 15,
    shopeeUrl: "https://shopee.com.br"
  },
  {
    id: 301,
    name: "Quadro Decorativo Alto Relevo",
    description: "Arte moderna em alto relevo com textura tátil e acabamento premium. Transforma qualquer parede em uma galeria de arte contemporânea.",
    price: 129.90,
    category: "Quadros",
    image: "https://http2.mlstatic.com/D_Q_NP_826339-MLB103628736154_012026-F.webp",
    rating: 5.0,
    reviews: 12,
    mlUrl: "https://www.mercadolivre.com.br"
  },
  {
    id: 201,
    name: "Caneca Blee Original",
    description: "Caneca de cerâmica premium com acabamento brilhante. Design minimalista da nossa colmeia, resistente a micro-ondas e lava-louças.",
    price: 45.90,
    category: "Canecas",
    image: "https://http2.mlstatic.com/D_Q_NP_825003-MLB103723021942_012026-C.webp",
    rating: 4.9,
    reviews: 56,
    mlUrl: "https://www.mercadolivre.com.br"
  },
  {
    id: 101,
    name: "Busto Wandinha Addams",
    description: "Busto ultra detalhado da Wandinha (Wednesday), impresso em resina de alta resolução com acabamento preto fosco acetinado.",
    price: 189.90,
    category: "Action Figures",
    image: "https://http2.mlstatic.com/D_Q_NP_892182-MLB93487725615_092025-F.webp",
    rating: 5.0,
    reviews: 42,
    mlUrl: "https://www.mercadolivre.com.br"
  },
  {
    id: 102,
    name: "Xenomorfo Alien Classic",
    description: "Figura colecionável do Alien Xenomorfo. Detalhes orgânicos impressionantes e base personalizada da nossa oficina.",
    price: 249.00,
    category: "Action Figures",
    image: "https://http2.mlstatic.com/D_Q_NP_813588-MLB93490175283_092025-C.webp",
    rating: 4.9,
    reviews: 28,
    mlUrl: "https://www.mercadolivre.com.br"
  }
];
