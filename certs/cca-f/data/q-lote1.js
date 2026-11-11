// CCA-F · Lote 1 — escrito a partir da documentação oficial da Anthropic.
// Mesmo esquema do DVA-C02, mais "sc" (cenário da prova). Cada questão traz a citação literal em ev/evu.
QB.push(
/* ---------- Domínio 1: Arquitetura agêntica e orquestração ---------- */
{
  id: "a1-01", d: 1, t: "1", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Um time de suporte recebe tickets de três tipos bem definidos: reembolso, dúvida técnica e alteração cadastral. Cada tipo tem um procedimento próprio e o classificador atual acerta quase sempre. A empresa quer respostas previsíveis e quer otimizar o prompt de cada tipo sem prejudicar os outros. Qual arquitetura atende MELHOR?",
  o: [
    "Um workflow de routing: classificar o ticket e encaminhá-lo para um prompt especializado em cada tipo",
    "Um agente autônomo único com todas as ferramentas, decidindo sozinho o que fazer em cada ticket",
    "Um sistema multiagente em que vários agentes debatem a resposta de cada ticket",
    "Um prompt único e longo cobrindo os três procedimentos ao mesmo tempo"
  ],
  a: [0],
  w: [
    "Routing classifica a entrada e a direciona para uma tarefa especializada; serve bem quando há categorias distintas e a classificação é confiável.",
    "Um agente autônomo troca previsibilidade por flexibilidade, o que não é necessário em categorias fixas.",
    "Debate multiagente aumenta custo e latência sem necessidade para tarefas bem definidas.",
    "Com um prompt único, otimizar um tipo de ticket pode piorar o desempenho nos outros."
  ],
  kw: ["três tipos bem definidos", "classificador atual acerta quase sempre", "respostas previsíveis", "sem prejudicar os outros"],
  obj: "Escolher o padrão para categorias fixas e distintas.",
  cons: ["Categorias distintas", "Previsibilidade", "Prompts independentes"],
  el: [2],
  concept: "Workflow de routing",
  trap: "Achar que 'agente' é sempre mais avançado e, portanto, melhor.",
  tip: "Categorias distintas + classificação confiável → routing.",
  ref: "https://www.anthropic.com/research/building-effective-agents",
  ev: "Routing classifies an input and directs it to a specialized followup task. This workflow allows for separation of concerns, and building more specialized prompts. Without this workflow, optimizing for one kind of input can hurt performance on other inputs.",
  evu: "https://www.anthropic.com/research/building-effective-agents"
},
{
  id: "a1-02", d: 1, t: "1", sc: "Structured Data Extraction", lvl: "Pegadinha",
  q: "Uma equipe precisa extrair 12 campos fixos de notas fiscais em PDF. Uma única chamada ao Claude com bons exemplos já atinge a precisão exigida nos testes. Um arquiteto propõe um sistema multiagente com planejador, extratores e revisor 'para ficar mais robusto'. Qual é a melhor recomendação?",
  o: [
    "Manter a solução com uma única chamada bem otimizada, já que atende aos critérios; só aumentar a complexidade se as avaliações mostrarem necessidade",
    "Adotar o sistema multiagente, porque agentes sempre aumentam a precisão",
    "Trocar por um agente autônomo com acesso a ferramentas de busca na web",
    "Usar vários agentes votando em cada campo para todo documento"
  ],
  a: [0],
  w: [
    "A recomendação é buscar a solução mais simples possível e só aumentar a complexidade quando necessário.",
    "Sistemas agênticos trocam latência e custo por desempenho; aqui o desempenho já é suficiente.",
    "Busca na web não ajuda a extrair campos de um documento fornecido.",
    "Votação em todo documento multiplica o custo sem ganho medido."
  ],
  kw: ["12 campos fixos", "Uma única chamada", "já atinge a precisão exigida", "para ficar mais robusto"],
  obj: "Decidir se a complexidade agêntica se justifica.",
  cons: ["Precisão já atingida", "Custo e latência"],
  el: [2],
  concept: "Quando (e quando não) usar agentes",
  trap: "Complexidade adicional sem ganho medido nas avaliações.",
  tip: "Comece simples; só suba para workflow/agente quando a avaliação pedir.",
  ref: "https://www.anthropic.com/research/building-effective-agents",
  ev: "When building applications with LLMs, we recommend finding the simplest solution possible, and only increasing complexity when needed. This might mean not building agentic systems at all. Agentic systems often trade latency and cost for better task performance, and you should consider when this tradeoff makes sense.",
  evu: "https://www.anthropic.com/research/building-effective-agents"
},
{
  id: "a1-03", d: 1, t: "1", sc: "Multi-Agent Research System", lvl: "Desafiadora",
  q: "Um sistema de pesquisa recebe perguntas abertas, como 'avalie o mercado de baterias de estado sólido'. Não dá para saber antecipadamente quantas fontes ou quais subtópicos serão necessários; isso depende de cada pergunta. Qual padrão é o mais adequado?",
  o: [
    "Orchestrator-workers: um LLM central decompõe a tarefa dinamicamente, delega a workers e sintetiza os resultados",
    "Parallelization por sectioning com uma lista fixa de subtarefas definida no código",
    "Prompt chaining com uma sequência fixa de etapas",
    "Routing para um prompt especializado em baterias"
  ],
  a: [0],
  w: [
    "No orchestrator-workers, as subtarefas não são predefinidas: o orquestrador as determina conforme a entrada.",
    "Sectioning exige subtarefas conhecidas de antemão, o que não é o caso.",
    "Prompt chaining serve para tarefas que se decompõem em etapas fixas.",
    "Routing escolhe um caminho entre categorias, mas não decompõe uma pesquisa aberta."
  ],
  kw: ["perguntas abertas", "Não dá para saber antecipadamente", "depende de cada pergunta"],
  obj: "Escolher o padrão para subtarefas imprevisíveis.",
  cons: ["Subtarefas desconhecidas", "Pesquisa em várias fontes"],
  el: [3],
  concept: "Workflow orchestrator-workers",
  trap: "Parallelization parece igual, mas tem subtarefas fixas.",
  tip: "Subtarefas definidas pela entrada → orchestrator-workers; subtarefas fixas → parallelization.",
  ref: "https://www.anthropic.com/research/building-effective-agents",
  ev: "In the orchestrator-workers workflow, a central LLM dynamically breaks down tasks, delegates them to worker LLMs, and synthesizes their results. [...] Whereas it’s topographically similar, the key difference from parallelization is its flexibility—subtasks aren't pre-defined, but determined by the orchestrator based on the specific input.",
  evu: "https://www.anthropic.com/research/building-effective-agents"
},
{
  id: "a1-04", d: 1, t: "1", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Uma empresa quer reduzir falsos positivos ao decidir se uma mensagem de cliente deve ser escalada como possível fraude. A ideia é rodar a MESMA avaliação várias vezes, de forma independente, e decidir pela maioria. Qual variação de workflow é essa?",
  o: [
    "Parallelization por voting",
    "Parallelization por sectioning",
    "Evaluator-optimizer",
    "Prompt chaining com gate"
  ],
  a: [0],
  w: [
    "Voting roda a mesma tarefa várias vezes para obter saídas diversas e ganhar confiança no resultado.",
    "Sectioning divide a tarefa em subtarefas DIFERENTES e independentes.",
    "Evaluator-optimizer é um ciclo de geração e feedback, não uma votação.",
    "Prompt chaining encadeia etapas sequenciais."
  ],
  kw: ["reduzir falsos positivos", "MESMA avaliação várias vezes", "decidir pela maioria"],
  obj: "Identificar o padrão de votação.",
  cons: ["Mesma tarefa repetida", "Decisão por maioria"],
  el: [3],
  concept: "Parallelization: sectioning vs voting",
  trap: "Confundir voting (mesma tarefa) com sectioning (subtarefas diferentes).",
  tip: "Mesma tarefa N vezes → voting; partes diferentes em paralelo → sectioning.",
  ref: "https://www.anthropic.com/research/building-effective-agents",
  ev: "This workflow, parallelization, manifests in two key variations: Sectioning: Breaking a task into independent subtasks run in parallel. Voting: Running the same task multiple times to get diverse outputs.",
  evu: "https://www.anthropic.com/research/building-effective-agents"
},
{
  id: "a1-05", d: 1, t: "1", sc: "Developer Productivity with Claude", lvl: "Intermediária",
  q: "Um time gera a documentação de release notes com o Claude. Existe um checklist claro do que uma boa nota precisa ter, e os textos melhoram de forma mensurável quando alguém aponta o que falta. Qual padrão aproveita MELHOR essas características?",
  o: [
    "Evaluator-optimizer: uma chamada gera o texto e outra avalia contra o checklist e devolve feedback, em ciclo",
    "Routing por tipo de release",
    "Um agente autônomo com acesso irrestrito ao repositório",
    "Aumentar a temperatura para gerar textos mais variados"
  ],
  a: [0],
  w: [
    "O evaluator-optimizer é eficaz quando há critérios claros de avaliação e o refinamento iterativo traz ganho mensurável.",
    "Routing separa categorias, mas não melhora o texto com feedback.",
    "Autonomia irrestrita aumenta o risco sem atender ao requisito.",
    "Variação aleatória não é refinamento guiado por critério."
  ],
  kw: ["checklist claro", "melhoram de forma mensurável", "quando alguém aponta o que falta"],
  obj: "Escolher o padrão de refinamento iterativo.",
  cons: ["Critérios claros", "Feedback melhora o resultado"],
  el: [3],
  concept: "Workflow evaluator-optimizer",
  trap: "Achar que mais autonomia resolve um problema de qualidade com critério definido.",
  tip: "Critério claro + feedback que melhora → evaluator-optimizer.",
  ref: "https://www.anthropic.com/research/building-effective-agents",
  ev: "In the evaluator-optimizer workflow, one LLM call generates a response while another provides evaluation and feedback in a loop. The evaluator-optimizer workflow When to use this workflow: This workflow is particularly effective when we have clear evaluation criteria, and when iterative refinement provides measurable value.",
  evu: "https://www.anthropic.com/research/building-effective-agents"
},
{
  id: "a1-06", d: 1, t: "1", sc: "Developer Productivity with Claude", lvl: "Intermediária",
  q: "Um time gera campanhas de marketing em duas etapas: primeiro um esboço, depois o texto final. Quando o esboço sai fora das regras da marca, o texto final é descartado e o custo é desperdiçado. Como reestruturar o fluxo com o MENOR esforço?",
  o: [
    "Prompt chaining com uma verificação programática (gate) do esboço antes de gerar o texto final",
    "Trocar por um único prompt que gere esboço e texto juntos",
    "Um sistema multiagente com orquestrador",
    "Gerar cinco textos finais e escolher o melhor manualmente"
  ],
  a: [0],
  w: [
    "No prompt chaining, cada chamada processa a saída da anterior, e é possível adicionar verificações em etapas intermediárias.",
    "Juntar as etapas elimina o ponto de verificação.",
    "Um orquestrador é complexidade desnecessária para etapas fixas.",
    "Gerar vários textos aumenta o custo, o oposto do objetivo."
  ],
  kw: ["duas etapas", "fora das regras da marca", "custo é desperdiçado", "MENOR esforço"],
  obj: "Barrar saídas ruins no meio de uma sequência fixa.",
  cons: ["Etapas fixas", "Evitar desperdício"],
  el: [3],
  concept: "Prompt chaining com gate",
  trap: "Ir direto para multiagente quando as etapas são fixas.",
  tip: "Etapas fixas + checagem no meio → prompt chaining com gate.",
  ref: "https://www.anthropic.com/research/building-effective-agents",
  ev: "Prompt chaining decomposes a task into a sequence of steps, where each LLM call processes the output of the previous one. You can add programmatic checks (see \"gate” in the diagram below) on any intermediate steps to ensure that the process is still on track.",
  evu: "https://www.anthropic.com/research/building-effective-agents"
},
{
  id: "a1-07", d: 1, t: "1", sc: "Claude Code for Continuous Integration", lvl: "Desafiadora",
  q: "Uma equipe usa o Claude Agent SDK em um job de CI que recebe prompts abertos, como 'melhore a cobertura de testes'. Algumas execuções rodam por muito tempo e geram custo alto. A equipe quer limitar as execuções sem mudar a lógica do agente. O que configurar?",
  o: [
    "Limites do loop: max_turns (maxTurns) e/ou max_budget_usd (maxBudgetUsd)",
    "Remover todas as ferramentas do agente",
    "Aumentar o timeout do runner de CI",
    "Trocar os prompts abertos por prompts com 'seja rápido' no texto"
  ],
  a: [0],
  w: [
    "O SDK permite limitar o loop por número de turnos e por gasto; sem limites, prompts abertos podem rodar por muito tempo.",
    "Sem ferramentas o agente não consegue fazer o trabalho.",
    "Timeout maior permite execuções ainda mais longas.",
    "Uma instrução no texto não é um limite garantido."
  ],
  kw: ["Claude Agent SDK", "prompts abertos", "rodam por muito tempo", "sem mudar a lógica do agente"],
  obj: "Limitar loops agênticos longos.",
  cons: ["CI", "Custo controlado"],
  el: [1],
  concept: "Limites do agent loop no Agent SDK",
  trap: "Contar com instruções no prompt em vez de um limite real.",
  tip: "Loop sem fim no Agent SDK → max_turns e max_budget_usd.",
  ref: "https://code.claude.com/docs/en/agent-sdk/agent-loop",
  ev: "You can also use max_budget_usd / maxBudgetUsd to cap turns based on a spend threshold. Without limits, the loop runs until Claude finishes on its own, which is fine for well-scoped tasks but can run long on open-ended prompts (\"improve this codebase\").",
  evu: "https://code.claude.com/docs/en/agent-sdk/agent-loop"
},
{
  id: "a1-08", d: 1, t: "1", sc: "Multi-Agent Research System", lvl: "Intermediária",
  q: "No Claude Code, a exploração de um codebase grande está enchendo o contexto da conversa principal com leituras de arquivos, e a qualidade cai no meio da tarefa. O desenvolvedor quer que a exploração aconteça à parte e que só um resumo volte. O que usar?",
  o: [
    "Um subagent, que roda em sua própria janela de contexto e devolve apenas o resultado",
    "Mais instruções no CLAUDE.md pedindo para ler menos arquivos",
    "Aumentar o max_tokens da resposta",
    "Um hook PostToolUse que apaga os arquivos lidos"
  ],
  a: [0],
  w: [
    "Cada subagent roda em seu próprio contexto, com prompt, ferramentas e permissões próprios, e devolve o resultado.",
    "Instruções não isolam o contexto das leituras necessárias.",
    "max_tokens limita a saída, não o contexto acumulado.",
    "Apagar arquivos é destrutivo e não reduz o contexto já consumido."
  ],
  kw: ["enchendo o contexto da conversa principal", "à parte", "só um resumo volte"],
  obj: "Isolar trabalho de exploração em outro contexto.",
  cons: ["Contexto principal limpo", "Só o resumo volta"],
  el: [3],
  concept: "Subagents e isolamento de contexto",
  trap: "Tentar resolver falta de contexto com mais instruções.",
  tip: "Muita leitura poluindo o contexto → delegue a um subagent.",
  ref: "https://code.claude.com/docs/en/sub-agents",
  ev: "Each subagent runs in its own context window with a custom system prompt, specific tool access, and independent permissions.",
  evu: "https://code.claude.com/docs/en/sub-agents"
},
{
  id: "a1-09", d: 1, t: "1", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Um agente autônomo de suporte pode emitir reembolsos e às vezes entra em ciclos tentando resolver casos impossíveis. Antes de ir para produção, qual combinação está alinhada às recomendações da Anthropic para agentes autônomos?",
  o: [
    "Testes extensivos em ambiente sandbox, guardrails adequados e condições de parada, como um número máximo de iterações",
    "Liberar em produção e corrigir os problemas pelos feedbacks dos clientes",
    "Remover o limite de iterações para que o agente sempre termine o caso",
    "Substituir o agente por um prompt pedindo que ele 'não erre'"
  ],
  a: [0],
  w: [
    "A autonomia traz custo maior e risco de erros acumulados; a recomendação é testar em sandbox com guardrails e incluir condições de parada.",
    "Erros acumulados de um agente com poder de reembolso são caros de corrigir depois.",
    "Sem limite, os ciclos continuam e o custo cresce.",
    "Pedir para não errar não é um controle."
  ],
  kw: ["emitir reembolsos", "entra em ciclos", "Antes de ir para produção"],
  obj: "Preparar um agente autônomo para produção com segurança.",
  cons: ["Ações com impacto financeiro", "Ciclos longos"],
  el: [3],
  concept: "Guardrails e condições de parada em agentes",
  trap: "Tirar o limite de iterações achando que isso 'resolve mais casos'.",
  tip: "Agente autônomo → sandbox + guardrails + stopping conditions.",
  ref: "https://www.anthropic.com/research/building-effective-agents",
  ev: "The autonomous nature of agents means higher costs, and the potential for compounding errors. We recommend extensive testing in sandboxed environments, along with the appropriate guardrails.",
  evu: "https://www.anthropic.com/research/building-effective-agents"
},

/* ---------- Domínio 2: Configuração e fluxos do Claude Code ---------- */
{
  id: "b2-01", d: 2, t: "2", sc: "Code Generation with Claude Code", lvl: "Intermediária",
  q: "Um desenvolvedor quer que o Claude Code use as URLs do SEU ambiente sandbox e seus dados de teste preferidos em um projeto, sem que essas instruções sejam compartilhadas com o time pelo controle de versão. Onde colocar essas instruções?",
  o: [
    "Em ./CLAUDE.local.md, adicionado ao .gitignore",
    "Em ./CLAUDE.md na raiz do projeto",
    "No CLAUDE.md de managed policy da organização",
    "Em .claude/settings.json"
  ],
  a: [0],
  w: [
    "CLAUDE.local.md é para preferências pessoais do projeto e deve ir para o .gitignore.",
    "O CLAUDE.md do projeto é compartilhado com o time pelo controle de versão.",
    "Managed policy vale para toda a organização e é gerida por TI.",
    "settings.json guarda configurações (permissões, hooks), não instruções em texto, e o do projeto é compartilhado."
  ],
  kw: ["SEU ambiente sandbox", "dados de teste preferidos", "sem que essas instruções sejam compartilhadas"],
  obj: "Escolher o escopo certo de instruções pessoais.",
  cons: ["Só para mim", "Fora do controle de versão"],
  el: [2],
  concept: "Escopos do CLAUDE.md",
  trap: "Confundir instruções (CLAUDE.md) com configurações (settings.json).",
  tip: "Pessoal + só neste projeto → CLAUDE.local.md no .gitignore.",
  ref: "https://code.claude.com/docs/en/memory",
  ev: "For private per-project preferences that shouldn't be checked into version control, create a CLAUDE.local.md at the project root. It loads alongside CLAUDE.md and is treated the same way. Add CLAUDE.local.md to your .gitignore so it isn't committed.",
  evu: "https://code.claude.com/docs/en/memory"
},
{
  id: "b2-02", d: 2, t: "2", sc: "Developer Productivity with Claude", lvl: "Pegadinha",
  q: "A organização distribui um managed settings que define uma configuração de segurança. Um desenvolvedor define a mesma chave com outro valor em .claude/settings.local.json e também a passa por linha de comando. Qual valor o Claude Code usa (fora as exceções documentadas de chaves sensíveis)?",
  o: [
    "O do managed settings, que tem a maior precedência",
    "O da linha de comando, porque é o mais recente",
    "O do settings.local.json, porque é o mais específico do projeto",
    "O das configurações de usuário em ~/.claude/settings.json"
  ],
  a: [0],
  w: [
    "A precedência é: managed, linha de comando, project local, shared project e user; nada nos arquivos do usuário sobrepõe uma chave gerenciada.",
    "A linha de comando fica abaixo do managed settings.",
    "O local do projeto fica abaixo do managed e da linha de comando.",
    "As configurações de usuário têm a menor precedência."
  ],
  kw: ["managed settings", "settings.local.json", "linha de comando"],
  obj: "Aplicar a ordem de precedência das configurações.",
  cons: ["Mesma chave em vários níveis"],
  el: [3],
  concept: "Precedência de settings no Claude Code",
  trap: "Achar que o mais específico ou o mais recente sempre vence.",
  tip: "Managed > CLI > local > projeto > usuário.",
  ref: "https://code.claude.com/docs/en/settings",
  ev: "Settings precedence, highest first: managed settings, command line, project local, shared project, user. A key set at a higher level overrides the same key set lower down.",
  evu: "https://code.claude.com/docs/en/settings"
},
{
  id: "b2-03", d: 2, t: "2", sc: "Claude Code for Continuous Integration", lvl: "Pegadinha",
  q: "As configurações de permissão de um projeto têm a regra deny Bash(aws *) e a regra allow Bash(aws s3 ls). O que acontece quando o Claude tenta executar 'aws s3 ls'?",
  o: [
    "É bloqueado: as regras são avaliadas na ordem deny, ask, allow, e um allow não abre exceção em um deny",
    "É permitido, porque a regra allow é mais específica",
    "O Claude Code pergunta ao usuário, porque as regras conflitam",
    "É permitido apenas em plan mode"
  ],
  a: [0],
  w: [
    "O primeiro match na ordem deny → ask → allow decide; a especificidade não muda a ordem.",
    "Especificidade não sobrepõe um deny.",
    "Não há prompt: o deny decide.",
    "Plan mode não altera regras de deny."
  ],
  kw: ["deny Bash(aws *)", "allow Bash(aws s3 ls)", "'aws s3 ls'"],
  obj: "Avaliar regras de permissão conflitantes.",
  cons: ["Deny amplo", "Allow específico"],
  el: [3],
  concept: "Ordem de avaliação das permission rules",
  trap: "Achar que a regra mais específica vence, como em alguns firewalls.",
  tip: "Deny sempre ganha; allow não abre exceção em deny.",
  ref: "https://code.claude.com/docs/en/permissions",
  ev: "Rules are evaluated in order: deny, then ask, then allow. The first match in that order determines the outcome, and rule specificity doesn't change the order. A broad deny rule like Bash(aws *) blocks every matching call, including calls that also match a narrower allow rule like Bash(aws s3 ls).",
  evu: "https://code.claude.com/docs/en/permissions"
},
{
  id: "b2-04", d: 2, t: "2", sc: "Code Generation with Claude Code", lvl: "Desafiadora",
  q: "Um time escreveu no CLAUDE.md 'nunca rode comandos de migração no banco de produção', mas quer uma garantia que não dependa de o modelo seguir a instrução. Como impor a regra de forma determinística antes que a ferramenta execute?",
  o: [
    "Um hook PreToolUse para o Bash que identifica o comando e sai com código 2, bloqueando a chamada",
    "Repetir a instrução em maiúsculas no CLAUDE.md",
    "Um hook PostToolUse que desfaz a migração depois",
    "Um hook que sai com código 1"
  ],
  a: [0],
  w: [
    "Com exit code 2 em um PreToolUse, o Claude Code bloqueia a chamada da ferramenta; o stderr vira o motivo do bloqueio.",
    "Instruções orientam o modelo, mas não são garantia determinística.",
    "PostToolUse roda depois: a migração já aconteceu.",
    "Exit code 1 sem JSON válido é um erro não bloqueante na maioria dos eventos."
  ],
  kw: ["garantia que não dependa de o modelo", "determinística", "antes que a ferramenta execute"],
  obj: "Bloquear uma ação perigosa de forma garantida.",
  cons: ["Determinístico", "Antes da execução"],
  el: [1],
  concept: "Hooks PreToolUse e exit code 2",
  trap: "Exit code 1 parece 'erro', mas não bloqueia; o bloqueio é o 2.",
  tip: "Política obrigatória → hook PreToolUse com exit 2.",
  ref: "https://code.claude.com/docs/en/hooks",
  ev: "Exit with code 2 to block the action. On events that can block, Claude Code stops the action: a PreToolUse hook blocks the tool call, for example, and a UserPromptSubmit hook rejects the prompt.",
  evu: "https://code.claude.com/docs/en/hooks"
},
{
  id: "b2-05", d: 2, t: "2", sc: "Claude Code for Continuous Integration", lvl: "Intermediária",
  q: "Um pipeline de CI precisa rodar o Claude Code sem interação humana para corrigir um bug e depois seguir para a próxima etapa conforme o resultado. Como executar o Claude Code nesse contexto?",
  o: [
    "Com claude -p (--print) e o prompt, usando --allowedTools para pré-aprovar as ferramentas necessárias",
    "Abrir uma sessão interativa e responder aos prompts de permissão pelo log",
    "Usar plan mode, que executa sem pedir aprovação",
    "Rodar o claude interativo dentro de um terminal virtual no runner"
  ],
  a: [0],
  w: [
    "O flag -p roda de forma não interativa; --allowedTools aprova ferramentas e o exit code permite ramificar o pipeline.",
    "Não há humano para responder no CI.",
    "Plan mode não edita arquivos até a aprovação do plano.",
    "Simular um terminal interativo é frágil e desnecessário."
  ],
  kw: ["sem interação humana", "seguir para a próxima etapa conforme o resultado"],
  obj: "Rodar o Claude Code em modo não interativo.",
  cons: ["Sem humano", "Resultado programático"],
  el: [3],
  concept: "Modo não interativo (headless) do Claude Code",
  trap: "Achar que plan mode é um modo 'automático'.",
  tip: "CI/scripts → claude -p + --allowedTools (+ --output-format json).",
  ref: "https://code.claude.com/docs/en/headless",
  ev: "Add the -p (or --print) flag to any claude command to run it non-interactively.",
  evu: "https://code.claude.com/docs/en/headless"
},
{
  id: "b2-06", d: 2, t: "2", sc: "Code Generation with Claude Code", lvl: "Fácil",
  q: "Antes de uma refatoração grande, um desenvolvedor quer que o Claude leia o código e proponha um plano, sem alterar nenhum arquivo até que ele aprove. Qual recurso usar?",
  o: [
    "Plan mode (claude --permission-mode plan ou Shift+Tab)",
    "Um subagent com permissão de escrita",
    "Um hook PostToolUse",
    "O flag -p"
  ],
  a: [0],
  w: [
    "No plan mode o Claude lê arquivos e propõe um plano, sem editar até a aprovação.",
    "Um subagent com escrita poderia alterar arquivos.",
    "PostToolUse roda depois que a ferramenta já executou.",
    "O -p é para execução não interativa, não para revisar um plano."
  ],
  kw: ["proponha um plano", "sem alterar nenhum arquivo até que ele aprove"],
  obj: "Revisar a estratégia antes de qualquer edição.",
  cons: ["Nenhuma edição antes da aprovação"],
  el: [2],
  concept: "Plan mode",
  trap: "Achar que precisa de hook para impedir edições durante o planejamento.",
  tip: "Planejar antes de editar → plan mode.",
  ref: "https://code.claude.com/docs/en/common-workflows",
  ev: "For changes you want to review before they touch disk, switch to plan mode. Claude reads files and proposes a plan but makes no edits until you approve.",
  evu: "https://code.claude.com/docs/en/common-workflows"
},
{
  id: "b2-07", d: 2, t: "2", sc: "Developer Productivity with Claude", lvl: "Intermediária",
  q: "O CLAUDE.md de um projeto cresceu com um procedimento de deploy de 150 linhas que só é usado algumas vezes por semana, e isso consome contexto em toda sessão. O time quer continuar invocando o procedimento quando precisar. Qual é a MELHOR mudança?",
  o: [
    "Mover o procedimento para uma skill (.claude/skills/deploy/SKILL.md), cujo corpo só carrega quando é usada",
    "Importar o procedimento com @path dentro do CLAUDE.md",
    "Mover o procedimento para o CLAUDE.local.md",
    "Colocar o procedimento em ~/.claude/CLAUDE.md"
  ],
  a: [0],
  w: [
    "Diferente do CLAUDE.md, o corpo de uma skill só carrega quando é usado, então material longo quase não custa contexto.",
    "Imports carregam junto com o CLAUDE.md que os referencia: não reduzem o custo de contexto.",
    "CLAUDE.local.md também é carregado em toda sessão.",
    "O CLAUDE.md do usuário também é carregado sempre, e o procedimento deixa de ser do time."
  ],
  kw: ["150 linhas", "algumas vezes por semana", "consome contexto em toda sessão", "invocando o procedimento"],
  obj: "Reduzir o custo de contexto de um procedimento raro.",
  cons: ["Uso eventual", "Continuar invocável"],
  el: [2],
  concept: "Skills vs CLAUDE.md",
  trap: "Imports com @ organizam, mas não economizam contexto.",
  tip: "Procedimento longo e eventual → skill; fatos sempre úteis → CLAUDE.md.",
  ref: "https://code.claude.com/docs/en/skills",
  ev: "Unlike CLAUDE.md content, a skill's body loads only when it's used, so long reference material costs almost nothing until you need it.",
  evu: "https://code.claude.com/docs/en/skills"
},

/* ---------- Domínio 3: Prompt engineering e saída estruturada ---------- */
{
  id: "c3-01", d: 3, t: "3", sc: "Structured Data Extraction", lvl: "Intermediária",
  q: "Um pipeline extrai dados de contratos e pede ao Claude 'responda somente em JSON'. Em produção, cerca de 1% das respostas quebra o parser por campos ausentes ou JSON inválido, e a equipe criou retries para isso. Qual solução elimina o problema na origem?",
  o: [
    "Usar structured outputs (output_config.format com um JSON schema), que garante respostas conformes ao schema",
    "Repetir no prompt 'o JSON DEVE ser válido' três vezes",
    "Aumentar o número de retries",
    "Pedir a resposta em XML e converter para JSON"
  ],
  a: [0],
  w: [
    "Structured outputs usam constrained decoding: respostas sempre válidas no schema, sem retries por violação.",
    "Mesmo com prompts cuidadosos, ainda podem ocorrer JSON inválido e campos faltando.",
    "Retries tratam o sintoma e aumentam custo e latência.",
    "Trocar o formato não garante conformidade."
  ],
  kw: ["responda somente em JSON", "quebra o parser", "na origem"],
  obj: "Garantir JSON conforme o schema.",
  cons: ["Sem retries", "Schema obrigatório"],
  el: [3],
  concept: "Structured outputs",
  trap: "Achar que prompting cuidadoso basta para garantir o formato.",
  tip: "JSON garantido pelo schema → structured outputs (ou strict: true em tools).",
  ref: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs",
  ev: "Without structured outputs, Claude can generate malformed JSON responses or invalid tool inputs that break your applications. [...] Structured outputs guarantee schema-compliant responses through constrained decoding:",
  evu: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs"
},
{
  id: "c3-02", d: 3, t: "3", sc: "Structured Data Extraction", lvl: "Intermediária",
  q: "Um prompt de classificação de despesas usa um único exemplo, e o Claude passou a copiar detalhes desse exemplo em casos diferentes. Como os exemplos devem ser reformulados, segundo as boas práticas da Anthropic?",
  o: [
    "Usar 3 a 5 exemplos relevantes e diversos, cobrindo casos de borda, dentro de tags <example> (ou <examples>)",
    "Remover todos os exemplos e confiar apenas na instrução",
    "Usar 20 exemplos quase idênticos ao caso mais comum",
    "Colocar os exemplos misturados com as instruções, sem marcação"
  ],
  a: [0],
  w: [
    "Exemplos devem ser relevantes, diversos e estruturados em tags; 3 a 5 exemplos trazem os melhores resultados.",
    "Exemplos bem escolhidos melhoram a precisão e a consistência.",
    "Exemplos parecidos demais fazem o modelo pegar padrões indesejados.",
    "Sem tags, o Claude pode confundir exemplos com instruções."
  ],
  kw: ["único exemplo", "copiar detalhes desse exemplo"],
  obj: "Reformular exemplos few-shot.",
  cons: ["Evitar padrões indesejados"],
  el: [3],
  concept: "Few-shot (multishot) prompting",
  trap: "Mais exemplos iguais não é melhor: diversidade importa.",
  tip: "Exemplos: relevantes, diversos, 3–5, em <example>.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "Diverse: Cover edge cases and vary enough that Claude doesn’t pick up unintended patterns. Structured: Wrap examples in <example> tags (multiple examples in <examples> tags) so Claude can distinguish them from instructions. Include 3–5 examples for best results.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},
{
  id: "c3-03", d: 3, t: "3", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Um prompt de suporte mistura instruções, política de reembolso, histórico do cliente e a mensagem atual em texto corrido. Às vezes o Claude trata trechos da mensagem do cliente como se fossem instruções. Qual ajuste segue as boas práticas?",
  o: [
    "Envolver cada tipo de conteúdo em tags XML próprias, como <instructions>, <context> e <input>",
    "Colocar tudo em maiúsculas para destacar as instruções",
    "Remover a política de reembolso do prompt",
    "Aumentar a temperatura"
  ],
  a: [0],
  w: [
    "Tags XML ajudam o Claude a separar instruções, contexto, exemplos e entradas variáveis, reduzindo erros de interpretação.",
    "Maiúsculas não delimitam o conteúdo.",
    "A política é necessária para responder corretamente.",
    "Temperatura não ajuda a distinguir instrução de entrada."
  ],
  kw: ["texto corrido", "trata trechos da mensagem do cliente como se fossem instruções"],
  obj: "Separar tipos de conteúdo no prompt.",
  cons: ["Conteúdo misto", "Entrada não confiável"],
  el: [3],
  concept: "Estruturar prompts com tags XML",
  trap: "Achar que ênfase (maiúsculas) resolve ambiguidade estrutural.",
  tip: "Prompt com instruções + contexto + entrada → uma tag XML para cada.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "XML tags help Claude parse complex prompts unambiguously, especially when your prompt mixes instructions, context, examples, and variable inputs. Wrapping each type of content in its own tag (for example, <instructions>, <context>, <input>) reduces misinterpretation.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},
{
  id: "c3-04", d: 3, t: "3", sc: "Multi-Agent Research System", lvl: "Pegadinha",
  q: "Um agente de pesquisa recebe cinco relatórios longos (cerca de 40 mil tokens) e uma pergunta. Hoje o prompt começa com a pergunta e as instruções e termina com os documentos. Qual mudança tende a melhorar a qualidade da resposta?",
  o: [
    "Colocar os documentos longos no topo do prompt e a pergunta e as instruções no final",
    "Manter a pergunta no início e repetir os documentos duas vezes",
    "Resumir cada documento em uma frase antes de enviar",
    "Dividir os documentos em cinco chamadas sem a pergunta"
  ],
  a: [0],
  w: [
    "Dados longos no topo, acima da pergunta e das instruções, melhoram o desempenho; a pergunta no final pode melhorar a qualidade em até 30%.",
    "Repetir documentos gasta contexto sem ganho.",
    "Resumir demais perde a informação necessária.",
    "Sem a pergunta, as chamadas não sabem o que procurar."
  ],
  kw: ["cinco relatórios longos", "começa com a pergunta", "termina com os documentos"],
  obj: "Ordenar documentos longos e a pergunta no prompt.",
  cons: ["Documentos longos", "Vários documentos"],
  el: [3],
  concept: "Posição de documentos longos e da pergunta",
  trap: "A intuição de 'pergunta primeiro' é o contrário do recomendado.",
  tip: "Documentos longos em cima, pergunta embaixo.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "Put long-form data at the top: Place your long documents and inputs near the top of your prompt, above your query, instructions, and examples. This improves performance across all models.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},
{
  id: "c3-05", d: 3, t: "3", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "As respostas de um assistente vão para um widget que não renderiza markdown. O prompt diz 'Não use markdown', mas listas e negritos continuam aparecendo. Qual reformulação segue as boas práticas de controle de formato?",
  o: [
    "Dizer o que fazer: 'Sua resposta deve ser composta por parágrafos de prosa corrida'",
    "Repetir 'NÃO USE MARKDOWN' no fim do prompt",
    "Pedir a resposta em JSON e exibir o JSON",
    "Diminuir o max_tokens"
  ],
  a: [0],
  w: [
    "Dizer ao Claude o que fazer, em vez do que não fazer, é uma forma eficaz de controlar o formato.",
    "Repetir a proibição mantém a instrução negativa.",
    "Exibir JSON não serve ao usuário final.",
    "max_tokens limita o tamanho, não o formato."
  ],
  kw: ["não renderiza markdown", "'Não use markdown'"],
  obj: "Controlar o formato da resposta.",
  cons: ["Sem markdown"],
  el: [3],
  concept: "Controle de formato da saída",
  trap: "Insistir na instrução negativa.",
  tip: "Formato: diga o que fazer, não o que evitar.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "Tell Claude what to do instead of what not to do Instead of: “Do not use markdown in your response” Try: “Your response should be composed of smoothly flowing prose paragraphs.”",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},
{
  id: "c3-06", d: 3, t: "3", sc: "Developer Productivity with Claude", lvl: "Intermediária",
  q: "Um prompt diz apenas 'NUNCA use reticências'. O texto gerado será lido por um sintetizador de voz, mas o Claude ainda erra em casos parecidos que a regra não cobre. Como melhorar a instrução?",
  o: [
    "Explicar o motivo: o texto será lido por um mecanismo de text-to-speech, que não sabe pronunciar reticências",
    "Escrever a regra em maiúsculas e negrito",
    "Listar todos os caracteres proibidos um a um",
    "Remover a regra e corrigir o texto depois com regex"
  ],
  a: [0],
  w: [
    "Dar contexto e motivação ajuda o Claude a entender o objetivo e generalizar para casos não listados.",
    "Ênfase não explica o porquê.",
    "Listas exaustivas não cobrem casos novos.",
    "Pós-processamento não resolve a causa."
  ],
  kw: ["'NUNCA use reticências'", "sintetizador de voz", "casos parecidos que a regra não cobre"],
  obj: "Fazer o modelo generalizar uma regra.",
  cons: ["Casos não cobertos"],
  el: [3],
  concept: "Dar contexto e motivação às instruções",
  trap: "Achar que regra mais enfática generaliza melhor que regra explicada.",
  tip: "Explique o porquê da regra: o Claude generaliza a partir da explicação.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "Providing context or motivation behind your instructions, such as explaining to Claude why such behavior is important, can give Claude more information about your goals and help it deliver more targeted responses.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},

/* ---------- Domínio 4: Design de tools e integração MCP ---------- */
{
  id: "d4-01", d: 4, t: "4", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Um agente tem as tools get_order e get_order_history, com descrições de uma linha. O Claude frequentemente escolhe a errada e passa parâmetros em formato inesperado. Qual é o fator MAIS importante a melhorar?",
  o: [
    "As descrições: detalhar o que cada tool faz, quando usar e quando não usar, o significado de cada parâmetro e suas limitações",
    "Trocar o modelo por um maior",
    "Diminuir a temperatura",
    "Remover o input_schema para dar flexibilidade"
  ],
  a: [0],
  w: [
    "Descrições extremamente detalhadas são, de longe, o fator mais importante no desempenho com tools.",
    "Um modelo maior não compensa descrições ambíguas.",
    "Temperatura não corrige a falta de informação.",
    "Sem schema, os parâmetros ficam ainda menos previsíveis."
  ],
  kw: ["descrições de uma linha", "escolhe a errada", "formato inesperado"],
  obj: "Melhorar a escolha e o uso de tools.",
  cons: ["Tools parecidas"],
  el: [3],
  concept: "Descrições de tools",
  trap: "Atribuir ao modelo um problema de definição da tool.",
  tip: "Tool mal usada → descrição detalhada (3–4 frases ou mais).",
  ref: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools",
  ev: "Provide extremely detailed descriptions. This is by far the most important factor in tool performance.",
  evu: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools"
},
{
  id: "d4-02", d: 4, t: "4", sc: "Developer Productivity with Claude", lvl: "Desafiadora",
  q: "Um assistente interno tem 40 tools de GitHub, Jira e Slack com nomes como list, create e search. O Claude confunde tools de serviços diferentes. Qual mudança de design segue as boas práticas?",
  o: [
    "Prefixar os nomes com o serviço (github_list_prs, jira_search_issues) e consolidar operações relacionadas em menos tools",
    "Criar uma tool separada para cada ação possível de cada serviço",
    "Renomear as tools com números (tool_1, tool_2...)",
    "Colocar as 40 descrições no system prompt em vez das tools"
  ],
  a: [0],
  w: [
    "Namespacing torna a escolha inequívoca, e menos tools, mais capazes, reduzem a ambiguidade.",
    "Mais tools aumentam a ambiguidade na seleção.",
    "Nomes sem significado pioram a seleção.",
    "Tirar a definição das tools não ajuda o Claude a chamá-las."
  ],
  kw: ["40 tools", "nomes como list, create e search", "confunde tools de serviços diferentes"],
  obj: "Organizar uma superfície grande de tools.",
  cons: ["Vários serviços", "Nomes ambíguos"],
  el: [2],
  concept: "Namespacing e consolidação de tools",
  trap: "Achar que granularidade máxima facilita a escolha.",
  tip: "Muitas tools de vários serviços → prefixo do serviço + consolidação.",
  ref: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools",
  ev: "Use meaningful namespacing in tool names. When your tools span multiple services or resources, prefix names with the service (for example, github_list_prs, slack_send_message). This makes tool selection unambiguous as your library grows",
  evu: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools"
},
{
  id: "d4-03", d: 4, t: "4", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "A API de estoque chamada por uma tool às vezes retorna HTTP 500. Hoje o código do desenvolvedor descarta a chamada e não devolve nada ao Claude, e a conversa trava. Como tratar o erro corretamente?",
  o: [
    "Devolver um tool_result com a mensagem de erro em content e \"is_error\": true, de preferência com instrução do que tentar em seguida",
    "Omitir o tool_result e enviar só uma mensagem de texto",
    "Devolver um tool_result vazio sem indicar erro",
    "Encerrar a conversa com stop_reason end_turn"
  ],
  a: [0],
  w: [
    "Com is_error: true o Claude incorpora o erro na resposta ao usuário; mensagens instrutivas ajudam a decidir o próximo passo.",
    "Todo tool_use precisa do tool_result correspondente logo em seguida.",
    "Um resultado vazio esconde a falha e pode levar a respostas erradas.",
    "O stop_reason é definido pela API, não pelo cliente."
  ],
  kw: ["retorna HTTP 500", "não devolve nada ao Claude"],
  obj: "Sinalizar falha de ferramenta ao modelo.",
  cons: ["Erro do backend", "Conversa não pode travar"],
  el: [3],
  concept: "Erros de tools com is_error",
  trap: "Achar que esconder o erro é mais seguro.",
  tip: "Tool falhou → tool_result com is_error: true e mensagem útil.",
  ref: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls",
  ev: "If the tool itself throws an error during execution (for example, a network error when fetching weather data), you can return the error message in the content along with \"is_error\": true:",
  evu: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls"
},
{
  id: "d4-04", d: 4, t: "4", sc: "Developer Productivity with Claude", lvl: "Pegadinha",
  q: "Um servidor MCP corporativo quer oferecer o fluxo 'Resumir minhas reuniões' como um template parametrizado que o USUÁRIO escolhe explicitamente no aplicativo, em vez de o modelo decidir sozinho quando usá-lo. Qual primitiva do MCP usar?",
  o: [
    "Prompts",
    "Tools",
    "Resources",
    "Sampling"
  ],
  a: [0],
  w: [
    "Prompts são templates reutilizáveis controlados pelo usuário, que exigem invocação explícita.",
    "Tools são controladas pelo modelo, que decide quando chamá-las.",
    "Resources são fontes de dados passivas, controladas pela aplicação.",
    "Sampling é uma primitiva do CLIENTE (o servidor pede completions ao LLM via cliente) e está obsoleta desde a versão 2026-07-28 do protocolo."
  ],
  kw: ["template parametrizado", "USUÁRIO escolhe explicitamente", "em vez de o modelo decidir"],
  obj: "Escolher a primitiva MCP pelo controle de invocação.",
  cons: ["Controlado pelo usuário", "Template reutilizável"],
  el: [3],
  concept: "Primitivas do MCP: tools, resources e prompts",
  trap: "Achar que tudo no MCP é tool.",
  tip: "Tools = modelo decide; Resources = aplicação; Prompts = usuário.",
  ref: "https://modelcontextprotocol.io/docs/learn/server-concepts",
  ev: "Prompts are structured templates that define expected inputs and interaction patterns. They are user-controlled, requiring explicit invocation rather than automatic triggering.",
  evu: "https://modelcontextprotocol.io/docs/learn/server-concepts"
},
{
  id: "d4-05", d: 4, t: "4", sc: "Code Generation with Claude Code", lvl: "Intermediária",
  q: "Um time quer que TODOS os desenvolvedores de um repositório tenham automaticamente o mesmo servidor MCP de rastreamento de bugs ao usar o Claude Code, versionado junto com o código. Qual escopo de configuração usar?",
  o: [
    "Escopo de projeto (--scope project), que grava no .mcp.json da raiz do repositório",
    "Escopo local (padrão do claude mcp add)",
    "Escopo de usuário, em ~/.claude.json",
    "Uma variável de ambiente em cada máquina"
  ],
  a: [0],
  w: [
    "Servidores de escopo de projeto ficam no .mcp.json, que vai para o controle de versão e chega a todo o time.",
    "O escopo local é privado e vale só para você no projeto.",
    "O escopo de usuário vale em todos os seus projetos, mas não é compartilhado com o time.",
    "Variáveis manuais não são versionadas nem padronizadas."
  ],
  kw: ["TODOS os desenvolvedores", "versionado junto com o código"],
  obj: "Compartilhar um servidor MCP com o time.",
  cons: ["Compartilhado", "Versionado"],
  el: [3],
  concept: "Escopos de MCP no Claude Code",
  trap: "O padrão do 'claude mcp add' é local, não projeto.",
  tip: "MCP para o time → --scope project (.mcp.json); só para mim → local ou user.",
  ref: "https://code.claude.com/docs/en/mcp",
  ev: "Project-scoped servers enable team collaboration by storing configurations in a .mcp.json file at your project's root directory.",
  evu: "https://code.claude.com/docs/en/mcp"
},
{
  id: "d4-06", d: 4, t: "4", sc: "Code Generation with Claude Code", lvl: "Desafiadora",
  q: "Um agente de código passa caminhos relativos para uma tool de edição e erra arquivos depois de mudar de diretório durante a tarefa. Qual mudança no design da tool previne esse tipo de erro?",
  o: [
    "Exigir caminhos absolutos no parâmetro da tool (poka-yoke), tornando o erro mais difícil de cometer",
    "Adicionar ao prompt 'tenha cuidado com caminhos relativos'",
    "Permitir os dois formatos e tentar adivinhar o caminho certo",
    "Remover a tool de edição e usar só Bash"
  ],
  a: [0],
  w: [
    "Mudar os argumentos para dificultar erros é o poka-yoke; exigir caminhos absolutos resolveu exatamente esse problema.",
    "Instruções não removem a possibilidade do erro.",
    "Adivinhar aumenta a ambiguidade.",
    "Trocar a tool não resolve o problema do caminho."
  ],
  kw: ["caminhos relativos", "depois de mudar de diretório"],
  obj: "Tornar a tool à prova de erro.",
  cons: ["Mudança de diretório"],
  el: [3],
  concept: "Poka-yoke no design de tools",
  trap: "Tentar resolver no prompt o que a interface da tool deveria impedir.",
  tip: "Erro recorrente de parâmetro → mude a interface da tool (poka-yoke).",
  ref: "https://www.anthropic.com/research/building-effective-agents",
  ev: "Poka-yoke your tools. Change the arguments so that it is harder to make mistakes. [...] For example, we found that the model would make mistakes with tools using relative filepaths after the agent had moved out of the root directory. To fix this, we changed the tool to always require absolute filepaths",
  evu: "https://www.anthropic.com/research/building-effective-agents"
},
{
  id: "d4-07", d: 4, t: "4", sc: "Customer Support Resolution Agent", lvl: "Pegadinha",
  q: "Um desenvolvedor devolve os resultados de tools assim: na mensagem do usuário, primeiro um texto 'Aqui estão os resultados:' e depois os blocos tool_result. A API passou a rejeitar as requisições. Qual regra foi violada?",
  o: [
    "Na mensagem com resultados, os blocos tool_result devem vir PRIMEIRO no array de content; qualquer texto vem depois",
    "Os resultados de tools devem ser enviados como mensagem de assistant",
    "Só é permitido um tool_result por mensagem",
    "O texto precisa estar no campo system"
  ],
  a: [0],
  w: [
    "Os tool_result devem vir primeiro no content; o texto vem depois de todos os resultados.",
    "Resultados vão na mensagem de user que segue a de assistant.",
    "Vários tool_result podem ir na mesma mensagem (e devem, em chamadas paralelas).",
    "O system não é o lugar para comentar resultados."
  ],
  kw: ["primeiro um texto", "depois os blocos tool_result", "rejeitar as requisições"],
  obj: "Formatar corretamente os resultados de tools.",
  cons: ["Texto junto com resultados"],
  el: [3],
  concept: "Formato de tool_result",
  trap: "Achar que a ordem dentro do content não importa.",
  tip: "tool_result logo após o tool_use e no início do content.",
  ref: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls",
  ev: "Tool result blocks must immediately follow their corresponding tool use blocks in the message history. You cannot include any messages between the assistant’s tool use message and the user’s tool result message. In the user message containing tool results, the tool_result blocks must come FIRST in the content array. Any text must come AFTER all tool results.",
  evu: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls"
},

/* ---------- Domínio 5: Gerenciamento de contexto e confiabilidade ---------- */
{
  id: "e5-01", d: 5, t: "5", sc: "Customer Support Resolution Agent", lvl: "Desafiadora",
  q: "Um assistente envia em cada requisição as mesmas definições de tools e um system prompt longo, mas o system prompt começa com a data e hora atuais. A taxa de cache hit do prompt caching fica perto de zero. Qual é a correção?",
  o: [
    "Deixar o conteúdo estático (tools, instruções, exemplos) no início e mover o conteúdo que muda, como a data/hora, para depois do último breakpoint de cache",
    "Adicionar mais breakpoints cache_control no início do system prompt",
    "Mudar a ordem para messages, system e tools",
    "Usar o cache de 1 hora"
  ],
  a: [0],
  w: [
    "O cache é um prefixo na ordem tools → system → messages; qualquer mudança no início invalida tudo o que vem depois.",
    "Breakpoints não adiantam se o próprio prefixo muda a cada requisição.",
    "A ordem do prefixo é fixa: tools, system, messages.",
    "Um TTL maior não ajuda se o prefixo nunca se repete."
  ],
  kw: ["mesmas definições de tools", "começa com a data e hora atuais", "perto de zero"],
  obj: "Recuperar o cache hit.",
  cons: ["Conteúdo estático grande", "Valor variável no início"],
  el: [2],
  concept: "Estrutura do prompt para prompt caching",
  trap: "Um timestamp no começo do system invalida silenciosamente o cache.",
  tip: "Estático primeiro (tools → system → messages); variável depois do breakpoint.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching",
  ev: "Place static content (tool definitions, system instructions, context, examples) at the beginning of your prompt. Mark the end of the reusable content for caching using the cache_control parameter. Cache prefixes are created in the following order: tools, system, then messages.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
},
{
  id: "e5-02", d: 5, t: "5", sc: "Multi-Agent Research System", lvl: "Intermediária",
  q: "Um agente reutiliza um contexto grande em cache, mas cada chamada ao modelo acontece a cada 12 a 20 minutos (entre elas, rodam ferramentas lentas). As leituras do cache quase nunca acontecem. Qual ajuste resolve?",
  o: [
    "Usar a duração de cache de 1 hora, já que o padrão de 5 minutos expira entre as chamadas",
    "Adicionar mais breakpoints de cache",
    "Diminuir o tamanho do contexto em cache",
    "Fazer as chamadas em paralelo"
  ],
  a: [0],
  w: [
    "Por padrão o cache dura 5 minutos e é renovado a cada uso; para intervalos maiores existe o TTL de 1 hora, com custo adicional.",
    "Breakpoints extras não estendem o tempo de vida.",
    "Contexto menor não evita a expiração.",
    "As chamadas dependem dos resultados anteriores; o intervalo continua."
  ],
  kw: ["a cada 12 a 20 minutos", "quase nunca acontecem"],
  obj: "Manter o cache vivo entre chamadas espaçadas.",
  cons: ["Intervalo > 5 min"],
  el: [3],
  concept: "TTL do prompt caching",
  trap: "Achar que o cache dura a sessão inteira.",
  tip: "Chamadas a mais de 5 min de distância → cache de 1 hora.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching",
  ev: "By default, the cache has a 5-minute lifetime. The cache is refreshed for no additional cost each time the cached content is used. [...] If you find that 5 minutes is too short, Anthropic also offers a 1-hour cache duration at additional cost.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
},
{
  id: "e5-03", d: 5, t: "5", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Em picos de uso, uma aplicação recebe ocasionalmente erros 529 da Claude API. A equipe escreveu um loop próprio que repete a requisição imediatamente, sem pausa. Qual abordagem é a recomendada?",
  o: [
    "Usar as retentativas automáticas do SDK oficial, que fazem backoff exponencial e respeitam o header retry-after, ajustando max_retries se preciso",
    "Repetir imediatamente até dar certo, sem limite",
    "Tratar o 529 como erro de autenticação e renovar a API key",
    "Desistir na primeira falha e mostrar erro ao usuário"
  ],
  a: [0],
  w: [
    "O SDK oficial já repete falhas transitórias (conexão, rate limit e 5xx) com backoff exponencial, honrando retry-after.",
    "Repetir sem pausa piora a sobrecarga.",
    "529 é overloaded_error: a API está temporariamente sobrecarregada.",
    "Falhas transitórias normalmente se resolvem com uma nova tentativa."
  ],
  kw: ["erros 529", "repete a requisição imediatamente, sem pausa"],
  obj: "Tratar sobrecarga temporária da API.",
  cons: ["Erro transitório"],
  el: [2],
  concept: "Erros 529/429 e retentativas com backoff",
  trap: "Confundir 529 (sobrecarga) com 429 (rate limit da sua conta).",
  tip: "Erros transitórios → backoff exponencial (o SDK já faz, 2 tentativas por padrão).",
  ref: "https://platform.claude.com/docs/en/api/errors",
  ev: "The official SDK automatically retries transient failures (such as connection errors, rate limits, and 5xx server errors) with exponential backoff, twice by default, honoring the retry-after header when present.",
  evu: "https://platform.claude.com/docs/en/api/errors"
},
{
  id: "e5-04", d: 5, t: "5", sc: "Structured Data Extraction", lvl: "Intermediária",
  q: "Toda noite, uma empresa extrai dados de 80 mil documentos com o Claude. Os resultados só são usados na manhã seguinte, e o custo é a principal preocupação. Qual abordagem reduz MAIS o custo sem mudar o modelo?",
  o: [
    "Enviar as requisições pela Message Batches API, que reduz o custo em 50%",
    "Usar streaming em todas as requisições",
    "Aumentar a concorrência das chamadas síncronas",
    "Usar o fast mode"
  ],
  a: [0],
  w: [
    "A Batch API é indicada para tarefas sem resposta imediata: a maioria dos lotes termina em menos de 1 hora, com custo 50% menor.",
    "Streaming melhora a experiência de latência, não o custo.",
    "Mais concorrência não reduz o preço e esbarra em rate limits.",
    "Fast mode custa mais, para ganhar velocidade."
  ],
  kw: ["Toda noite", "só são usados na manhã seguinte", "custo é a principal preocupação"],
  obj: "Reduzir o custo de processamento em lote.",
  cons: ["Sem urgência", "Alto volume"],
  el: [3],
  concept: "Message Batches API",
  trap: "Fast mode e streaming parecem otimizações, mas não de custo.",
  tip: "Alto volume sem urgência → Batch API (50% mais barato).",
  ref: "https://platform.claude.com/docs/en/build-with-claude/batch-processing",
  ev: "This approach is well-suited to tasks that do not require immediate responses, with most batches finishing in less than 1 hour while reducing costs by 50 percent and increasing throughput.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/batch-processing"
},
{
  id: "e5-05", d: 5, t: "5", sc: "Multi-Agent Research System", lvl: "Intermediária",
  q: "Uma conversa longa de um agente se aproxima do limite da janela de contexto, e a qualidade das respostas cai conforme o histórico cresce. A equipe não quer escrever o próprio código de resumo. Qual recurso da API usar?",
  o: [
    "Compaction, que substitui os turnos antigos por um resumo escrito pelo Claude no servidor",
    "Aumentar max_tokens",
    "Apagar manualmente as mensagens mais antigas sem resumo",
    "Reenviar o histórico inteiro em todas as chamadas"
  ],
  a: [0],
  w: [
    "A compaction resume os turnos antigos no servidor, mantém a tarefa dentro da janela e o contexto ativo pequeno.",
    "max_tokens limita a saída, não o contexto.",
    "Apagar sem resumo perde informação importante.",
    "Reenviar tudo é justamente o que estoura a janela."
  ],
  kw: ["se aproxima do limite da janela de contexto", "não quer escrever o próprio código de resumo"],
  obj: "Manter conversas longas dentro do contexto.",
  cons: ["Sem código próprio", "Qualidade em queda"],
  el: [3],
  concept: "Compaction",
  trap: "Confundir max_tokens (saída) com janela de contexto (entrada + saída).",
  tip: "Conversa longa sem código de resumo → compaction; só resultados de tools velhos → context editing.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/compaction",
  ev: "Compaction replaces the older turns of a conversation with a summary that Claude writes on the server, so you need no summarization code of your own. It keeps a long conversation or agent task inside the context window, and it keeps the active context small, because response quality degrades as a conversation grows.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/compaction"
},
{
  id: "e5-06", d: 5, t: "5", sc: "Code Generation with Claude Code", lvl: "Desafiadora",
  q: "Um agente que usa muitas tools acumula resultados grandes de buscas antigas que não são mais necessários, mas a equipe quer preservar o restante da conversa sem resumi-la. Qual estratégia da API é a mais adequada?",
  o: [
    "Context editing com limpeza de resultados de tools (tool result clearing)",
    "Compaction de toda a conversa",
    "Aumentar o cache para 1 hora",
    "Desabilitar o uso de tools paralelas"
  ],
  a: [0],
  w: [
    "Tool result clearing é indicado para fluxos agênticos com muitas tools, em que resultados antigos não são mais necessários.",
    "Compaction resume a conversa, o que a equipe quer evitar.",
    "Cache não reduz o tamanho do contexto.",
    "Chamadas paralelas não são a causa do acúmulo."
  ],
  kw: ["muitas tools", "resultados grandes de buscas antigas", "sem resumi-la"],
  obj: "Remover resultados de tools obsoletos.",
  cons: ["Preservar a conversa", "Não resumir"],
  el: [3],
  concept: "Context editing (tool result clearing)",
  trap: "Usar compaction quando só os resultados de tools precisam sair.",
  tip: "Resultados de tools velhos → context editing; conversa inteira longa → compaction.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/context-editing",
  ev: "Tool result clearing: Best for agentic workflows with heavy tool use where old tool results are no longer needed",
  evu: "https://platform.claude.com/docs/en/build-with-claude/context-editing"
}
);
