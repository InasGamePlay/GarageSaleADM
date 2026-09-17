 UI/UX Pro Design Skill — Project Edition

## Objetivo

Criar interfaces profissionais, naturais, consistentes, acessíveis e orientadas ao produto.

Esta skill é uma camada de decisão de design. Ela deve transformar requisitos de produto em um sistema visual coerente antes de gerar componentes.

## 1. Regra principal

Não comece pelo componente.

Antes de escrever UI:

1. identificar o tipo de produto;
2. identificar o público e a intenção principal;
3. identificar a ação mais importante da página;
4. escolher uma direção visual coerente;
5. definir hierarquia, cores e tipografia;
6. definir padrões de interação;
7. só então implementar.

Se o projeto já possuir um design system, ele é a fonte de verdade.

Não substituir identidade visual existente sem solicitação.

## 2. Design System antes da implementação

Para páginas novas, definir mentalmente ou documentar:

- estilo visual;
- paleta;
- tipografia;
- escala de espaçamento;
- raio de borda;
- sombras;
- densidade;
- componentes principais;
- estados interativos;
- comportamento responsivo.

Evitar escolher cada componente isoladamente.

A interface inteira deve parecer parte do mesmo produto.

## 3. Escolha visual orientada ao produto

Escolher o estilo de acordo com o contexto.

Exemplos:

- SaaS: clareza, confiança e hierarquia funcional.
- Fintech: confiança, precisão e baixa ambiguidade.
- Saúde: calma, legibilidade e segurança.
- E-commerce: foco em produto, preço, confiança e conversão.
- Portfólio: identidade, contraste e narrativa visual.
- Dashboard: densidade controlada, leitura rápida e hierarquia de dados.
- Produto premium: tipografia, espaço negativo e detalhes refinados.

Não aplicar o mesmo estilo visual a todos os produtos.

## 4. Evitar aparência genérica de IA

Evitar automaticamente:

- gradientes roxo/rosa sem justificativa;
- excesso de glassmorphism;
- cartões arredondados em tudo;
- sombras exageradas;
- excesso de blur;
- neon sem contexto;
- ícones usados como decoração aleatória;
- textos genéricos;
- excesso de animações;
- layouts previsíveis e intercambiáveis.

A estética deve ter motivo relacionado ao produto.

## 5. Hierarquia visual

Toda página deve possuir uma hierarquia clara.

Definir:

1. objetivo principal;
2. conteúdo primário;
3. conteúdo secundário;
4. ações principais;
5. ações secundárias;
6. informações de apoio.

O usuário deve compreender a página rapidamente sem precisar analisar todos os elementos.

## 6. Layout

Preferir:

- grids consistentes;
- alinhamentos claros;
- largura de conteúdo controlada;
- espaço negativo intencional;
- agrupamento visual relacionado;
- ritmo vertical consistente.

Não preencher espaços vazios apenas porque existem.

Espaço negativo também comunica hierarquia.

## 7. Tipografia

Escolher tipografia de acordo com a personalidade do produto.

Priorizar:

- legibilidade;
- contraste;
- hierarquia;
- comprimento confortável de linha;
- escala consistente;
- pesos coerentes.

Evitar utilizar muitas famílias tipográficas.

Como padrão, utilizar no máximo duas famílias quando não houver design system definido.

Headings devem possuir hierarquia clara sem depender apenas de tamanho.

## 8. Cores

Criar uma paleta coerente antes de aplicar cores individualmente.

Definir papéis:

- background;
- surface;
- text;
- muted text;
- primary;
- secondary;
- accent;
- success;
- warning;
- error;
- border.

Não escolher cores aleatórias para cada componente.

Estados não devem depender exclusivamente de cor.

## 9. Contraste e legibilidade

Garantir contraste adequado para texto e elementos essenciais.

Texto importante deve permanecer legível em:

- telas pequenas;
- zoom;
- diferentes níveis de brilho;
- temas claro e escuro quando suportados.

Não utilizar cinza excessivamente claro apenas para criar aparência "premium".

## 10. Responsividade

Projetar mobile e desktop desde o início.

Validar pelo menos:

- 375px;
- 768px;
- 1024px;
- 1440px.

Não depender de uma largura específica.

Conteúdo deve poder crescer sem quebrar o layout.

Textos longos devem:

- quebrar naturalmente;
- não ultrapassar containers;
- não ficar cortados;
- continuar acessíveis em zoom.

Chips, badges e tags devem quebrar linha ou possuir mecanismo apropriado de expansão.

## 11. Componentes

Antes de criar um componente:

1. procurar componente existente;
2. verificar se ele pode ser composto;
3. verificar o design system;
4. só então criar algo novo.

Componentes devem possuir responsabilidade clara.

Evitar componentes gigantes.

Evitar transformar elementos triviais em dezenas de componentes sem benefício.

## 12. Estados obrigatórios

Elementos interativos relevantes devem considerar:

- default;
- hover;
- focus;
- active;
- disabled;
- loading;
- error;
- success;
- empty;
- selected.

Não criar apenas o estado visual de sucesso.

## 13. Interações

Microinterações devem comunicar:

- mudança de estado;
- confirmação;
- progresso;
- foco;
- feedback.

Não adicionar animações apenas para impressionar.

Priorizar transições rápidas e discretas.

Respeitar `prefers-reduced-motion`.

Se uma interação for interrompida, o estado final deve continuar semanticamente correto.

## 14. Botões e ações

A ação principal deve ser visualmente identificável.

Evitar múltiplos CTAs competindo pela mesma atenção.

Botões clicáveis devem possuir área de interação confortável.

Não usar links como botões quando um `button` for semanticamente correto.

## 15. Formulários

Formulários devem priorizar:

- labels claros;
- agrupamento lógico;
- mensagens de erro próximas ao campo;
- estados de loading;
- confirmação de sucesso;
- preservação dos dados digitados quando possível.

Não esconder mensagens importantes somente em toast.

## 16. Ícones

Ícones devem possuir significado claro.

Preferir bibliotecas de ícones consistentes, como Lucide, quando já disponíveis no projeto.

Não utilizar emoji como ícones de interface.

Ícones decorativos devem ser tratados como decorativos.

Botões somente com ícone precisam de nome acessível.

## 17. Imagens e mídia

Usar imagens que reforcem o produto.

Não utilizar placeholders genéricos quando uma solução real estiver disponível.

Otimizar imagens.

Utilizar `alt` apropriado.

Não utilizar imagens apenas para preencher espaço.

## 18. Dashboards e dados

Dashboards devem priorizar leitura e decisão.

Antes de adicionar um gráfico, perguntar:

- qual decisão ele ajuda a tomar?
- qual métrica importa?
- qual período?
- qual comparação é necessária?

Não criar gráficos apenas porque a página parece vazia.

Utilizar visualização adequada ao tipo de dado.

## 19. Landing pages

Estruturar de acordo com a intenção do produto.

Uma estrutura possível:

1. hero;
2. proposta de valor;
3. prova social;
4. benefícios;
5. demonstração;
6. funcionalidades;
7. objeções/FAQ;
8. CTA;
9. footer.

Não aplicar essa estrutura automaticamente.

Escolher somente as seções necessárias.

## 20. Acessibilidade

Priorizar:

- HTML semântico;
- navegação por teclado;
- foco visível;
- labels;
- contraste;
- nomes acessíveis;
- mensagens de erro compreensíveis;
- suporte a zoom;
- suporte a redução de movimento.

Preferir HTML nativo antes de ARIA.

Não utilizar ARIA incorretamente.

Complementar esta regra com `accessibility.md`.

## 21. UX resiliente

A interface deve funcionar com conteúdo inesperado.

Testar mentalmente:

- textos longos;
- nomes muito grandes;
- números grandes;
- traduções;
- labels extensos;
- listas vazias;
- erros;
- loading;
- ausência de imagem;
- conexão lenta.

Não criar layouts que funcionem somente com textos curtos de exemplo.

## 22. Mobile UX

No mobile:

- priorizar conteúdo essencial;
- reduzir densidade;
- manter ações importantes acessíveis;
- evitar hover como único mecanismo de descoberta;
- utilizar controles apropriados para toque;
- evitar tabelas impossíveis de usar.

Não simplesmente reduzir o desktop.

## 23. Dark mode

Se houver dark mode:

- não inverter cores mecanicamente;
- revisar contraste;
- ajustar superfícies;
- reduzir sombras inadequadas;
- preservar hierarquia;
- verificar estados de interação.

Não assumir que todo projeto precisa de dark mode.

## 24. Performance visual

Evitar:

- animações pesadas;
- JavaScript desnecessário;
- imagens enormes;
- efeitos excessivos;
- componentes client-side sem necessidade.

Preferir CSS e recursos nativos quando suficientes.

Complementar com `performance.md`.

## 25. Stack

Quando o projeto utilizar:

### React
Seguir `react.md`.

### Next.js
Seguir `nextjs.md`.

### Tailwind CSS
Seguir `tailwindcss.md`.

### shadcn/ui
Seguir `shadcn-ui.md`.

### TypeScript
Seguir `typescript.md`.

Não substituir padrões existentes do projeto sem motivo.

## 26. Regra de consistência

Quando houver conflito:

1. requisitos explícitos do usuário;
2. design system existente do projeto;
3. arquitetura existente;
4. requisitos de acessibilidade e segurança;
5. esta skill;
6. preferências estéticas pessoais.

## 27. Regra de eficiência

Não explicar toda a teoria de design antes de implementar.

Não gerar uma biblioteca de componentes desnecessária.

Não pesquisar ou analisar categorias de design que não tenham relação com o produto.

Usar somente as decisões necessárias para resolver a tarefa.

## 28. Anti-patterns

Antes de finalizar, procurar:

- excesso de gradientes;
- excesso de cards;
- excesso de bordas;
- excesso de sombras;
- excesso de animação;
- baixa hierarquia;
- contraste insuficiente;
- CTA demais;
- texto truncado;
- layout quebrando em mobile;
- ícones sem significado;
- componentes duplicados;
- visual inconsistente;
- aparência genérica de template.

## 29. Checklist de pré-entrega

- [ ] A interface possui uma hierarquia visual clara.
- [ ] A identidade visual é consistente.
- [ ] O layout funciona em 375px, 768px, 1024px e 1440px.
- [ ] Textos longos não quebram a interface.
- [ ] Estados de loading, erro e vazio foram considerados quando necessários.
- [ ] Estados hover, focus, active e disabled foram considerados.
- [ ] Foco de teclado permanece visível.
- [ ] Contraste é adequado.
- [ ] Ícones possuem significado ou são marcados como decorativos.
- [ ] Botões somente com ícone possuem nome acessível.
- [ ] `prefers-reduced-motion` é respeitado quando houver animação.
- [ ] Não existem gradientes ou efeitos sem função.
- [ ] Não existem componentes duplicados desnecessariamente.
- [ ] Não foram adicionadas dependências sem necessidade.
- [ ] A implementação segue a arquitetura existente.
- [ ] A solução não está overengineered.

## Resultado esperado

Entregar interfaces com aparência profissional e específica para o produto, com decisões visuais coerentes, UX resiliente, acessibilidade, responsividade, performance e componentes reutilizáveis.

A interface deve parecer projetada para aquele produto — não como um template genérico produzido por IA.
