# Instruções locais — frontend AutoFlow

Este guia complementa `../AGENTS.md` com orientações específicas do frontend. Leia os dois antes de alterar este projeto. Para mudanças no contrato da API, consulte também a documentação correspondente no backend; este guia não substitui `autoflow-backend/AGENTS.md`.

## Stack e estado observado

- Angular 20, TypeScript 5.9, aplicação standalone, Angular Router, RxJS e `HttpClient`.
- PrimeNG 20 e `@primeuix/themes` estão declarados. `app.config.ts` registra `providePrimeNG` com Aura, animações e providers globais. Os módulos/componentes PrimeNG usados precisam ser importados em cada componente standalone que os utiliza; o provider global não importa componentes.
- Tailwind CSS 4 e `@tailwindcss/postcss` estão declarados. `.postcssrc.json` configura o plugin e `src/styles.scss` importa Tailwind. Consulte configuração e arquivos atuais antes de alterar o pipeline visual.
- O ponto de entrada atual é o template de início do Angular. `app.routes.ts` contém uma lista vazia. Os diretórios `core`, `layout`, `modulos` e `shared` encontrados não têm código funcional observado; a estrutura-alvo descrita abaixo orienta novas funcionalidades e não representa código já implementado.
- A configuração atual registra `provideHttpClient()`, mas não foi encontrado fluxo de telas/serviços de autenticação ou consumo operacional da API. `environment.development.ts` define uma URL local e `environment.ts` ainda tem URL de produção vazia; confirme o uso real antes de depender desses valores.

## Organização atual

- `src/main.ts`: inicialização por `bootstrapApplication` usando `AppComponent` e `appConfig`.
- `src/app/app.config.ts`: providers globais, incluindo router, HttpClient, animações e tema PrimeNG.
- `src/app/app.routes.ts`: definição das rotas Angular.
- `src/app/app.component.*`: componente raiz e template atual de exemplo.
- `src/environments/`: configurações selecionadas por substituições do build.
- `src/styles.scss` e o CSS global referenciado em `angular.json`: estilos globais; `app.component.scss`: estilo local do componente raiz.
- `public/`: arquivos estáticos copiados pelo build.
- `docs/produto/`: planejamento e requisitos do produto; diferencie requisitos propostos do que está implementado.

Use essa estrutura existente como ponto de partida. A organização-alvo informada para o frontend é:

```text
src/app/
├── core/
│   ├── autenticacao/
│   └── http/
├── shared/
│   ├── botao/
│   └── modal/
├── features/
│   ├── clientes/
│   │   ├── lista-clientes/
│   │   ├── formulario-cliente/
│   │   ├── cliente-api.service.ts
│   │   └── cliente.model.ts
│   ├── veiculos/
│   └── ordens-servico/
├── app.config.ts
└── app.routes.ts
```

Trate `core` como o lugar para preocupações transversais da aplicação, como autenticação e HTTP; `shared` para componentes reutilizáveis sem regra específica de um domínio; e `features` para funcionalidades organizadas por domínio. Em `clientes`, mantenha páginas/componentes, serviço de API e modelo agrupados na feature conforme o exemplo. Para `veiculos` e `ordens-servico`, aplique a mesma separação quando os arquivos forem necessários, sem criar antecipadamente componentes ou camadas vazias. A árvore é o padrão-alvo para novas implementações, não evidência de que esses diretórios e recursos já existem.

Mantenha componentes, serviços e modelos próximos da responsabilidade que atendem. Crie abstrações compartilhadas quando houver necessidade concreta e repetida. Não adote os diretórios antigos `layout` ou `modulos` como estrutura paralela sem uma decisão explícita de arquitetura.

## Standalone e dependências de componentes

- Preserve o modelo standalone atual; não introduza `NgModule` sem necessidade técnica demonstrada e decisão compatível com o projeto.
- Registre configuração global na composição existente em `app.config.ts` e rotas em `app.routes.ts`; não espalhe providers globais em componentes.
- Declare no componente standalone seus componentes, diretivas e pipes usados no template, incluindo componentes PrimeNG. Não confunda providers globais do PrimeNG com imports locais de UI.
- Mantenha a inicialização por `bootstrapApplication` em `main.ts`.
- Mantenha tipos explícitos nas fronteiras HTTP e nos modelos compartilhados. O tipo passado a `HttpClient` orienta o compilador, mas não valida a resposta recebida em runtime.

## API, autenticação e segurança no cliente

- Confirme rota, DTO, status e semântica no backend antes de criar ou alterar chamadas. Não invente endpoints, como renovação, logout de servidor ou perfil atual, sem contrato implementado.
- Centralize chamadas HTTP em serviços apropriados quando houver fluxos de domínio; mantenha componentes responsáveis pela interação e apresentação, não por copiar regras de negócio do backend.
- Use `environment` apenas para configuração pública do cliente. Nunca inclua senha, chave de assinatura, segredo ou credencial no bundle Angular.
- Um guard ou botão oculto controla navegação/apresentação, não autorização de dados. O backend deve validar identidade, permissão, vínculo ativo e isolamento entre empresas.
- Restrinja interceptors às chamadas próprias da API. Não envie Bearer para login, preparação CSRF ou destinos externos; siga exatamente o contrato e os limites descritos no guia de autenticação do backend.
- Trate carregamento, sucesso, erro, ausência de dados e expiração de acesso quando fizerem parte do fluxo. Não exponha mensagens internas, tokens ou credenciais na interface/logs.

## Estilos e interface

- Antes de criar padrões visuais novos, consulte `docs/produto/padroes-interface.md`; ele registra propostas iniciais, não um design system já consolidado.
- Use PrimeNG, Aura, Tailwind e SCSS conforme as necessidades reais da tela e a configuração existente. Não afirme que uma biblioteca está configurada em runtime só porque consta nas dependências.
- Mantenha estilo global em arquivos globais e estilo específico junto ao componente. Evite duplicar regras globais em vários componentes.
- Verifique acessibilidade básica, navegação por teclado, rótulos de campos e estados de erro ao implementar telas.

## Configuração a conferir

`angular.json` referencia `src/styles.css`, mas a inspeção encontrou `styles.css` na raiz do frontend e `src/styles.scss` dentro de `src/`. Antes de mexer em estilos ou declarar o build saudável, resolva/valide esse caminho de forma consciente. O guia registra a divergência observada; não afirma resultado de compilação.

O `README.md` ainda informa Angular CLI 19.2.12, enquanto `package.json` declara Angular CLI 20.3.33. Use os arquivos de dependências/configuração atuais para identificar a stack e mantenha o README sincronizado quando houver trabalho de documentação relacionado.

As opções de build e teste ficam em `angular.json`; scripts disponíveis estão em `package.json`:

```bash
npm run start
npm run build
npm test
```

Não há script `lint` ou `e2e` declarado em `package.json` na inspeção. Confirme a configuração atual antes de indicar comandos adicionais. Execute apenas as verificações pertinentes à mudança e relate o resultado real; não declare testes/build aprovados sem executá-los.

## Testes

- Os testes encontrados usam Jasmine/Karma e ficam em arquivos `*.spec.ts`; o spec observado cobre somente o componente raiz de exemplo.
- Para nova lógica de componente/serviço, escreva ou atualize testes no padrão que o projeto já usa, quando o escopo e a solicitação incluírem testes.
- Para apresentação e integração visual, complemente testes automatizados com inspeção no navegador quando isso fizer parte da validação. Testes unitários não comprovam conectividade real com o backend.
- Se uma verificação falhar por configuração/ambiente, informe a falha observada e não a descreva como aprovação.

## Documentação e decisões pendentes

Antes de implementar uma área de produto, consulte:

- `docs/produto/README.md` para direção e estado documentados;
- `docs/produto/requisitos-produto.md` para requisitos de referência, ainda sujeitos a priorização e confirmação;
- `docs/produto/padroes-interface.md` para propostas visuais iniciais;
- `docs/boas-praticas-angular.md` para estrutura de pastas, responsabilidades e checklist do frontend;
- `../docs/codigo-limpo-e-reutilizacao.md` para princípios de código limpo e decisão entre código particular e reutilizável;
- documentação do backend para contratos HTTP e autenticação.

As rotas de produto, a estrutura final de módulos, o design system, o fluxo de autenticação no navegador e a estratégia de sessão do cliente ainda não estavam implementados/definidos na inspeção. Ao trabalhar nessas áreas, confirme decisões e evidências atuais em vez de transformar propostas em convenções estabelecidas.
