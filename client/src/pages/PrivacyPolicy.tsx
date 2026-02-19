export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Política de Privacidade e Conformidade LGPD
          </h1>

          <div className="space-y-8 text-gray-700">
            {/* Introdução */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introdução
              </h2>
              <p>
                Este documento descreve como o Sistema de Gestão de Pacientes coleta, utiliza,
                armazena e protege os dados pessoais dos usuários, em conformidade com a Lei
                Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018.
              </p>
            </section>

            {/* Dados Coletados */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Dados Coletados
              </h2>
              <p className="mb-4">
                Coletamos os seguintes dados pessoais:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Nome completo</li>
                <li>E-mail</li>
                <li>Idade</li>
                <li>Especialidade médica</li>
                <li>Localização no hospital (prédio e turno)</li>
                <li>Informações de pendências médicas</li>
                <li>Data e hora de cadastro e resolução</li>
                <li>Histórico de ações no sistema</li>
              </ul>
            </section>

            {/* Finalidade */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Finalidade do Tratamento
              </h2>
              <p className="mb-4">
                Os dados são coletados e utilizados para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Gerenciar pacientes em atendimento no pronto-socorro</li>
                <li>Controlar pendências médicas (exames, avaliações, etc)</li>
                <li>Notificar funcionários sobre pendências não resolvidas</li>
                <li>Gerar relatórios e indicadores de desempenho</li>
                <li>Manter auditoria e conformidade regulatória</li>
                <li>Melhorar a qualidade do serviço hospitalar</li>
              </ul>
            </section>

            {/* Base Legal */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Base Legal
              </h2>
              <p>
                O tratamento de dados pessoais é realizado com base nas seguintes bases legais
                da LGPD:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>
                  <strong>Artigo 7, II:</strong> Consentimento do titular
                </li>
                <li>
                  <strong>Artigo 7, III:</strong> Cumprimento de obrigação legal
                </li>
                <li>
                  <strong>Artigo 7, IV:</strong> Execução de contrato
                </li>
                <li>
                  <strong>Artigo 7, IX:</strong> Proteção da saúde
                </li>
              </ul>
            </section>

            {/* Segurança */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Segurança e Proteção de Dados
              </h2>
              <p className="mb-4">
                Implementamos as seguintes medidas de segurança:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Autenticação segura com Firebase Authentication</li>
                <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
                <li>Banco de dados MySQL com controles de acesso</li>
                <li>Controle de acesso baseado em funções (funcionário vs admin)</li>
                <li>Logs de auditoria de todas as ações</li>
                <li>Acesso restrito a dados sensíveis</li>
                <li>Backup regular dos dados</li>
              </ul>
            </section>

            {/* Direitos */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Direitos do Titular
              </h2>
              <p className="mb-4">
                Conforme a LGPD, você tem direito a:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos ou incorretos</li>
                <li>Solicitar a exclusão de seus dados (direito ao esquecimento)</li>
                <li>Revogar seu consentimento</li>
                <li>Receber informações sobre como seus dados são tratados</li>
                <li>Solicitar portabilidade de seus dados</li>
              </ul>
              <p className="mt-4">
                Para exercer esses direitos, entre em contato com o administrador do sistema.
              </p>
            </section>

            {/* Retenção */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Período de Retenção
              </h2>
              <p>
                Os dados são mantidos pelo período necessário para cumprir as finalidades
                descritas, ou conforme exigido por lei. Dados de pacientes resolvidos são
                mantidos por no mínimo 2 anos para fins de auditoria e indicadores.
              </p>
            </section>

            {/* Compartilhamento */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Compartilhamento de Dados
              </h2>
              <p>
                Os dados não são compartilhados com terceiros, exceto:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Quando exigido por lei ou ordem judicial</li>
                <li>Com outros departamentos do hospital para fins operacionais</li>
                <li>Com prestadores de serviço que assinam contratos de confidencialidade</li>
              </ul>
            </section>

            {/* Consentimento */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Consentimento
              </h2>
              <p>
                Ao utilizar este sistema, você consente com a coleta e tratamento de seus
                dados pessoais conforme descrito nesta política. O consentimento pode ser
                revogado a qualquer momento.
              </p>
            </section>

            {/* Contato */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Contato
              </h2>
              <p>
                Para dúvidas sobre esta política ou para exercer seus direitos LGPD, entre
                em contato com o administrador do sistema ou envi um e-mail para
                privacidade@hospital.com.br
              </p>
            </section>

            {/* Última Atualização */}
            <section className="border-t pt-8 mt-8">
              <p className="text-sm text-gray-600">
                <strong>Última atualização:</strong> 19 de fevereiro de 2026
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
