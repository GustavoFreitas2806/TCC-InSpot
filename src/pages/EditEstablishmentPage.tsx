import { useState } from 'react';
import { Upload, X, ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { supabase } from '../lib/supabase'; // Importação real do banco

const typeOptions = [
  { value: 'bar', label: 'Bar' },
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'salao', label: 'Salão de Festas' },
  { value: 'churrascaria', label: 'Churrascaria' },
  { value: 'buffet', label: 'Buffet' },
  { value: 'hamburgueria', label: 'Hamburgueria' },
  { value: 'pizzaria', label: 'Pizzaria' },
  { value: 'cafe', label: 'Café' },
];

const priceOptions = [
  { value: '$', label: '$ — Econômico' },
  { value: '$$', label: '$$ — Moderado' },
  { value: '$$$', label: '$$$ — Sofisticado' },
  { value: '$$$$', label: '$$$$ — Premium' },
];

export function EditEstablishmentPage() {
  const { navigate, addToast, selectedEstablishment } = useApp();
  
  // Se não houver nada selecionado (ex: refresh na página), volta para a lista
  if (!selectedEstablishment) {
    navigate('my-establishments');
    return null;
  }

  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(selectedEstablishment.images || []);
  
  const [form, setForm] = useState({
    name: selectedEstablishment.name,
    type: selectedEstablishment.type,
    capacity: String(selectedEstablishment.capacity),
    priceRange: selectedEstablishment.priceRange,
    address: selectedEstablishment.address,
    neighborhood: selectedEstablishment.neighborhood,
    city: selectedEstablishment.city,
    description: selectedEstablishment.description,
  });

  const set = (key: keyof typeof form) => (val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('establishments')
        .update({
          name: form.name,
          type: form.type,
          capacity: parseInt(form.capacity),
          priceRange: form.priceRange,
          address: form.address,
          neighborhood: form.neighborhood,
          city: form.city,
          description: form.description,
          images: uploadedImages
        })
        .eq('id', selectedEstablishment.id);

      if (error) {
        addToast('Erro ao atualizar: ' + error.message, 'error');
      } else {
        addToast('Alterações salvas com sucesso!', 'success');
        navigate('my-establishments');
      }
    } catch (err) {
      addToast('Ocorreu um erro inesperado.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('establishments')
        .delete()
        .eq('id', selectedEstablishment.id);

      if (error) {
        addToast('Erro ao excluir: ' + error.message, 'error');
      } else {
        addToast('Estabelecimento excluído permanentemente.', 'info');
        navigate('my-establishments');
      }
    } catch (err) {
      addToast('Erro ao tentar excluir.', 'error');
    } finally {
      setLoading(false);
      setDeleteOpen(false);
    }
  };

  const handleMockUpload = () => {
    const extra = [
      'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=200',
      'https://images.pexels.com/photos/941864/pexels-photo-941864.jpeg?auto=compress&cs=tinysrgb&w=200',
      'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=200',
    ];
    const available = extra.filter(img => !uploadedImages.includes(img));
    if (available.length === 0) return;
    setUploadedImages(prev => [...prev, available[0]]);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate('my-establishments')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar para a lista
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar: {selectedEstablishment.name}</h1>
          <p className="text-gray-500 mt-1">Atualize os dados que ficarão visíveis para os clientes.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Informações básicas</h2>
          <Input
            label="Nome do estabelecimento"
            value={form.name}
            onChange={e => set('name')(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Tipo de espaço" options={typeOptions} value={form.type} onChange={set('type')} />
            <Select label="Faixa de preço" options={priceOptions} value={form.priceRange} onChange={set('priceRange')} />
          </div>
          <Input
            label="Capacidade máxima"
            type="number"
            value={form.capacity}
            onChange={e => set('capacity')(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Localização</h2>
          <Input
            label="Endereço"
            value={form.address}
            onChange={e => set('address')(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Bairro" value={form.neighborhood} onChange={e => set('neighborhood')(e.target.value)} />
            <Input label="Cidade" value={form.city} onChange={e => set('city')(e.target.value)} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Fotos do espaço</h2>
          <div className="flex flex-wrap gap-3">
            {uploadedImages.map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setUploadedImages(prev => prev.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            {uploadedImages.length < 6 && (
              <button
                type="button"
                onClick={handleMockUpload}
                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-red-400 hover:text-red-500 transition-colors"
              >
                <Upload size={20} />
                <span className="text-xs">Adicionar</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Descrição</h2>
          <textarea
            rows={5}
            value={form.description}
            onChange={e => set('description')(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button type="submit" size="lg" loading={loading} fullWidth>
            Salvar alterações
          </Button>
          <Button
            type="button"
            variant="danger"
            size="lg"
            onClick={() => setDeleteOpen(true)}
            className="sm:shrink-0"
          >
            <Trash2 size={16} />
            Excluir estabelecimento
          </Button>
        </div>
      </form>

      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Excluir estabelecimento" size="sm">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={24} className="text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Deseja realmente excluir?</h3>
            <p className="text-sm text-gray-500">
              Esta ação removerá "{selectedEstablishment.name}" permanentemente do InSpot.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" fullWidth onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" fullWidth onClick={handleDelete} className="bg-red-600 hover:bg-red-700" loading={loading}>
              Sim, excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}