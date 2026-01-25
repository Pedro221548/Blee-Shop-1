
import React, { useState } from 'react';
// Import Link from react-router-dom to handle internal navigation
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Twitter, Facebook, ExternalLink, Camera, Zap, Heart, ZoomIn, X } from 'lucide-react';

const PORTFOLIO_IMAGES = [
  { id: 1, title: 'Action Figure Master', category: '3D Printing', url: 'https://images.unsplash.com/photo-1560762484-813fc97650a0?q=80&w=800&auto=format&fit=crop' },
  { id: 2, title: 'Caneca Gamer Blee', category: 'Canecas', url: 'https://images.unsplash.com/photo-1514228742587-6b1558fbed20?q=80&w=800&auto=format&fit=crop' },
  { id: 3, title: 'Suporte Tech Minimalista', category: '3D Printing', url: 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?q=80&w=800&auto=format&fit=crop' },
  { id: 4, title: 'Caneca Galáxia', category: 'Canecas', url: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?q=80&w=800&auto=format&fit=crop' },
  { id: 5, title: 'Vaso Orgânico 3D', category: '3D Printing', url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=800&auto=format&fit=crop' },
  { id: 6, title: 'Kit Escritório Blee', category: 'Personalizados', url: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?q=80&w=800&auto=format&fit=crop' },
];

const ProductsGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all">
            <X size={32} />
          </button>
          <img 
            src={selectedImage} 
            alt="Trabalho Blee" 
            className="max-w-full max-h-full rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Hero Header */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black bg-amber-400 text-gray-900 uppercase tracking-widest mb-6 shadow-sm">
            <Camera size={14} className="mr-2" /> Portifólio de Criação
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">
            Trabalhos <span className="text-amber-500">Recentes.</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Dê uma olhada no que as nossas impressoras e prensas têm produzido ultimamente. Cada item é uma peça única de tecnologia e arte.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PORTFOLIO_IMAGES.map((img) => (
            <div 
              key={img.id} 
              className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-zoom-in"
              onClick={() => setSelectedImage(img.url)}
            >
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="text-white" size={32} />
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900">
                    {img.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                  {img.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Media Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">Siga o Voo da Blee</h2>
            <p className="text-gray-400 font-medium mb-12">Fique por dentro das novidades, bastidores e sorteios exclusivos nas nossas redes.</p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-amber-400 hover:text-gray-900 p-5 rounded-3xl transition-all group"
              >
                <Instagram size={28} />
                <span className="block mt-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Instagram</span>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-red-500 p-5 rounded-3xl transition-all group"
              >
                <Youtube size={28} />
                <span className="block mt-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">YouTube</span>
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-black p-5 rounded-3xl transition-all group"
              >
                <div className="w-7 h-7 flex items-center justify-center font-black">TK</div>
                <span className="block mt-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">TikTok</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 text-center mt-12">
        <div className="inline-flex items-center space-x-2 text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-4">
          <Zap size={14} className="text-amber-500" />
          <span>Inspirado por algum trabalho?</span>
        </div>
        <br />
        <Link 
          to="/dashboard" 
          className="text-amber-600 font-black text-xl hover:text-amber-700 underline underline-offset-8 decoration-amber-200 hover:decoration-amber-500 transition-all"
        >
          Peça seu portifólio agora
        </Link>
      </section>
    </div>
  );
};

export default ProductsGallery;
