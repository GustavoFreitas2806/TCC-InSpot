import { useState } from 'react';
import { Eye, EyeOff, MapPin, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function RegisterPage() {
  const { navigate, setUser, addToast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nome é obrigatório';
    if (!form.email) e.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.password) e.password = 'Senha é obrigatória';
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (form.password !== form.confirm) e.confirm = 'As senhas não coincidem';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setUser({ id: '1', name: form.name, email: form.email });
    addToast('Conta criada com sucesso! Bem-vindo ao Inspot!', 'success');
    navigate('home');
    setLoading(false);
  };

  const passwordStrength = (p: string) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^a-zA-Z0-9]/.test(p)) s++;
    return s;
  };

  const strength = passwordStrength(form.password);
  const strengthLabel = ['', 'Fraca', 'Regular', 'Boa', 'Forte', 'Muito forte'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-500'][strength];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-1.5 group mb-6"
          >
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-red-700 transition-colors">
              <MapPin size={20} className="text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              In<span className="text-red-600">Spot</span>
            </span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Criar conta grátis</h1>
          <p className="text-gray-500 mt-1">Comece a descobrir os melhores espaços</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nome completo"
              type="text"
              placeholder="Seu nome"
              value={form.name}
              onChange={set('name')}
              error={errors.name}
              autoComplete="name"
            />

            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              autoComplete="email"
            />

            <div className="space-y-1.5">
              <Input
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={set('password')}
                error={errors.password}
                autoComplete="new-password"
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(p => !p)} className="hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              {form.password && (
                <div>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${i < strength ? strengthColor : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${strength >= 3 ? 'text-green-600' : 'text-orange-500'}`}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            <Input
              label="Confirmar senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Repita a senha"
              value={form.confirm}
              onChange={set('confirm')}
              error={errors.confirm}
              autoComplete="new-password"
            />

            <div className="flex items-start gap-2 pt-1">
              <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-500">
                Ao criar conta, você concorda com nossos{' '}
                <span className="text-red-600 cursor-pointer hover:underline">Termos de Uso</span> e{' '}
                <span className="text-red-600 cursor-pointer hover:underline">Política de Privacidade</span>.
              </p>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Criar conta
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tem uma conta?{' '}
          <button
            onClick={() => navigate('login')}
            className="text-red-600 font-semibold hover:text-red-700 transition-colors"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
