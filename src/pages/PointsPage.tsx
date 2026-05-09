import { ArrowLeft, Star, Gift, Trophy, Zap, ChevronRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';

const TIERS = [
  { name: 'Bronze', min: 0, max: 499, color: 'from-amber-700 to-amber-500', icon: '🥉', perks: ['5% desconto nas reservas', 'Acesso a ofertas basicas'] },
  { name: 'Prata', min: 500, max: 1499, color: 'from-gray-400 to-gray-300', icon: '🥈', perks: ['8% desconto nas reservas', 'Prioridade no suporte', 'Acesso a ofertas exclusivas'] },
  { name: 'Ouro', min: 1500, max: 3999, color: 'from-amber-400 to-yellow-300', icon: '🥇', perks: ['12% desconto nas reservas', 'Check-in prioritario', 'Convites para eventos VIP'] },
  { name: 'Diamante', min: 4000, max: Infinity, color: 'from-cyan-400 to-blue-400', icon: '💎', perks: ['15% desconto nas reservas', 'Concierge dedicado', 'Acesso antecipado a lancamentos', 'Recompensas em dobro'] },
];

const REWARDS = [
  { id: 'r1', title: '10% de desconto', description: 'Valido em qualquer reserva', points: 200, icon: <Gift size={20} className="text-red-500" /> },
  { id: 'r2', title: 'Reserva sem taxa', description: 'Isencao de taxa de servico', points: 350, icon: <Star size={20} className="text-amber-500" /> },
  { id: 'r3', title: 'Upgrade de mesa', description: 'Mesa premium garantida', points: 500, icon: <Trophy size={20} className="text-yellow-500" /> },
  { id: 'r4', title: 'Jantar para 2', description: 'Entrada gratuita para 2 pessoas', points: 1000, icon: <Zap size={20} className="text-blue-500" /> },
];

function getTier(points: number) {
  return TIERS.find(t => points >= t.min && points <= t.max) ?? TIERS[0];
}

function getNextTier(points: number) {
  const idx = TIERS.findIndex(t => points >= t.min && points <= t.max);
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
}

export function PointsPage() {
  const { user, navigate, userPoints, addToast } = useApp();

  if (!user) {
    navigate('login');
    return null;
  }

  const currentTier = getTier(userPoints);
  const nextTier = getNextTier(userPoints);
  const progress = nextTier
    ? ((userPoints - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  const handleRedeem = (reward: typeof REWARDS[0]) => {
    if (userPoints < reward.points) {
      addToast('Pontos insuficientes para resgatar esta recompensa.', 'error');
      return;
    }
    addToast(`Recompensa "${reward.title}" resgatada com sucesso!`, 'success');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meus Pontos</h1>
        <p className="text-gray-500 mt-1">Acumule pontos e resgate recompensas exclusivas.</p>
      </div>

      {/* Points card */}
      <div className={`bg-gradient-to-br ${currentTier.color} rounded-2xl p-6 text-white mb-6 shadow-lg`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/70 text-sm font-medium">Seus pontos</p>
            <p className="text-5xl font-bold mt-1">{userPoints.toLocaleString('pt-BR')}</p>
            <p className="text-white/80 text-sm mt-1">pts acumulados</p>
          </div>
          <div className="text-right">
            <span className="text-3xl">{currentTier.icon}</span>
            <p className="text-white font-bold text-lg mt-1">{currentTier.name}</p>
          </div>
        </div>

        {nextTier && (
          <div>
            <div className="flex justify-between text-xs text-white/70 mb-1.5">
              <span>{currentTier.name}</span>
              <span>{nextTier.min - userPoints} pts para {nextTier.name}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
        {!nextTier && (
          <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2 mt-2">
            <Trophy size={16} className="text-white" />
            <p className="text-sm text-white font-medium">Nivel maximo atingido!</p>
          </div>
        )}
      </div>

      {/* Tier benefits */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy size={16} className="text-amber-500" />
          Beneficios do nivel {currentTier.name}
        </h2>
        <ul className="space-y-2">
          {currentTier.perks.map((perk, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <Check size={11} className="text-green-600" />
              </div>
              {perk}
            </li>
          ))}
        </ul>
        {nextTier && (
          <button
            onClick={() => {}}
            className="mt-4 flex items-center gap-1 text-sm text-red-600 font-medium hover:text-red-700 transition-colors"
          >
            Ver beneficios do nivel {nextTier.name}
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* How to earn */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap size={16} className="text-red-500" />
          Como ganhar pontos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { action: 'Fazer uma reserva', pts: '+100 pts' },
            { action: 'Reserva confirmada', pts: '+50 pts' },
            { action: 'Avaliacao pos-visita', pts: '+30 pts' },
            { action: 'Indicar um amigo', pts: '+200 pts' },
            { action: 'Reserva no aniversario', pts: '+500 pts' },
            { action: 'Primeiro acesso do mes', pts: '+20 pts' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <span className="text-sm text-gray-700">{item.action}</span>
              <span className="text-sm font-bold text-green-600">{item.pts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards catalog */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Gift size={16} className="text-red-500" />
          Resgatar recompensas
        </h2>
        <div className="space-y-3">
          {REWARDS.map(reward => {
            const canRedeem = userPoints >= reward.points;
            return (
              <div
                key={reward.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  canRedeem ? 'border-gray-200 hover:border-red-200 hover:bg-red-50/30' : 'border-gray-100 bg-gray-50 opacity-60'
                }`}
              >
                <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                  {reward.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{reward.title}</p>
                  <p className="text-xs text-gray-500">{reward.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">{reward.points.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-gray-400">pontos</p>
                </div>
                <Button
                  size="sm"
                  variant={canRedeem ? 'primary' : 'ghost'}
                  disabled={!canRedeem}
                  onClick={() => handleRedeem(reward)}
                  className="shrink-0"
                >
                  Resgatar
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
