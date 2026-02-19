# TODO - Sistema de Gestão de Pacientes

## Autenticação e Controle de Acesso
- [x] Integrar Firebase Authentication com e-mail e senha
- [x] Criar tela de login com campos de e-mail e senha
- [x] Implementar seleção de prédio (UPA ou HOB) no login
- [x] Implementar seleção de turno (Diurno ou Noturno) no login
- [x] Criar sistema de roles (funcionário vs admin)
- [x] Implementar logout funcional

## Banco de Dados
- [x] Criar tabela de usuários com role, prédio e turno
- [x] Criar tabela de pacientes com todos os campos especificados
- [x] Criar tabela de pendências vinculada aos pacientes
- [x] Criar tabela de histórico de ações para auditoria
- [x] Criar tabela de configurações de notificações por usuário

## Formulário de Cadastro de Pacientes
- [x] Criar formulário com campo Nome
- [x] Adicionar campo Idade
- [x] Adicionar campo Especialidade
- [x] Adicionar campo "Tem pendência?" (S/N)
- [x] Adicionar campo "Qual pendência?" (Raio X, TC, Lab, Reavaliação, 1ª Avaliação, outros)
- [x] Adicionar campo "Onde o paciente está"
- [x] Adicionar campo "Outras ações" (campo livre)
- [x] Implementar validação de formulário
- [x] Registrar hora do cadastro automaticamente
- [x] Salvar dados no banco MySQL

## Sistema de Notificações
- [ ] Criar sistema de lembretes configuráveis por usuário
- [ ] Implementar notificações visuais dentro do sistema
- [ ] Implementar alertas sonoros opcionais
- [ ] Permitir configuração de intervalo de tempo para lembretes
- [ ] Mostrar contador de pendências ativas
- [ ] Criar lista de pendências não resolvidas na dashboard

## Gestão de Pendências
- [x] Criar visualização de pendências ativas do funcionário
- [x] Implementar botão "Marcar como resolvida"
- [x] Registrar hora de resolução da pendência
- [x] Remover pendência da lista ativa do funcionário
- [x] Manter histórico completo no banco para admin

## Painel Administrativo
- [x] Criar dashboard exclusiva para administradores
- [x] Implementar visualização de todos os registros
- [x] Adicionar filtro por período (data início e fim)
- [x] Adicionar filtro por prédio (UPA/HOB)
- [x] Adicionar filtro por turno (Diurno/Noturno)
- [x] Adicionar filtro por funcionário
- [x] Criar visualização de relatórios com hora de cadastro e resolução
- [x] Implementar exportação de dados para indicadores
- [x] Criar estatísticas e métricas (tempo médio de resolução, etc)

## Conformidade LGPD
- [x] Criar página de Política de Privacidade
- [ ] Criar página de Termos de Uso
- [ ] Implementar consentimento de coleta de dados no primeiro acesso
- [x] Adicionar criptografia de dados sensíveis
- [x] Implementar controles de acesso baseados em função
- [x] Criar logs de auditoria de acesso a dados de pacientes
- [ ] Implementar anonimização de dados para relatórios
- [ ] Adicionar opção de exclusão de dados (direito ao esquecimento)

## Design e Interface
- [x] Definir paleta de cores (laranja, branco, cinza claro)
- [x] Aplicar tema de cores em toda aplicação
- [x] Criar layout responsivo para mobile e desktop
- [x] Otimizar legibilidade para ambiente hospitalar
- [x] Criar componentes reutilizáveis com design system
- [x] Implementar feedback visual para ações do usuário
- [x] Adicionar loading states e skeleton screens

## Testes e Validação
- [x] Escrever testes para autenticação
- [x] Escrever testes para CRUD de pacientes
- [ ] Escrever testes para sistema de notificações
- [ ] Escrever testes para painel administrativo
- [ ] Testar responsividade em diferentes dispositivos
- [ ] Validar conformidade LGPD

## Documentação
- [ ] Criar guia de uso para funcionários
- [ ] Criar guia de administração para gestores
- [ ] Documentar processo de criação de usuários no Firebase
- [ ] Criar FAQ sobre funcionalidades do sistema


## Melhorias Implementadas
- [x] Criar tela de login diferenciada para admin (sem prédio/turno)
- [x] Adicionar botões de seleção de tipo de login (Funcionário/Admin)
- [x] Direcionar admin automaticamente para /admin ao fazer login
- [x] Direcionar funcionário para /dashboard ao fazer login
