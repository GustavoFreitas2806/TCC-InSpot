import { useState } from 'react';
import {
  MapPin, Users, DollarSign, Star, ArrowLeft, Share2, Heart, Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ImageCarousel } from '../components/establishment/ImageCarousel';
import { ReviewCard } from '../components/establishment/ReviewCard';
import { Button } from '../components/ui/Button';
import { StarRating } from '../components/ui/StarRating';
import { typeLabels, priceRangeLabels } from '../data/mockData';

export function DetailPage() {
  const { selectedEstablishment, navigate, addToast } = useApp();
  const [liked, setLiked] = useState(false);

  if (!selectedEstablishment) {
    navigate('home');
    return null;
  }

  const e = selectedEstablishment;

  const handleReserve = () => {
    navigate('reservation');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar para busca
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { addToast('Link copiado!', 'success'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <Share2 size={14} />
            Compartilhar
          </button>
          <button
            onClick={() => setLiked(p => !p)}
            className={`p-2 rounded-full border transition-all ${liked ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
          >
            <Heart size={16} className={liked ? 'fill-red-500' : ''} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          <ImageCarousel images={e.images} name={e.name} />

          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
                {typeLabels[e.type] || e.type}
              </span>
              {e.isFeatured && (
                <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                  Destaque
                </span>
              )}
              {e.isNew && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Novo
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{e.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-red-500" />
                {e.address}, {e.neighborhood}
              </span>
              {e.distance && (
                <span className="flex items-center gap-1 text-gray-400">
                  {e.distance} de distância
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span className="font-bold text-gray-900">{(e.rating || 0).toFixed(1)}</span>
              </div>
              <p className="text-xs text-gray-500">{e.reviewCount || 0} avaliações</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users size={16} className="text-red-500" />
                <span className="font-bold text-gray-900">{e.capacity}</span>
              </div>
              <p className="text-xs text-gray-500">capacidade</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign size={16} className="text-green-500" />
                <span className="font-bold text-gray-900">{e.priceRange}</span>
              </div>
              <p className="text-xs text-gray-500">{priceRangeLabels[e.priceRange]}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Sobre o espaço</h2>
            <p className="text-gray-600 leading-relaxed">{e.description}</p>
          </div>

          {/* Tags */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Características</h2>
            <div className="flex flex-wrap gap-2">
              {e.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
                  <Tag size={12} className="text-red-500" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews - ALTERADO PARA SEGURANÇA */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Avaliações</h2>
              <StarRating rating={e.rating || 0} showNumber reviewCount={e.reviewCount || 0} />
            </div>
            {(e.reviews || []).length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <Star size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Ainda não há avaliações</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(e.reviews || []).map(r => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky reservation card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-lg p-6 space-y-5">
            <div>
              <p className="text-sm text-gray-500 mb-0.5">A partir de</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">{e.priceRange}</span>
                <span className="text-sm text-gray-500">por pessoa</span>
              </div>
              <StarRating rating={e.rating || 0} showNumber reviewCount={e.reviewCount || 0} size={13} />
            </div>

            <div className="border-t border-gray-100 pt-4">
              <Button fullWidth size="lg" onClick={handleReserve}>
                Reservar agora
              </Button>
            </div>

            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl">
              <Tag size={14} className="text-green-600 shrink-0" />
              <p className="text-xs text-green-700 font-medium">
                Use o cupom InSpot e ganhe até 10% de desconto!
              </p>
            </div>

            <p className="text-xs text-gray-400 text-center">Você não será cobrado ainda</p>
          </div>
        </div>
      </div>
    </div>
  );
}