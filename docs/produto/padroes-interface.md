# AutoFlow: padrões iniciais de interface

Proposta em 20/10/2026. Guia para as primeiras telas; não há um design system próprio implementado neste levantamento.

## 1. Para que serve

O plano do produto define o problema e as entregas. O backlog organiza o trabalho. Este guia define como telas e interações semelhantes devem se comportar.

Um design system amadurece ao reunir princípios, padrões, componentes, exemplos e manutenção consistente. Instalar uma biblioteca de componentes fornece uma base, mas não decide os padrões do produto.

## 2. Base proposta

- Usar PrimeNG para os componentes prontos necessários às primeiras telas.
- Começar com um tema existente, como Aura, e registrar a escolha antes de personalizar.
- Usar Tailwind para composição, espaçamento e responsividade dos layouts.
- Usar SCSS/CSS específico quando houver uma necessidade não coberta pelos padrões adotados.
- Preferir tokens de tema para cores e aparência dos componentes. O PrimeNG oferece presets e tokens com funções específicas; ver [documentação de temas da versão 20](https://v20.primeng.org/theming).

Nenhuma dessas propostas altera a configuração atual. O tema ainda precisa ser registrado no frontend.

## 3. Decisões visuais mínimas

| Tema | Proposta para começar | Estado |
| --- | --- | --- |
| Tema base | Aura, com personalização mínima | A validar |
| Cor principal | Uma cor para ações principais, definida pelo tema | A definir |
| Cores semânticas | Distinguir informação, sucesso, atenção e erro; acompanhar cor com texto/ícone quando necessário | A detalhar nas telas |
| Tipografia | Uma família legível e hierarquia consistente entre título, seção, texto e ajuda | A definir |
| Espaçamento | Reutilizar uma escala curta, por exemplo 4, 8, 12, 16, 24 e 32 px | Proposta |
| Densidade | Formulários e tabelas adequados às informações e ao dispositivo usados na oficina | Depende da observação do trabalho |
| Modo claro/escuro | Escolher comportamento inicial e verificar o tema real | A definir |
| Dispositivos | Desktop e/ou celular conforme o atendimento observado | A definir |

Essas escolhas são pequenas decisões de produto. Não é necessário desenhar todos os componentes antes de validar a primeira tela.

## 4. Primeiros padrões a documentar

### Navegação e contexto

- Mostrar em qual oficina a pessoa está operando quando esse contexto existir.
- Apresentar opções conforme a permissão, mantendo a autorização real no backend.
- Manter título da página, localização no menu e ação principal compreensíveis.

### Formulários

- Rótulo visível para cada campo e indicação clara de obrigatoriedade.
- Mensagens específicas próximas ao campo e resumo quando o problema afetar toda a operação.
- Preservar valores preenchidos em caso de erro recuperável.
- Diferenciar carregar dados, salvar dados e operação concluída.
- Tratar envio repetido e fornecer retorno acessível para sucesso ou falha.

### Listas e busca

- Diferenciar lista vazia, busca sem resultados e falha no carregamento.
- Apresentar identificação suficiente para distinguir clientes/veículos com nomes semelhantes.
- Manter as ações de consultar e alterar consistentes entre páginas.
- Definir paginação e filtros quando o volume e o fluxo os exigirem.

### Ações e mensagens

- Usar verbos concretos: `Salvar cliente`, `Abrir ordem`, `Cancelar`.
- Diferenciar cancelar edição de inativar um registro ou cancelar uma OS.
- Confirmar ações com consequências relevantes e explicar seu efeito.
- Dar orientação para corrigir uma falha, sem expor detalhes internos ao usuário final.

### Estados de acesso

- Tratar conta/sessão sem acesso, oficina indisponível e sessão expirada conforme a política definida.
- Preservar o que for possível do trabalho em andamento antes de pedir nova autenticação.
- Nunca tratar esconder um botão como garantia de autorização.

## 5. Como verificar uma primeira tela

- Uma pessoa entende o propósito e a ação principal sem explicação do desenvolvedor?
- Os campos e os erros são compreensíveis no vocabulário da oficina?
- É possível navegar com teclado e perceber o foco?
- A tela funciona nos dispositivos combinados para o piloto?
- Carregamento, sucesso, falha e ausência de dados foram demonstrados?
- O componente mantém aparência e comportamento coerentes com as demais telas?

Registrar uma captura aprovada ou um esboço e os critérios de aceite na tarefa correspondente. Ao surgir um padrão repetido, atualizar este guia e, se necessário, criar um componente compartilhado.

## 6. Primeira aplicação prática

Aplicar este guia ao fluxo de entrada e ao primeiro cadastro. Documentar o que foi escolhido e demonstrar a tela antes de repetir o padrão nos módulos seguintes.

O objetivo imediato é aprender construindo o sistema. As primeiras telas podem usar um cenário fictício de oficina e critérios claros, registrando quais regras são didáticas. A hipótese comercial ainda será explorada. Ao chegar à etapa de OS, esboçar como a pessoa localiza um atendimento, identifica seu estado e consulta a próxima ação, sem apresentar esse desenho como requisito validado com uma oficina.

O próximo passo de design é um esboço pequeno do fluxo de estudo escolhido, acompanhado de estados e regras. Conforme houver retorno de uma oficina, adaptar o desenho ao trabalho real. A expansão para uma biblioteca própria de componentes deve acompanhar a reutilização real.
