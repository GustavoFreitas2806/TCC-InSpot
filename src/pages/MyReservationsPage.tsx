import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Users, MapPin, Tag, ChevronRight, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { typeLabels } from '../data/mockData';

type FilterTab = 'all' | 'confirmed' | 'pending' | 'cancelled';

export function MyReservationsPage() {
  const { user, navigate, reservations } = useApp();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  if (!user) {
    navigate('login');
    return null;
  }

  const filtered = activeTab === 'all' ? reservations : reservations.filter(r => r.status === activeTab);

  const tabCounts = {
    all: reservations.length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending: reservations.filter(r => r.status === 'pending').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Minhas Reservas</h1>
        <p className="text-gray-500 mt-1">Gerencie todas as suas reservas em um so lugar.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 pb-1">
        {([['all', 'Todas'], ['confirmed', 'Confirmadas'], ['pending', 'Pendentes'], ['cancelled', 'Canceladas']] as [FilterTab, string][]).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setActiveTab(val)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              activeTab === val
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
            }`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === val ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {tabCounts[val]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhuma reserva encontrada</h3>
          <p className="text-gray-500 mb-5 max-w-xs mx-auto text-sm">
            {activeTab === 'all'
              ? 'Voce ainda nao fez nenhuma reserva. Que tal explorar os melhores espacos?'
              : `Nenhuma reserva com status "${activeTab === 'confirmed' ? 'confirmada' : activeTab === 'pending' ? 'pendente' : 'cancelada'}".`}
          </p>
          {activeTab === 'all' && (
            <Button onClick={() => navigate('home')}>Explorar espacos</Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex gap-0">
                <img
                  src={r.establishmentImage}
                  alt={r.establishmentName}
                  className="w-28 sm:w-36 object-cover shrink-0"
                />
                <div className="flex-1 p-4 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      {typeLabels[r.establishmentType] ?? r.establishmentType}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      r.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      r.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {r.status === 'confirmed' ? 'Confirmada' : r.status === 'pending' ? 'Pendente' : 'Cancelada'}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 text-base mb-2 truncate">{r.establishmentName}</h3>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={11} className="text-red-500 shrink-0" />
                      {new Date(r.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={11} className="text-red-500 shrink-0" />
                      {r.time}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Users size={11} className="text-red-500 shrink-0" />
                      {r.people} pessoas
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin size={11} className="text-red-500 shrink-0" />
                      {r.establishmentNeighborhood}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 bg-green-50 border border-green-100 rounded-lg px-2 py-1">
                        <Tag size={10} className="text-green-600" />
                        <span className="text-xs font-mono font-bold text-green-700">{r.couponCode}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">R$ {r.total.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <button className="flex items-center gap-1 text-xs text-red-600 font-medium hover:text-red-700 transition-colors">
                      Detalhes <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
