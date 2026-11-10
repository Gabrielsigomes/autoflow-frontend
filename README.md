# AutoFlow — Frontend

Aplicação web do **AutoFlow**, sistema de gestão para oficinas automotivas. Reúne em um só lugar os dados de clientes, veículos e serviços da oficina, com acesso por usuário e separação dos dados de cada empresa.

Este repositório contém a interface (SPA em Angular). A API, as regras de negócio e a persistência ficam no projeto irmão [`autoflow-backend`](../autoflow-backend) (Java 21 + Spring Boot).

---

## Funcionalidades

| Módulo | Descrição |
| --- | --- |
| **Acesso** | Login por e-mail e senha, sessão segura e acesso apenas às oficinas às quais o usuário está vinculado |
| **Empresas e usuários** | Cadastro de oficinas, usuários e vínculos com perfil por empresa |
| **Clientes** | Cadastro e busca de clientes, com endereços e histórico |
| **Veículos** | Cadastro de veículos e vínculo com seus proprietários |
| **Serviços** | Catálogo de serviços oferecidos pela oficina |
| **Ordens de serviço** | Abertura, acompanhamento e conclusão dos atendimentos |

Escopo, requisitos e roadmap do produto: [`docs/produto/README.md`](docs/produto/README.md).

---

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | [Angular](https://angular.dev) 21.2 (standalone components, Angular Router) |
| Linguagem | TypeScript 5.9 |
| Reatividade | Signals + `ChangeDetectionStrategy.OnPush` |
| Componentes de UI | [PrimeNG](https://primeng.org) 21.1 (licença MIT) + `@angular/cdk` 21 |
| Tema | `@primeuix/themes` 2 (preset Aura) |
| Estilos | [Tailwind CSS](https://tailwindcss.com) 4 + SCSS |
| HTTP | `HttpClient` + RxJS 7.8 |
| Formulários | Template-driven (`ngModel`) com estado em signals |
| Build | Angular CLI 21.2 (`@angular/build`, esbuild) |
| Testes | Jasmine + Karma |

---

## Arquitetura

- **Standalone:** sem `NgModule`. Cada componente declara as próprias dependências.
- **Organização por domínio:**

  ```text
  src/app/
  ├── core/        infraestrutura transversal (HTTP, autenticação)
  ├── shared/      componentes visuais reutilizáveis, sem regra de negócio
  ├── features/    funcionalidades por domínio (clientes, veículos, ...)
  ├── app.config.ts
  └── app.routes.ts
  ```

- **Camada HTTP centralizada:** componentes chamam serviços da feature, que usam o `ApiService` de `core/http`. URL base e tratamento de erro ficam num único lugar.
- **Estado com signals:** todo dado exibido na tela fica em `signal`/`computed`, com componentes `OnPush`, compatível com detecção de mudanças sem zone.js.

---

## Segurança

- **Access token (JWT) somente em memória.** Nunca é gravado em `localStorage` ou `sessionStorage`.
- **Refresh token em cookie `HttpOnly`, `Secure`, `SameSite=Strict`**, inacessível ao JavaScript e restrito às rotas de autenticação.
- **Proteção CSRF** nas rotas que usam cookie.
- **Bearer enviado apenas para a API própria**, nunca para domínios externos.
- **Nenhum segredo no bundle:** `environment` contém só configuração pública.
- **Autorização decidida no backend.** Guards de rota controlam apenas a navegação.

Detalhes e justificativas: [`docs/sessao-autenticacao.md`](docs/sessao-autenticacao.md).

---

## Como executar

**Requisitos:** Node.js `^20.19`, `^22.12` ou `^24` e npm.

```bash
npm install
```

```bash
npm start
```

A aplicação abre em `http://localhost:4200/` e recarrega a cada alteração.

| Comando | O que faz |
| --- | --- |
| `npm start` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run watch` | Build de desenvolvimento contínuo |
| `npm test` | Testes unitários (Karma) |

A URL da API é definida em `src/environments/`.

---

## Documentação

| Documento | Conteúdo |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | Convenções do frontend, versões e restrições |
| [`docs/boas-praticas-angular.md`](docs/boas-praticas-angular.md) | Estrutura de pastas, responsabilidades e checklist |
| [`docs/zoneless.md`](docs/zoneless.md) | Detecção de mudanças e regras de estado com signals |
| [`docs/sessao-autenticacao.md`](docs/sessao-autenticacao.md) | Estratégia de sessão e autenticação |
| [`docs/produto/`](docs/produto/) | Plano, requisitos e padrões de interface |
| [`../docs/codigo-limpo-e-reutilizacao.md`](../docs/codigo-limpo-e-reutilizacao.md) | Princípios de código limpo |
