# Detecção de mudanças sem zone.js (zoneless)

Guia de orientação do frontend AutoFlow. Explica a decisão, as regras para escrever código e o estado da migração.

- Regras gerais do frontend: [`AGENTS.md`](../AGENTS.md)
- Estrutura e convenções: [`boas-praticas-angular.md`](boas-praticas-angular.md)

---

## 1. Decisão

**Decisão (08/11/2026):** o AutoFlow usa detecção de mudanças **zoneless**, sem zone.js.

| Motivo | Detalhe |
| --- | --- |
| Direção do framework | Zoneless é estável desde o Angular 20.2 e é o padrão de projetos novos no Angular 21 |
| Custo de migração mínimo | O projeto ainda não tem telas; migrar depois exigiria revisar cada componente |
| Desempenho | O Angular só verifica componentes avisados, em vez de verificar a árvore após qualquer evento assíncrono |
| Tamanho | Remove ~34,6 kB (o chunk `polyfills`) do pacote inicial |
| Depuração | Stack traces sem as camadas do zone.js; `async/await` nativo sem tratamento especial |
| Padrão correto desde o início | Estado fora de signal deixa de funcionar "por acaso" e o erro aparece na hora |

Compatibilidade verificada:

- `ngModel` (template-driven) chama `markForCheck()` internamente.
- Varredura estática do PrimeNG 21.1.10: nenhum uso de `NgZone.onStable`, `onMicrotaskEmpty` ou `isStable`. É um indício, não uma garantia oficial; a confirmação depende da tela de teste (seção 5).

---

## 2. Como o Angular é avisado

Sem zone.js, o Angular não adivinha que algo mudou: ele precisa ser **avisado**. Na maior parte dos casos, o aviso é automático.

| Situação | Avisa sozinho? |
| --- | --- |
| Escrever em um `signal` lido no template (`.set()`, `.update()`) | ✅ |
| Evento do template (`(click)`, `(input)`, `(onChange)` do PrimeNG) | ✅ durante o listener |
| `ngModel` | ✅ |
| `async` pipe | ✅ |
| `input()` recebendo valor novo do componente pai | ✅ |
| Variável comum alterada em `subscribe`, `await`, `setTimeout` ou callback de biblioteca | ❌ |

---

## 3. Regras para escrever código

1. **Todo dado exibido na tela fica em um signal** (`signal`, `computed`) ou chega por `async` pipe.
2. **Componentes usam `ChangeDetectionStrategy.OnPush`.**
3. **Depois de um `await` ou dentro de um `subscribe`, altere o estado com `.set()`/`.update()`**, nunca com `=` em variável comum.
4. **Signals guardam valores imutáveis.** Para alterar um objeto ou lista, crie um novo (`update(c => ({ ...c, nome }))`). Mutar o objeto existente não avisa o Angular.
5. **`ChangeDetectorRef.markForCheck()` é exceção**, para integrar bibliotecas externas que alteram dados por fora do Angular. Se aparecer em código comum, provavelmente o estado deveria estar em signal.
6. **Não use `NgZone.onStable`, `onMicrotaskEmpty` nem `isStable`.** Para rodar algo após a renderização, use `afterNextRender`/`afterEveryRender`. `NgZone.run` e `runOutsideAngular` continuam permitidos, mas não são necessários.

### Exemplo

```ts
// ❌ Não atualiza a tela sem zone.js
export class ListaClientesComponent {
  clientes: Cliente[] = [];

  ngOnInit() {
    this.clienteApi.listar().subscribe(lista => this.clientes = lista);
  }
}
```

```ts
// ✅ O signal avisa o Angular
@Component({ changeDetection: ChangeDetectionStrategy.OnPush, /* ... */ })
export class ListaClientesComponent {
  private readonly clienteApi = inject(ClienteApiService);
  readonly clientes = signal<Cliente[]>([]);
  readonly carregando = signal(false);

  ngOnInit() {
    this.carregando.set(true);
    this.clienteApi.listar().subscribe(lista => {
      this.clientes.set(lista);
      this.carregando.set(false);
    });
  }
}
```

```ts
// Evento com await: a linha após o await só atualiza a tela se for um signal
async salvar() {
  this.mensagem.set('Salvando...');
  await firstValueFrom(this.clienteApi.salvar(this.cliente()));
  this.mensagem.set('Salvo!');
}
```

### Formulários

- **Template-driven (padrão do projeto):** compatível. Com objeto em signal, use `[ngModel]="cliente().nome" (ngModelChange)="atualizar('nome', $event)"`. Evite `[(ngModel)]="cliente().nome"`, que muta o objeto sem notificar o signal.
- **Reactive Forms:** `setValue`/`patchValue` não agendam atualização da tela. Se usados, exponha o resultado em signal (por exemplo, `toSignal(form.valueChanges)`).

---

## 4. Bibliotecas de terceiros

Antes de instalar uma biblioteca de UI ou que manipule o DOM:

- [ ] A documentação declara suporte a zoneless ou a Angular 21?
- [ ] O código do pacote (`node_modules/<pacote>/fesm2022`) usa `onStable`, `onMicrotaskEmpty` ou `isStable`? Se sim, ela depende do zone.js.
- [ ] A licença é compatível (veja a restrição de licença no `AGENTS.md`)?
- [ ] Testada em uma tela real: a interface atualiza após cada interação?

---

## 5. Estado da migração

Atualizado em 09/11/2026.

| Passo | Estado | Evidência |
| --- | --- | --- |
| 2.1 Remover `provideZoneChangeDetection` do `app.config.ts` | ✅ Feito | Commit `07471ad`. No Angular 21, sem provider de zone, o padrão é zoneless |
| 2.2 Remover `zone.js` e `zone.js/testing` dos `polyfills` no `angular.json` (build e test) | ⏳ Pendente | O build ainda gera `polyfills` de 34,59 kB |
| 2.3 Desinstalar o pacote (`npm uninstall zone.js`) | ⏳ Pendente | `package.json` ainda declara `zone.js ~0.15.0` |
| 2.4 `OnPush` no `AppComponent` | ✅ Feito | Commit `012b20b` |
| 2.5 Verificar build, testes e navegador | ⏳ Parcial | 09/11/2026: build com sucesso (523,77 kB, acima do aviso de 500 kB); 3 de 3 testes aprovados; navegador não conferido |
| 3.1 Tela de teste com PrimeNG (botão, campo com `ngModel`, select, diálogo, tabela) | ⏳ Pendente | Confirma a compatibilidade do PrimeNG no navegador |

Enquanto os passos 2.2 e 2.3 estiverem pendentes, o zone.js continua **carregado** no navegador e nos testes, alterando as APIs assíncronas e ocupando espaço no bundle, mesmo sem o provider. A migração só é considerada concluída quando todos os passos estiverem marcados e verificados.

Resultado esperado após o passo 2.2: o chunk `polyfills` desaparece do build e o pacote inicial cai para ~489 kB, abaixo do aviso de budget.

---

## 6. Diagnóstico rápido

| Sintoma | Causa provável | Correção |
| --- | --- | --- |
| A tela só atualiza depois de outro clique | Estado em variável comum alterado após `await`/`subscribe` | Mover o estado para signal |
| Lista não atualiza depois de `push` | Mutação de array dentro do signal | `update(lista => [...lista, item])` |
| Componente de biblioteca não atualiza | Biblioteca depende do zone.js | Aplicar o checklist da seção 4; `markForCheck()` como contorno pontual |
| Teste não enxerga a mudança | O teste não aguardou a renderização | `await fixture.whenStable()` antes das verificações |

Fontes: [Angular – Zoneless](https://angular.dev/guide/zoneless), [Angular v21 – Zoneless](https://v21.angular.dev/guide/zoneless).
