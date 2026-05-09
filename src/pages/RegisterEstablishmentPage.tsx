import { useState } from 'react';
import { Upload, X, MapPin, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';

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

const MOCK_IMAGES = [
  'https://images.pexels.com/photos/1189095/pexels-photo-1189095.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=200',
];

export function RegisterEstablishmentPage() {
  const { navigate, addToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '',
    type: '',
    capacity: '',
    priceRange: '',
    address: '',
    neighborhood: '',
    city: 'São Paulo',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof form) => (val: string) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nome é obrigatório';
    if (!form.type) e.type = 'Selecione o tipo';
    if (!form.capacity || isNaN(parseInt(form.capacity))) e.capacity = 'Capacidade inválida';
    if (!form.priceRange) e.priceRange = 'Selecione a faixa de preço';
    if (!form.address.trim()) e.address = 'Endereço é obrigatório';
    if (!form.description.trim()) e.description = 'Descrição é obrigatória';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleMockUpload = () => {
    const available = MOCK_IMAGES.filter(img => !uploadedImages.includes(img));
    if (available.length === 0) return;
    setUploadedImages(prev => [...prev, available[0]]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    addToast('Estabelecimento cadastrado com sucesso!', 'success');
    navigate('home');
    setLoading(false);
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

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <MapPin size={20} className="text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastrar estabelecimento</h1>
        </div>
        <p className="text-gray-500">
          Preencha as informações do seu espaço para começar a receber clientes pelo Inspot.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Informações básicas</h2>

          <Input
            label="Nome do estabelecimento"
            type="text"
            placeholder="Ex: Bar do Zé"
            value={form.name}
            onChange={e => set('name')(e.target.value)}
            error={errors.name}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Tipo de espaço"
              options={typeOptions}
              value={form.type}
              onChange={set('type')}
              placeholder="Selecione o tipo"
              error={errors.type}
            />
            <Select
              label="Faixa de preço"
              options={priceOptions}
              value={form.priceRange}
              onChange={set('priceRange')}
              placeholder="Selecione o preço"
              error={errors.priceRange}
            />
          </div>

          <Input
            label="Capacidade máxima (pessoas)"
            type="number"
            placeholder="Ex: 80"
            value={form.capacity}
            onChange={e => set('capacity')(e.target.value)}
            error={errors.capacity}
          />
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Localização</h2>

          <Input
            label="Endereço"
            type="text"
            placeholder="Rua, número"
            value={form.address}
            onChange={e => set('address')(e.target.value)}
            error={errors.address}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Bairro"
              type="text"
              placeholder="Ex: Consolação"
              value={form.neighborhood}
              onChange={e => set('neighborhood')(e.target.value)}
            />
            <Input
              label="Cidade"
              type="text"
              placeholder="Ex: São Paulo"
              value={form.city}
              onChange={e => set('city')(e.target.value)}
            />
          </div>
        </div>

        {/* Photos */}
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
          <p className="text-xs text-gray-400">Clique em "Adicionar" para simular o upload de fotos. Máximo 6 fotos.</p>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 pb-2 border-b border-gray-100">Descrição</h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Descreva seu espaço</label>
            <textarea
              rows={5}
              placeholder="Conte sobre o ambiente, diferenciais, tipo de evento ideal..."
              value={form.description}
              onChange={e => set('description')(e.target.value)}
              className={`
                w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900
                placeholder:text-gray-400 resize-none
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                transition-all duration-200
                ${errors.description ? 'border-red-400' : ''}
              `}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button type="submit" size="lg" loading={loading} fullWidth>
            Cadastrar estabelecimento
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => navigate('home')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
