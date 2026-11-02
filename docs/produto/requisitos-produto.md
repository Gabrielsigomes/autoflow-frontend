# Requisitos do produto AutoFlow

Este documento organiza o conteúdo de `Gestão-automotivo.odt` para consulta e planejamento. É uma transcrição estruturada da proposta de requisitos, não uma confirmação de que as funcionalidades já existam nem uma aprovação de escopo para implementação.

## 1. Para que serve o sistema

A proposta descreve um sistema para apoiar a operação de oficinas automotivas, desde o cadastro de clientes e veículos até a ordem de serviço, orçamento, execução, pagamento e liberação do veículo. Também inclui catálogo de serviços, estoque, fornecedores, compras, usuários e relatórios.

Fluxo operacional sugerido no documento:

**Cliente → Veículo → Entrada na oficina → Ordem de serviço → Orçamento → Aprovação → Execução → Pagamento → Saída**

Esse fluxo é uma visão geral. Nem todos os passos ou regras estão detalhados, e a prioridade comercial ainda precisa ser validada com oficinas.

## 2. Pessoas e perfis envolvidos

O documento cita os seguintes perfis possíveis dentro da oficina:

- **Administrador:** gerencia usuários e operações administrativas; permissões exatas a definir.
- **Atendente:** participa do atendimento e dos registros de clientes, veículos e ordens; permissões exatas a definir.
- **Mecânico:** registra diagnóstico, serviços executados e informações técnicas; permissões exatas a definir.
- **Estoquista:** acompanha produtos, fornecedores e movimentações de estoque; permissões exatas a definir.
- **Financeiro:** registra pagamentos e consulta informações financeiras; permissões exatas a definir.
- **Cliente da oficina:** recebe orçamento e participa da aprovação ou recusa. O documento não define se terá conta ou acesso direto ao sistema.

Os perfis acima são sugestões do documento de requisitos, não uma matriz de autorização aprovada. O produto também possui conceitos de usuário global e vínculo/perfil por empresa no modelo atual. A correspondência entre os perfis sugeridos e o código deve ser decidida antes de implementar permissões.

## 3. Requisitos funcionais

Os IDs originais foram preservados para facilitar rastreabilidade com o ODT.

### 3.1 Clientes e veículos — RF01 a RF06

| ID | Requisito |
| --- | --- |
| RF01 | Cadastrar clientes. |
| RF02 | Consultar, editar e inativar clientes. |
| RF03 | Cadastrar um ou mais veículos para cada cliente. |
| RF04 | Consultar, editar e inativar veículos. |
| RF05 | Armazenar placa, marca, modelo, ano, cor, quilometragem e observações do veículo. |
| RF06 | Transferir o vínculo de um veículo para outro cliente, mantendo o histórico anterior de propriedade. |

### 3.2 Entrada e saída de veículos — RF07 a RF12

| ID | Requisito |
| --- | --- |
| RF07 | Registrar a entrada de um veículo na oficina. |
| RF08 | Registrar data, hora, quilometragem, nível de combustível e motivo da entrada. |
| RF09 | Registrar avarias ou condições encontradas na entrada. |
| RF10 | Anexar fotos do veículo ao registro de entrada. |
| RF11 | Registrar a saída do veículo. |
| RF12 | Armazenar data, hora, quilometragem e responsável pela liberação do veículo. |

### 3.3 Ordens de serviço — RF13 a RF23

| ID | Requisito |
| --- | --- |
| RF13 | Cadastrar uma ordem de serviço para o veículo. |
| RF14 | Informar o problema relatado pelo cliente. |
| RF15 | Registrar o diagnóstico técnico. |
| RF16 | Adicionar serviços à ordem de serviço. |
| RF17 | Adicionar peças e materiais à ordem de serviço. |
| RF18 | Calcular mão de obra, peças, descontos e total da ordem. |
| RF19 | Atribuir um mecânico responsável pela ordem de serviço. |
| RF20 | Atualizar o status da ordem de serviço. |
| RF21 | Consultar o histórico de ordens de serviço do veículo. |
| RF22 | Adicionar observações internas e observações destinadas ao cliente. |
| RF23 | Imprimir ou gerar um documento da ordem de serviço. |

Estados possíveis citados para a ordem de serviço:

1. Aberta
2. Aguardando diagnóstico
3. Aguardando aprovação
4. Aprovada
5. Em execução
6. Aguardando peça
7. Finalizada
8. Entregue
9. Cancelada

A sequência permitida, as transições, os responsáveis por cada mudança e o significado de reabertura ainda precisam ser definidos.

### 3.4 Catálogo de serviços — RF24 a RF27

| ID | Requisito |
| --- | --- |
| RF24 | Cadastrar os tipos de serviços oferecidos pela oficina. |
| RF25 | Definir descrição, duração estimada e valor padrão do serviço. |
| RF26 | Editar e inativar serviços. |
| RF27 | Alterar o valor do serviço especificamente em uma ordem, conforme a permissão do usuário. |

Exemplos citados: troca de óleo, alinhamento, balanceamento, revisão de freios e diagnóstico eletrônico.

### 3.5 Produtos, estoque, fornecedores e compras — RF28 a RF39

| ID | Requisito |
| --- | --- |
| RF28 | Cadastrar peças, produtos e materiais. |
| RF29 | Registrar entradas e saídas de itens do estoque. |
| RF30 | Atualizar o estoque quando uma peça for utilizada em uma ordem de serviço. |
| RF31 | Definir estoque mínimo. |
| RF32 | Alertar quando um produto atingir o estoque mínimo. |
| RF33 | Consultar o histórico de movimentações do estoque. |
| RF34 | Ajustar o estoque com registro do motivo e do usuário responsável. |
| RF35 | Cadastrar fornecedores. |
| RF36 | Consultar, editar e inativar fornecedores. |
| RF37 | Vincular peças e produtos aos fornecedores. |
| RF38 | Registrar compras de produtos e peças. |
| RF39 | Registrar custos e quantidades dos itens comprados. |

### 3.6 Orçamentos e aprovação — RF40 a RF45

| ID | Requisito |
| --- | --- |
| RF40 | Gerar um orçamento a partir de uma ordem de serviço. |
| RF41 | Enviar ou disponibilizar o orçamento ao cliente. |
| RF42 | Registrar a aprovação ou recusa do orçamento. |
| RF43 | Registrar a data e a pessoa responsável pela aprovação. |
| RF44 | Manter o histórico das alterações do orçamento. |
| RF45 | Impedir a execução de serviços não aprovados, salvo autorização de usuário com permissão específica. |

### 3.7 Usuários, acesso e auditoria — RF46 a RF51

| ID | Requisito |
| --- | --- |
| RF46 | Cadastrar usuários. |
| RF47 | Autenticar usuários por login e senha. |
| RF48 | Permitir alterar e recuperar senha. |
| RF49 | Ativar e inativar usuários. |
| RF50 | Definir perfis e permissões de acesso. |
| RF51 | Registrar ações importantes realizadas pelos usuários. |

### 3.8 Pagamentos — RF52 a RF57

| ID | Requisito |
| --- | --- |
| RF52 | Registrar pagamentos relacionados à ordem de serviço. |
| RF53 | Registrar diferentes formas de pagamento. |
| RF54 | Dividir um pagamento entre mais de uma forma. |
| RF55 | Registrar pagamentos parciais. |
| RF56 | Informar o valor pago e o saldo pendente. |
| RF57 | Emitir ou imprimir comprovante de pagamento. |

### 3.9 Pesquisa, visão operacional e relatórios — RF58 a RF63

| ID | Requisito |
| --- | --- |
| RF58 | Pesquisar ordens por número, cliente, placa, período e status. |
| RF59 | Exibir os veículos que estão atualmente na oficina. |
| RF60 | Apresentar relatório de serviços realizados por período. |
| RF61 | Apresentar relatório de faturamento. |
| RF62 | Apresentar relatório de produtos com estoque baixo. |
| RF63 | Apresentar relatório de produtividade por mecânico. |

## 4. Regras de negócio

As regras abaixo foram separadas dos requisitos funcionais porque afetam o comportamento de vários fluxos.

| ID | Regra proposta no documento |
| --- | --- |
| RN01 | Uma ordem de serviço deve estar vinculada a um cliente e a um veículo. |
| RN02 | Um veículo pode possuir várias ordens de serviço; cada ordem pertence a apenas um veículo. |
| RN03 | Uma ordem entregue não pode ser alterada sem reabertura autorizada. |
| RN04 | O veículo só pode ser liberado após a conclusão da ordem ou mediante autorização registrada. |
| RN05 | Peças utilizadas em uma ordem devem gerar movimentação de saída no estoque. |
| RN06 | Uma saída de estoque não pode deixar quantidade negativa, exceto se a empresa permitir estoque negativo. |
| RN07 | O valor final deve considerar serviços, peças, materiais, acréscimos e descontos. |
| RN08 | Descontos acima de um limite definido exigem autorização. |
| RN09 | Toda mudança de status da ordem deve registrar data, hora e usuário responsável. |
| RN10 | O histórico de manutenção do veículo deve permanecer disponível após a troca de proprietário. |

## 5. Primeira versão sugerida no documento

O ODT recomenda começar por um recorte operacional, em vez de implementar todo o escopo de uma vez:

1. Cadastro de clientes.
2. Cadastro de veículos.
3. Registro da entrada do veículo.
4. Cadastro de serviços.
5. Cadastro de peças.
6. Criação da ordem de serviço.
7. Inclusão de serviços e peças na ordem.
8. Cálculo do orçamento.
9. Aprovação ou recusa.
10. Alteração do status.
11. Registro do pagamento.
12. Liberação do veículo.
13. Consulta do histórico.
14. Controle básico de usuários.

Esta lista é uma sugestão de priorização do documento, não um MVP aprovado. Deve ser confrontada com o backlog e validada com o responsável pelo produto e, para uso comercial, com oficinas.

## 6. Pontos a detalhar antes de transformar em critérios de aceite

O documento apresenta a intenção, mas não especifica todas as regras necessárias para uma implementação consistente. Confirmar, conforme a área entrar no planejamento:

- Campos obrigatórios, formatos, duplicidade e política de inativação de clientes, veículos, serviços, produtos e fornecedores.
- Se clientes terão acesso ao sistema ou se receberão orçamento por outro canal; como serão registradas aprovação, recusa e identidade de quem respondeu.
- Quais dados e evidências compõem a entrada/saída, como fotos são armazenadas e quais limites de arquivo serão aceitos.
- Matriz de permissões por perfil, por ação e por empresa; relação com identidade global e vínculo do usuário à oficina.
- Estados da ordem e transições permitidas; cancelamento, reabertura, autorização excepcional e quem pode realizá-los.
- Regras de cálculo, arredondamento, impostos, acréscimos, descontos e preservação do preço aplicado em uma ordem quando o catálogo mudar.
- Política de estoque negativo, unidades de medida, custo, devolução, ajuste e concorrência de movimentações.
- Se um orçamento pode ser alterado após envio ou aprovação e como preservar seu histórico.
- Formas de pagamento, estorno, comprovantes, pagamentos parciais e regra de saldo pendente.
- Conteúdo, filtros, período, permissões e exportação de cada relatório.
- Escopo de isolamento dos dados entre oficinas e regras de histórico quando veículo ou cliente mudar de vínculo.

## 7. Relação com o estado atual do AutoFlow

Este arquivo não marca requisitos como implementados. Consulte [Plano inicial do produto](README.md) para o retrato e as hipóteses já registrados e verifique o código antes de descrever o estado atual.

Na inspeção que motivou a documentação do produto, o backend já possuía entidades relacionadas a clientes, veículos e serviços, mas não APIs operacionais para esses módulos; ordens de serviço, entrada/saída, estoque, orçamento e pagamentos não foram encontrados como funcionalidades implementadas. Esse retrato pode ficar desatualizado: reconfirme os projetos e testes relevantes antes de usar a informação em decisões.

O documento de requisitos não substitui contratos de API, decisões de arquitetura nem regras de segurança. Ao selecionar uma entrega, converta os requisitos pertinentes em critérios de aceite verificáveis e defina os casos negativos, permissões e limites multiempresa.

## Fonte

`Gestão-automotivo.odt`, fornecido pelo responsável pelo produto. Os requisitos e regras foram reagrupados e reescritos para facilitar a leitura; os IDs RF01–RF63 e RN01–RN10 e o sentido dos itens foram preservados.
