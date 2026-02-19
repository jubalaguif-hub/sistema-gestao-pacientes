import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Loader2, Plus, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface Pendencia {
  tipo: 'Raio X' | 'TC' | 'Lab' | 'Reavaliação' | '1ª Avaliação' | 'Outros';
  descricao?: string;
}

interface FormCadastroPacienteProps {
  onSuccess?: () => void;
}

export function FormCadastroPaciente({ onSuccess }: FormCadastroPacienteProps) {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [temPendencia, setTemPendencia] = useState(false);
  const [localPaciente, setLocalPaciente] = useState('');
  const [outrasAcoes, setOutrasAcoes] = useState('');
  const [pendencias, setPendencias] = useState<Pendencia[]>([]);
  const [novasPendencias, setNovasPendencias] = useState<Pendencia>({
    tipo: 'Raio X',
    descricao: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createPaciente = trpc.pacientes.create.useMutation();

  const handleAddPendencia = () => {
    if (novasPendencias.tipo) {
      setPendencias([...pendencias, novasPendencias]);
      setNovasPendencias({ tipo: 'Raio X', descricao: '' });
    }
  };

  const handleRemovePendencia = (index: number) => {
    setPendencias(pendencias.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nome || !idade || !especialidade || !localPaciente) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    if (temPendencia && pendencias.length === 0) {
      setError('Adicione pelo menos uma pendência');
      return;
    }

    try {
      setIsLoading(true);

      await createPaciente.mutateAsync({
        nome,
        idade: parseInt(idade),
        especialidade,
        temPendencia,
        localPaciente,
        outrasAcoes: outrasAcoes || undefined,
        pendencias: temPendencia ? pendencias : undefined,
      });

      toast.success('Paciente cadastrado com sucesso!');

      // Limpar formulário
      setNome('');
      setIdade('');
      setEspecialidade('');
      setTemPendencia(false);
      setLocalPaciente('');
      setOutrasAcoes('');
      setPendencias([]);

      onSuccess?.();
    } catch (err: any) {
      const message = err.message || 'Erro ao cadastrar paciente';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle>Cadastrar Novo Paciente</CardTitle>
        <CardDescription>
          Preencha os dados do paciente e suas pendências
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Dados Básicos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Dados Básicos</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome *</label>
                <Input
                  placeholder="Nome do paciente"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Idade *</label>
                <Input
                  type="number"
                  placeholder="Idade"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Especialidade *</label>
              <Input
                placeholder="Ex: Cardiologia, Ortopedia, etc"
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Onde o paciente está? *</label>
              <Input
                placeholder="Ex: Leito 5, Sala de espera, etc"
                value={localPaciente}
                onChange={(e) => setLocalPaciente(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Outras ações</label>
              <Textarea
                placeholder="Descreva outras ações ou observações"
                value={outrasAcoes}
                onChange={(e) => setOutrasAcoes(e.target.value)}
                disabled={isLoading}
                rows={3}
              />
            </div>
          </div>

          {/* Pendências */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="temPendencia"
                checked={temPendencia}
                onCheckedChange={(checked) => setTemPendencia(checked as boolean)}
                disabled={isLoading}
              />
              <label htmlFor="temPendencia" className="text-sm font-medium text-gray-700">
                Tem pendência?
              </label>
            </div>

            {temPendencia && (
              <div className="space-y-4 bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">Pendências</h3>

                {/* Nova Pendência */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tipo de Pendência</label>
                    <Select
                      value={novasPendencias.tipo}
                      onValueChange={(value: any) =>
                        setNovasPendencias({ ...novasPendencias, tipo: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Raio X">Raio X</SelectItem>
                        <SelectItem value="TC">TC</SelectItem>
                        <SelectItem value="Lab">Lab</SelectItem>
                        <SelectItem value="Reavaliação">Reavaliação</SelectItem>
                        <SelectItem value="1ª Avaliação">1ª Avaliação</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Descrição (opcional)</label>
                    <Input
                      placeholder="Descreva a pendência"
                      value={novasPendencias.descricao || ''}
                      onChange={(e) =>
                        setNovasPendencias({ ...novasPendencias, descricao: e.target.value })
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleAddPendencia}
                    variant="outline"
                    className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                    disabled={isLoading}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Pendência
                  </Button>
                </div>

                {/* Lista de Pendências */}
                {pendencias.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Pendências adicionadas:</p>
                    {pendencias.map((pend, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white p-3 rounded border border-orange-200"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{pend.tipo}</p>
                          {pend.descricao && (
                            <p className="text-sm text-gray-600">{pend.descricao}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePendencia(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                'Cadastrar Paciente'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
