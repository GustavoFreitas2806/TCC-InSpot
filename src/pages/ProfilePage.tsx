import { useState } from 'react';
import { ArrowLeft, User, Camera, Save, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function ProfilePage() {
  const { user, setUser, navigate, addToast } = useApp();

  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
    city: 'São Paulo',
    bio: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState(0);

  const avatars = [
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
  ];

  if (!user) {
    navigate('login');
    return null;
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nome é obrigatório';
    if (!form.email) e.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setUser({ ...user, name: form.name, email: form.email, avatar: avatars[avatarIndex] });
    addToast('Perfil atualizado com sucesso!', 'success');
    setLoading(false);
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

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurar Perfil</h1>
        <p className="text-gray-500 mt-1">Personalize suas informações e preferencias.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 pb-3 border-b border-gray-100 mb-5">Foto de perfil</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={avatars[avatarIndex]}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
                <Camera size={13} className="text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Escolha um avatar</p>
              <div className="flex gap-2">
                {avatars.map((av, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarIndex(i)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                      i === avatarIndex ? 'border-red-600 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={av} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-semibold text-gray-900 pb-3 border-b border-gray-100">Informações pessoais</h2>

          <Input
            label="Nome completo"
            type="text"
            placeholder="Seu nome"
            value={form.name}
            onChange={set('name')}
            error={errors.name}
            icon={<User size={15} />}
          />

          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            icon={<Mail size={15} />}
          />

          <Input
            label="Telefone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={form.phone}
            onChange={set('phone')}
            icon={<Phone size={15} />}
          />

          <Input
            label="Cidade"
            type="text"
            placeholder="Sua cidade"
            value={form.city}
            onChange={set('city')}
            icon={<MapPin size={15} />}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              rows={3}
              placeholder="Conte um pouco sobre você..."
              value={form.bio}
              onChange={set('bio')}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Security section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 pb-3 border-b border-gray-100 mb-5">Seguranca</h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Shield size={18} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Senha</p>
                <p className="text-xs text-gray-500">Ultima alteracao ha 30 dias</p>
              </div>
            </div>
            <button
              type="button"
              className="text-sm text-red-600 font-medium hover:text-red-700 transition-colors"
            >
              Alterar
            </button>
          </div>
        </div>

        <Button type="submit" fullWidth size="lg" loading={loading}>
          <Save size={16} />
          Salvar alteracoes
        </Button>
      </form>
    </div>
  );
}
