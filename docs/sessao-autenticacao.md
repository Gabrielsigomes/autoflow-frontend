# Sessão e autenticação no navegador

> **Status:** decisão de arquitetura registrada em 09/11/2026. O login e o access token já existem no backend; o refresh token, o logout no servidor e a integração no Angular **ainda não foram implementados**. Plano detalhado do backend: [`autoflow-backend/docs/plano-refresh-token.md`](../../autoflow-backend/docs/plano-refresh-token.md).

## A decisão

| Credencial | Onde fica | Validade | Enviada como |
| --- | --- | --- | --- |
| **Access token** (JWT) | **Somente em memória** (signal em `SessaoService`) | Curta: 15 minutos | Header `Authorization: Bearer`, adicionado pelo interceptor apenas para a API própria |
| **Refresh token** (valor opaco) | **Cookie `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/auth`**, gerenciado pelo navegador | Longa, com limite absoluto | Enviado automaticamente pelo navegador, só para `/auth/refresh` e `/auth/logout` |

Nenhum token é gravado em `localStorage`, `sessionStorage`, IndexedDB ou cookie legível por JavaScript.

## Por que esta escolha

**1. `localStorage` fica exposto a XSS.** Qualquer script que rode na página, seja de uma falha de XSS, de uma dependência comprometida ou de uma extensão, consegue ler `localStorage.getItem('token')` e enviar o token para fora. O token roubado funciona em qualquer máquina até expirar.

**2. Cookie `HttpOnly` não é legível por JavaScript.** O navegador guarda e envia o refresh token, mas `document.cookie` não o enxerga. Um XSS não consegue copiá-lo.

**3. Access token em memória some ao fechar a aba** e dura só 15 minutos. Se vazar, a janela de uso é curta.

**4. A sessão sobrevive à recarga.** Ao abrir o app, o Angular chama `POST /auth/refresh`: o navegador envia o cookie, e o backend devolve um novo access token. O usuário não precisa entrar de novo.

**5. O servidor consegue encerrar sessões.** Como o refresh token fica registrado no banco, logout, desativação do usuário ou suspeita de roubo o revogam de verdade, o que um JWT sozinho não permite.

**6. A API continua sem CSRF nas rotas de negócio.** Se o próprio JWT fosse para um cookie, toda rota da API passaria a receber credencial automática e precisaria de proteção CSRF. Mantendo o access token como Bearer, o cookie fica restrito a `/auth`, que já tem CSRF.

### Cookie e CSRF trabalham juntos

| Ataque | Só `localStorage` | Só cookie `HttpOnly` | Cookie + token CSRF + `SameSite` |
| --- | --- | --- | --- |
| XSS **rouba** o token | ❌ vulnerável | ✅ protegido | ✅ protegido |
| Outro site **usa** a credencial (CSRF) | ✅ não se aplica | ❌ vulnerável | ✅ protegido |

O cookie `HttpOnly` impede que **roubem** a credencial; o token CSRF e o `SameSite` impedem que a **usem** sem o usuário saber.

### O que esta escolha não resolve

Um XSS ativo ainda pode fazer requisições em nome do usuário enquanto a página está aberta. A proteção reduz o **roubo** e a **persistência** do token, mas não dispensa a prevenção de XSS: sanitização padrão do Angular, nada de `bypassSecurityTrust*` com dados externos e uma Content Security Policy na implantação.

## O que o backend precisará ganhar

Resumo; os detalhes estão no [plano](../../autoflow-backend/docs/plano-refresh-token.md).

1. **Tabela `refresh_token`** (nova migração Flyway), guardando apenas o **hash SHA-256** do token, a família, a expiração, o uso e a revogação.
2. **Login emitindo o cookie** `HttpOnly` do refresh token. O corpo da resposta não muda e continua sem o refresh token.
3. **`POST /auth/refresh`:** valida o cookie, **rotaciona** o token (cada um é usado uma vez), verifica se o usuário continua ativo e devolve um novo access token.
4. **Detecção de reuso:** um refresh token já usado que reaparece indica roubo, e toda a família de tokens é revogada.
5. **`POST /auth/logout`:** revoga a sessão no servidor e apaga o cookie.
6. **Revogação ao desativar o usuário** ou mudar seu papel.
7. **Limite de tentativas** em login e refresh.
8. **Testes** de segurança: atributos do cookie, rotação, reuso, CSRF, expiração e usuário inativo.
9. **Implantação na mesma origem** (proxy reverso), para que `SameSite=Strict` funcione sem abrir CORS com credenciais.

## O que o frontend precisará

- `SessaoService` guardando o access token em signal, só em memória.
- Na inicialização do app: `GET /auth/csrf` seguido de `POST /auth/refresh` para restaurar a sessão.
- Interceptor que adiciona o Bearer só às rotas da API e, em `401`, faz **um único** refresh compartilhado e repete a requisição uma vez.
- Logout chamando `POST /auth/logout`.
