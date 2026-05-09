import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, ArrowLeft, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import type { Establishment } from '../types';

export function MyEstablishmentsPage() {
  const { navigate, setSelectedEstablishment, addToast } = useApp();
  const [mySpaces, setMySpaces] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMySpaces();
  }, []);

  async function fetchMySpaces() {
    setLoading(true);
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMySpaces(data as Establishment[]);
    }
    setLoading(false);
  }

  const handleEdit = (space: Establishment) => {
    setSelectedEstablishment(space); // Guarda qual espaço foi escolhido
    navigate('edit-establishment'); // Vai para a tela de edição
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={() => navigate('home')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-2">
            <ArrowLeft size={16} /> Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Meus Estabelecimentos</h1>
        </div>
        <Button onClick={() => navigate('register-establishment')} size="sm" className="gap-2">
          <Plus size={18} /> Novo Espaço
        </Button>
      </div>

      {loading ? (
        <p className="text-center py-10">Carregando seus espaços...</p>
      ) : mySpaces.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">Você ainda não cadastrou nenhum estabelecimento real.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {mySpaces.map((space) => (
            <div key={space.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={space.images[0]} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold text-gray-900">{space.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin size={12} /> {space.neighborhood}, {space.city}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleEdit(space)} className="gap-2">
                <Edit2 size={14} /> Gerenciar
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}