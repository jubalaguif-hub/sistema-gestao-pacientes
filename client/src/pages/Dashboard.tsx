import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Plus, Clock } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { FormCadastroPaciente } from '@/components/FormCadastroPaciente';

export default function Dashboard() {
  const { user, logout } = useFirebaseAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const meQuery = trpc.auth.me.useQuery();

  useEffect(() => {
    if (!user) {
      setLocation('/login');
    } else {
      setIsLoading(false);
    }
  }, [user, setLocation]);

  const handleLogout = async () => {
    try {
      await logout();
      setLocation('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (isLoading || !user || !meQuery.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sistema de Gestão de Pacientes</h1>
            <p className="text-sm text-gray-600 mt-1">
              Bem-vindo, {meQuery.data?.name || user.email}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Prédio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">
                {meQuery.data?.predio || '-'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Turno</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">
                {meQuery.data?.turno || '-'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pendências Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">0</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pacientes" className="space-y-4">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="pacientes">Pacientes</TabsTrigger>
            <TabsTrigger value="pendencias">Pendências</TabsTrigger>
            <TabsTrigger value="lembretes">Lembretes</TabsTrigger>
          </TabsList>

          <TabsContent value="pacientes" className="space-y-4">
            <FormCadastroPaciente />
          </TabsContent>

          <TabsContent value="pendencias" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pendências Ativas</CardTitle>
                <CardDescription>
                  Acompanhe as pendências dos seus pacientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Clock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>Nenhuma pendência no momento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lembretes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurar Lembretes</CardTitle>
                <CardDescription>
                  Configure notificações para pendências não resolvidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Funcionalidade em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
