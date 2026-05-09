import { useState } from 'react';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, MapPin, Clock, Users, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { typeLabels } from '../data/mockData';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function CalendarPage() {
  const { user, navigate, reservations } = useApp();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (!user) {
    navigate('login');
    return null;
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const reservationDates = new Set(reservations.map(r => r.date));

  const reservationsForDate = selectedDate
    ? reservations.filter(r => r.date === selectedDate)
    : reservations;

  const formatDate = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calendario de Reservas</h1>
        <p className="text-gray-500 mt-1">Visualize todas as suas reservas em um calendario.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h2>
            <button
              onClick={nextMonth}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES.map(d => (
              <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const hasReservation = reservationDates.has(dateStr);
              const isToday = dateStr === today.toISOString().split('T')[0];
              const isSelected = dateStr === selectedDate;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-red-600 text-white'
                      : isToday
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : hasReservation
                      ? 'hover:bg-gray-100 text-gray-900'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  {day}
                  {hasReservation && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-red-50 border border-red-200 rounded-full inline-block" />
              Hoje
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block" />
              Com reserva
            </span>
          </div>
        </div>

        {/* Reservations list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar size={16} className="text-red-500" />
                {selectedDate ? formatDate(selectedDate) : 'Todas as reservas'}
              </h3>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                >
                  <XCircle size={13} />
                  Limpar
                </button>
              )}
            </div>

            {reservationsForDate.length === 0 ? (
              <div className="text-center py-8">
                <Calendar size={36} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">
                  {selectedDate ? 'Nenhuma reserva neste dia.' : 'Voce ainda nao tem reservas.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reservationsForDate.map(r => (
                  <div key={r.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-start gap-3">
                      <img
                        src={r.establishmentImage}
                        alt={r.establishmentName}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{r.establishmentName}</p>
                        <p className="text-xs text-red-600 bg-red-50 inline-block px-2 py-0.5 rounded-full mt-0.5">
                          {typeLabels[r.establishmentType] ?? r.establishmentType}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin size={10} />
                            {r.establishmentNeighborhood}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={10} />
                            {r.time}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Users size={10} />
                            {r.people} pessoas
                          </span>
                        </div>
                        {!selectedDate && (
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(r.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                          </p>
                        )}
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        r.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        r.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {r.status === 'confirmed' ? 'Confirmada' : r.status === 'pending' ? 'Pendente' : 'Cancelada'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
