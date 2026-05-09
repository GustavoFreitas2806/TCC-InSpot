import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { EstablishmentType, PriceRange } from '../../types';

const typeOptions: { value: EstablishmentType | ''; label: string }[] = [
  { value: '', label: 'Todos os tipos' },
  { value: 'bar', label: 'Bar' },
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'salao', label: 'Salão de Festas' },
  { value: 'churrascaria', label: 'Churrascaria' },
  { value: 'buffet', label: 'Buffet' },
  { value: 'hamburgueria', label: 'Hamburgueria' },
  { value: 'pizzaria', label: 'Pizzaria' },
  { value: 'cafe', label: 'Café' },
];

const priceOptions: { value: PriceRange | ''; label: string }[] = [
  { value: '', label: 'Qualquer preço' },
  { value: '$', label: '$ Econômico' },
  { value: '$$', label: '$$ Moderado' },
  { value: '$$$', label: '$$$ Sofisticado' },
  { value: '$$$$', label: '$$$$ Premium' },
];

const sortOptions = [
  { value: 'relevance', label: 'Relevância' },
  { value: 'rating', label: 'Melhor avaliação' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
];

interface FiltersContentProps {
  onApply?: () => void;
}

function FiltersContent({ onApply }: FiltersContentProps) {
  const { filters, setFilters } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Tipo de espaço</h3>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilters({ type: opt.value as EstablishmentType | '' })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filters.type === opt.value
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Faixa de preço</h3>
        <div className="flex flex-wrap gap-2">
          {priceOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilters({ priceRange: opt.value as PriceRange | '' })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filters.priceRange === opt.value
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Avaliação mínima: {filters.minRating === 0 ? 'Todas' : `${filters.minRating}+`}
        </h3>
        <input
          type="range"
          min={0}
          max={4}
          step={0.5}
          value={filters.minRating}
          onChange={e => setFilters({ minRating: parseFloat(e.target.value) })}
          className="w-full accent-red-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Todas</span>
          <span>4.0+</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Ordenar por</h3>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilters({ sortBy: opt.value as typeof filters.sortBy })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filters.sortBy === opt.value
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {onApply && (
        <Button fullWidth onClick={onApply}>
          Aplicar filtros
        </Button>
      )}

      <button
        onClick={() => setFilters({ type: '', priceRange: '', minRating: 0, sortBy: 'relevance' })}
        className="w-full text-sm text-gray-500 hover:text-red-600 transition-colors py-1"
      >
        Limpar filtros
      </button>
    </div>
  );
}

export function FiltersSidebar() {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-red-600" />
          Filtros
        </h2>
        <FiltersContent />
      </div>
    </aside>
  );
}

export function FiltersMobileButton() {
  const [open, setOpen] = useState(false);
  const { filters } = useApp();

  const activeCount = [
    filters.type !== '',
    filters.priceRange !== '',
    filters.minRating > 0,
    filters.sortBy !== 'relevance',
  ].filter(Boolean).length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-red-300 transition-colors shadow-sm"
      >
        <SlidersHorizontal size={15} className="text-red-600" />
        Filtros
        {activeCount > 0 && (
          <span className="w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Filtros">
        <FiltersContent onApply={() => setOpen(false)} />
      </Modal>
    </>
  );
}
