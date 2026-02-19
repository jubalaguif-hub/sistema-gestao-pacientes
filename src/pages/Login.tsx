import { useState } from 'react';
import { useLocation } from 'wouter';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Loader2, Lock, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc } from '@/lib/trpc';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [predio, setPredio] = useState<'UPA' | 'HOB' | ''>('');
  const [turno, setTurno] = useState<'Diurno' | 'Noturno' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginType, setLoginType] = useState<'funcionario' | 'admin'>('funcionario');

  const { login, getIdToken } = useFirebaseAuth();
  const [, setLocation] = useLocation();
  const updateLoginInfo = trpc.auth.updateLoginInfo.useMutation();
  const meQuery = trpc.auth.me.useQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Para admin, não precisa de prédio e turno
    if (loginType === 'funcionario' && (!email || !password || !predio || !turno)) {
      setError('Preencha todos os campos');
      return;
    }
    
    if (loginType === 'admin' && (!email || !password)) {
      setError('Preencha e-mail e senha');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await login(email, password);
      
      // Aguardar um pouco para o Firebase atualizar currentUser
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const token = await getIdToken();
      if (!token) {
        setError('Erro ao obter token de autenticação');
        return;
      }

      // Atualizar prédio e turno no banco de dados (apenas para funcionários)
      if (loginType === 'funcionario') {
        await updateLoginInfo.mutateAsync({ predio: predio as 'UPA' | 'HOB', turno: turno as 'Diurno' | 'Noturno' });
        // Redirecionar para dashboard de funcionário
        setLocation('/dashboard');
      } else {
        // Para admin, redirecionar para painel administrativo
        setLocation('/admin');
      }
    } catch (err: any) {
      const message = err.message || 'Erro ao fazer login';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50 flex items-center justify-center p-4">
      {/* Seletor de tipo de login */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          onClick={() => setLoginType('funcionario')}
          variant={loginType === 'funcionario' ? 'default' : 'outline'}
          className={loginType === 'funcionario' ? 'bg-orange-500 hover:bg-orange-600' : ''}
        >
          <Users className="mr-2 h-4 w-4" />
          Funcionário
        </Button>
        <Button
          onClick={() => setLoginType('admin')}
          variant={loginType === 'admin' ? 'default' : 'outline'}
          className={loginType === 'admin' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          <Lock className="mr-2 h-4 w-4" />
          Admin
        </Button>
      </div>
      <Card className={`w-full max-w-md shadow-lg ${
        loginType === 'admin' ? 'border-blue-200' : 'border-orange-200'
      }`}>
        <CardHeader className={`bg-gradient-to-r ${
          loginType === 'admin'
            ? 'from-blue-600 to-blue-700'
            : 'from-orange-500 to-orange-600'
        } text-white rounded-t-lg`}>
          <CardTitle className="text-2xl">Sistema de Gestão</CardTitle>
          <CardDescription className={loginType === 'admin' ? 'text-blue-100' : 'text-orange-100'}>
            {loginType === 'admin'
              ? 'Painel Administrativo'
              : 'Pronto Socorro - Gestão de Pacientes'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">E-mail</label>
              <Input
                type="email"
                placeholder="seu.email@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="border-gray-300"
              />
            </div>

            {loginType === 'funcionario' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Prédio</label>
                  <Select value={predio} onValueChange={(value: any) => setPredio(value)}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Selecione o prédio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPA">UPA</SelectItem>
                      <SelectItem value="HOB">HOB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Turno</label>
                  <Select value={turno} onValueChange={(value: any) => setTurno(value)}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Selecione o turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Diurno">Diurno</SelectItem>
                      <SelectItem value="Noturno">Noturno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-semibold h-10 ${
                loginType === 'admin'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4">
              {loginType === 'admin'
                ? '🔒 Acesso restrito a administradores'
                : '✓ Sistema seguro com autenticação Firebase'}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
