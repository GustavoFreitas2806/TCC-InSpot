import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Calendar, Users, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { establishments } from '../data/mockData';
import { EstablishmentCard } from '../components/establishment/EstablishmentCard';
import { FiltersSidebar, FiltersMobileButton } from '../components/establishment/Filters';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { Button } from '../components/ui/Button';
import type { Establishment } from '../types';

const categoryQuickFilters = [
  { label: 'Todos', value: '' },
  { label: 'Bar', value: 'bar' },
  { label: 'Restaurante', value: 'restaurante' },
  { label: 'Salão de Festas', value: 'salao' },
  { label: 'Churrascaria', value: 'churrascaria' },
  { label: 'Buffet', value: 'buffet' },
  { label: 'Hamburgueria', value: 'hamburgueria' },
  { label: 'Pizzaria', value: 'pizzaria' },
  { label: 'Café', value: 'cafe' },
];

export function HomePage() {
  const { filters, setFilters, navigate } = useApp();
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState(filters.location);
  const [searchDate, setSearchDate] = useState(filters.date);
  const [searchPeople, setSearchPeople] = useState(filters.people);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    let list: Establishment[] = [...establishments];

    if (filters.type) list = list.filter(e => e.type === filters.type);
    if (filters.priceRange) list = list.filter(e => e.priceRange === filters.priceRange);
    if (filters.minRating > 0) list = list.filter(e => e.rating >= filters.minRating);
    if (filters.location) {
      const q = filters.location.toLowerCase();
      list = list.filter(e =>
        e.neighborhood.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.address.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (filters.sortBy === 'price-asc') {
      const order = ['$', '$$', '$$$', '$$$$'];
      list.sort((a, b) => order.indexOf(a.priceRange) - order.indexOf(b.priceRange));
    } else if (filters.sortBy === 'price-desc') {
      const order = ['$', '$$', '$$$', '$$$$'];
      list.sort((a, b) => order.indexOf(b.priceRange) - order.indexOf(a.priceRange));
    } else {
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return list;
  }, [filters]);

  const handleSearch = () => {
    setFilters({ location: searchLocation, date: searchDate, people: searchPeople });
  };

  const featured = establishments.filter(e => e.isFeatured);

  return (
    <div>
      {/* Hero */}
      <div
        className="relative bg-gray-900 text-white py-16 sm:py-24 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1400)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 text-red-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Sparkles size={14} />
            Encontre o lugar perfeito para seu rolê
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Cada celebração merece um
            <span className="text-red-400"> espaço incrível</span>
          </h1>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Descubra bares, restaurantes, salões e muito mais para seus aniversários, rolês e jantares especiais.
          </p>

          {/* Search card */}
          <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
              <MapPin size={18} className="text-red-500 shrink-0" />
              <input
                type="text"
                placeholder="Onde? (bairro ou cidade)"
                value={searchLocation}
                onChange={e => setSearchLocation(e.target.value)}
                className="flex-1 text-sm text-gray-800 placeholder:text-gray-400 bg-transparent focus:outline-none"
              />
            </div>
            <div className="hidden sm:block w-px bg-gray-200" />
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Calendar size={18} className="text-red-500 shrink-0" />
              <input
                type="date"
                value={searchDate}
                onChange={e => setSearchDate(e.target.value)}
                className="text-sm text-gray-800 bg-transparent focus:outline-none w-full sm:w-auto"
              />
            </div>
            <div className="hidden sm:block w-px bg-gray-200" />
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Users size={18} className="text-red-500 shrink-0" />
              <input
                type="number"
                min={1}
                max={500}
                value={searchPeople}
                onChange={e => setSearchPeople(parseInt(e.target.value) || 1)}
                className="text-sm text-gray-800 bg-transparent focus:outline-none w-16"
                placeholder="Pessoas"
              />
            </div>
            <Button size="lg" onClick={handleSearch} className="!rounded-xl shrink-0">
              <Search size={16} />
              Buscar
            </Button>
          </div>
        </div>
      </div>

      {/* Category quick filters */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar py-3">
            {categoryQuickFilters.map(cat => (
              <button
                key={cat.value}
                onClick={() => setFilters({ type: cat.value as typeof filters.type })}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  filters.type === cat.value
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Featured section */}
        {!filters.type && !filters.location && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Destaques da semana</h2>
                <p className="text-sm text-gray-500 mt-0.5">Os lugares mais amados pelos usuários</p>
              </div>
              <button className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                Ver todos <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
                : featured.map(e => (
                    <EstablishmentCard key={e.id} establishment={e} />
                  ))}
            </div>
          </section>
        )}

        {/* Main listing */}
        <div className="flex gap-8">
          <FiltersSidebar />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {filters.type
                    ? `${categoryQuickFilters.find(c => c.value === filters.type)?.label ?? ''}`
                    : 'Todos os espaços'}
                </h2>
                {!loading && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                    {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <FiltersMobileButton />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhum espaço encontrado</h3>
                <p className="text-gray-500 mb-5 max-w-sm mx-auto">
                  Tente ajustar os filtros ou buscar em outra localização.
                </p>
                <Button variant="outline" onClick={() => setFilters({ type: '', priceRange: '', minRating: 0, location: '' })}>
                  Limpar filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(e => (
                  <EstablishmentCard key={e.id} establishment={e} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA banner */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Tem um espaço incrível?</h2>
          <p className="text-red-100 mb-6 max-w-lg mx-auto">
            Cadastre seu estabelecimento no Inspot e alcance milhares de pessoas procurando o lugar perfeito para seus rolês.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('register-establishment')}
          >
            Cadastrar meu espaço
          </Button>
        </div>
      </div>
    </div>
  );
}
