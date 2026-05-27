import { useState } from 'react';
import { ArrowLeft, MapPin, Users, Calendar, Clock, Tag, CheckCircle, Copy, Star, ChevronLeft, ChevronRight, Timer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { typeLabels, priceRangeLabels } from '../data/mockData';

const timeSlots = [
  '12:00', '12:30', '13:00', '13:30', '14:00',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
];

const durationOptions = ['1 hora', '2 horas', '3 horas', '4 horas'];

const pricePerPerson: Record<string, number> = {
  '$': 40,
  '$$': 80,
  '$$$': 150,
  '$$$$': 280,
};

const POINTS_PER_RESERVATION = 100;

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

export function ReservationPage() {
  const { selectedEstablishment, navigate, addToast, filters, addReservation, addPoints, user, reservations } = useApp();
  
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [date, setDate] = useState(filters.date || '');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('2 horas');
  const [people, setPeople] = useState(filters.people || 2);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [couponCode] = useState(() => `INSPOT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);

  if (!selectedEstablishment) {
    navigate('home');
    return null;
  }

  const e = selectedEstablishment;
  const basePrice = pricePerPerson[e.priceRange] ?? 80;
  const subtotal = basePrice * people;
  const discount = Math.round(subtotal * 0.08);
  const total = subtotal - discount;

  const establishmentReservations = reservations.filter(
    r => r.establishmentId === e.id && r.date === date && r.status !== 'cancelled'
  );
  const reservedTimes = new Set(establishmentReservations.map(r => r.time));

  const handleConfirm = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!date || !time) {
      addToast('Selecione data e horario para continuar', 'error');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));

    const newReservation = {
      id: Math.random().toString(36).slice(2),
      establishmentId: e.id,
      establishmentName: e.name,
      establishmentImage: e.images[0],
      establishmentType: e.type,
      establishmentNeighborhood: e.neighborhood,
      establishmentCity: e.city,
      date,
      time,
      duration,
      people,
      subtotal,
      discount,
      total,
      couponCode,
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    };

    addReservation(newReservation);
    addPoints(POINTS_PER_RESERVATION);
    setSuccess(true);
    setLoading(false);
  };

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

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reserva confirmada!</h1>
            <p className="text-gray-500">
              Sua reserva em <strong>{e.name}</strong> foi realizada com sucesso.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
              <Star size={18} className="text-amber-500 fill-amber-500" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-amber-800">+{POINTS_PER_RESERVATION} pontos ganhos!</p>
              <p className="text-xs text-amber-600">Acumule pontos e resgate recompensas exclusivas.</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Estabelecimento</span>
              <span className="font-medium">{e.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Data</span>
              <span className="font-medium">{new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Horario</span>
              <span className="font-medium">{time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duração</span>
              <span className="font-medium">{duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pessoas</span>
              <span className="font-medium">{people}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span className="font-semibold text-gray-800">Total com desconto</span>
              <span className="font-bold text-green-600">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2">Seu cupom exclusivo InSpot</p>
            <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-dashed border-red-300">
              <span className="font-mono font-bold text-red-600 text-sm">{couponCode}</span>
              <button
                onClick={() => addToast('Cupom copiado!', 'success')}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Copy size={12} />
                Copiar
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Apresente este codigo na hora do pagamento para receber 8% de desconto.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" fullWidth onClick={() => navigate('my-reservations')}>
              Ver minhas reservas
            </Button>
            <Button fullWidth onClick={() => navigate('home')}>
              Explorar mais espacos
            </Button>
          </div>

          {user && (
            <button
              onClick={() => navigate('points')}
              className="text-sm text-red-600 font-medium hover:text-red-700 transition-colors"
            >
              Ver meus pontos e recompensas
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate('detail')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar para o espaco
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Finalizar reserva</h1>

      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4">
          <img
            src={e.images[0]}
            alt={e.name}
            className="w-20 h-20 rounded-xl object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              {typeLabels[e.type] || e.type}
            </span>
            <h3 className="font-semibold text-gray-900 mt-1">{e.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin size={12} />
              {e.neighborhood}, {e.city}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{priceRangeLabels[e.priceRange]}</p>
          </div>
        </div>

        <form onSubmit={handleConfirm} className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h2 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Selecione a Data</h2>

            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <h3 className="text-sm font-semibold text-gray-900">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </h3>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-7 mb-2">
                {DAY_NAMES.map(d => (
                  <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isSelected = dateStr === date;
                  const dateObj = new Date(dateStr + 'T00:00:00');
                  const isPast = dateObj < new Date(today.setHours(0, 0, 0, 0));

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={isPast}
                      onClick={() => {
                        setDate(dateStr);
                        setTime(''); // Reset time when date changes
                      }}
                      className={`relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-red-600 text-white'
                          : isPast
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {date && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-6">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Clock size={14} className="text-red-500" />
                    Horários disponíveis
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map(slot => {
                      const isUnavailable = reservedTimes.has(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isUnavailable}
                          onClick={() => setTime(slot)}
                          className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${
                            isUnavailable
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                              : time === slot
                              ? 'bg-red-600 text-white border-red-600 shadow-md'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-6">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Timer size={14} className="text-red-500" />
                    Tempo de permanência
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {durationOptions.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setDuration(opt)}
                        className={`px-3 py-1.5 rounded-xl text-sm border transition-all ${
                          duration === opt
                            ? 'bg-red-600 text-white border-red-600 shadow-md'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-6">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Users size={14} className="text-red-500" />
                    Numero de pessoas
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPeople(p => Math.max(1, p - 1))}
                      className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors font-medium"
                    >
                      −
                    </button>
                    <span className="font-semibold text-gray-900 w-8 text-center text-lg">{people}</span>
                    <button
                      type="button"
                      onClick={() => setPeople(p => Math.min(e.capacity, p + 1))}
                      className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors font-medium"
                    >
                      +
                    </button>
                    <span className="text-sm text-gray-400">max. {e.capacity}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <Star size={16} className="text-amber-500 fill-amber-400 shrink-0" />
            <p className="text-sm text-amber-800">
              Voce ganhara <strong>+{POINTS_PER_RESERVATION} pontos</strong> ao confirmar esta reserva!
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
            <h2 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Resumo de preco</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>R$ {basePrice.toFixed(2).replace('.', ',')} x {people} pessoas</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span className="flex items-center gap-1">
                  <Tag size={12} />
                  Desconto InSpot (8%)
                </span>
                <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2 mt-2">
                <span>Total estimado</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              * Valores sao estimativas. O pagamento final e feito diretamente no estabelecimento.
            </p>
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading} disabled={!date || !time}>
            Confirmar reserva
          </Button>
        </form>
      </div>
    </div>
  );
}
