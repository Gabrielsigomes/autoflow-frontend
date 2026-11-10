# AutoflowFrontEnd

Frontend do AutoFlow. Gerado originalmente com o Angular CLI 19.2.12 e atualizado para **Angular 21.2** (CLI 21.2.29), **PrimeNG 21.1** (MIT), `@primeuix/themes` 2 e **Tailwind CSS 4**.

Requisitos: Node `^20.19`, `^22.12` ou `^24`. As versões detalhadas, restrições de licença e o estado do build estão em [`AGENTS.md`](AGENTS.md).

## Sessão e autenticação

> **Status:** decisão de arquitetura registrada em 09/11/2026. O login e o access token já existem no backend; o refresh token, o logout no servidor e a integração no Angular **ainda não foram implementados**. Plano detalhado: [`autoflow-backend/docs/plano-refresh-token.md`](../autoflow-backend/docs/plano-refresh-token.md).

### A decisão

| Credencial | Onde fica | Validade | Enviada como |
| --- | --- | --- | --- |
| **Access token** (JWT) | **Somente em memória** (signal em `SessaoService`) | Curta: 15 minutos | Header `Authorization: Bearer`, adicionado pelo interceptor apenas para a API própria |
| **Refresh token** (valor opaco) | **Cookie `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/auth`**, gerenciado pelo navegador | Longa, com limite absoluto | Enviado automaticamente pelo navegador, só para `/auth/refresh` e `/auth/logout` |

Nenhum token é gravado em `localStorage`, `sessionStorage`, IndexedDB ou cookie legível por JavaScript.

### Por que esta escolha

**1. `localStorage` fica exposto a XSS.** Qualquer script que rode na página, seja de uma falha de XSS, de uma dependência comprometida ou de uma extensão, consegue ler `localStorage.getItem('token')` e enviar o token para fora. O token roubado funciona em qualquer máquina até expirar.

**2. Cookie `HttpOnly` não é legível por JavaScript.** O navegador guarda e envia o refresh token, mas `document.cookie` não o enxerga. Um XSS não consegue copiá-lo.

**3. Access token em memória some ao fechar a aba** e dura só 15 minutos. Se vazar, a janela de uso é curta.

**4. A sessão sobrevive à recarga.** Ao abrir o app, o Angular chama `POST /auth/refresh`: o navegador envia o cookie, e o backend devolve um novo access token. O usuário não precisa entrar de novo.

**5. O servidor consegue encerrar sessões.** Como o refresh token fica registrado no banco, logout, desativação do usuário ou suspeita de roubo o revogam de verdade, o que um JWT sozinho não permite.

**6. A API continua sem CSRF nas rotas de negócio.** Se o próprio JWT fosse para um cookie, toda rota da API passaria a receber credencial automática e precisaria de proteção CSRF. Mantendo o access token como Bearer, o cookie fica restrito a `/auth`, que já tem CSRF.

**O que esta escolha não resolve:** um XSS ativo ainda pode fazer requisições em nome do usuário enquanto a página está aberta. A proteção reduz o **roubo** e a **persistência** do token, mas não dispensa a prevenção de XSS: sanitização padrão do Angular, nada de `bypassSecurityTrust*` com dados externos e uma Content Security Policy na implantação.

### O que o backend precisará ganhar

Resumo; os detalhes estão no [plano](../autoflow-backend/docs/plano-refresh-token.md).

1. **Tabela `refresh_token`** (nova migração Flyway), guardando apenas o **hash SHA-256** do token, a família, a expiração, o uso e a revogação.
2. **Login emitindo o cookie** `HttpOnly` do refresh token. O corpo da resposta não muda e continua sem o refresh token.
3. **`POST /auth/refresh`:** valida o cookie, **rotaciona** o token (cada um é usado uma vez), verifica se o usuário continua ativo e devolve um novo access token.
4. **Detecção de reuso:** um refresh token já usado que reaparece indica roubo, e toda a família de tokens é revogada.
5. **`POST /auth/logout`:** revoga a sessão no servidor e apaga o cookie.
6. **Revogação ao desativar o usuário** ou mudar seu papel.
7. **Limite de tentativas** em login e refresh.
8. **Testes** de segurança: atributos do cookie, rotação, reuso, CSRF, expiração e usuário inativo.
9. **Implantação na mesma origem** (proxy reverso), para que `SameSite=Strict` funcione sem abrir CORS com credenciais.

### O que o frontend precisará

- `SessaoService` guardando o access token em signal, só em memória.
- Na inicialização do app: `GET /auth/csrf` seguido de `POST /auth/refresh` para restaurar a sessão.
- Interceptor que adiciona o Bearer só às rotas da API e, em `401`, faz **um único** refresh compartilhado e repete a requisição uma vez.
- Logout chamando `POST /auth/logout`.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
