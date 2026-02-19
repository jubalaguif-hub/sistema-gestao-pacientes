import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, BarChart3, Users, AlertCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { skipToken } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminDashboard() {
  const { user, logout } = useFirebaseAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const meQuery = trpc.auth.me.useQuery();
  const estatisticasQuery = trpc.admin.getEstatisticas.useQuery(meQuery.data ? {} : skipToken);
  const pacientesQuery = trpc.admin.getPacientes.useQuery(meQuery.data ? {} : skipToken);
  const pendenciasQuery = trpc.admin.getPendencias.useQuery(meQuery.data ? {} : skipToken);
  const funcionariosQuery = trpc.admin.getFuncionarios.useQuery(meQuery.data ? skipToken : skipToken);

  useEffect(() => {
    if (!user) {
      setLocation('/login');
    } else if (meQuery.data && meQuery.data.role !== 'admin') {
      setLocation('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [user, meQuery.data, setLocation]);

  const handleLogout = async () => {
    try {
      await logout();
      setLocation('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (isLoading || !user || !meQuery.data || meQuery.data.role !== 'admin') {
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
            <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerenciamento completo do sistema
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
        {/* Estatísticas */}
        {estatisticasQuery.data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total de Pacientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">
                  {estatisticasQuery.data.totalPacientes}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {estatisticasQuery.data.pacientesResolvidos} resolvidos
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Pendências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">
                  {estatisticasQuery.data.totalPendencias}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {estatisticasQuery.data.pendenciasResolvidas} resolvidas
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tempo Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">
                  {estatisticasQuery.data.tempoMedioResolucaoMinutos}m
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Resolução de pendências
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Funcionários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">
                  {funcionariosQuery.data?.length || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Ativos no sistema
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="pacientes" className="space-y-4">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="pacientes">Pacientes</TabsTrigger>
            <TabsTrigger value="pendencias">Pendências</TabsTrigger>
            <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
          </TabsList>

          {/* Pacientes */}
          <TabsContent value="pacientes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Todos os Pacientes</CardTitle>
                <CardDescription>
                  Visualize todos os pacientes cadastrados no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pacientesQuery.data && pacientesQuery.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Idade</TableHead>
                          <TableHead>Especialidade</TableHead>
                          <TableHead>Prédio</TableHead>
                          <TableHead>Turno</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Cadastrado em</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pacientesQuery.data.map((item: any) => (
                          <TableRow key={item.paciente.id}>
                            <TableCell className="font-medium">
                              {item.paciente.nome}
                            </TableCell>
                            <TableCell>{item.paciente.idade}</TableCell>
                            <TableCell>{item.paciente.especialidade}</TableCell>
                            <TableCell>{item.paciente.predio}</TableCell>
                            <TableCell>{item.paciente.turno}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  item.paciente.status === 'resolvido'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {item.paciente.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              {new Date(item.paciente.horaCadastro).toLocaleDateString('pt-BR')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>Nenhum paciente cadastrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pendências */}
          <TabsContent value="pendencias" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pendências</CardTitle>
                <CardDescription>
                  Acompanhe todas as pendências do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendenciasQuery.data && pendenciasQuery.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Paciente</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Criada em</TableHead>
                          <TableHead>Resolvida em</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendenciasQuery.data.map((item: any) => (
                          <TableRow key={item.pendencia.id}>
                            <TableCell className="font-medium">
                              {item.paciente.nome}
                            </TableCell>
                            <TableCell>{item.pendencia.tipoPendencia}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  item.pendencia.status === 'resolvida'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {item.pendencia.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              {new Date(item.pendencia.horaCriacao).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              {item.pendencia.horaResolucao
                                ? new Date(item.pendencia.horaResolucao).toLocaleDateString('pt-BR')
                                : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>Nenhuma pendência registrada</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Funcionários */}
          <TabsContent value="funcionarios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Funcionários</CardTitle>
                <CardDescription>
                  Gerenciar funcionários do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                {funcionariosQuery.data && funcionariosQuery.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>E-mail</TableHead>
                          <TableHead>Prédio</TableHead>
                          <TableHead>Turno</TableHead>
                          <TableHead>Último Acesso</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {funcionariosQuery.data.map((funcionario: any) => (
                          <TableRow key={funcionario.id}>
                            <TableCell className="font-medium">
                              {funcionario.name}
                            </TableCell>
                            <TableCell>{funcionario.email}</TableCell>
                            <TableCell>{funcionario.predio || '-'}</TableCell>
                            <TableCell>{funcionario.turno || '-'}</TableCell>
                            <TableCell>
                              {new Date(funcionario.lastSignedIn).toLocaleDateString('pt-BR')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>Nenhum funcionário cadastrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
