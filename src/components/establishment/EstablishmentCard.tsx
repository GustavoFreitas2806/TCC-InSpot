import { MapPin, Users } from 'lucide-react';
import type { Establishment } from '../../types';
import { StarRating } from '../ui/StarRating';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { typeLabels } from '../../data/mockData';

interface EstablishmentCardProps {
  establishment: Establishment;
}

export function EstablishmentCard({ establishment }: EstablishmentCardProps) {
  const { navigate, setSelectedEstablishment } = useApp();

  const handleView = () => {
    setSelectedEstablishment(establishment);
    navigate('detail');
  };

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={handleView}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={establishment.images[0]}
          alt={establishment.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {establishment.isFeatured && (
            <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-semibold rounded-full shadow-sm">
              Destaque
            </span>
          )}
          {establishment.isNew && (
            <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-sm">
              Novo
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-bold rounded-full shadow-sm">
            {establishment.priceRange}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            {typeLabels[establishment.type] || establishment.type}
          </span>
          {establishment.distance && (
            <span className="flex items-center gap-0.5 text-xs text-gray-400 shrink-0">
              <MapPin size={11} />
              {establishment.distance}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 text-base mt-1.5 mb-1 group-hover:text-red-600 transition-colors">
          {establishment.name}
        </h3>

        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
          <MapPin size={11} />
          {establishment.neighborhood}, {establishment.city}
        </p>

        <div className="flex items-center gap-1 mb-3">
          <StarRating rating={establishment.rating} showNumber reviewCount={establishment.reviewCount} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users size={12} />
            <span>até {establishment.capacity} pessoas</span>
          </div>
          <Button
            size="sm"
            onClick={e => { e.stopPropagation(); handleView(); }}
          >
            Ver mais
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {establishment.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
