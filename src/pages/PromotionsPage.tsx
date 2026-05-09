import { useState } from 'react';
import { ArrowLeft, Tag, Plus, Trash2, Calendar, Percent, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

const today = new Date().toISOString().split('T')[0];
const thirtyDays = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

export function PromotionsPage() {
  const { user, navigate, addToast } = useApp();
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: 'p1',
      title: 'Happy Hour Especial',
      description: 'Desconto em todas as reservas no periodo da tarde.',
      discountPercent: 15,
      validFrom: today,
      validUntil: thirtyDays,
      isActive: true,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    discountPercent: '10',
    validFrom: today,
    validUntil: thirtyDays,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    navigate('login');
    return null;
  }

  const set = (key: keyof typeof form) => (val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Titulo e obrigatorio';
    if (!form.description.trim()) e.description = 'Descricao e obrigatoria';
    const pct = parseInt(form.discountPercent);
    if (isNaN(pct) || pct < 1 || pct > 90) e.discountPercent = 'Desconto deve ser entre 1% e 90%';
    if (!form.validFrom) e.validFrom = 'Data de inicio e obrigatoria';
    if (!form.validUntil) e.validUntil = 'Data de termino e obrigatoria';
    if (form.validFrom && form.validUntil && form.validFrom > form.validUntil)
      e.validUntil = 'Data de termino deve ser apos a data de inicio';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const newPromo: Promotion = {
      id: Math.random().toString(36).slice(2),
      title: form.title,
      description: form.description,
      discountPercent: parseInt(form.discountPercent),
      validFrom: form.validFrom,
      validUntil: form.validUntil,
      isActive: true,
    };
    setPromotions(prev => [newPromo, ...prev]);
    addToast('Promocao cadastrada com sucesso!', 'success');
    setShowForm(false);
    setForm({ title: '', description: '', discountPercent: '10', validFrom: today, validUntil: thirtyDays });
    setLoading(false);
  };

  const handleDelete = (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
    addToast('Promocao removida.', 'info');
  };

  const toggleActive = (id: string) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const formatDate = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Promocoes</h1>
          <p className="text-gray-500 mt-1">Cadastre e gerencie promocoes para seu estabelecimento.</p>
        </div>
        <Button onClick={() => setShowForm(s => !s)}>
          <Plus size={16} />
          Nova promocao
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 pb-3 border-b border-gray-100 mb-5 flex items-center gap-2">
            <Tag size={16} className="text-red-500" />
            Nova promocao
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Titulo da promocao"
              type="text"
              placeholder="Ex: Happy Hour Especial"
              value={form.title}
              onChange={e => set('title')(e.target.value)}
              error={errors.title}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Descricao</label>
              <textarea
                rows={3}
                placeholder="Descreva os detalhes da promocao..."
                value={form.description}
                onChange={e => set('description')(e.target.value)}
                className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${errors.description ? 'border-red-400' : ''}`}
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>

            <Input
              label="Desconto (%)"
              type="number"
              placeholder="Ex: 15"
              value={form.discountPercent}
              onChange={e => set('discountPercent')(e.target.value)}
              error={errors.discountPercent}
              icon={<Percent size={14} />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <Calendar size={13} className="text-red-500" />
                  Valido de
                </label>
                <input
                  type="date"
                  value={form.validFrom}
                  onChange={e => set('validFrom')(e.target.value)}
                  className={`w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${errors.validFrom ? 'border-red-400' : ''}`}
                />
                {errors.validFrom && <p className="text-xs text-red-500">{errors.validFrom}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <Calendar size={13} className="text-red-500" />
                  Valido ate
                </label>
                <input
                  type="date"
                  value={form.validUntil}
                  onChange={e => set('validUntil')(e.target.value)}
                  className={`w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${errors.validUntil ? 'border-red-400' : ''}`}
                />
                {errors.validUntil && <p className="text-xs text-red-500">{errors.validUntil}</p>}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={loading}>
                Salvar promocao
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Promotions list */}
      {promotions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tag size={24} className="text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhuma promocao cadastrada</h3>
          <p className="text-gray-500 text-sm mb-4">Crie sua primeira promocao para atrair mais clientes.</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={15} />
            Criar promocao
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {promotions.map(p => {
            const isExpired = p.validUntil < today;
            return (
              <div key={p.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${
                !p.isActive || isExpired ? 'border-gray-100 opacity-60' : 'border-gray-100 hover:shadow-md'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{p.title}</h3>
                      <span className="text-sm font-bold text-white bg-red-600 px-2.5 py-0.5 rounded-full">
                        -{p.discountPercent}%
                      </span>
                      {isExpired && (
                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertCircle size={10} />
                          Expirada
                        </span>
                      )}
                      {!p.isActive && !isExpired && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          Inativa
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{p.description}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar size={11} />
                      {formatDate(p.validFrom)} — {formatDate(p.validUntil)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleActive(p.id)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${p.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${p.isActive ? 'left-5' : 'left-0.5'}`} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
