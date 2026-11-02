# AutoFlow: plano inicial do produto

Levantamento em 20/10/2026. Projeto de estudo com intenção de evoluir para um sistema comercial para oficinas. As hipóteses comerciais serão validadas conforme o projeto amadurecer.

## 1. Como usar estes documentos

- Este arquivo registra o objetivo, o estado atual e as decisões do produto.
- [Backlog](backlog.md) organiza as entregas, suas dependências e o modelo de tarefa.
- [Padrões de interface](padroes-interface.md) registra as escolhas visuais e de interação que devem se repetir nas telas.
- [Requisitos do produto](requisitos-produto.md) organiza os requisitos do documento de gestão automotiva por área, separando requisitos funcionais, regras de negócio, proposta inicial e pontos a confirmar.

O modelo de entidades descreve dados e relações. O plano do produto descreve quem usa, qual problema será resolvido e como reconhecer uma entrega útil. Uma entidade criada não equivale a uma funcionalidade concluída.

Os arquivos de planejamento ficam inicialmente neste repositório por ser o espaço de trabalho desta análise, mas tratam do produto inteiro. Mudanças no backend também devem atualizar o status correspondente aqui. Se futuramente houver um local central de documentação, mover os documentos para ele e manter um link nos dois repositórios.

## 2. O que foi verificado

Foram inspecionados:

- Frontend em `D:\Fontes\autoflow-frontend`: dependências, configuração Angular, rotas, componente inicial, arquivos de estilos e diretórios.
- Backend em `D:\Fontes\autoflow-backend`: instruções de colaboração, documentação de autenticação, controladores, serviços administrativos, segurança, entidades, repositórios, migrações e testes existentes.
- PDF em `C:\Users\User\Downloads\modelo_entidades_oficina_saas_atualizado (1).pdf`: sete páginas, texto e visualização das páginas. A cópia sem o sufixo `(1)` possui conteúdo binário idêntico.

Este levantamento não consultou o banco em execução, não aplicou migrações, não iniciou o backend e não executou seus testes. A documentação antiga é referência histórica; o estado abaixo corresponde ao código lido nesta data. Não há confirmação de um fluxo completo de produto funcionando entre navegador, API e banco.

Foi executado `npm run build` no frontend nesta revisão. O comando terminou com erro `Could not resolve "src/styles.css"`. O arquivo referenciado não existe nesse caminho; o CSS encontrado está na raiz do repositório. Esse resultado confirma a pendência registrada em BASE-01, sem indicar o resultado das outras configurações após sua futura correção. Os testes do frontend não foram executados nesta revisão.

## 3. Retrato do projeto

| Área | Evidência atual | O que falta para virar uma entrega utilizável |
| --- | --- | --- |
| Base Angular | Angular 20 declarado, inicialização standalone, SCSS, PrimeNG 20.4.0 e Tailwind 4 declarados; pastas `core`, `shared`, `layout` e `modulos` criadas e sem conteúdo funcional | Resolver a configuração de estilos e tema; construir páginas e navegação |
| Configuração visual | `angular.json` aponta para `src/styles.css`, mas o arquivo está na raiz; existe `postcssrc.json` sem o ponto inicial; `app.config.ts` ainda não registra o PrimeNG | Alinhar o caminho do CSS, configurar o PostCSS reconhecido pelo build e registrar o tema; confirmar visualmente |
| Telas e rotas | Template padrão do Angular e `routes = []` | Login, contexto da oficina, páginas operacionais e integração HTTP |
| Autenticação | Código para cookie CSRF, login, emissão de JWT e validação Bearer; testes MockMvc existentes; documentação em `docs/api/autenticacao.md` no backend | Verificar o estado executável atual e integrar o navegador; definir expiração, saída e tratamento de sessão no frontend |
| Administração | APIs e serviços para usuários, empresas e vínculos; cadastro inicial cria usuário, empresa e vínculo administrador | Definir quem pode executar cada operação e verificar esse acesso no servidor |
| Isolamento por oficina | Modelo separa identidade global, empresa e vínculo por empresa | Implementar e verificar autorização por recurso e vínculo ativo; a configuração lida exige login, mas não aplica essa política de oficina |
| Banco | Dez tabelas representadas por entidades e doze migrações Flyway | Verificar em ambiente de desenvolvimento quais migrações foram aplicadas; não considerar o banco ativo confirmado apenas pela existência dos scripts |
| Clientes, veículos e catálogo de serviços | Entidades e migrações presentes | Repositórios operacionais, regras, APIs, telas, integração e verificações de isolamento |
| Histórico cliente-veículo e endereços | Entidades e tabelas associativas presentes | Regras e operações para usar os relacionamentos com segurança e coerência |
| Ordem de serviço e orçamento | Não encontrados no código nem como entidades no PDF; o PDF os menciona como evolução futura | Validar o fluxo e modelar a primeira versão |
| Peças, estoque e pagamentos da oficina | Não encontrados no escopo inspecionado; explicitamente fora do modelo inicial do PDF | Decidir prioridade antes de planejar implementação |
| Assinatura e cobrança do SaaS | Não encontrei implementação nos arquivos inspecionados | Definir quem compra, como entra no piloto e como será cobrado; automatizar quando houver necessidade validada |
| Qualidade | Três testes iniciais no frontend; quatro classes de testes no backend, incluindo autenticação, bootstrap e cadastro inicial | Executar verificações atuais e acrescentar evidências por entrega; existência de teste não significa teste aprovado |

### Pontos do modelo a decidir ao desenvolver as funcionalidades

- O PDF usa `MASTER`/`USUARIO` globalmente e cinco perfis operacionais; o código usa `ADMINISTRADOR`/`USUARIO` globalmente e `ADMIN`/`FUNCIONARIO` no vínculo. Registrar os significados e a matriz de acesso antes de ampliar ou renomear perfis.
- `Veiculo` e `Servico` permitem empresa nula no mapeamento e nas migrações. Definir a obrigatoriedade de pertencer a uma oficina para os registros operacionais.
- O PDF prevê placa obrigatória e curta; o código e o SQL permitem placa nula de até 150 caracteres. Decidir a regra com base nos veículos atendidos.
- O PDF recomenda unicidade do nome do serviço por empresa; essa restrição não está presente na migração atual.
- As chaves de `ClienteVeiculo` garantem a existência dos registros, mas não garantem que pertençam à mesma empresa. A regra precisa ser aplicada e verificada.
- O valor de um serviço lançado em uma futura OS deve preservar o preço aplicado naquela operação; mudanças no catálogo não devem recalcular o histórico sem uma ação explícita definida pelo produto.

Esses pontos alimentam as tarefas da respectiva funcionalidade. Não são autorização para executar migrações ou refatorações.

## 4. Objetivo de aprendizado e possibilidade comercial

**Direção confirmada pelo responsável em 20/10/2026:** aprender construindo o AutoFlow e desenvolver um sistema que possa ser vendido para uma oficina no futuro. Ainda não existe um problema comercial prioritário definido.

O planejamento passa a ter duas frentes:

| Frente | Objetivo | Como reconhecer avanço |
| --- | --- | --- |
| Aprendizado | Construir funcionalidades completas e compreender suas decisões e responsabilidades | Conseguir explicar o fluxo, demonstrá-lo e verificar seus resultados |
| Produto comercial | Descobrir quais necessidades reais de uma oficina justificam adoção e pagamento | Retorno de oficinas, problema prioritário identificado e piloto com resultado observado |

É possível avançar no estudo com cenários fictícios e regras didáticas explícitas. A descoberta comercial não é pré-requisito para corrigir a base, aprender integração ou desenvolver o primeiro cadastro. Uma decisão tomada como exercício pode precisar de revisão ao conhecer uma oficina real.

### Objetivos de aprendizado por etapa

| Etapa proposta | O que estudar | Resultado para demonstrar |
| --- | --- | --- |
| Base visual | Build, estilos globais, standalone e biblioteca de componentes | Uma página compila e apresenta os estilos/componentes esperados |
| Acesso e oficina | Integração HTTP, autenticação, autorização e contexto por empresa | Usuário acessa somente os recursos permitidos da oficina do cenário |
| Clientes | Contratos, validação, formulário, API, persistência e erros | Cliente criado pela tela pode ser encontrado novamente |
| Veículos e vínculos | Relacionamentos e regras de domínio | Cliente e veículo são vinculados na oficina correta |
| Serviços | Valores monetários, regras do catálogo e operações por empresa | Serviço cadastrado pode ser consultado e selecionado |
| OS simples | Ciclo de vida, composição de itens e histórico | Atendimento fictício pode ser aberto, acompanhado e concluído |

Essa ordem é uma proposta didática baseada no código existente. Nenhuma necessidade comercial de atendimento/OS está declarada validada.

### Hipótese comercial para explorar no futuro

**Público inicial proposto:** proprietário e pessoa responsável pelo atendimento de uma oficina automotiva independente. Tamanho da equipe, especialidade e dispositivos utilizados ainda precisam ser confirmados.

**Problema proposto:** dificuldade de reunir os dados do cliente, do veículo e do serviço em andamento e saber o que precisa acontecer em seguida.

**Promessa inicial proposta:** permitir que a oficina registre um atendimento e acompanhe sua ordem de serviço até a conclusão, preservando o histórico do veículo.

**Resultado observável proposto:** uma pessoa da oficina consegue registrar um atendimento, localizar a OS, consultar seu andamento e concluí-la sem depender do desenvolvedor para operar as telas.

Público, prioridade comercial, causas do problema, promessa e resultado acima são hipóteses. Não há pesquisa com oficinas documentada nos arquivos inspecionados. Enquanto o estudo avança, registrar o que é regra de um exercício e o que foi confirmado com uma oficina.

### Conversa curta com uma oficina piloto

Sugestão de descoberta inicial: conversar com duas ou três oficinas acessíveis e observar um atendimento real. Isso gera sinais qualitativos; não é prova de demanda de mercado.

1. Peça que mostrem como registraram o último atendimento, do recebimento do veículo à entrega.
2. Pergunte onde houve perda de informação, retrabalho ou demora, e peça um exemplo concreto.
3. Identifique quem registra dados, quem acompanha o serviço e quem decide contratar o sistema.
4. Descubra se usam computador, celular ou ambos e em que condições de conexão.
5. Identifique o que precisariam manter no processo atual para conseguir experimentar o AutoFlow.
6. Combine uma demonstração com dados fictícios e pergunte se aceitariam um piloto; registre as condições, sem pressupor intenção de compra.

Registre data, perfil da oficina, evidências, problema prioritário e o que mudou no plano. O princípio de começar pela compreensão do problema e dos usuários é descrito no [guia de descoberta do GOV.UK](https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works); a escala reduzida sugerida aqui é uma adaptação para este projeto.

## 5. Roteiro funcional de estudo e hipótese de versão comercial

Fluxo didático proposto para construir progressivamente:

```text
Entrar -> acessar uma oficina autorizada -> localizar/cadastrar cliente
       -> localizar/cadastrar veículo -> abrir OS -> registrar itens e andamento
       -> concluir OS -> consultar histórico
```

Esse fluxo orienta o exercício. A primeira versão comercial será recortada após conhecer necessidades reais; poderá aproveitar somente parte do que foi estudado.

### Escopo de estudo proposto

- Acesso autenticado e contexto de oficina validado pelo backend.
- Entrada de uma oficina fictícia e de seu responsável; provisionamento assistido é uma opção para o cenário de estudo. Uma oficina piloto real pertence à etapa de validação comercial.
- Cadastro e busca de clientes e veículos, com seu vínculo.
- Catálogo mínimo de serviços para exercitar o atendimento fictício.
- Abertura, consulta, atualização de andamento e conclusão de uma OS simples.
- Histórico básico de atendimentos do veículo.
- Uma interface consistente, com carregamento, erros, lista vazia e acesso negado tratados.

### Evoluções posteriores, conforme interesse de estudo ou necessidade validada

- Controle completo de estoque, compras e fornecedores.
- Financeiro completo, emissão fiscal e integrações bancárias.
- Pagamento online pelo cliente da oficina.
- Automação de WhatsApp, aplicativos nativos e relatórios avançados.
- Contratação self-service e cobrança automática da assinatura do SaaS.

Pagamento de uma OS pela pessoa atendida e pagamento da assinatura do AutoFlow pela oficina são problemas diferentes. Registrar ambos separadamente no planejamento.

### O que medir no piloto

- A pessoa consegue completar o fluxo sem ajuda? Onde precisa de intervenção?
- Quanto tempo leva para localizar um cliente, veículo ou OS, comparado ao processo atual?
- Os atendimentos reais do período combinado estão sendo registrados no sistema?
- Quais erros impedem o trabalho, e quantas vezes ocorrem?
- A oficina deseja continuar usando? Em quais condições aceitaria contratar?

Definir uma meta e um período de observação com a oficina antes do piloto. Não há metas comerciais ou tempos de uso validados neste momento.

## 6. Decisões pendentes

| ID | Decisão | Quando resolver | Estado |
| --- | --- | --- | --- |
| D01 | Qual perfil de oficina e qual problema comercial prioritário serão atendidos? | Durante a descoberta comercial, antes de fechar a oferta | Ainda não definido; não bloqueia a trilha de estudo |
| D02 | Quem usa no dia a dia e quem decide pagar pelo produto? | Descoberta inicial | A definir |
| D03 | A primeira oficina entra por cadastro público ou por provisionamento assistido? | Antes da entrega de acesso | A definir; o PDF sugere provisionamento administrativo |
| D04 | Quais operações cabem ao administrador do SaaS, ao administrador da oficina e aos demais usuários? | Antes de expor dados operacionais | A definir |
| D05 | Como escolher a oficina quando um usuário possui mais de um vínculo? | Entrega de acesso | A definir |
| D06 | Quais campos mínimos são necessários para cliente, veículo e atendimento? | Antes de cada entrega | A definir |
| D07 | Quais estados a OS possui, quem pode mudá-los e como tratar cancelamento/reabertura? | Antes da implementação de OS | A definir |
| D08 | Como funcionam expiração, saída e continuidade do acesso no navegador? | Entrega de acesso | A definir |
| D09 | Como será o piloto, suporte, cobrança inicial e autorização para uso dos dados? | Antes do uso real | A definir |
| D10 | Onde serão hospedados aplicação e banco, e como serão recuperados os dados? | Antes do uso real | A definir; implantação atual não verificada |

Para cada decisão: registrar a escolha, o motivo, a data e o impacto nas tarefas. Propostas deste documento não devem ser tratadas como decisões aprovadas.

Decisões necessárias ao exercício podem usar um cenário fictício com escopo reduzido e justificativa registrada. Decisões de negócio destinadas a uma oficina real exigem confirmação com esse contexto. Aprender o controle de acesso, por exemplo, continua necessário para o cenário SaaS mesmo antes de escolher o público comercial.

## 7. Ordem sugerida de trabalho

| Etapa | Resultado demonstrável | Condição para avançar |
| --- | --- | --- |
| 0. Definir a próxima entrega de estudo | Objetivo de aprendizado e cenário fictício descritos | Resultado demonstrável e critérios registrados |
| 1. Estabilizar a base visual | Uma página simples renderiza com tema e utilitários | Build e conferência no navegador aprovados |
| 2. Acesso e contexto | Usuário entra e acessa somente a oficina autorizada | Integração e cenários negativos de autorização verificados |
| 3. Cliente e veículo | Cadastro e busca realizados na tela, persistidos na oficina correta | Uma pessoa consegue preparar um atendimento |
| 4. Serviço e OS | Um atendimento pode ser aberto, acompanhado e concluído | Fluxo operacional completo demonstrado |
| 5. Descoberta comercial e futuro piloto | Uma oficina avalia o fluxo e, quando houver condições, experimenta o sistema | Necessidade, adequação e decisão de continuidade registradas |

As etapas 3 e 4 podem ser divididas em entregas menores. Cada entrega deve atravessar tela, API e persistência quando essas partes fizerem parte do resultado. Não há estimativa de prazo porque disponibilidade, requisitos e validação ainda não foram definidos.

**Próxima atividade recomendada:** detalhar BASE-01 como uma tarefa de aprendizado e resolver a base visual. Em seguida, definir um cenário pequeno de usuário/oficina e completar o acesso integrado antes do primeiro cadastro operacional. Clientes é a primeira funcionalidade de negócio proposta para estudar o caminho completo entre tela, API e banco. As conversas com oficinas podem acontecer ao longo dessa construção; OS permanece como etapa didática posterior, sem prioridade comercial presumida.

## 8. Rotina para saber o que fazer em seguida

1. No início da semana, escolha um resultado demonstrável e as tarefas necessárias para ele.
2. Mantenha uma tarefa principal em andamento. Se surgir uma ideia, registre-a na fila e preserve o foco da entrega atual.
3. Ao terminar uma sessão, registre o que foi verificado, o bloqueio atual e a próxima ação concreta.
4. Antes de marcar uma funcionalidade como concluída, aplique a definição de pronto do backlog.
5. Ao demonstrar uma entrega, registre o retorno da oficina e ajuste a prioridade da fila.

Nas etapas de estudo, a demonstração pode ser feita pelo próprio responsável com dados fictícios: explicar o que aprendeu, o que decidiu e como verificou. Quando houver participação de uma oficina, registrar também o retorno real, distinguindo-o das suposições do exercício.

O quadro pode ser mantido em Markdown no início: `Ideias -> Pronta para começar -> Em andamento -> Em validação -> Concluída`. Use `Bloqueada` com o motivo explícito. Uma ferramenta externa pode ser adotada depois, se trouxer uma necessidade concreta.
