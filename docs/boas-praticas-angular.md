# Boas práticas — estrutura e código Angular

Guia de estudo e referência para o frontend AutoFlow. Complementa o [`AGENTS.md`](../AGENTS.md) do frontend e o [guia de código limpo e reutilização](../../docs/codigo-limpo-e-reutilizacao.md). Em caso de divergência, o `AGENTS.md` prevalece.

> **Estado em 06/11/2026:** a estrutura descrita aqui é o **padrão-alvo**. O código atual tem apenas o componente raiz, `app.config.ts`, rotas vazias e os arquivos de `core/http/`. Pastas como `features/` e `shared/` ainda não existem. Não as crie vazias: elas surgem quando a primeira funcionalidade precisar delas.

---

## 1. Estrutura de pastas

```text
src/app/
├── core/                      ← infraestrutura da aplicação (uma instância, usada por todos)
│   ├── http/                  ← ApiService, tratamento de erro HTTP, interceptors
│   └── autenticacao/          ← sessão, guard de rota, interceptor do Bearer
├── shared/                    ← peças reutilizáveis SEM regra de negócio
│   ├── botao/
│   └── modal/
├── features/                  ← funcionalidades do negócio, uma pasta por domínio
│   ├── clientes/
│   │   ├── lista-clientes/          ← página/componente
│   │   ├── formulario-cliente/      ← página/componente
│   │   ├── cliente-api.service.ts   ← chamadas HTTP do domínio
│   │   ├── cliente.model.ts         ← tipos do contrato
│   │   └── clientes.routes.ts       ← rotas da feature (quando houver mais de uma)
│   ├── veiculos/
│   └── ordens-servico/
├── app.config.ts              ← providers globais
└── app.routes.ts              ← rotas raiz
```

### Como decidir onde um arquivo fica

Faça as perguntas nesta ordem:

| Pergunta | Se sim, vai para |
| --- | --- |
| Fala de um assunto do negócio (cliente, veículo, OS)? | `features/<domínio>/` |
| É infraestrutura que a aplicação inteira usa, com uma única instância (HTTP, autenticação, configuração)? | `core/` |
| É uma peça visual ou utilitária genérica, que funcionaria igual em outro sistema? | `shared/` |
| Nenhuma das anteriores? | Mantenha junto de quem usa. Mova só quando surgir um segundo uso real. |

**Teste rápido para `shared/`:** se o componente precisa importar algo de `features/` ou conhece palavras do negócio, como "cliente" ou "placa", ele **não é** compartilhado. Ele pertence à feature.

### Regras de dependência entre pastas

```text
features  →  pode usar  →  core, shared
shared    →  pode usar  →  (nada do app; só Angular/PrimeNG)
core      →  pode usar  →  (nada de features)
```

- Uma feature **não importa** arquivos de outra feature. Se `veiculos` precisa de algo de `clientes`, esse algo provavelmente é um modelo compartilhado ou um serviço de `core`. Discuta antes de criar o atalho.
- As pastas antigas `layout/` e `modulos/` não fazem parte do padrão-alvo. Não as use como estrutura paralela sem decisão registrada.

---

## 2. Nomes de arquivos e classes

O projeto usa **sufixos de tipo** no nome do arquivo. Mantenha essa convenção para mais consistência, mesmo que o guia de estilo do Angular (desde a versão 20) os torne opcionais.

| Tipo | Arquivo | Classe / símbolo |
| --- | --- | --- |
| Componente | `lista-clientes.component.ts` | `ListaClientesComponent` |
| Serviço de API | `cliente-api.service.ts` | `ClienteApiService` |
| Modelo | `cliente.model.ts` | `Cliente`, `ClienteCriacao` |
| Rotas | `clientes.routes.ts` | `CLIENTES_ROUTES` |
| Guard funcional | `autenticado.guard.ts` | `autenticadoGuard` |
| Interceptor funcional | `autenticacao.interceptor.ts` | `autenticacaoInterceptor` |
| Teste | `<arquivo>.spec.ts` | — |

- Arquivos em `kebab-case`, classes em `PascalCase`, funções e variáveis em `camelCase`.
- Use nomes do domínio em português, como no backend (`cliente`, `veiculo`, `ordem-servico`). Termos técnicos do Angular (`component`, `service`, `guard`) ficam em inglês.
- Um arquivo deve ter uma responsabilidade principal. Se você precisa de "e" para descrevê-lo ("lista **e** salva **e** formata"), ele está fazendo coisas demais.

---

## 3. Componentes

### Standalone sempre

```ts
@Component({
  selector: 'app-lista-clientes',
  imports: [TableModule, ButtonModule],          // tudo que o template usa
  templateUrl: './lista-clientes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaClientesComponent { }
```

- Declare em `imports` cada componente, diretiva e pipe usado no template, **inclusive os do PrimeNG**. O `providePrimeNG` em `app.config.ts` configura o tema, mas não importa componentes.
- Não introduza `NgModule`.

### Dois papéis de componente

| Papel | Responsabilidade | Exemplo |
| --- | --- | --- |
| **Página (container)** | Busca dados pelo serviço, trata carregamento/erro e reage à navegação | `lista-clientes` |
| **Apresentação** | Recebe dados por `input()`, emite eventos por `output()` e não chama HTTP | `tabela-clientes`, `botao` |

Componentes de apresentação são os candidatos naturais a reutilização. Componentes de página quase nunca são reutilizados, e não precisam ser.

### O que **não** colocar no componente

- Chamadas `HttpClient` diretas: use o serviço da feature.
- Montagem de URL, tratamento de status HTTP ou leitura de token: isso pertence a `core/`.
- Regras de negócio do backend, como "CNPJ duplicado" ou "pode desativar?". O componente mostra o resultado e o backend decide.

### APIs modernas do Angular 21

- `inject()` em vez de injeção pelo construtor.
- `input()`, `output()` e `signal()`/`computed()` para estado local.
- Controle de fluxo no template com `@if`, `@for` (com `track`) e `@switch`.
- `ChangeDetectionStrategy.OnPush` em componentes novos.

### Estado e detecção de mudanças (zoneless)

O projeto adota zoneless, e a migração está em andamento. O guia completo, com exemplos, checklist de bibliotecas e estado da migração, está em [`zoneless.md`](zoneless.md). Resumo:

- **Todo dado exibido na tela fica em um signal.** Use `this.clientes.set(lista)` dentro de `subscribe`/`await`, nunca `this.clientes = lista` em uma variável comum.
- Eventos do template, `ngModel`, `async` pipe e `input()` avisam o Angular sozinhos. O problema só aparece quando uma variável comum é alterada em código assíncrono.
- `ChangeDetectorRef.markForCheck()` é exceção, reservada à integração com bibliotecas externas que alteram dados por fora do Angular.

### Formulários

- Padrão do projeto: **template-driven (`ngModel`) com estado em signals**. Com um objeto em signal, use `[ngModel]="cliente().nome" (ngModelChange)="atualizar('nome', $event)"` com atualização imutável. Evite `[(ngModel)]="cliente().nome"`, que altera o objeto sem notificar o signal.
- Reactive Forms ficam para telas com estrutura dinâmica (listas de itens que crescem, validação cruzada complexa). Nesse caso, combine com signals, porque `setValue`/`patchValue` não agendam atualização da tela sem zone.js.
- Signal Forms (`@angular/forms/signals`) são experimentais no Angular 21. Não use até haver decisão de atualização.

---

## 4. Serviços e HTTP

O fluxo de uma chamada fica dividido em três níveis, cada um com uma responsabilidade:

```text
Componente            "preciso da lista de clientes"
   ↓
ClienteApiService     "a lista de clientes é GET /clientes e devolve Cliente[]"
   ↓
ApiService (core)     "monta a URL base, executa e padroniza o erro"
   ↓
HttpClient (Angular)
```

O [`ApiService`](../src/app/core/http/api.service.ts) já segue essa ideia: `buildUrl` centraliza a URL base e bloqueia URLs externas, e `createApiError` padroniza o erro. Os serviços das features **reutilizam** esse serviço em vez de repetir essas regras.

Exemplo do formato esperado de um serviço de feature:

```ts
@Injectable({ providedIn: 'root' })
export class ClienteApiService {
  private readonly api = inject(ApiService);

  listar(): Observable<Cliente[]> {
    return this.api.request<Cliente[]>({ method: 'GET', endpoint: '/clientes' });
  }
}
```

> O endpoint `/clientes` acima é **ilustrativo**: ele ainda não existe no backend. Antes de criar uma chamada, confirme rota, DTO, status e erros no controller correspondente.

### Regras

- **Tipos explícitos nas fronteiras.** Parâmetros, retornos e modelos HTTP são tipados. O tipo informa o compilador, mas **não valida** a resposta em tempo de execução.
- **Modelos espelham os DTOs do backend.** Se o backend envia `mensagem` e `campos` (veja `RespostaErro.java`), o frontend lê `mensagem` e `campos`. Nomes diferentes nos dois lados quebram o contrato em silêncio.
- **Interceptors só para a própria API.** Não envie o Bearer para login, preparação CSRF ou domínios externos. Siga `autoflow-backend/docs/api/integracao-angular.md`.
- **`environment` guarda apenas configuração pública.** Nunca coloque segredo, senha ou chave no bundle.

---

## 5. Rotas

- Rotas raiz em `app.routes.ts`. Rotas de uma feature em `features/<domínio>/<domínio>.routes.ts`, carregadas sob demanda:

```ts
{ path: 'clientes', loadChildren: () =>
    import('./features/clientes/clientes.routes').then(m => m.CLIENTES_ROUTES) }
```

- Guards controlam **navegação**, não segurança. Esconder um botão ou bloquear uma rota não impede uma chamada direta à API. A autorização real é do backend.

---

## 6. Estilos

- O tema e os componentes visuais vêm do PrimeNG com Aura. Layout, espaçamento e responsividade usam utilitários Tailwind.
- `src/styles.css` importa o Tailwind e deve conter só isso. Estilos globais próprios ficam em `src/styles.scss`. Estilo específico fica no `.scss` do componente.
- Versões do PrimeNG e do `@primeuix/themes` ficam nas faixas `^21` e `^2` (MIT). Veja a restrição de licença em [`AGENTS.md`](../AGENTS.md).
- Antes de criar um padrão visual novo, consulte [`padroes-interface.md`](produto/padroes-interface.md).
- Se o mesmo conjunto de classes se repete em três ou mais telas, isso indica um componente em `shared/`, não uma classe global copiada.

---

## 7. Testes

- Jasmine/Karma, arquivos `*.spec.ts` ao lado do arquivo testado.
- Priorize testes de serviços (contrato, tratamento de erro) e de componentes com lógica de estado.
- Teste unitário com `HttpClient` simulado **não comprova** a integração com o backend real. Registre separadamente o que foi verificado no navegador.

---

## 8. Checklist antes de abrir um PR

- [ ] O arquivo está na pasta certa (`features`, `core` ou `shared`), segundo a seção 1?
- [ ] O componente não chama `HttpClient` diretamente?
- [ ] Os nomes dos campos do modelo batem com o DTO do backend?
- [ ] Os estados de carregamento, erro, lista vazia e sucesso estão tratados?
- [ ] Os imports de PrimeNG estão declarados no componente?
- [ ] Algum código foi copiado de outra feature? Se sim, veja o [guia de reutilização](../../docs/codigo-limpo-e-reutilizacao.md#3-particular-ou-reutilizável).
- [ ] `npm run build` e `npm test` foram executados e o resultado real foi registrado?
