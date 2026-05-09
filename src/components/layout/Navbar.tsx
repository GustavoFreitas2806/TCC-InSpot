import { useState } from 'react';
import { MapPin, Menu, X, User, LogOut, Settings, PlusCircle, Star, Calendar, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export function Navbar() {
  const { navigate, user, setUser, userPoints } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setDropdownOpen(false);
    navigate('home');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-1.5 group"
          >
            <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-red-700 transition-colors">
              <MapPin size={16} className="text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              In<span className="text-red-600">Spot</span>
            </span>
          </button>

          {/* Desktop Nav - MENU PRINCIPAL */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate('home')}
              className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
            >
              Explorar
            </button>
            
            {/* TRAVA DE SEGURANÇA: Só aparece se estiver logado */}
            {user && (
              <>
                <button
                  onClick={() => navigate('my-reservations')}
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                >
                  Minhas Reservas
                </button>

                <button
                  onClick={() => navigate('register-establishment')}
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                >
                  Cadastrar Espaço
                </button>
              </>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative flex items-center gap-3">
                {/* Points badge */}
                <button
                  onClick={() => navigate('points')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full transition-colors"
                >
                  <Star size={13} className="text-amber-500 fill-amber-400" />
                  <span className="text-xs font-bold text-amber-700">{userPoints ? userPoints.toLocaleString('pt-BR') : 0} pts</span>
                </button>

                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <User size={16} className="text-red-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                      <button
                        onClick={() => { navigate('profile'); setDropdownOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User size={15} />
                        Meu Perfil
                      </button>
                      <button
                        onClick={() => { navigate('promotions'); setDropdownOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Tag size={15} />
                        Minhas Promoções
                      </button>
                      
                      <div className="border-t border-gray-100 my-1" />
                      
                      <button
                        onClick={() => { navigate('my-establishments'); setDropdownOpen(false); }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings size={15} />
                        Meus Estabelecimentos
                      </button>
                      
                      <div className="border-t border-gray-100 my-1" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} />
                        Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('login')}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  Entrar
                </button>
                <Button size="sm" onClick={() => navigate('register')}>
                  Criar conta
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(prev => !prev)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          <button
            onClick={() => { navigate('home'); setMenuOpen(false); }}
            className="flex w-full items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Explorar
          </button>

          {/* TRAVA MOBILE: Só aparece se estiver logado */}
          {user && (
            <>
              <button
                onClick={() => { navigate('my-reservations'); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Minhas Reservas
              </button>
              
              <button
                onClick={() => { navigate('register-establishment'); setMenuOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cadastrar Espaço
              </button>
            </>
          )}

          <div className="border-t border-gray-100 pt-3 mt-3 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => { navigate('points'); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Star size={15} />
                  Pontos ({userPoints ? userPoints.toLocaleString('pt-BR') : 0})
                </button>
                <button
                  onClick={() => { navigate('profile'); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={15} />
                  Meu Perfil
                </button>

                <button
                  onClick={() => { navigate('my-establishments'); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={15} />
                  Meus Estabelecimentos
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { navigate('login'); setMenuOpen(false); }}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 text-left"
                >
                  Entrar
                </button>
                <Button fullWidth onClick={() => { navigate('register'); setMenuOpen(false); }}>
                  Criar conta
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}