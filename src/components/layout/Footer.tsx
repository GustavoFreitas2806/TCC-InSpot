import { MapPin, Instagram, Twitter, Facebook } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Footer() {
  const { navigate } = useApp();

  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <button onClick={() => navigate('home')} className="flex items-center gap-1.5 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center">
                <MapPin size={16} className="text-white" fill="white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                In<span className="text-red-500">Spot</span>
              </span>
            </button>
            <p className="text-sm leading-relaxed text-gray-500">
              O marketplace para encontrar o lugar perfeito para cada rolê, jantar ou comemoração.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('home')} className="hover:text-white transition-colors">Explorar espaços</button></li>
              <li><button onClick={() => navigate('register-establishment')} className="hover:text-white transition-colors">Cadastrar estabelecimento</button></li>
              <li><button className="hover:text-white transition-colors">Como funciona</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li><button className="hover:text-white transition-colors">Central de ajuda</button></li>
              <li><button className="hover:text-white transition-colors">Fale conosco</button></li>
              <li><button className="hover:text-white transition-colors">Termos de uso</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Redes sociais</h4>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                <Instagram size={16} className="text-gray-300" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                <Twitter size={16} className="text-gray-300" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                <Facebook size={16} className="text-gray-300" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-600">
          <p>© 2026 Inspot. Todos os direitos reservados.</p>
          <p>Feito com carinho em São Paulo, Brasil</p>
        </div>
      </div>
    </footer>
  );
}
