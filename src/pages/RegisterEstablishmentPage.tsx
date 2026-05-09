import { useState } from 'react';
import { Upload, X, MapPin, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { supabase } from '../lib/supabase';

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
  'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=200',
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
    if (!form.capacity) e.capacity = 'Capacidade inválida';
    if (!form.priceRange) e.priceRange = 'Selecione o preço';
    if (!form.address.trim()) e.address = 'Endereço é obrigatório';
    if (!form.description.trim()) e.description = 'Descrição é obrigatória';
    
    setErrors(e);
    const isValid = Object.keys(e).length === 0;
    
    if (!isValid) {
      window.alert("Campos faltando: " + Object.keys(e).join(", "));
    }
    
    return isValid;
  };

  const handleMockUpload = () => {
    const available = MOCK_IMAGES.filter(img => !uploadedImages.includes(img));
    if (available.length === 0) return;
    setUploadedImages(prev => [...prev, available[0]]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Iniciando submit..."); // Verifique se isso aparece no console
    
    if (!validate()) return;

    setLoading(true);
    
    try {
      const { error } = await supabase.from('establishments').insert({
        name: form.name,
        type: form.type,
        capacity: parseInt(form.capacity),
        priceRange: form.priceRange,
        address: form.address,
        neighborhood: form.neighborhood,
        city: form.city,
        description: form.description,
        images: uploadedImages.length > 0 ? uploadedImages : [MOCK_IMAGES[0]],
        tags: ['Novo', form.type]
      });

      if (error) {
        console.error(error);
        addToast('Erro no banco: ' + error.message, 'error');
      } else {
        addToast('Cadastrado com sucesso!', 'success');
        navigate('home');
      }
    } catch (err) {
      console.error(err);
      addToast('Erro inesperado.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <button onClick={() => navigate('home')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <ArrowLeft size={16} /> Voltar
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cadastrar estabelecimento</h1>
        <p className="text-gray-500">Preencha tudo para salvar no banco real.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <Input label="Nome" value={form.name} onChange={e => set('name')(e.target.value)} error={errors.name} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Tipo" options={typeOptions} value={form.type} onChange={set('type')} error={errors.type} />
            <Select label="Preço" options={priceOptions} value={form.priceRange} onChange={set('priceRange')} error={errors.priceRange} />
          </div>
          <Input label="Capacidade" type="number" value={form.capacity} onChange={e => set('capacity')(e.target.value)} error={errors.capacity} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <Input label="Endereço" value={form.address} onChange={e => set('address')(e.target.value)} error={errors.address} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Bairro" value={form.neighborhood} onChange={e => set('neighborhood')(e.target.value)} />
            <Input label="Cidade" value={form.city} onChange={e => set('city')(e.target.value)} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Fotos</h2>
          <div className="flex flex-wrap gap-3">
            {uploadedImages.map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setUploadedImages(prev => prev.filter((_, j) => j !== i))} className="absolute top-1 right-1 bg-black/60 text-white rounded-full"><X size={10} /></button>
              </div>
            ))}
            <button type="button" onClick={handleMockUpload} className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
              <Upload size={20} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <label className="text-sm font-medium text-gray-700">Descrição</label>
          <textarea rows={5} value={form.description} onChange={e => set('description')(e.target.value)} className="w-full rounded-xl border border-gray-200 p-4 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
          {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* BOTÃO FORÇADO COMO TYPE SUBMIT */}
          <button 
            type="submit" 
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full w-full transition-all disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Cadastrar estabelecimento"}
          </button>
          <Button type="button" variant="ghost" onClick={() => navigate('home')}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}