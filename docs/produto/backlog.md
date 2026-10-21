# AutoFlow: backlog inicial

Data-base: 20/10/2026. Proposta de planejamento vinculada ao [plano do produto](README.md). Nenhuma tarefa de implementação abaixo é declarada concluída por este levantamento.

**Objetivo confirmado:** aprender construindo o AutoFlow, com possibilidade de comercialização futura. A sequência técnica pode avançar por cenários didáticos; a descoberta de um problema comercial será conduzida como uma frente própria.

## 1. Como ler a fila

- **A definir:** ainda precisa de uma escolha de produto.
- **A fazer:** há trabalho conhecido, mas ele ainda não foi iniciado.
- **Pronta para começar:** objetivo, regras essenciais, dependências e critérios de aceite estão claros.
- **Em andamento:** implementação ou investigação iniciada.
- **Em validação:** resultado disponível, aguardando as verificações combinadas.
- **Concluída:** critérios específicos e definição de pronto atendidos, com evidências.
- **Bloqueada:** depende de decisão, acesso ou entrega; registrar qual.

Uma tarefa de infraestrutura pode estar concluída sem que a funcionalidade maior esteja pronta. Exemplo: criar a tabela de clientes conclui uma subtarefa; não conclui o cadastro de clientes no produto.

## 2. Fila sugerida

| ID | Entrega ou tarefa | Tipo | Estado inicial | Depende de | Critério principal |
| --- | --- | --- | --- | --- | --- |
| PROD-01 | Explorar problema, público e hipótese de versão comercial | Produto | A definir | Conversas com oficinas quando disponíveis | Documento distingue suposições de evidências e identifica uma necessidade real |
| PROD-02 | Definir entrada e matriz de acesso no cenário de estudo | Domínio e estudo | A definir | Cenário fictício; decisões D03-D05 para o exercício | Responsável por cada operação e contexto da oficina documentados; hipótese comercial separada |
| BASE-01 | Ajustar integração do Tailwind e do tema PrimeNG | Técnica | A fazer | Nenhuma decisão de domínio | Build passa; uma página mostra utilitários e componente com tema |
| UX-01 | Esboçar o fluxo e padronizar as primeiras telas | Design | A fazer | Cenário de estudo; alinhar regras antes de finalizar | Login e primeiro cadastro têm estados e navegação compreensíveis |
| ACESSO-01 | Completar login no navegador e entrada em oficina autorizada | Entrega | A definir | PROD-02, BASE-01, UX-01 | Entrada, falha de login, expiração e saída seguem a política; outra oficina fica inacessível |
| CLIENTE-01 | Cadastrar, buscar e consultar clientes da oficina | Entrega | A definir | ACESSO-01; campos e permissões aprovados | Dado salvo pela tela aparece ao buscar e não vaza entre oficinas |
| VEICULO-01 | Cadastrar e localizar veículo com vínculo ao cliente | Entrega | A definir | CLIENTE-01; regra de identificação/propriedade | Veículo e cliente pertencem à oficina e o vínculo segue a regra definida |
| SERVICO-01 | Cadastrar e selecionar serviços do catálogo | Entrega | A definir | ACESSO-01; regras do cenário de estudo | Nome, valor e atividade seguem as regras do exercício |
| OS-01 | Definir o ciclo de vida e o modelo mínimo da OS | Domínio e design | A definir | Cenário de atendimento fictício; confirmar com oficina antes de tratar como requisito comercial | Estados, itens, preços, permissões e critérios de conclusão documentados |
| OS-02 | Abrir e consultar uma OS | Entrega | A definir | VEICULO-01, OS-01; SERVICO-01 se o fluxo exigir catálogo | OS possui identificação, cliente/veículo, itens aplicáveis e estado persistidos |
| OS-03 | Acompanhar, concluir e consultar histórico da OS | Entrega | A definir | OS-02 | Mudanças permitidas preservam itens/preços/histórico definidos |
| PILOTO-01 | Preparar um ambiente recuperável e realizar piloto assistido | Validação | A definir | PROD-01, fluxo mínimo, dados e suporte combinados | Oficina executa cenários; problemas e métricas são registrados; recuperação de dados verificada antes de dados reais |

**Ordem didática proposta:** BASE-01 -> PROD-02 e UX-01 -> ACESSO-01 -> CLIENTE-01 -> VEICULO-01 -> SERVICO-01 -> OS-01/02/03. PROD-01 pode avançar em paralelo quando houver contato com oficinas; seu resultado orientará o escopo comercial e PILOTO-01. Não é necessário ter um problema comercial definido para aprender com o primeiro cadastro. A escolha anterior de atendimento/OS não constitui prioridade comercial.

Para cada tarefa, registrar um resultado funcional e um objetivo de aprendizado. Exemplo de BASE-01: explicar como os estilos entram no build e demonstrar um componente com tema. Exemplo de CLIENTE-01: explicar o caminho formulário -> contrato HTTP -> validação -> persistência e demonstrar a criação/consulta pela tela.

## 3. Detalhamento de BASE-01

**Título:** fazer a base visual compilar e renderizar corretamente.

**Motivo:** dar uma base verificável para construir as telas do produto.

**Evidências atuais:**

- `angular.json` referencia `src/styles.css` no build e nos testes.
- Existe `styles.css` na raiz, contendo a importação do Tailwind; não existe o arquivo no caminho referenciado.
- O arquivo de configuração encontrado é `postcssrc.json`, sem o ponto inicial do nome utilizado pelo guia de instalação.
- `app.config.ts` ainda não registra `providePrimeNG` e o tema.

**Verificação em 20/10/2026:** `npm run build` foi executado e falhou com `Could not resolve "src/styles.css"`. A tarefa permanece aberta. Não houve alteração da configuração durante o levantamento.

**Escopo:** alinhar os caminhos/configurações existentes, registrar o tema e demonstrar um componente. Preservar standalone e os estilos SCSS que forem necessários.

**Critérios de aceite:**

- [ ] `npm run build` termina com sucesso.
- [ ] As classes Tailwind usadas na página de demonstração produzem o resultado esperado.
- [ ] Um componente PrimeNG aparece com o tema escolhido.
- [ ] A configuração de estilos dos testes acompanha a da aplicação.
- [ ] A página é conferida no navegador e o resultado fica registrado.

**Verificações sugeridas:** build, testes existentes afetados e conferência visual. Rodar build não substitui conferir a aparência da tela.

## 4. Exemplo de uma entrega: CLIENTE-01

Este exemplo é um rascunho. Só mover para `Pronta para começar` após aprovar campos, permissões e contrato.

**Necessidade:** como pessoa autorizada a atender na oficina, quero cadastrar e localizar um cliente para preparar seu atendimento sem redigitar seus dados.

**Resultado demonstrável:** cadastrar um cliente pela tela e encontrá-lo novamente, com dados persistidos e restritos à oficina autorizada.

**Regras a confirmar:**

- O schema atual exige tipo de pessoa e nome/razão social; CPF/CNPJ é opcional. Confirmar se o fluxo inicial mantém essas regras.
- Definir campos de contato necessários, formato dos documentos e política para duplicidade.
- Definir quem pode criar, consultar e alterar clientes.
- O backend determina e valida a oficina acessada com base na identidade e no vínculo; um ID enviado pelo frontend não concede acesso.

**Escopo proposto:** formulário mínimo, criação, listagem/busca e consulta de detalhe. Edição, inativação, importação e endereços podem virar tarefas próprias conforme a necessidade da primeira entrega.

**Critérios de aceite propostos:**

- [ ] Pessoa autorizada salva um cliente com os campos obrigatórios aprovados.
- [ ] Campos inválidos geram mensagens junto aos respectivos campos; os valores digitados são preservados.
- [ ] O cadastro concluído aparece ao consultar novamente a oficina.
- [ ] CPF/CNPJ já usado na mesma oficina respeita a regra de duplicidade; o mesmo documento em outra oficina segue a regra multiempresa definida.
- [ ] Usuário sem vínculo/permissão não lê nem grava dados dessa oficina, inclusive alterando IDs na requisição.
- [ ] Lista sem resultados, carregamento, erro da API e repetição do envio são tratados.
- [ ] O cenário é demonstrado pela tela e acompanhado por verificações da API e da persistência.

**Subtarefas possíveis:**

1. Aprovar campos, regras, permissões e esboço da tela.
2. Definir contrato de entrada/saída e erros da API.
3. Implementar consultas e gravação com isolamento por oficina.
4. Implementar formulário e listagem no Angular.
5. Integrar e verificar o fluxo completo, incluindo tentativas indevidas de acesso.
6. Registrar a demonstração e atualizar o status da entrega.

O contrato de API e os cenários de isolamento devem orientar a implementação; essa lista não exige concluir toda a camada backend antes de começar as telas.

## 5. Modelo para copiar ao criar uma tarefa

```markdown
### ID - Título com um resultado concreto

Estado: A definir / Pronta para começar / Em andamento / Em validação / Concluída / Bloqueada
Tipo: Produto / Design / Técnica / Entrega / Correção
Responsável: a atribuir
Entrega maior: vínculo com o objetivo do produto
Depende de: IDs ou decisões necessárias

Objetivo de aprendizado:
O que quero conseguir compreender e explicar ao terminar.
Cenário: fictício para estudo / confirmado com uma oficina.

Necessidade da pessoa usuária:
Como [perfil], quero [ação], para [benefício].
Para tarefa técnica, explicar qual entrega ela habilita.

Situação atual e evidências:
O que existe e onde foi verificado.

Resultado esperado:
O que será possível demonstrar ao terminar.

Escopo e limites:
O que será entregue nesta tarefa e o que fica em outra.

Regras e decisões pendentes:
Campos, permissões, validações e pontos que precisam de resposta.

Critérios de aceite:
- [ ] Resultado observável 1.
- [ ] Resultado observável 2.
- [ ] Cenário de falha relevante.

Subtarefas:
- [ ] Passo necessário para produzir o resultado.

Verificação:
Como testar, cenário, ambiente e resultado esperado.

Evidência ao concluir:
Comando/resultado, demonstração, captura ou referência de alteração.
Breve explicação do que aprendi e do motivo das principais escolhas.

Próxima ação / bloqueio:
Uma ação concreta para retomar o trabalho.
```

A estrutura de necessidade e critérios de aceite é baseada no conceito de [histórias de usuário](https://www.atlassian.com/agile/project-management/user-stories/). As tarefas acima são propostas específicas para o AutoFlow.

## 6. Definição de pronto

Critérios de aceite descrevem o que aquela tarefa deve fazer. A definição de pronto registra o padrão de qualidade aplicado a todas as entregas do mesmo tipo.

Para uma entrega funcional do AutoFlow:

- [ ] Critérios específicos atendidos e decisões relevantes registradas.
- [ ] Fluxo completo demonstrado no ambiente combinado, incluindo persistência quando aplicável.
- [ ] Erros e estados de interface relevantes tratados.
- [ ] Acesso por perfil e isolamento por oficina verificados quando há dados operacionais.
- [ ] Build e verificações pertinentes passaram; falhas conhecidas e limites são explícitos.
- [ ] Documentação/contrato atualizado quando afetado.
- [ ] Retorno de revisão ou validação incorporado.
- [ ] A tarefa contém evidência e o próximo trabalho está identificado.

Para uma decisão de produto, a evidência é a escolha justificada e seus efeitos no plano. Para uma tarefa visual isolada, não exigir um banco que não faça parte de seu escopo. Ajustar a definição ao tipo de trabalho sem confundir uma subtarefa concluída com a entrega maior.

## 7. Encerramento de cada sessão

```markdown
Data:
Tarefa principal:
O que foi feito:
O que foi verificado e resultado:
O que ainda não foi verificado:
Decisão tomada ou bloqueio:
Próxima ação concreta:
```

Essa anotação curta deve permitir retomar o trabalho sem redescobrir o estado do projeto.
