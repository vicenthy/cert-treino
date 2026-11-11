// CCA-F · Lote 3 — escrito a partir da documentação oficial e dos artigos de engenharia da Anthropic.
// Foco: agentes de longa duração, avaliação de agentes, Agent SDK, boas práticas do Claude Code,
// programmatic tool calling e técnicas contra alucinação.
QB.push(
/* ---------- Domínio 1: Arquitetura agêntica e orquestração ---------- */
{
  id: "a1-20", d: 1, t: "1", sc: "Code Generation with Claude Code", lvl: "Desafiadora",
  q: "Um agente construído no Claude Agent SDK precisa desenvolver uma aplicação web completa ao longo de dezenas de sessões, cada uma com uma janela de contexto nova. Só com um prompt de alto nível, ele tenta fazer tudo de uma vez, fica sem contexto no meio de uma funcionalidade e a sessão seguinte não sabe o que aconteceu. Qual arquitetura a Anthropic descreve para esse caso?",
  o: [
    "Uma primeira sessão inicializadora, com prompt próprio, prepara o ambiente (script init.sh, arquivo de progresso, commit inicial no git); cada sessão seguinte avança aos poucos e deixa commit e notas de progresso para a próxima",
    "Confiar só na compaction automática do SDK, que resume a conversa e sempre passa instruções completas para a próxima sessão",
    "Fazer a aplicação inteira em uma única sessão, com max_tokens no valor máximo",
    "Começar toda sessão com o mesmo prompt de alto nível, para o agente redescobrir o estado do projeto lendo o código do zero"
  ],
  a: [0],
  w: [
    "É a solução em duas partes do artigo: agente inicializador na primeira execução e agente de código que progride de forma incremental, deixando artefatos claros para a próxima sessão.",
    "O artigo diz que a compaction não basta: ela nem sempre passa instruções perfeitamente claras para o próximo agente.",
    "max_tokens limita a saída de uma resposta; não resolve o limite da janela de contexto em um projeto de várias sessões.",
    "Redescobrir tudo a cada sessão é exatamente o desperdício que o arquivo de progresso e o histórico do git evitam."
  ],
  kw: ["dezenas de sessões", "tenta fazer tudo de uma vez", "a sessão seguinte não sabe o que aconteceu"],
  obj: "Estruturar um harness para agentes que trabalham em várias janelas de contexto.",
  cons: ["Várias janelas de contexto", "Continuidade entre sessões"],
  el: [2],
  concept: "Agente inicializador + agente de progresso incremental",
  trap: "Achar que a compaction sozinha garante continuidade em projetos longos.",
  tip: "Longa duração: inicializador prepara o ambiente; cada sessão faz uma parte, commita e anota o progresso.",
  ref: "https://www.anthropic.com/research/effective-harnesses-for-long-running-agents",
  ev: "We developed a two-fold solution to enable the Claude Agent SDK to work effectively across many context windows: an initializer agent that sets up the environment on the first run, and a coding agent that is tasked with making incremental progress in every session, while leaving clear artifacts for the next session. [...] Initializer agent: The very first agent session uses a specialized prompt that asks the model to set up the initial environment: an init.sh script, a claude-progress.txt file that keeps a log of what agents have done, and an initial git commit that shows what files were added.",
  evu: "https://www.anthropic.com/research/effective-harnesses-for-long-running-agents"
},
{
  id: "a1-21", d: 1, t: "1", sc: "Code Generation with Claude Code", lvl: "Intermediária",
  q: "Em um harness de longa duração, o agente inicializador gera uma lista com mais de 200 funcionalidades, todas marcadas como falhando. Quando a lista está em Markdown, os agentes das sessões seguintes às vezes reescrevem ou apagam itens dela. O que a Anthropic fez?",
  o: [
    "Passou a lista para JSON, em que os agentes só podem mudar o campo passes, com instruções firmes proibindo remover ou editar testes",
    "Deixou cada agente reescrever a lista livremente, porque ele conhece melhor o estado atual do projeto",
    "Removeu a lista e deixou o agente decidir sozinho quando o projeto está pronto",
    "Passou a lista para texto corrido dentro do system prompt"
  ],
  a: [0],
  w: [
    "Segundo o artigo, o modelo tem menos tendência a alterar ou sobrescrever indevidamente arquivos JSON do que arquivos Markdown.",
    "Reescrever a lista livremente causa justamente a perda de itens que se quer evitar.",
    "Sem a lista, o agente tende a declarar o projeto pronto cedo demais.",
    "Texto corrido não deixa claro o que pode ser alterado e não registra o status de cada item."
  ],
  kw: ["mais de 200 funcionalidades", "em Markdown", "reescrevem ou apagam itens"],
  obj: "Escolher o formato certo para o estado que o agente não deve corromper.",
  cons: ["Lista de funcionalidades", "Integridade do estado"],
  el: [2],
  concept: "Lista de funcionalidades em JSON com campo de status",
  trap: "Pensar que o formato do arquivo de estado não faz diferença.",
  tip: "Estado que o agente não pode bagunçar: JSON, e só o campo de status pode mudar.",
  ref: "https://www.anthropic.com/research/effective-harnesses-for-long-running-agents",
  ev: "These features were all initially marked as \"failing\" so that later coding agents would have a clear outline of what full functionality looked like. [...] We prompt coding agents to edit this file only by changing the status of a passes field, and we use strongly-worded instructions like \"It is unacceptable to remove or edit tests because this could lead to missing or buggy functionality.\" After some experimentation, we landed on using JSON for this, as the model is less likely to inappropriately change or overwrite JSON files compared to Markdown files.",
  evu: "https://www.anthropic.com/research/effective-harnesses-for-long-running-agents"
},
{
  id: "a1-22", d: 1, t: "1", sc: "Code Generation with Claude Code", lvl: "Intermediária",
  q: "Um agente de longa duração marca funcionalidades como concluídas depois de rodar testes unitários e alguns comandos curl, mas, ao abrir a aplicação, várias delas não funcionam de ponta a ponta. Qual mudança melhorou bastante o resultado, segundo a Anthropic?",
  o: [
    "Pedir explicitamente que ele teste como um usuário humano faria, com ferramentas de automação de navegador (por exemplo, um servidor MCP do Puppeteer), e só marcar a funcionalidade como concluída depois disso",
    "Aumentar o número de testes unitários até cobrir 100% das linhas",
    "Pedir apenas que o agente releia o código antes de marcar como concluída",
    "Trocar para um modelo maior, já que as ferramentas de teste não mudam o resultado"
  ],
  a: [0],
  w: [
    "Com o pedido explícito e ferramentas de automação de navegador, o agente encontrou e corrigiu bugs que não eram óbvios só pelo código.",
    "Testes unitários já existiam e não pegavam as falhas de ponta a ponta.",
    "Reler o código não verifica o comportamento real da aplicação.",
    "O artigo relata que dar essas ferramentas de teste melhorou muito o desempenho."
  ],
  kw: ["testes unitários e alguns comandos curl", "não funcionam de ponta a ponta"],
  obj: "Dar ao agente um jeito real de verificar o próprio trabalho.",
  cons: ["Verificação de ponta a ponta", "Conclusão prematura"],
  el: [3],
  concept: "Verificação de ponta a ponta com automação de navegador",
  trap: "Achar que testes unitários passando provam que a funcionalidade está pronta.",
  tip: "Agente que declara 'pronto' cedo: dê ferramentas para testar como o usuário e peça isso explicitamente.",
  ref: "https://www.anthropic.com/research/effective-harnesses-for-long-running-agents",
  ev: "Absent explicit prompting, Claude tended to make code changes, and even do testing with unit tests or curl commands against a development server, but would fail recognize that the feature didn't work end-to-end. In the case of building a web app, Claude mostly did well at verifying features end-to-end once explicitly prompted to use browser automation tools and do all testing as a human user would.",
  evu: "https://www.anthropic.com/research/effective-harnesses-for-long-running-agents"
},
{
  id: "a1-23", d: 1, t: "1", sc: "Customer Support Resolution Agent", lvl: "Desafiadora",
  q: "Um agente de atendimento acerta 75% das vezes em cada tentativa de uma tarefa. O time de produto quer uma métrica que mostre se os clientes terão um comportamento confiável TODA vez. Qual métrica usar, e qual seria o valor com 3 tentativas?",
  o: [
    "pass^k (as k tentativas precisam passar): cerca de 42% com k = 3",
    "pass@k (basta uma das k tentativas passar): cerca de 98% com k = 3",
    "pass@k, porque ela cai conforme k aumenta e por isso mede consistência",
    "pass^k, que se aproxima de 100% conforme k aumenta"
  ],
  a: [0],
  w: [
    "pass^k mede a chance de todas as k tentativas darem certo: 0,75³ ≈ 42%. É a métrica para agentes que atendem clientes.",
    "O cálculo de pass@3 está certo (1 − 0,25³ ≈ 98%), mas essa métrica mede se pelo menos uma tentativa deu certo, não a consistência.",
    "É o contrário: pass@k sobe conforme k aumenta.",
    "pass^k cai conforme k aumenta; com k = 10 ela tende a 0%."
  ],
  kw: ["75% das vezes", "TODA vez", "3 tentativas"],
  obj: "Escolher a métrica de avaliação de acordo com o requisito do produto.",
  cons: ["Variação entre execuções", "Agente voltado ao cliente"],
  el: [3],
  concept: "pass@k vs pass^k",
  trap: "Usar pass@k, que fica alta, para um requisito de consistência.",
  tip: "pass@k: basta um acerto. pass^k: todos precisam acertar, que é o que importa para o cliente.",
  ref: "https://www.anthropic.com/research/demystifying-evals-for-ai-agents",
  ev: "pass^k measures the probability that all k trials succeed. As k increases, pass^k falls since demanding consistency across more trials is a harder bar to clear. If your agent has a 75% per-trial success rate and you run 3 trials, the probability of passing all three is (0.75)³ ≈ 42%. This metric especially matters for customer-facing agents where users expect reliable behavior every time.",
  evu: "https://www.anthropic.com/research/demystifying-evals-for-ai-agents"
},
{
  id: "a1-24", d: 1, t: "1", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Na avaliação de um agente de reservas de voo, o grader confere só se a última mensagem diz 'Seu voo foi reservado'. Alguns testes passam mesmo sem nenhuma reserva no banco. O que o eval deveria conferir?",
  o: [
    "O outcome: o estado final do ambiente, ou seja, se a reserva realmente existe no banco SQL do ambiente de teste",
    "O tamanho do transcript: quanto mais curto, melhor",
    "Se a mensagem final tem palavras positivas",
    "Se o agente chamou as tools exatamente na ordem de um roteiro fixo"
  ],
  a: [0],
  w: [
    "O artigo define o outcome como o estado final do ambiente; o que o agente diz no transcript não prova que a reserva existe.",
    "O tamanho do transcript não diz nada sobre a reserva ter sido feita.",
    "Palavras positivas são justamente o que engana o grader atual.",
    "Exigir uma ordem exata de tools deixa os testes frágeis e também não confere o estado final."
  ],
  kw: ["só se a última mensagem diz", "sem nenhuma reserva no banco"],
  obj: "Separar o que o agente diz do que ele de fato fez.",
  cons: ["Transcript vs outcome"],
  el: [1, 2],
  concept: "Outcome (estado final) vs transcript",
  trap: "Avaliar a mensagem do agente em vez do efeito no ambiente.",
  tip: "Agente que age no mundo: avalie o estado final, não a frase final.",
  ref: "https://www.anthropic.com/research/demystifying-evals-for-ai-agents",
  ev: "The outcome is the final state in the environment at the end of the trial. A flight-booking agent might say \"Your flight has been booked\" at the end of the transcript, but the outcome is whether a reservation exists in the environment's SQL database.",
  evu: "https://www.anthropic.com/research/demystifying-evals-for-ai-agents"
},
{
  id: "a1-25", d: 1, t: "1", sc: "Code Generation with Claude Code", lvl: "Intermediária",
  q: "Os evals de um agente de código exigem uma sequência exata de chamadas de tools. O agente começa a reprovar em tarefas que resolve corretamente por caminhos diferentes do previsto. O que a Anthropic recomenda?",
  o: [
    "Avaliar o que o agente produziu, e não o caminho que ele seguiu, porque agentes encontram abordagens válidas que quem escreveu o eval não previu",
    "Manter a sequência fixa e acrescentar mais passos obrigatórios",
    "Proibir o agente de usar tools que não estão no roteiro",
    "Abandonar os evals, porque agentes não podem ser avaliados de forma automática"
  ],
  a: [0],
  w: [
    "O artigo considera a checagem de passos exatos rígida demais e recomenda avaliar o resultado, para não punir soluções válidas.",
    "Mais passos obrigatórios deixam os testes ainda mais frágeis.",
    "Restringir as tools não corrige o eval e ainda limita o agente.",
    "Evals automáticos funcionam; o problema é o que este eval está medindo."
  ],
  kw: ["sequência exata de chamadas de tools", "caminhos diferentes do previsto"],
  obj: "Desenhar graders que não punam soluções válidas.",
  cons: ["Testes frágeis"],
  el: [3],
  concept: "Avaliar o resultado, não o caminho",
  trap: "Achar que conferir a ordem das tools é o jeito mais rigoroso de avaliar.",
  tip: "Grader de agente: confira o que foi produzido, não a rota exata.",
  ref: "https://www.anthropic.com/research/demystifying-evals-for-ai-agents",
  ev: "There is a common instinct to check that agents followed very specific steps like a sequence of tool calls in the right order. We've found this approach too rigid and results in overly brittle tests, as agents regularly find valid approaches that eval designers didn't anticipate. So as not to unnecessarily punish creativity, it's often better to grade what the agent produced, not the path it took.",
  evu: "https://www.anthropic.com/research/demystifying-evals-for-ai-agents"
},
{
  id: "a1-26", d: 1, t: "1", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Um time tem uma suíte de evals em que o agente acerta quase 100% e outra, com tarefas novas e difíceis, em que acerta 30%. Um engenheiro quer apagar a segunda porque ela 'só dá nota ruim'. Como a Anthropic descreve essas duas suítes?",
  o: [
    "A segunda é um eval de capacidade (começa com taxa baixa e dá ao time algo para melhorar); a primeira é de regressão (deve ficar perto de 100% e protege contra retrocessos). As duas devem rodar",
    "As duas deveriam ficar perto de 100%; tarefas com taxa baixa estão sempre quebradas",
    "Evals de regressão é que devem começar com taxa baixa e subir com o tempo",
    "Basta o eval de capacidade, porque regressão deixa de importar depois do lançamento"
  ],
  a: [0],
  w: [
    "Capacidade mede o que o agente ainda não faz bem; regressão confere se ele continua fazendo o que já fazia. Ao melhorar uma, é preciso rodar a outra.",
    "Taxa baixa é esperada em um eval de capacidade; isso não significa tarefa quebrada.",
    "É o contrário: regressão deve ficar perto de 100%.",
    "O artigo recomenda rodar regressão continuamente para pegar desvios."
  ],
  kw: ["acerta quase 100%", "tarefas novas e difíceis", "só dá nota ruim"],
  obj: "Distinguir evals de capacidade e de regressão.",
  cons: ["Medir melhoria", "Evitar retrocesso"],
  el: [2],
  concept: "Evals de capacidade vs de regressão",
  trap: "Achar que um eval com taxa baixa é um eval ruim.",
  tip: "Capacidade: começa baixo, algo a escalar. Regressão: perto de 100%, alarme se cair.",
  ref: "https://www.anthropic.com/research/demystifying-evals-for-ai-agents",
  ev: "Capability or \"quality\" evals ask, \"What can this agent do well?\" They should start at a low pass rate, targeting tasks the agent struggles with and giving teams a hill to climb. Regression evals ask, \"Does the agent still handle all the tasks it used to?\" and should have a nearly 100% pass rate. They protect against backsliding, as a decline in score signals that something is broken and needs to be improved.",
  evu: "https://www.anthropic.com/research/demystifying-evals-for-ai-agents"
},
{
  id: "a1-27", d: 1, t: "1", sc: "Code Generation with Claude Code", lvl: "Intermediária",
  q: "Os resultados dos evals de um agente de código variam muito entre execuções, e em alguns casos o agente aproveita arquivos e histórico do git deixados por tentativas anteriores. O que fazer?",
  o: [
    "Isolar cada tentativa, começando de um ambiente limpo, sem estado compartilhado entre execuções (arquivos que sobraram, cache, recursos esgotados)",
    "Reutilizar o mesmo ambiente para ganhar tempo, já que o estado anterior ajuda o agente",
    "Rodar só uma tentativa por tarefa, para a variação sumir",
    "Aumentar a temperature para diminuir a variação"
  ],
  a: [0],
  w: [
    "Estado compartilhado causa falhas correlacionadas por instabilidade da infraestrutura e também pode inflar artificialmente o desempenho.",
    "O estado anterior dá ao agente uma vantagem injusta e distorce a medida.",
    "Uma tentativa só esconde a variação; o artigo roda várias tentativas para ter resultados mais consistentes.",
    "Temperature mais alta aumenta a variação, não diminui."
  ],
  kw: ["variam muito entre execuções", "deixados por tentativas anteriores"],
  obj: "Garantir que o eval mede o agente, e não o ambiente.",
  cons: ["Ruído de infraestrutura", "Desempenho inflado"],
  el: [3],
  concept: "Tentativas isoladas em ambiente limpo",
  trap: "Reaproveitar o ambiente entre tentativas para economizar tempo.",
  tip: "Cada tentativa começa do zero: sem arquivos, cache ou git de rodadas anteriores.",
  ref: "https://www.anthropic.com/research/demystifying-evals-for-ai-agents",
  ev: "Each trial should be \"isolated\" by starting from a clean environment. Unnecessary shared state between runs (leftover files, cached data, resource exhaustion) can cause correlated failures due to infrastructure flakiness rather than agent performance. Shared state can also artificially inflate performance.",
  evu: "https://www.anthropic.com/research/demystifying-evals-for-ai-agents"
},
{
  id: "a1-28", d: 1, t: "1", sc: "Developer Productivity with Claude", lvl: "Intermediária",
  q: "Para avaliar a busca na web de um assistente, um time criou apenas casos em que o modelo DEVERIA pesquisar. Depois de otimizar para esse eval, o assistente passou a pesquisar quase tudo, até perguntas triviais. Qual foi o erro?",
  o: [
    "Eval de um lado só: é preciso testar tanto os casos em que o comportamento deve acontecer quanto aqueles em que ele não deve",
    "Faltaram mais casos em que o modelo deveria pesquisar",
    "O problema é só do modelo; o eval não influencia o comportamento otimizado",
    "Deveriam ter usado somente avaliação humana"
  ],
  a: [0],
  w: [
    "O artigo usa este exemplo: evals de um lado só geram otimização de um lado só. Evite evals desbalanceados.",
    "Mais casos positivos pioram o desequilíbrio.",
    "O comportamento mudou justamente porque o time otimizou para esse eval.",
    "O problema é o desequilíbrio dos casos, e ele continuaria com avaliação humana."
  ],
  kw: ["apenas casos em que o modelo DEVERIA pesquisar", "pesquisar quase tudo"],
  obj: "Montar evals balanceados.",
  cons: ["Otimização de um lado só"],
  el: [2],
  concept: "Testar quando o comportamento deve e quando não deve acontecer",
  trap: "Criar só casos positivos e otimizar em cima deles.",
  tip: "Todo comportamento tem dois lados no eval: quando fazer e quando NÃO fazer.",
  ref: "https://www.anthropic.com/research/demystifying-evals-for-ai-agents",
  ev: "Test both the cases where a behavior should occur and where it shouldn't. One-sided evals create one-sided optimization. For instance, if you only test whether the agent searches when it should, you might end up with an agent that searches for almost everything. Try to avoid class-imbalanced evals.",
  evu: "https://www.anthropic.com/research/demystifying-evals-for-ai-agents"
},
{
  id: "a1-29", d: 1, t: "1", sc: "Claude Code for Continuous Integration", lvl: "Pegadinha",
  q: "Com um modelo de ponta, uma tarefa do eval falha em 100 de 100 tentativas. Lendo os transcripts, o time vê que o teste espera o script em um caminho que o enunciado nunca mencionou. Qual a leitura correta?",
  o: [
    "0% em muitas tentativas costuma indicar uma tarefa quebrada, e não um agente incapaz: tudo o que o grader confere deve estar claro na descrição da tarefa",
    "O agente é incapaz, e a tarefa deve ficar como está",
    "Rodar 1.000 tentativas até alguma passar",
    "Trocar o grader por um LLM, que adivinha o caminho esperado"
  ],
  a: [0],
  w: [
    "O artigo diz que, com modelos de ponta, 0% em pass@100 é na maioria das vezes sinal de tarefa quebrada. Corrija o enunciado.",
    "O agente falha por um detalhe que ele não tinha como saber, então o problema não é capacidade.",
    "Mais tentativas não resolvem uma especificação ambígua.",
    "A correção certa é deixar o requisito explícito no enunciado."
  ],
  kw: ["100 de 100 tentativas", "nunca mencionou"],
  obj: "Interpretar falhas de eval antes de culpar o agente.",
  cons: ["Especificação ambígua", "Ler os transcripts"],
  el: [2],
  concept: "Tarefa quebrada vs agente incapaz",
  trap: "Concluir que o agente não consegue, sem ler os transcripts.",
  tip: "0% em pass@100 com modelo de ponta: desconfie da tarefa, não do agente.",
  ref: "https://www.anthropic.com/research/demystifying-evals-for-ai-agents",
  ev: "Everything the grader checks should be clear from the task description; agents shouldn't fail due to ambiguous specs. With frontier models, a 0% pass rate across many trials (i.e. 0% pass@100) is most often a signal of a broken task, not an incapable agent,",
  evu: "https://www.anthropic.com/research/demystifying-evals-for-ai-agents"
},
{
  id: "a1-30", d: 1, t: "1", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Uma aplicação multiusuário usa o Claude Agent SDK, com uma sessão de agente por cliente. Quando um cliente volta no dia seguinte, a aplicação precisa retomar exatamente a conversa DELE, que pode não ser a mais recente do diretório. Qual opção usar?",
  o: [
    "Guardar o ID de sessão de cada cliente e passá-lo em resume",
    "continue, que retoma a sessão mais recente do diretório",
    "fork, que grava o histórico novo por cima da sessão original",
    "Começar sempre uma sessão nova e colar o histórico inteiro no prompt"
  ],
  a: [0],
  w: [
    "resume recebe um ID de sessão específico, e a documentação diz que ele é necessário com várias sessões, por exemplo uma por usuário.",
    "continue pega a sessão mais recente do diretório, que pode ser de outro cliente.",
    "fork cria uma sessão nova com uma cópia do histórico; a original fica intacta.",
    "Colar o histórico é desnecessário, já que o SDK retoma a sessão pelo ID."
  ],
  kw: ["multiusuário", "uma sessão de agente por cliente", "pode não ser a mais recente"],
  obj: "Escolher entre continue, resume e fork no Agent SDK.",
  cons: ["Várias sessões simultâneas"],
  el: [3],
  concept: "Sessões no Agent SDK: continue, resume e fork",
  trap: "Usar continue em app multiusuário.",
  tip: "continue = a mais recente; resume = pelo ID; fork = cópia para tentar outro caminho.",
  ref: "https://code.claude.com/docs/en/agent-sdk/sessions",
  ev: "Continue finds the most recent session in the current directory. You don't track anything. Works well when your app runs one conversation at a time. Resume takes a specific session ID. You track the ID. Required when you have multiple sessions (for example, one per user in a multi-user app) or want to return to one that isn't the most recent. Fork is different: it creates a new session that starts with a copy of the original's history. The original stays unchanged.",
  evu: "https://code.claude.com/docs/en/agent-sdk/sessions"
},
{
  id: "a1-31", d: 1, t: "1", sc: "Multi-Agent Research System", lvl: "Intermediária",
  q: "Um agente que usa um modelo Claude recente cria subagentes até para tarefas simples, como achar um arquivo que um único grep encontraria. Tudo fica mais lento e mais caro. O que a documentação de prompting sugere?",
  o: [
    "Explicar no prompt quando usar subagentes (trabalho em paralelo, contexto isolado, frentes independentes) e quando trabalhar direto (tarefas simples, sequenciais, edição de um arquivo)",
    "Tirar a descrição das tools de subagente para o modelo não encontrá-las",
    "Exigir no prompt que ele use subagentes em toda tarefa, para padronizar",
    "Aumentar o effort para o modelo pensar mais antes de delegar"
  ],
  a: [0],
  w: [
    "A documentação alerta para o uso excessivo de subagentes e sugere orientação explícita de quando delegar e quando não.",
    "Tools de subagente mal descritas atrapalham a orquestração; a própria documentação pede que sejam bem definidas.",
    "Isso agrava o problema.",
    "Mais effort tende a aumentar o esforço do modelo; o problema é a falta de critério de quando delegar."
  ],
  kw: ["até para tarefas simples", "um único grep"],
  obj: "Calibrar quando o agente deve delegar a subagentes.",
  cons: ["Custo", "Latência"],
  el: [2],
  concept: "Uso excessivo de subagentes",
  trap: "Achar que delegar é sempre melhor.",
  tip: "Subagente: paralelo, contexto isolado, frentes independentes. Simples ou sequencial: faça direto.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "Watch for overuse: Claude Opus 4.6 has a strong tendency to use subagents and might spawn them in situations where a simpler, direct approach would suffice. For example, the model might spawn subagents for code exploration when a direct grep call is faster and sufficient. [...] Use subagents when tasks can run in parallel, require isolated context, or involve independent workstreams that don't need to share state. For simple tasks, sequential operations, single-file edits, or tasks where you need to maintain context across steps, work directly rather than delegating.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},
{
  id: "a1-32", d: 1, t: "1", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Um agente de e-mail feito com o Claude Agent SDK precisa encontrar conversas antigas relevantes. Um engenheiro quer começar montando busca semântica com embeddings. O que a Anthropic sugere?",
  o: [
    "Começar com busca agêntica (o agente usa o sistema de arquivos e comandos como grep e tail) e só acrescentar busca semântica se precisar de resultados mais rápidos ou de mais variações",
    "Começar sempre pelos embeddings, que são mais precisos e transparentes",
    "Colocar todas as conversas antigas no system prompt",
    "Evitar o sistema de arquivos, porque a estrutura de pastas não interfere no contexto"
  ],
  a: [0],
  w: [
    "O artigo diz que a busca semântica costuma ser mais rápida, mas é menos precisa, mais difícil de manter e menos transparente; por isso recomenda começar pela agêntica.",
    "É o contrário: a busca semântica é menos precisa e menos transparente.",
    "Isso enche o contexto com conversas que, na maioria, não são relevantes.",
    "O artigo diz que a estrutura de pastas e arquivos vira uma forma de engenharia de contexto."
  ],
  kw: ["conversas antigas", "busca semântica com embeddings"],
  obj: "Escolher como o agente busca o próprio contexto.",
  cons: ["Precisão", "Manutenção"],
  el: [2],
  concept: "Busca agêntica vs busca semântica",
  trap: "Montar RAG com embeddings antes de tentar a busca agêntica.",
  tip: "Agent SDK: comece com busca agêntica (grep, tail, pastas); embeddings só se precisar.",
  ref: "https://claude.com/resources/articles/building-agents-with-the-claude-agent-sdk",
  ev: "When Claude encounters large files, like logs or user-uploaded files, it will decide which way to load these into its context by using bash scripts like grep and tail. In essence, the folder and file structure of an agent becomes a form of context engineering. [...] Semantic search is usually faster than agentic search, but less accurate, more difficult to maintain, and less transparent. [...] Given its limitations, we suggest starting with agentic search, and only adding semantic search if you need faster results or more variations.",
  evu: "https://claude.com/resources/articles/building-agents-with-the-claude-agent-sdk"
},

/* ---------- Domínio 2: Configuração e fluxos do Claude Code ---------- */
{
  id: "b2-19", d: 2, t: "2", sc: "Code Generation with Claude Code", lvl: "Intermediária",
  q: "Um time quer garantir que o Claude Code não encerre o turno enquanto o typecheck do projeto estiver falhando, sem depender de o modelo lembrar de uma instrução. Qual configuração faz isso?",
  o: [
    "Um hook Stop que roda o typecheck e sai com código 2 se ele falhar, mandando a saída do compilador para o stderr como motivo para continuar",
    "Uma linha no CLAUDE.md: 'sempre rode o typecheck antes de terminar'",
    "Um hook PostToolUse que roda o typecheck e sai com código 0 quando ele falha",
    "Aumentar o effort, para o modelo ser mais cuidadoso"
  ],
  a: [0],
  w: [
    "O hook Stop roda quando o Claude tenta encerrar o turno, e o código de saída 2 o manda de volta ao trabalho. Quem aplica é o harness.",
    "O CLAUDE.md é uma instrução que o modelo lê e decide seguir, então não há garantia.",
    "O código de saída 0 não bloqueia nada, e o PostToolUse não impede o fim do turno.",
    "O effort muda o quanto o modelo se esforça, mas não impõe uma verificação."
  ],
  kw: ["não encerre o turno", "sem depender de o modelo lembrar"],
  obj: "Impor uma verificação de conclusão com hooks.",
  cons: ["Determinismo"],
  el: [3],
  concept: "Hook Stop com código de saída 2",
  trap: "Achar que uma instrução firme no CLAUDE.md é garantia.",
  tip: "'Não termine até passar' = hook Stop + exit 2; o stderr vira o motivo.",
  ref: "https://code.claude.com/docs/en/best-practices",
  ev: "As a Stop hook: a Stop hook runs your script whenever Claude tries to end its turn, and sends Claude back to work if the script exits with code 2. This one is enforced by Claude Code (the harness), so the turn doesn't end until the typecheck passes or the block limit is reached. [...] Exit code 2 is what blocks the stop. Whatever the command prints to stderr goes back to Claude as the reason it can't finish yet",
  evu: "https://code.claude.com/docs/en/best-practices"
},
{
  id: "b2-20", d: 2, t: "2", sc: "Claude Code for Continuous Integration", lvl: "Desafiadora",
  q: "Uma empresa quer bloquear qualquer commit com segredos usando um hook do Claude Code. Um engenheiro propõe um hook do tipo prompt, em que outro modelo decide se há segredo. O scanner às vezes fica fora do ar. Qual configuração é a mais adequada?",
  o: [
    "Um hook command (ou http), que é determinístico, com onFailure: \"block\" para bloquear a ação também quando o hook falhar ou estourar o tempo",
    "Um hook prompt, porque um modelo decidindo é tão garantido quanto um script",
    "Um hook command sem onFailure, deixando o commit passar quando o scanner cair",
    "Uma instrução no CLAUDE.md, já que o Claude a segue quase sempre"
  ],
  a: [0],
  w: [
    "A documentação recomenda hooks command ou http para aplicar regras de verdade, e onFailure: \"block\" quando a ação deve ser bloqueada mesmo se o hook falhar.",
    "Hooks prompt e agent pedem a outro modelo que decida, então também não são determinísticos.",
    "No exemplo da documentação, é melhor bloquear o commit do que deixá-lo passar sem verificação.",
    "Uma instrução no CLAUDE.md fica a critério do modelo."
  ],
  kw: ["bloquear qualquer commit com segredos", "hook do tipo prompt", "fica fora do ar"],
  obj: "Escolher o tipo de hook e o comportamento quando ele falha.",
  cons: ["Determinismo", "Falha do hook"],
  el: [3],
  concept: "Hooks determinísticos e onFailure: block",
  trap: "Achar que qualquer hook é determinístico, inclusive os que consultam um modelo.",
  tip: "Regra sem exceção: hook command/http + onFailure: \"block\". Hook prompt/agent = outro modelo decide.",
  ref: "https://code.claude.com/docs/en/best-practices",
  ev: "A prompt or agent hook asks another model to decide, so it isn't deterministic either. For real enforcement, use a command or http hook, and add onFailure: \"block\" if the action should also be stopped when the hook itself crashes or times out. For a hook that scans commits for secrets, say, you'd rather block the commit than let it through unscanned while the scanner is down.",
  evu: "https://code.claude.com/docs/en/best-practices"
},
{
  id: "b2-21", d: 2, t: "2", sc: "Developer Productivity with Claude", lvl: "Intermediária",
  q: "Um time vai reescrever o CLAUDE.md do repositório. Que tipo de conteúdo a documentação de boas práticas manda priorizar?",
  o: [
    "O que o Claude não descobre lendo o repositório: uma decisão tomada em reunião, um processo de deploy que só existe na cabeça de alguém, a variável de ambiente que os testes de integração exigem",
    "Uma descrição completa da estrutura de pastas e das convenções que já aparecem no código",
    "A lista de todos os arquivos do projeto, para poupar buscas",
    "Cópias da documentação do framework usado no projeto"
  ],
  a: [0],
  w: [
    "A documentação manda escrever só o que o Claude não acha lendo o repositório, ou o que ele gastaria tempo redescobrindo a cada sessão.",
    "Os modelos atuais encontram a estrutura e as convenções lendo o código, muitas vezes mais rápido do que alguém conseguiria explicar.",
    "Uma lista de arquivos é algo que o Claude descobre sozinho e ainda fica desatualizada.",
    "Copiar documentação externa infla o CLAUDE.md sem trazer informação específica do projeto."
  ],
  kw: ["reescrever o CLAUDE.md", "priorizar"],
  obj: "Decidir o que vale a pena colocar no CLAUDE.md.",
  cons: ["Contexto enxuto"],
  el: [2, 3],
  concept: "Contar ao Claude o que ele não consegue ver",
  trap: "Documentar o que o código já mostra.",
  tip: "Teste: ele acharia isso lendo o código? E iria procurar? Se sim nas duas, deixe de fora.",
  ref: "https://code.claude.com/docs/en/best-practices",
  ev: "Only write down what Claude can't find by reading the repo, or what it would otherwise spend time rediscovering every session. [...] What it can't find is the information that was never in the repo: A decision your team made in a meeting A deploy process that lives in one person's head The environment variable your integration tests need",
  evu: "https://code.claude.com/docs/en/best-practices"
},
{
  id: "b2-22", d: 2, t: "2", sc: "Developer Productivity with Claude", lvl: "Pegadinha",
  q: "Um desenvolvedor espera que delegar uma tarefa a um subagent do Claude Code produza uma resposta 'mais inteligente' e mais barata. O que a documentação diz?",
  o: [
    "Por padrão é o mesmo modelo (ou um menor) na mesma tarefa: dá paralelismo ou um olhar novo, não uma resposta mais inteligente, e cada subagent gasta tokens próprios",
    "Subagents sempre usam um modelo maior que o da sessão principal",
    "Subagents não contam no uso, porque rodam em segundo plano",
    "Delegar a um subagent sempre faz a tarefa terminar mais rápido"
  ],
  a: [0],
  w: [
    "A documentação diz que o custo é principalmente em tokens e que o ganho é paralelismo ou um olhar novo, não uma resposta mais inteligente.",
    "Por padrão é o mesmo modelo ou um menor.",
    "Cada subagent faz as próprias requisições, que contam no mesmo uso da conversa principal.",
    "Um subagent novo precisa primeiro reunir contexto e pode acabar mais lento do que fazer a tarefa na própria sessão."
  ],
  kw: ["mais inteligente", "mais barata"],
  obj: "Entender o custo e o benefício real de subagents.",
  cons: ["Tokens", "Tempo"],
  el: [2],
  concept: "Quanto custam os subagents",
  trap: "Achar que delegar melhora a qualidade da resposta.",
  tip: "Subagent = paralelismo, contexto isolado, revisor 'de fora'. Não é um cérebro maior.",
  ref: "https://code.claude.com/docs/en/best-practices",
  ev: "What they cost you is mostly tokens, since every subagent sends its own requests and they count against the same usage as your main conversation. Sometimes it's time as well: a fresh subagent first has to gather context your conversation already had, so it can end up slower than doing the task where you are. And by default it's the same model (or a smaller one) on the same task. You get parallelism or a fresh pair of eyes out of it, but not a smarter answer.",
  evu: "https://code.claude.com/docs/en/best-practices"
},
{
  id: "b2-23", d: 2, t: "2", sc: "Code Generation with Claude Code", lvl: "Pegadinha",
  q: "Durante uma sessão, o Claude Code rodou pelo Bash um script que reescreveu o arquivo config/legacy.yml, que ele nunca tinha editado com as ferramentas de edição. O desenvolvedor usa /rewind para desfazer. O que acontece com esse arquivo?",
  o: [
    "Nada: um arquivo alterado só por comandos Bash não é rastreado pelos checkpoints e continua como está; para reverter, use controle de versão, como o Git",
    "O /rewind restaura o arquivo, porque todo comando Bash é rastreado",
    "O /rewind apaga o arquivo",
    "O arquivo só volta se o comando tiver sido aprovado manualmente"
  ],
  a: [0],
  w: [
    "Os checkpoints só desfazem mudanças do Bash em arquivos que o Claude já tinha editado com as ferramentas de edição.",
    "Mudanças do Bash em arquivos nunca editados pelo Claude não são rastreadas.",
    "O /rewind não apaga arquivos que não rastreia.",
    "A aprovação manual não muda o que os checkpoints rastreiam."
  ],
  kw: ["pelo Bash", "nunca tinha editado com as ferramentas de edição", "/rewind"],
  obj: "Conhecer os limites dos checkpoints.",
  cons: ["Mudanças fora das ferramentas de edição"],
  el: [2],
  concept: "Limites do checkpointing",
  trap: "Tratar /rewind como substituto do controle de versão.",
  tip: "Checkpoint é recuperação rápida de sessão; Bash em arquivo não editado e mudanças externas exigem Git.",
  ref: "https://code.claude.com/docs/en/checkpointing",
  ev: "Once Claude has edited a file with its file editing tools in your conversation, /rewind undoes changes that Bash commands make to that file afterward. A file that only Bash commands changed isn't tracked and stays as it is. To revert it, use version control, such as Git.",
  evu: "https://code.claude.com/docs/en/checkpointing"
},
{
  id: "b2-24", d: 2, t: "2", sc: "Developer Productivity with Claude", lvl: "Intermediária",
  q: "Um time quer que TODAS as respostas do Claude Code em uma sessão sigam um tom didático e um formato próprio, que se troque com um único comando. Também quer que o formatador rode, sem falta, depois de cada edição. Que combinação a documentação indica?",
  o: [
    "Output style para a voz e o formato de todas as respostas; hook para o formatador, que precisa rodar sempre",
    "Output style para as duas coisas, porque ele é aplicado pelo harness e não depende do modelo",
    "Skill para o tom e CLAUDE.md para o formatador",
    "Subagent para o tom e --append-system-prompt para o formatador"
  ],
  a: [0],
  w: [
    "A tabela da documentação liga output style a voz e formato de toda resposta, e hook ao que tem de acontecer sempre, sem exceção.",
    "O output style é uma instrução que o Claude segue, e nada a impõe.",
    "A skill só carrega quando é chamada ou quando a tarefa combina, e o CLAUDE.md não garante execução.",
    "O subagent roda em contexto separado, e --append-system-prompt também é só uma instrução."
  ],
  kw: ["TODAS as respostas", "com um único comando", "sem falta, depois de cada edição"],
  obj: "Escolher entre output style, CLAUDE.md, skill, hook e subagent.",
  cons: ["Escopo da sessão", "Garantia de execução"],
  el: [3],
  concept: "Output styles vs outros recursos",
  trap: "Achar que o output style é imposto pelo harness.",
  tip: "Como responder: output style. O que saber: CLAUDE.md. Tarefa específica: skill. Sempre, sem exceção: hook.",
  ref: "https://code.claude.com/docs/en/output-styles",
  ev: "An output style applies to every response in a session. It's an instruction Claude follows, so nothing enforces it. [...] Every response in a certain voice, length, or format, or Claude in a different role [...] It applies to the whole session, and you switch styles with one command [...] Something to happen every time without exception, such as formatting after each edit or blocking a command [...] Claude Code runs a hook itself at a lifecycle event, so it doesn't depend on Claude following an instruction",
  evu: "https://code.claude.com/docs/en/output-styles"
},
{
  id: "b2-25", d: 2, t: "2", sc: "Developer Productivity with Claude", lvl: "Fácil",
  q: "Um time criou várias skills, dois subagents, hooks e a configuração de um servidor MCP, e quer distribuir tudo como uma unidade para outros times instalarem em muitos projetos, com versões publicadas. O que usar?",
  o: [
    "Um plugin, que reúne skills, subagents, hooks e servidores MCP em uma unidade e pode ser instalado a partir de um marketplace",
    "Um plugin para cada skill e cada hook, já que eles não funcionam fora de um plugin",
    "Copiar tudo para o CLAUDE.md da organização",
    "Um output style com todas as instruções"
  ],
  a: [0],
  w: [
    "A documentação recomenda plugins para empacotar vários recursos como uma unidade, compartilhar com o time, instalar em muitos projetos e publicar versões.",
    "Skills, subagents, hooks e servidores MCP funcionam sozinhos, sem plugin; o plugin serve para empacotá-los juntos.",
    "O CLAUDE.md não executa hooks nem configura servidores MCP.",
    "O output style só muda como o Claude responde."
  ],
  kw: ["distribuir tudo como uma unidade", "versões publicadas"],
  obj: "Saber quando empacotar a configuração como plugin.",
  cons: ["Distribuição", "Versionamento"],
  el: [2, 3],
  concept: "Plugins do Claude Code",
  trap: "Achar que skills e hooks precisam de plugin para funcionar.",
  tip: "Plugin = pacote de skills, subagents, hooks e MCP para distribuir e versionar.",
  ref: "https://code.claude.com/docs/en/plugins",
  ev: "Skills, subagents, hooks, and MCP servers all work on their own, without a plugin. [...] Use a plugin when you want several skills, subagents, hooks, or MCP servers packaged as one unit. Install one to get a setup someone else built, with one command and updates from its marketplace. Make one to give your own setup to teammates, install it in many projects, or publish versioned releases.",
  evu: "https://code.claude.com/docs/en/plugins"
},
{
  id: "b2-26", d: 2, t: "2", sc: "Code Generation with Claude Code", lvl: "Desafiadora",
  q: "Um desenvolvedor pede a um subagent que revise cada diff e corrige todos os achados. Com o tempo, o código ganha camadas extras de abstração e testes para casos que não podem acontecer. Como a documentação sugere escrever o pedido de revisão?",
  o: [
    "Pedir a revisão contra a especificação (por exemplo, SPEC.md), conferindo requisitos e casos de borda, relatando só lacunas que afetam a correção e ignorando estilo",
    "Pedir que ele encontre o máximo possível de problemas, inclusive de estilo",
    "Fazer a revisão na mesma conversa em que o código foi escrito, para o revisor conhecer o raciocínio",
    "Pular a revisão, porque o modelo que escreveu o código já o verificou"
  ],
  a: [0],
  w: [
    "A documentação mostra esse prompt e avisa para não tirar o 'skip style': um revisor pedido para achar problemas sempre acha algum.",
    "É justamente o que gera abstrações extras e testes para casos impossíveis.",
    "A documentação valoriza um revisor que não viu como o código foi escrito, para não ser influenciado por esse raciocínio.",
    "Quem escreveu tende a confirmar o próprio trabalho."
  ],
  kw: ["corrige todos os achados", "camadas extras de abstração"],
  obj: "Escrever um pedido de revisão útil.",
  cons: ["Revisor sempre acha algo"],
  el: [3],
  concept: "Revisão contra a especificação",
  trap: "Corrigir todo achado de um revisor sem foco.",
  tip: "Revisão: contra o SPEC, só o que afeta correção, 'skip style'.",
  ref: "https://code.claude.com/docs/en/best-practices",
  ev: "use a subagent to review the rate limiter diff against SPEC.md, check every requirement is implemented and the listed edge cases have tests, report gaps that affect correctness and skip style [...] Don't drop the skip style part of that prompt. A reviewer that's asked to find problems will always find something. If you fix every finding, you end up with extra abstraction layers and tests for cases that can't happen.",
  evu: "https://code.claude.com/docs/en/best-practices"
},
{
  id: "b2-27", d: 2, t: "2", sc: "Developer Productivity with Claude", lvl: "Fácil",
  q: "Um desenvolvedor usa a mesma sessão do Claude Code o dia inteiro para três tarefas sem relação entre si, e o consumo cresce a cada turno da quarta tarefa. O que a documentação recomenda?",
  o: [
    "Usar /clear entre tarefas sem relação: não custa nada e evita que a tarefa seguinte continue pagando pelo histórico da anterior",
    "Rodar /compact a cada turno, porque compactar não custa nada",
    "Nada, porque o histórico antigo não é reenviado nas requisições",
    "Abrir mais subagents em segundo plano para dividir o histórico"
  ],
  a: [0],
  w: [
    "Cada requisição envia a conversa inteira; /clear zera o histórico que não interessa à nova tarefa.",
    "Em sessão longa, o /compact é uma requisição grande, porque lê a conversa toda para resumir.",
    "Cada requisição reenvia a conversa inteira, então a quarta tarefa relê as três anteriores a cada turno.",
    "Subagents em segundo plano fazem mais requisições e aumentam o consumo."
  ],
  kw: ["três tarefas sem relação", "consumo cresce a cada turno"],
  obj: "Controlar custo e contexto em sessões longas.",
  cons: ["Custo por turno"],
  el: [3],
  concept: "/clear entre tarefas",
  trap: "Achar que o /compact é de graça.",
  tip: "Tarefa nova sem relação: /clear. /compact com foco quando precisar manter algo.",
  ref: "https://code.claude.com/docs/en/best-practices",
  ev: "Every request sends the whole conversation, so a session that's collected three unrelated tasks re-reads all three on every turn of the fourth. [...] /clear between unrelated tasks. It costs nothing, and it means the next task doesn't keep paying for the previous one's history. [...] On a long session /compact is itself a big request, since it reads the whole conversation to summarize it, and even more so once the cache has expired.",
  evu: "https://code.claude.com/docs/en/best-practices"
},

/* ---------- Domínio 3: Prompt engineering e saída estruturada ---------- */
{
  id: "c3-16", d: 3, t: "3", sc: "Structured Data Extraction", lvl: "Pegadinha",
  q: "Ao migrar para um modelo Claude recente, uma aplicação que enviava no fim da conversa uma mensagem assistant parcial com '{', para forçar JSON, passou a receber erro 400. Qual a migração recomendada?",
  o: [
    "Usar structured outputs para restringir a resposta a um schema; prefill na última mensagem assistant deixou de ser suportado a partir dos modelos Claude 4.6",
    "Trocar o prefill '{' por '['",
    "Mover o '{' para o system prompt como prefill",
    "Desativar a validação de JSON no cliente"
  ],
  a: [0],
  w: [
    "A documentação diz que prefill gera erro 400 nesses modelos e indica structured outputs para impor um formato.",
    "Qualquer prefill na última mensagem assistant dá o mesmo erro 400.",
    "O system prompt não funciona como prefill da resposta.",
    "O erro vem da API, não da validação feita no cliente."
  ],
  kw: ["mensagem assistant parcial", "erro 400"],
  obj: "Substituir prefill nos modelos atuais.",
  cons: ["Compatibilidade com modelos novos"],
  el: [3],
  concept: "Migrar de prefill para structured outputs",
  trap: "Achar que só o conteúdo do prefill está errado.",
  tip: "Modelos 4.6+: sem prefill. Formato garantido = structured outputs.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "Starting with Claude 4.6 models and Claude Mythos Preview, prefilled responses (providing a partial assistant message for Claude to continue from) on the last assistant turn are no longer supported. Requests with prefilled assistant messages to these models return a 400 error. [...] Migration: The structured outputs feature is designed specifically to constrain Claude's responses to follow a given schema.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},
{
  id: "c3-17", d: 3, t: "3", sc: "Developer Productivity with Claude", lvl: "Intermediária",
  q: "Uma resposta longa foi interrompida no meio. Antes, o time a continuava enviando o texto parcial como prefill da mensagem assistant, o que os modelos recentes não aceitam mais. Como continuar agora?",
  o: [
    "Passar a continuação para a mensagem do usuário, incluindo o final do texto interrompido e pedindo para continuar de onde parou, ou refazer a requisição se isso não prejudicar o usuário",
    "Enviar o texto parcial como system prompt",
    "Aumentar a temperature para o modelo adivinhar onde parou",
    "Não há como continuar; a resposta sempre precisa ser descartada"
  ],
  a: [0],
  w: [
    "É a migração indicada para continuações: o texto vai na mensagem do usuário, ou a requisição é refeita.",
    "O system prompt não é o lugar de uma resposta parcial a continuar.",
    "Temperature não ajuda o modelo a saber onde parou.",
    "A documentação mostra duas formas de seguir."
  ],
  kw: ["interrompida no meio", "como prefill"],
  obj: "Continuar respostas interrompidas sem prefill.",
  cons: ["Sem prefill"],
  el: [2, 3],
  concept: "Continuações sem prefill",
  trap: "Tentar contornar o fim do prefill pelo system prompt.",
  tip: "Continuação: mensagem do usuário com o trecho final + 'continue de onde parou'.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "Migration: Move the continuation to the user message, and include the final text from the interrupted response: [...] If this is part of error-handling or incomplete-response-handling and there is no UX penalty, retry the request.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},
{
  id: "c3-18", d: 3, t: "3", sc: "Structured Data Extraction", lvl: "Fácil",
  q: "Um assistente que analisa relatórios de aquisição às vezes inventa números quando o relatório não traz a informação. Qual técnica básica a documentação recomenda primeiro?",
  o: [
    "Permitir explicitamente que o Claude admita incerteza, por exemplo respondendo 'não tenho informação suficiente' quando o relatório não cobrir o ponto",
    "Proibir no prompt qualquer resposta sem números",
    "Aumentar max_tokens para ele ter espaço de encontrar os números",
    "Pedir que ele sempre dê a melhor estimativa, mesmo sem dados"
  ],
  a: [0],
  w: [
    "A documentação diz que dar permissão para dizer 'não sei' pode reduzir drasticamente a informação falsa.",
    "Isso força o modelo a inventar números.",
    "max_tokens não cria a informação que falta no relatório.",
    "Estimar sem dados é o próprio problema."
  ],
  kw: ["inventa números", "não traz a informação"],
  obj: "Reduzir alucinações.",
  cons: ["Informação ausente"],
  el: [2],
  concept: "Permitir que o Claude diga 'não sei'",
  trap: "Exigir uma resposta mesmo quando não há dados.",
  tip: "Contra alucinação: permissão para 'não sei', citações diretas, verificação com citações.",
  ref: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations",
  ev: "Allow Claude to say \"I don't know\": Explicitly give Claude permission to admit uncertainty. This technique can drastically reduce false information.",
  evu: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations"
},
{
  id: "c3-19", d: 3, t: "3", sc: "Structured Data Extraction", lvl: "Intermediária",
  q: "Um time gera comunicados de imprensa a partir de briefings de produto e quer que cada afirmação do texto final seja auditável e apoiada nos documentos. Qual técnica atende melhor?",
  o: [
    "Depois do rascunho, pedir que o Claude ache, para cada afirmação, uma citação direta dos documentos que a sustente, e retire a afirmação quando não achar",
    "Pedir que ele escreva com mais confiança para soar convincente",
    "Dar um único exemplo de comunicado e deixar o modelo copiar o estilo",
    "Tirar os documentos do prompt para economizar tokens"
  ],
  a: [0],
  w: [
    "É a técnica de verificar com citações: cada afirmação precisa de uma citação de apoio, e a que não tiver é retirada.",
    "Soar confiante não torna a afirmação verdadeira.",
    "Um exemplo ajuda no estilo, não na fundamentação.",
    "Sem os documentos, não há como fundamentar nada."
  ],
  kw: ["auditável", "apoiada nos documentos"],
  obj: "Tornar as respostas verificáveis.",
  cons: ["Rastreabilidade"],
  el: [1, 3],
  concept: "Verificar com citações e retirar o que não tem apoio",
  trap: "Confiar no texto final sem exigir a fonte de cada afirmação.",
  tip: "Afirmação sem citação de apoio sai do texto.",
  ref: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations",
  ev: "Verify with citations: Make Claude's response auditable by having it cite quotes and sources for each of its claims. You can also have Claude verify each claim by finding a supporting quote after it generates a response. If it can't find a quote, it must retract the claim.",
  evu: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations"
},
{
  id: "c3-20", d: 3, t: "3", sc: "Developer Productivity with Claude", lvl: "Fácil",
  q: "Um prompt que gera relatórios dá resultados medianos, e o time não sabe se falta contexto. Qual teste rápido a documentação sugere para avaliar se o prompt está claro?",
  o: [
    "Mostrar o prompt a um colega com pouco contexto da tarefa e pedir que ele o siga; se ele ficar confuso, o Claude também ficará",
    "Rodar o prompt com temperature 0 e ver se a saída se repete",
    "Contar os tokens, porque prompts mais curtos são sempre mais claros",
    "Traduzir o prompt para outro idioma e ver se o sentido se mantém"
  ],
  a: [0],
  w: [
    "É o 'teste-chave' da documentação: pense no Claude como um funcionário brilhante, mas novo, que não conhece suas normas.",
    "A saída se repetir não mostra que o prompt está claro.",
    "Prompt curto pode justamente estar sem contexto.",
    "A tradução não revela a falta de contexto."
  ],
  kw: ["resultados medianos", "se falta contexto"],
  obj: "Avaliar a clareza de um prompt.",
  cons: ["Contexto implícito"],
  el: [2],
  concept: "O teste do colega",
  trap: "Supor que o modelo conhece as normas implícitas do time.",
  tip: "Claude = funcionário brilhante e novo. Se um colega sem contexto se perderia, reescreva.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "Think of Claude as a brilliant but new employee who lacks context on your norms and workflows. The more precisely you explain what you want, the better the result. Key test: Show your prompt to a colleague with minimal context on the task and ask them to follow it. If they'd be confused, Claude will be too.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},
{
  id: "c3-21", d: 3, t: "3", sc: "Code Generation with Claude Code", lvl: "Intermediária",
  q: "Ao corrigir um bug simples, um agente de código cria arquivos extras e acrescenta abstrações e opções de configuração que ninguém pediu. Qual orientação a documentação sugere pôr no prompt?",
  o: [
    "Pedir soluções mínimas: só mudanças pedidas ou claramente necessárias, sem recursos, refatorações, abstrações ou flexibilidade não solicitados",
    "Pedir que ele 'melhore tudo o que encontrar' para aproveitar a sessão",
    "Aumentar o effort para ele pensar melhor na arquitetura",
    "Pedir validação e tratamento de erro para todo cenário imaginável"
  ],
  a: [0],
  w: [
    "A documentação descreve essa tendência a complicar demais e sugere orientação explícita para manter as soluções mínimas.",
    "Isso estimula ainda mais mudanças fora do escopo.",
    "Mais effort não limita o escopo, e o modelo pode explorar ainda mais.",
    "A própria orientação sugerida pede para não tratar cenários que não podem acontecer."
  ],
  kw: ["bug simples", "ninguém pediu"],
  obj: "Conter excesso de engenharia em agentes de código.",
  cons: ["Escopo"],
  el: [1],
  concept: "Overeagerness e soluções mínimas",
  trap: "Achar que mais código é sinal de mais qualidade.",
  tip: "Escopo: só o pedido ou o claramente necessário. Complexidade mínima para a tarefa.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "Claude Opus 4.5 and Claude Opus 4.6 have a tendency to overengineer by creating extra files, adding unnecessary abstractions, or building in flexibility that wasn't requested. If you're seeing this undesired behavior, add specific guidance to keep solutions minimal. [...] Avoid over-engineering. Only make changes that are directly requested or clearly necessary.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},
{
  id: "c3-22", d: 3, t: "3", sc: "Claude Code for Continuous Integration", lvl: "Intermediária",
  q: "Um agente de código faz os testes passarem escrevendo casos especiais para as entradas exatas dos testes, em vez de uma solução geral. O que incluir no prompt?",
  o: [
    "Pedir uma solução geral, que funcione para todas as entradas válidas, sem valores fixos para os testes, e que ele avise se algum teste estiver errado em vez de contorná-lo",
    "Dizer que o objetivo principal é fazer todos os testes passarem, custe o que custar",
    "Tirar os testes do repositório",
    "Pedir que ele crie scripts auxiliares para contornar os testes mais difíceis"
  ],
  a: [0],
  w: [
    "A orientação da documentação: os testes verificam a correção, mas não definem a solução.",
    "Isso reforça o comportamento de focar só nos testes.",
    "Sem testes não há como verificar a correção.",
    "A documentação pede justamente para não criar scripts auxiliares ou atalhos."
  ],
  kw: ["casos especiais para as entradas exatas", "solução geral"],
  obj: "Evitar soluções que só passam nos testes.",
  cons: ["Generalização"],
  el: [2],
  concept: "Não focar só em passar nos testes",
  trap: "Medir sucesso só por 'testes verdes'.",
  tip: "Testes verificam, não definem a solução. Teste errado? Avise, não contorne.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "Claude can sometimes focus too heavily on making tests pass at the expense of more general solutions [...] Implement a solution that works correctly for all valid inputs, not just the test cases. Do not hard-code values or create solutions that only work for specific test inputs. [...] If the task is unreasonable or infeasible, or if any of the tests are incorrect, please inform me rather than working around them.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},
{
  id: "c3-23", d: 3, t: "3", sc: "Developer Productivity with Claude", lvl: "Fácil",
  q: "Um assistente de código às vezes responde perguntas sobre arquivos do repositório sem abri-los e faz afirmações erradas sobre o código. Qual instrução a documentação sugere?",
  o: [
    "Instruir que ele nunca especule sobre código que não abriu: se o usuário citar um arquivo, ele deve lê-lo antes de responder",
    "Colar o repositório inteiro no system prompt de toda requisição",
    "Pedir respostas mais curtas para reduzir a chance de erro",
    "Proibir as tools de leitura para acelerar as respostas"
  ],
  a: [0],
  w: [
    "É o bloco 'investigate_before_answering' sugerido para reduzir alucinação em codificação com agentes.",
    "Isso é caro, enche o contexto e não garante que ele consulte o trecho certo.",
    "Resposta curta não deixa a resposta fundamentada.",
    "Sem ler os arquivos, a especulação aumenta."
  ],
  kw: ["sem abri-los", "afirmações erradas sobre o código"],
  obj: "Reduzir alucinação em agentes de código.",
  cons: ["Fundamentação no código"],
  el: [3],
  concept: "Investigar antes de responder",
  trap: "Deixar o agente responder 'de memória' sobre arquivos.",
  tip: "Perguntou de um arquivo? Leia antes de responder.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "Never speculate about code you have not opened. If the user references a specific file, you MUST read the file before answering.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},

/* ---------- Domínio 4: Design de tools e MCP ---------- */
{
  id: "d4-18", d: 4, t: "4", sc: "Developer Productivity with Claude", lvl: "Desafiadora",
  q: "Um agente precisa verificar o orçamento de 20 funcionários, e cada consulta devolve milhares de linhas de despesas. Hoje cada consulta é uma ida e volta ao modelo, e todas as linhas entram no contexto. Qual recurso da API resolve isso?",
  o: [
    "Programmatic tool calling: o Claude escreve um script que chama a tool para os 20 funcionários no container de code execution, filtra os resultados e devolve só quem estourou o limite",
    "Parallel tool use, com os 20 resultados completos entrando no contexto de uma só vez",
    "Uma janela de contexto maior, para caberem todas as linhas",
    "Prompt caching das despesas"
  ],
  a: [0],
  w: [
    "É o exemplo da documentação: um script faz as 20 consultas, filtra e reduz centenas de kilobytes a poucas linhas, e os resultados intermediários não entram no contexto.",
    "O paralelismo reduz as idas e voltas, mas os resultados completos continuam entrando no contexto.",
    "Uma janela maior não reduz o custo nem o ruído de milhares de linhas.",
    "O cache serve para prefixos repetidos, não para resultados de tool que mudam."
  ],
  kw: ["20 funcionários", "milhares de linhas", "uma ida e volta ao modelo"],
  obj: "Usar programmatic tool calling para fan-out com resultados grandes.",
  cons: ["Tokens", "Latência"],
  el: [3],
  concept: "Programmatic tool calling",
  trap: "Achar que o parallel tool use resolve o volume de dados no contexto.",
  tip: "Muitas chamadas + resultados grandes filtráveis = programmatic tool calling.",
  ref: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling",
  ev: "Consider checking budget compliance across 20 employees: the traditional approach requires 20 separate model round-trips, pulling thousands of expense line items into the context along the way. With programmatic tool calling, a single script runs all 20 lookups, filters the results, and returns only the employees who exceeded their limits, shrinking what Claude needs to reason over from hundreds of kilobytes down to a few lines.",
  evu: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling"
},
{
  id: "d4-19", d: 4, t: "4", sc: "Customer Support Resolution Agent", lvl: "Pegadinha",
  q: "Um time quer ativar programmatic tool calling em um agente de atendimento em que cada turno faz uma ou duas chamadas sequenciais, e cada chamada depende do raciocínio do Claude sobre o resultado anterior. O que a documentação indica?",
  o: [
    "É um caso fraco: fluxos estritamente sequenciais não se beneficiam, porque o script não consegue pular a ida ao modelo; em um benchmark assim, o custo subiu cerca de 8% sem mudança no resultado",
    "É o caso ideal, porque qualquer chamada sequencial fica mais barata em código",
    "Programmatic tool calling elimina a necessidade de o Claude raciocinar sobre os resultados",
    "Só vale a pena quando há uma única tool definida"
  ],
  a: [0],
  w: [
    "A documentação lista fluxos estritamente sequenciais como caso fraco e cita o τ²-bench, em que o custo subiu cerca de 8% sem mudar os resultados.",
    "Quando cada passo depende do raciocínio do modelo, o script não economiza as idas e voltas.",
    "Se a próxima chamada depende do raciocínio do Claude, ele continua precisando ver o resultado.",
    "Os maiores ganhos aparecem com várias tools e várias chamadas."
  ],
  kw: ["uma ou duas chamadas sequenciais", "depende do raciocínio do Claude"],
  obj: "Reconhecer quando programmatic tool calling não compensa.",
  cons: ["Overhead do container", "Dependência entre passos"],
  el: [3],
  concept: "Quando NÃO usar programmatic tool calling",
  trap: "Ativar o recurso em todo agente por padrão.",
  tip: "Bom: fan-out e resultados grandes. Fraco: sequencial dependente, poucas chamadas pequenas, feedback do usuário entre chamadas.",
  ref: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling",
  ev: "On τ²-bench (airline, retail, and telecom domains), where each turn makes one or two sequential tool calls, programmatic tool calling left scores unchanged and cost roughly 8 percent more. Sequential single-call workflows do not benefit. [...] Strictly sequential workflows where each call depends on Claude reasoning over the previous result, because the script cannot skip the model round trip in that case",
  evu: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling"
},
{
  id: "d4-20", d: 4, t: "4", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Uma tool create_ticket tem objetos aninhados e um campo due_date que a API só aceita em um formato específico. O schema está correto, mas o Claude erra o formato da data e combina parâmetros opcionais de forma inválida. O que acrescentar à definição da tool?",
  o: [
    "input_examples: exemplos concretos de inputs válidos, conferidos contra o input_schema, que mostram os formatos e combinações esperados",
    "Remover o input_schema e descrever tudo em texto livre",
    "Marcar todos os campos opcionais como obrigatórios",
    "defer_loading: true, para a tool só carregar quando necessária"
  ],
  a: [0],
  w: [
    "A documentação indica input_examples para tools com entradas complexas, objetos aninhados ou parâmetros sensíveis a formato.",
    "Sem schema o Claude perde a estrutura e a validação.",
    "Isso muda a semântica da API e não ensina o formato da data.",
    "defer_loading trata de carregar a tool sob demanda, não de usá-la corretamente."
  ],
  kw: ["objetos aninhados", "formato específico", "combina parâmetros opcionais"],
  obj: "Ensinar o uso correto de tools complexas.",
  cons: ["Formato", "Correlação entre parâmetros"],
  el: [1],
  concept: "input_examples (tool use examples)",
  trap: "Achar que um schema correto basta para expressar convenções de uso.",
  tip: "O schema diz o que é válido; input_examples mostram como usar.",
  ref: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools",
  ev: "Prioritize descriptions, but consider using input_examples for complex tools. Clear descriptions are most important, but for tools with complex inputs, nested objects, or format-sensitive parameters, you can use the input_examples field to provide schema-validated examples.",
  evu: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools"
},
{
  id: "d4-21", d: 4, t: "4", sc: "Developer Productivity with Claude", lvl: "Pegadinha",
  q: "Um time configurou allowed_callers de uma tool só para code execution e concluiu que o cliente nunca vai receber um tool_use direto dela, então não tratou esse caso. Está certo?",
  o: [
    "Não: allowed_callers define como a tool é apresentada e o Claude é fortemente orientado a respeitá-lo, mas a API não bloqueia chamadas diretas; o cliente deve estar pronto para um tool_use direto de qualquer tool que define",
    "Sim: a API rejeita com erro qualquer chamada direta",
    "Sim: allowed_callers remove a tool da requisição",
    "Não, porque allowed_callers só vale para servidores MCP"
  ],
  a: [0],
  w: [
    "A documentação avisa que allowed_callers não é um bloqueio rígido no nível da API.",
    "A API não rejeita a chamada direta; é por isso que o cliente precisa tratá-la.",
    "A tool continua na requisição; o campo só diz quem pode chamá-la.",
    "allowed_callers é um campo das definições de tool da API, não algo exclusivo do MCP."
  ],
  kw: ["só para code execution", "nunca vai receber um tool_use direto"],
  obj: "Conhecer as garantias reais de allowed_callers.",
  cons: ["Robustez do cliente"],
  el: [3],
  concept: "allowed_callers não é bloqueio rígido",
  trap: "Tratar uma orientação ao modelo como garantia da API.",
  tip: "Toda tool definida pode chegar como tool_use direto, então trate esse caso.",
  ref: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling",
  ev: "allowed_callers controls how the tool is presented to Claude and is validated against tool_choice, but it is not a hard API-level block on direct calls. Claude is strongly guided to respect it, but your client should still be prepared to handle a direct tool_use for any tool it defines.",
  evu: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling"
},
{
  id: "d4-22", d: 4, t: "4", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Em uma tool customizada do Claude Agent SDK, o handler lança uma exceção não tratada quando a API externa cai. O que acontece, e como melhorar o que o Claude recebe?",
  o: [
    "O loop continua: o servidor MCP em processo transforma a exceção em um resultado de erro com a mensagem bruta. Para dar contexto útil (o que falhou, o que tentar), capture o erro e retorne is_error com uma mensagem própria",
    "A query inteira falha e o agente para na hora",
    "O SDK repete a chamada sozinho até funcionar, sem avisar o Claude",
    "O Claude não recebe nada e fica esperando indefinidamente"
  ],
  a: [0],
  w: [
    "A documentação diz que um erro no handler não para o loop; o que muda é a mensagem que o Claude lê. Capture o erro quando a exceção bruta não bastar.",
    "O loop não para: a exceção vira um resultado de erro.",
    "O Claude recebe o erro e decide se tenta de novo, usa outra tool ou explica a falha.",
    "Ele recebe um resultado de erro."
  ],
  kw: ["exceção não tratada", "a API externa cai"],
  obj: "Tratar erros em tools customizadas do Agent SDK.",
  cons: ["Mensagem de erro útil"],
  el: [3],
  concept: "Erros de handler viram resultados de erro",
  trap: "Achar que uma exceção derruba o agente.",
  tip: "Exceção = mensagem bruta para o Claude. is_error com mensagem própria = contexto útil.",
  ref: "https://code.claude.com/docs/en/agent-sdk/custom-tools",
  ev: "A handler error doesn't stop the agent loop. The SDK's in-process MCP server catches uncaught exceptions and returns them as error results, so how you report an error determines what Claude reads, not whether the query fails: [...] Catch errors yourself when the raw exception message isn't enough for Claude to act on.",
  evu: "https://code.claude.com/docs/en/agent-sdk/custom-tools"
},
{
  id: "d4-23", d: 4, t: "4", sc: "Developer Productivity with Claude", lvl: "Pegadinha",
  q: "Um agente no Claude Agent SDK registra um servidor MCP com a chave 'my.server' em mcpServers. Para aprovar automaticamente a tool list_issues em allowedTools, qual nome usar?",
  o: [
    "mcp__my_server__list_issues",
    "list_issues",
    "mcp__my.server__list_issues",
    "my.server/list_issues"
  ],
  a: [0],
  w: [
    "O nome segue mcp__<server-name>__<tool-name>, e caracteres como . e espaços no nome do servidor viram _.",
    "Falta o prefixo com o nome do servidor.",
    "O ponto do nome do servidor é trocado por _.",
    "Esse formato não é o usado pelo SDK."
  ],
  kw: ["my.server", "allowedTools"],
  obj: "Referenciar tools MCP em permissões.",
  cons: ["Nome completo da tool"],
  el: [3],
  concept: "Convenção de nomes de tools MCP",
  trap: "Esquecer a troca do ponto por _.",
  tip: "mcp__<servidor>__<tool>, com . e espaços do servidor viram _.",
  ref: "https://code.claude.com/docs/en/agent-sdk/mcp",
  ev: "MCP tools are named mcp__<server-name>__<tool-name>, where <server-name> is the name you register the server under, such as its key in mcpServers. Characters in the server name such as . and spaces are replaced by _.",
  evu: "https://code.claude.com/docs/en/agent-sdk/mcp"
},
{
  id: "d4-24", d: 4, t: "4", sc: "Structured Data Extraction", lvl: "Desafiadora",
  q: "Um agente importa contatos de clientes de uma planilha para o CRM usando servidores MCP, e a empresa não quer que nomes, e-mails e telefones passem pelo contexto do modelo. Qual abordagem a Anthropic descreve?",
  o: [
    "Code execution com MCP: os resultados intermediários ficam no ambiente de execução, o agente só vê o que for explicitamente registrado ou retornado, e o harness pode tokenizar dados sensíveis automaticamente",
    "Chamadas diretas de tools, em que cada resultado passa pelo modelo antes da próxima chamada",
    "Colocar os dados no system prompt com a instrução 'não leia isto'",
    "Usar prompt caching para esconder os dados do modelo"
  ],
  a: [0],
  w: [
    "No artigo, os dados fluem da planilha para o CRM sem passar pelo modelo, e o cliente MCP destokeniza na hora da chamada.",
    "Com chamadas diretas, todo resultado intermediário passa pelo contexto do modelo.",
    "Os dados estariam no contexto do mesmo jeito.",
    "O cache não esconde nada do modelo, ele só reaproveita o processamento do prefixo."
  ],
  kw: ["planilha para o CRM", "não quer que nomes, e-mails e telefones passem pelo contexto"],
  obj: "Manter dados sensíveis fora do contexto do modelo.",
  cons: ["Privacidade", "Tokens"],
  el: [2, 3],
  concept: "Code execution com MCP e privacidade",
  trap: "Achar que todo dado que um agente manipula precisa passar pelo modelo.",
  tip: "Code execution + MCP: o dado intermediário fica no sandbox; o modelo vê só o que for retornado.",
  ref: "https://www.anthropic.com/research/code-execution-with-mcp",
  ev: "When agents use code execution with MCP, intermediate results stay in the execution environment by default. This way, the agent only sees what you explicitly log or return, meaning data you don't wish to share with the model can flow through your workflow without ever entering the model's context. For even more sensitive workloads, the agent harness can tokenize sensitive data automatically.",
  evu: "https://www.anthropic.com/research/code-execution-with-mcp"
},
{
  id: "d4-25", d: 4, t: "4", sc: "Multi-Agent Research System", lvl: "Intermediária",
  q: "Um agente de pesquisa lê vários arquivos independentes um de cada vez, o que deixa as tarefas lentas. Como a documentação sugere aumentar as chamadas paralelas sem causar erro nas chamadas que dependem umas das outras?",
  o: [
    "Pedir no prompt que chamadas independentes sejam feitas em paralelo, mas que as que dependem de resultados anteriores sejam sequenciais, sem placeholders nem parâmetros adivinhados",
    "Pedir que TODAS as chamadas sejam sempre paralelas, inclusive as dependentes",
    "Desativar o paralelismo e permitir uma tool por resposta",
    "Pedir que o modelo invente valores para os parâmetros que ainda não conhece, para paralelizar mais"
  ],
  a: [0],
  w: [
    "É o bloco 'use_parallel_tool_calls' da documentação, que eleva o paralelismo e mantém sequenciais as chamadas dependentes.",
    "Chamadas dependentes precisam do resultado anterior para ter os parâmetros certos.",
    "Isso deixaria tudo ainda mais lento.",
    "A orientação diz para nunca usar placeholders nem adivinhar parâmetros."
  ],
  kw: ["um de cada vez", "dependem umas das outras"],
  obj: "Orientar o paralelismo de chamadas de tools.",
  cons: ["Dependências entre chamadas"],
  el: [3],
  concept: "Ajustar o paralelismo de tool calls via prompt",
  trap: "Paralelizar tudo, inclusive o que depende de outro resultado.",
  tip: "Independentes em paralelo; dependentes em sequência; nunca adivinhe parâmetros.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "If you intend to call multiple tools and there are no dependencies between the tool calls, make all of the independent tool calls in parallel. [...] However, if some tool calls depend on previous calls to inform dependent values like the parameters, do NOT call these tools in parallel and instead call them sequentially. Never use placeholders or guess missing parameters in tool calls.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},

/* ---------- Domínio 5: Contexto e confiabilidade ---------- */
{
  id: "e5-16", d: 5, t: "5", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Um time vai habilitar o memory tool para um agente de suporte guardar aprendizados entre conversas. Qual é a responsabilidade da aplicação?",
  o: [
    "Executar cada operação de memória pedida pelo Claude em um armazenamento que ela controla (a ferramenta roda no cliente), mapeando /memories para esse armazenamento e rejeitando caminhos fora de /memories",
    "Nenhuma: a Anthropic guarda as memórias nos servidores dela automaticamente",
    "Carregar todos os arquivos de memória no system prompt antes de cada requisição",
    "Aceitar qualquer caminho que o Claude enviar, inclusive fora de /memories"
  ],
  a: [0],
  w: [
    "O memory tool roda no cliente: o Claude pede operações de arquivo, e a aplicação as executa no armazenamento dela e rejeita path traversal.",
    "A aplicação é quem controla onde e como os dados ficam guardados.",
    "A ideia é buscar o contexto na hora certa: o Claude lê as memórias sob demanda.",
    "A documentação exige rejeitar caminhos fora de /memories."
  ],
  kw: ["memory tool", "responsabilidade da aplicação"],
  obj: "Entender o modelo de execução do memory tool.",
  cons: ["Armazenamento controlado pelo cliente", "Segurança de caminhos"],
  el: [3],
  concept: "Memory tool no lado do cliente",
  trap: "Achar que a memória fica guardada pela Anthropic.",
  tip: "Memory tool: o Claude pede, sua aplicação executa, e só dentro de /memories.",
  ref: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool",
  ev: "The memory tool operates client-side: Claude requests file operations, and your application runs them. You control where and how the data is stored through your own infrastructure. [...] The /memories path is a prefix that your handler maps onto real storage, such as a per-user directory or keys in a database. [...] Your handler must reject paths outside /memories",
  evu: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool"
},
{
  id: "e5-17", d: 5, t: "5", sc: "Code Generation with Claude Code", lvl: "Intermediária",
  q: "Um agente de código trabalha em várias janelas de contexto e precisa registrar o status de 200 testes e também anotações gerais sobre o andamento. Que combinação a documentação recomenda?",
  o: [
    "Formato estruturado (como JSON) para o status dos testes, texto livre para as notas de progresso e git como registro e pontos de restauração",
    "Tudo em texto livre dentro da conversa, confiando na compaction",
    "Tudo em JSON, inclusive as notas gerais, sem usar git",
    "Nenhum registro: o modelo recomeça cada janela do zero"
  ],
  a: [0],
  w: [
    "São as práticas de gestão de estado da documentação: estruturado para dados de estado, texto livre para progresso, git para histórico e checkpoints.",
    "Estado dentro da conversa se perde ou se degrada entre janelas.",
    "Notas gerais funcionam bem em texto livre, e o git é recomendado para rastrear o estado.",
    "Sem registro, cada janela precisa redescobrir tudo."
  ],
  kw: ["várias janelas de contexto", "status de 200 testes", "anotações gerais"],
  obj: "Escolher formatos de estado para tarefas longas.",
  cons: ["Estado estruturado vs notas"],
  el: [3],
  concept: "Gestão de estado entre janelas de contexto",
  trap: "Usar um formato só para tudo.",
  tip: "Status: JSON. Progresso: texto livre. Histórico e restauração: git.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "Use structured formats for state data: When tracking structured information (such as test results or task status), use JSON or other structured formats to make schema requirements explicit to Claude. Use unstructured text for progress notes: Freeform progress notes work well for tracking general progress and context. Use git for state tracking: Git provides a log of what's been done and checkpoints that can be restored.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},
{
  id: "e5-18", d: 5, t: "5", sc: "Structured Data Extraction", lvl: "Desafiadora",
  q: "Um job usa o Claude Agent SDK com outputFormat (json_schema) para extrair contatos. O código usa structured_output sempre que o subtype do resultado é 'success', mas às vezes grava valores vazios. Que verificação está faltando?",
  o: [
    "Tratar como falha quando is_error for true ou structured_output estiver ausente, além de tratar o subtype error_max_structured_output_retries",
    "Nenhuma: o subtype success garante um structured_output válido",
    "Conferir só se a resposta contém a palavra JSON",
    "Aumentar a temperature para o schema ser respeitado"
  ],
  a: [0],
  w: [
    "A documentação avisa que o subtype success sozinho não garante uma resposta: confira is_error e se structured_output existe.",
    "É exatamente o que a documentação diz não ser verdade.",
    "A palavra JSON não indica um resultado válido.",
    "Temperature não resolve schema complexo, tarefa ambígua nem erro de API."
  ],
  kw: ["subtype do resultado é 'success'", "valores vazios"],
  obj: "Tratar falhas de saída estruturada no Agent SDK.",
  cons: ["Falhas silenciosas"],
  el: [2, 3],
  concept: "Tratamento de erros de structured outputs no Agent SDK",
  trap: "Confiar só no subtype success.",
  tip: "Use structured_output só com success, sem is_error e com o campo presente.",
  ref: "https://code.claude.com/docs/en/agent-sdk/structured-outputs",
  ev: "Structured output generation can fail when the agent cannot produce valid JSON matching your schema. [...] A success subtype doesn't by itself mean the run produced an answer. Treat a result as a failure when the result's is_error is true or structured_output is absent:",
  evu: "https://code.claude.com/docs/en/agent-sdk/structured-outputs"
},
{
  id: "e5-19", d: 5, t: "5", sc: "Code Generation with Claude Code", lvl: "Intermediária",
  q: "Um agente de código autônomo, diante de um obstáculo, chegou a usar git push --force e a apagar arquivos que não conhecia. O que a documentação recomenda pôr no prompt?",
  o: [
    "Orientar o agente a pesar reversibilidade e impacto: ações locais e reversíveis (editar arquivos, rodar testes) podem seguir, mas ações difíceis de desfazer, destrutivas ou que afetam sistemas compartilhados pedem confirmação do usuário",
    "Proibir o agente de editar qualquer arquivo",
    "Pedir que ele use atalhos destrutivos sempre que travar, para não perder tempo",
    "Liberar tudo e confiar no histórico do git para desfazer"
  ],
  a: [0],
  w: [
    "É o trecho sugerido para equilibrar autonomia e segurança, incluindo não usar ações destrutivas como atalho.",
    "Isso tira do agente a autonomia útil.",
    "A documentação diz o contrário: nada de atalhos destrutivos.",
    "Um force push pode apagar trabalho de outras pessoas, e o histórico local não garante a recuperação."
  ],
  kw: ["git push --force", "apagar arquivos que não conhecia"],
  obj: "Equilibrar autonomia e segurança em agentes.",
  cons: ["Ações irreversíveis", "Sistemas compartilhados"],
  el: [2],
  concept: "Reversibilidade e confirmação",
  trap: "Achar que proibir tudo ou liberar tudo resolve.",
  tip: "Local e reversível: siga. Destrutivo, irreversível ou compartilhado: pergunte.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "Consider the reversibility and potential impact of your actions. You are encouraged to take local, reversible actions like editing files or running tests, but for actions that are hard to reverse, affect shared systems, or could be destructive, ask the user before proceeding. [...] When encountering obstacles, do not use destructive actions as a shortcut.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},
{
  id: "e5-20", d: 5, t: "5", sc: "Developer Productivity with Claude", lvl: "Desafiadora",
  q: "Um time hesita em usar tool search com defer_loading porque teme invalidar o prompt caching do system prompt e das tools principais. O que a documentação explica?",
  o: [
    "As tools adiadas não entram no prefixo do system prompt; quando o modelo descobre uma delas pela busca, a definição é anexada no histórico como bloco tool_reference, e o prefixo, junto com o cache, fica intacto",
    "Toda busca de tool invalida o cache da conversa inteira",
    "defer_loading só funciona com o cache desativado",
    "As tools adiadas são carregadas no início de toda requisição, junto com o system prompt"
  ],
  a: [0],
  w: [
    "A documentação de tool use com prompt caching diz que o prefixo não é alterado, então o cache é preservado.",
    "A definição descoberta entra no histórico, sem mexer no prefixo.",
    "Os dois recursos funcionam juntos; o cache_control só não pode ficar na própria tool adiada.",
    "Se fossem carregadas sempre, não haveria economia de contexto."
  ],
  kw: ["defer_loading", "invalidar o prompt caching"],
  obj: "Combinar tool search e prompt caching.",
  cons: ["Cache", "Muitas tools"],
  el: [3],
  concept: "defer_loading preserva o prompt caching",
  trap: "Achar que carregar tools sob demanda quebra o cache.",
  tip: "Tool adiada entra no histórico (tool_reference), não no prefixo, e o cache segue válido.",
  ref: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-use-with-prompt-caching",
  ev: "Deferred tools are not included in the system-prompt prefix. When the model discovers a deferred tool through tool search, the definition is appended inline as a tool_reference block in the conversation history. The prefix is untouched, so prompt caching is preserved.",
  evu: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-use-with-prompt-caching"
},
{
  id: "e5-21", d: 5, t: "5", sc: "Multi-Agent Research System", lvl: "Desafiadora",
  q: "Um agente que usa um modelo Claude recente explora demais e pensa por muito tempo, inflando os tokens de raciocínio. O time cogita definir budget_tokens no extended thinking. O que a documentação recomenda?",
  o: [
    "Tirar instruções que forçam exaustividade, usar orientações mais direcionadas e baixar o effort; para um teto rígido, usar max_tokens, já que budget_tokens retorna erro 400 a partir do Claude 4.7",
    "Definir budget_tokens em qualquer modelo, que é a forma recomendada",
    "Acrescentar 'se tiver dúvida, use a tool' para acelerar a decisão",
    "Aumentar o effort para o modelo decidir mais rápido"
  ],
  a: [0],
  w: [
    "A documentação sugere tirar o excesso de instruções, usar o effort como alternativa e, para um teto, max_tokens com adaptive thinking.",
    "budget_tokens está obsoleto e retorna 400 no Claude 4.7 e posteriores.",
    "A documentação cita esse tipo de instrução como causa de uso excessivo de tools.",
    "Effort mais alto aumenta a exploração e o raciocínio."
  ],
  kw: ["explora demais", "budget_tokens"],
  obj: "Controlar custo de raciocínio em modelos recentes.",
  cons: ["Tokens de thinking", "Compatibilidade"],
  el: [3],
  concept: "Effort e max_tokens no lugar de budget_tokens",
  trap: "Usar budget_tokens em modelos novos.",
  tip: "Pensando demais: menos over-prompting, effort menor; teto rígido = max_tokens.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "Remove over-prompting. Tools that undertriggered in previous models are likely to trigger appropriately now. [...] Use effort as a fallback. If Claude continues to be overly aggressive, use a lower setting for effort. [...] On Claude 4.7 and later models, setting budget_tokens returns a 400 error. Prefer lowering the effort setting or using max_tokens as a hard limit with adaptive thinking",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
}
);
