// Comparar conceitos do CCA-F (mesma estrutura do DVA-C02).
// Cada célula resume o que está na página oficial indicada em "ref" (e nas questões ligadas ao tema).
CMP.push(
{
  id: "k-instrucoes", d: [2, 5], title: "CLAUDE.md vs .claude/rules vs Skills vs Subagents",
  svc: [
    ["CLAUDE.md", "Instruções carregadas em toda sessão (projeto, usuário, local ou managed policy)."],
    [".claude/rules (paths)", "Regras modulares; com o campo paths, só valem ao trabalhar com arquivos que casam com o padrão."],
    ["Skills", "Procedimentos invocáveis (/nome); o corpo só carrega quando a skill é usada."],
    ["Subagents", "Assistentes com contexto, system prompt, ferramentas e permissões próprios; devolvem só o resultado."]
  ],
  rows: [
    ["Quando entra no contexto", "Sempre (subdiretórios sob demanda)", "Sem paths: sempre; com paths: ao tocar arquivos que casam", "Só quando invocada", "Em outra janela de contexto"],
    ["Melhor para", "Fatos e padrões sempre úteis", "Regras de uma parte do código", "Procedimentos longos e eventuais", "Trabalho que lê muito (exploração, revisão)"],
    ["Custo de contexto", "Sempre pago (imports não reduzem)", "Só quando relevante", "Quase zero até usar", "Só o resumo volta à conversa principal"],
    ["Onde fica", "./CLAUDE.md, ~/.claude/CLAUDE.md, CLAUDE.local.md", ".claude/rules/*.md", ".claude/skills/<nome>/SKILL.md", ".claude/agents/<nome>.md"]
  ],
  kw: [
    ["padrões do projeto, sempre", "CLAUDE.md"],
    ["só para src/api, só para testes", ".claude/rules com paths"],
    ["procedimento longo, de vez em quando, /deploy", "Skill"],
    ["exploração enche o contexto, só o resumo deve voltar", "Subagent"]
  ],
  traps: "Imports com @ organizam o CLAUDE.md, mas não economizam contexto: o conteúdo importado carrega junto.",
  analogy: "CLAUDE.md é o crachá com as regras da casa; rules são placas em salas específicas; skills são manuais na estante; subagents são colegas que você manda pesquisar e que voltam com um resumo.",
  decide: ["Vale sempre? → CLAUDE.md", "Vale só para certos arquivos? → rules com paths", "É um procedimento acionável? → skill", "Precisa isolar contexto ou ferramentas? → subagent"],
  ref: "https://code.claude.com/docs/en/memory"
},
{
  id: "k-controle", d: [2], title: "CLAUDE.md vs Permission rules vs Hooks",
  svc: [
    ["Instruções (CLAUDE.md)", "Orientam o modelo, que normalmente segue, mas não é garantia."],
    ["Permission rules", "allow/ask/deny por ferramenta e padrão; avaliadas na ordem deny → ask → allow."],
    ["Hooks", "Comandos que rodam em eventos do ciclo de vida (PreToolUse, PostToolUse, Stop...)."]
  ],
  rows: [
    ["Determinístico?", "Não", "Sim", "Sim"],
    ["Pode bloquear uma ação?", "Não garante", "Sim (deny)", "Sim (PreToolUse com exit 2)"],
    ["Lógica própria", "Não", "Padrões simples", "Qualquer script (ex.: checar o comando, rodar formatter)"],
    ["Exemplo", "\"Prefira pnpm\"", "deny Bash(rm *)", "Bloquear migração em produção; formatar após edições"]
  ],
  kw: [
    ["preferência, estilo, convenção", "CLAUDE.md"],
    ["nunca permitir um comando/ferramenta", "deny rule"],
    ["validação com lógica, garantia, rodar algo após editar", "Hook"]
  ],
  traps: "Exit code 1 em hook é erro NÃO bloqueante na maioria dos eventos; para bloquear use exit 2. E um allow nunca abre exceção em um deny.",
  analogy: "CLAUDE.md é o conselho; a permission rule é a catraca; o hook é o segurança que lê o crachá e decide caso a caso.",
  decide: ["Precisa de garantia? → rule ou hook, não só instrução", "Bloqueio por padrão simples → deny", "Bloqueio com lógica ou ação automática → hook"],
  ref: "https://code.claude.com/docs/en/hooks"
},
{
  id: "k-modos", d: [2], title: "Permission modes do Claude Code",
  svc: [
    ["default (Manual)", "Pergunta antes de editar, rodar comandos ou acessar a rede."],
    ["acceptEdits", "Libera leituras, edições e comandos comuns de arquivos."],
    ["plan", "Lê e propõe um plano; não edita até você aprovar."],
    ["auto", "Um classificador revisa as ações no seu lugar."],
    ["dontAsk", "Só leituras e ferramentas pré-aprovadas; o resto é negado."],
    ["bypassPermissions", "Libera tudo."]
  ],
  rows: [
    ["Indicado para", "Trabalho sensível", "Iterar em código que você revisa", "Explorar antes de mudar", "Tarefas longas, menos prompts", "CI e scripts travados", "Somente containers e VMs isolados"]
  ],
  kw: [
    ["revisar antes de mexer em disco", "plan"],
    ["CI restrito, só pré-aprovado, negar o resto", "dontAsk"],
    ["container descartável e isolado", "bypassPermissions"]
  ],
  traps: "bypassPermissions não é 'o modo para CI': em CI travado use dontAsk; bypass só em ambiente isolado.",
  analogy: "Do mais vigiado ao mais livre: default → plan → acceptEdits → auto → bypass; dontAsk é a lista de convidados fechada.",
  decide: ["Quer ver o plano antes? → plan", "Pipeline sem humano e restrito → dontAsk (+ allowedTools)", "Sandbox descartável → bypassPermissions"],
  ref: "https://code.claude.com/docs/en/permission-modes"
},
{
  id: "k-settings", d: [2], title: "Precedência de settings do Claude Code",
  svc: [
    ["Managed", "Distribuído pela organização (arquivo, MDM ou console)."],
    ["Linha de comando", "Flags da sessão atual."],
    ["Project local", ".claude/settings.local.json (pessoal, fora do git)."],
    ["Shared project", ".claude/settings.json (commitado para o time)."],
    ["User", "~/.claude/settings.json (todos os seus projetos)."]
  ],
  rows: [
    ["Ordem", "1º (vence)", "2º", "3º", "4º", "5º"],
    ["Quem define", "TI/segurança", "Você, por sessão", "Você, por projeto", "O time", "Você, global"]
  ],
  kw: [["política de segurança da empresa", "Managed"], ["configuração do time no repositório", "Shared project"], ["preferência pessoal só neste projeto", "Project local"]],
  traps: "O mais específico NÃO vence o managed: nada nos seus arquivos ou em --settings sobrepõe uma chave gerenciada (fora poucas exceções de segurança).",
  analogy: "Lei federal (managed) > ordem do dia (CLI) > combinado pessoal na sala (local) > regra da equipe (projeto) > hábito pessoal (user).",
  decide: ["Conflito com managed → managed vence", "Entre arquivos seus → local > projeto > user"],
  ref: "https://code.claude.com/docs/en/settings"
},
{
  id: "k-workflows-1", d: [1], title: "Prompt chaining vs Routing vs Parallelization",
  svc: [
    ["Prompt chaining", "Sequência fixa de etapas; cada chamada processa a saída da anterior, com gates opcionais."],
    ["Routing", "Classifica a entrada e encaminha para um prompt/tarefa especializado."],
    ["Parallelization", "Chamadas simultâneas agregadas: sectioning (partes diferentes) ou voting (mesma tarefa várias vezes)."]
  ],
  rows: [
    ["Estrutura", "Linear", "Bifurcação por categoria", "Leque em paralelo"],
    ["Use quando", "Tarefa se decompõe em etapas fixas", "Categorias distintas e classificação confiável", "Subtarefas independentes ou mais confiança"],
    ["Troca", "Latência por precisão", "Especialização por categoria", "Custo por velocidade/confiança"]
  ],
  kw: [
    ["esboço → checagem → texto final", "Prompt chaining"],
    ["tipos de ticket, modelos diferentes por dificuldade", "Routing"],
    ["mesma avaliação várias vezes / guardrail em paralelo", "Parallelization (voting / sectioning)"]
  ],
  traps: "Sectioning = partes DIFERENTES em paralelo; voting = a MESMA tarefa repetida.",
  analogy: "Chaining é a linha de montagem; routing é a recepção que encaminha; parallelization é o júri ou a equipe dividindo capítulos.",
  decide: ["Etapas fixas em ordem → chaining", "Escolher o caminho pela categoria → routing", "Independentes ou votação → parallelization"],
  ref: "https://www.anthropic.com/research/building-effective-agents"
},
{
  id: "k-workflows-2", d: [1], title: "Orchestrator-workers vs Evaluator-optimizer vs Agent",
  svc: [
    ["Orchestrator-workers", "Um LLM central decompõe a tarefa dinamicamente, delega e sintetiza."],
    ["Evaluator-optimizer", "Uma chamada gera e outra avalia e dá feedback, em ciclo."],
    ["Agent autônomo", "O LLM dirige o próprio processo e o uso de tools, em loop com feedback do ambiente."]
  ],
  rows: [
    ["Quem define os passos", "O orquestrador, conforme a entrada", "Ciclo fixo gerar ↔ avaliar", "O próprio modelo"],
    ["Use quando", "Subtarefas imprevisíveis", "Critério claro e o feedback melhora o resultado", "Problemas abertos, número de passos imprevisível"],
    ["Cuidados", "Delegação detalhada", "Critérios de avaliação explícitos", "Sandbox, guardrails e stopping conditions"]
  ],
  kw: [
    ["não dá para prever as subtarefas", "Orchestrator-workers"],
    ["checklist claro, refinamento iterativo", "Evaluator-optimizer"],
    ["aberto, autonomia, ambiente confiável", "Agent"]
  ],
  traps: "Orchestrator-workers parece parallelization, mas as subtarefas NÃO são predefinidas.",
  analogy: "O orquestrador é o editor-chefe que distribui pautas; o evaluator-optimizer é autor + revisor; o agente é o repórter que decide sozinho onde investigar.",
  decide: ["Subtarefas dependem da entrada → orchestrator-workers", "Melhorar com feedback e critério → evaluator-optimizer", "Caminho imprevisível e confiança no ambiente → agent (com limites)"],
  ref: "https://www.anthropic.com/research/building-effective-agents"
},
{
  id: "k-mcp-primitivas", d: [4], title: "MCP: Tools vs Resources vs Prompts vs Elicitation",
  svc: [
    ["Tools", "Funções que o modelo chama; podem ter efeitos (gravar, chamar APIs)."],
    ["Resources", "Dados passivos, somente leitura, para contexto (arquivos, schemas, docs)."],
    ["Prompts", "Templates reutilizáveis e parametrizados de interação."],
    ["Elicitation", "Recurso do cliente: o servidor pede informações ao usuário durante a interação."]
  ],
  rows: [
    ["Quem controla", "Modelo", "Aplicação", "Usuário", "Servidor pede, usuário responde"],
    ["Exemplo", "Enviar mensagem, criar evento", "Schema do banco, documentação", "\"Resumir minhas reuniões\"", "Perguntar a preferência de assento"]
  ],
  kw: [
    ["o modelo decide quando chamar, ação", "Tool"],
    ["dado somente leitura para contexto", "Resource"],
    ["usuário escolhe explicitamente, template", "Prompt"],
    ["servidor precisa perguntar algo ao usuário", "Elicitation"]
  ],
  traps: "Sampling e Roots também são recursos do cliente, mas estão obsoletos desde a versão 2026-07-28 do protocolo.",
  analogy: "Tools são os botões que o assistente aperta; resources são os livros da estante; prompts são os formulários prontos que você escolhe; elicitation é o atendente perguntando 'janela ou corredor?'.",
  decide: ["Ação → tool", "Contexto passivo → resource", "Fluxo iniciado pelo usuário → prompt", "Servidor precisa de input do usuário → elicitation"],
  ref: "https://modelcontextprotocol.io/docs/learn/server-concepts"
},
{
  id: "k-mcp-escopo", d: [4, 2], title: "MCP no Claude Code: local vs project vs user (e transportes)",
  svc: [
    ["Local (padrão)", "Só você, só neste projeto; fica no ~/.claude.json."],
    ["Project", "Todo o time; fica no .mcp.json da raiz, versionado."],
    ["User", "Só você, em todos os seus projetos; fica no ~/.claude.json."]
  ],
  rows: [
    ["Compartilhado com o time", "Não", "Sim, via controle de versão", "Não"],
    ["Flag", "(padrão)", "--scope project", "--scope user"],
    ["Bom para", "Testes e credenciais pessoais", "Ferramentas do time", "Utilitários pessoais"]
  ],
  kw: [["todo o time, versionado", "--scope project (.mcp.json)"], ["só eu, todos os projetos", "--scope user"], ["só eu, só aqui", "local"]],
  traps: "O padrão de 'claude mcp add' é local. Transportes: stdio para servidor local (geralmente um cliente) e Streamable HTTP para remoto (muitos clientes).",
  analogy: "Local é a gaveta da sua mesa; project é o armário da equipe; user é a sua mochila, que vai com você para qualquer sala.",
  decide: ["Time inteiro → project", "Pessoal e global → user", "Pessoal e só neste repo → local"],
  ref: "https://code.claude.com/docs/en/mcp"
},
{
  id: "k-contexto", d: [5], title: "Compaction vs Context editing vs Notas vs Subagents",
  svc: [
    ["Compaction", "Substitui turnos antigos por um resumo escrito pelo Claude no servidor."],
    ["Context editing", "Limpa resultados antigos de tools (ou blocos de thinking) sem resumir."],
    ["Structured note-taking", "O agente grava notas fora do contexto (NOTES.md, to-do) e as relê depois."],
    ["Subagents", "Trabalho pesado em contextos separados; só um resumo volta."]
  ],
  rows: [
    ["Resolve", "Conversa longa perto do limite", "Resultados de tools velhos ocupando espaço", "Estado entre sessões e tarefas longas", "Exploração que poluiria o contexto"],
    ["Perde detalhe?", "Sim (resumo)", "Só o que foi limpo", "Não (fica em arquivo)", "O líder vê só o resumo"]
  ],
  kw: [
    ["conversa longa, sem código de resumo", "Compaction"],
    ["muitos tool results antigos, não resumir", "Context editing"],
    ["várias sessões, acompanhar progresso", "Notas estruturadas"],
    ["isolar pesquisa pesada", "Subagents"]
  ],
  traps: "max_tokens limita a SAÍDA; não resolve contexto cheio. E mais contexto não é automaticamente melhor (context rot).",
  analogy: "Compaction é a ata da reunião; context editing é jogar fora rascunhos; notas são o caderno de bordo; subagents são estagiários que voltam com um resumo.",
  decide: ["Histórico longo → compaction", "Só tool results velhos → context editing", "Continuidade entre sessões → notas", "Pesquisa ampla → subagents"],
  ref: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
},
{
  id: "k-saida", d: [3], title: "JSON outputs vs Strict tool use vs Só prompt",
  svc: [
    ["JSON outputs", "output_config.format: a RESPOSTA segue um JSON schema (constrained decoding)."],
    ["Strict tool use", "strict: true: garante o schema nos nomes e inputs das tools."],
    ["Só prompt", "Pedir JSON no texto do prompt, com exemplos."]
  ],
  rows: [
    ["Garantia de schema", "Sim", "Sim (inputs de tools)", "Não"],
    ["Retries por violação", "Não precisa", "Não precisa", "Podem ser necessários"],
    ["Use para", "Extração, relatórios estruturados", "Agentes chamando APIs com inputs críticos", "Protótipos rápidos"]
  ],
  kw: [["resposta sempre no schema", "JSON outputs"], ["inputs de tools sem campos faltando", "strict: true"]],
  traps: "Structured outputs garantem o FORMATO, não que o conteúdo seja verdadeiro; para citações confiáveis use o recurso de citations.",
  analogy: "JSON outputs é o formulário com campos obrigatórios; strict tool use é o caixa eletrônico que só aceita a senha no formato certo; 'só prompt' é pedir por favor.",
  decide: ["Formato da resposta → output_config.format", "Inputs de tools → strict: true", "Pode usar os dois juntos"],
  ref: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs"
},
{
  id: "k-chamadas", d: [5], title: "Síncrono vs Streaming vs Message Batches",
  svc: [
    ["Requisição síncrona", "Resposta completa ao final."],
    ["Streaming", "A resposta chega aos poucos (SSE)."],
    ["Message Batches", "Lote assíncrono de requisições, com custo menor."]
  ],
  rows: [
    ["Latência percebida", "Espera tudo", "Primeiros tokens rápido", "A maioria termina em menos de 1 hora"],
    ["Custo", "Padrão", "Padrão", "50% menor"],
    ["Use para", "Respostas curtas", "Respostas longas, chat, evitar timeout", "Alto volume sem urgência"],
    ["Cuidado", "Timeout em respostas longas", "Erro pode vir depois do 200", "Resultados em qualquer ordem: use custom_id"]
  ],
  kw: [["toda noite, resultado no dia seguinte, custo", "Batches"], ["resposta longa, timeout", "Streaming"]],
  traps: "Fast mode deixa mais rápido e mais caro; não é otimização de custo. Em batch, nunca assuma a ordem dos resultados.",
  analogy: "Síncrono é esperar a pizza inteira; streaming é receber fatia por fatia; batch é a encomenda de buffet para amanhã, mais barata.",
  decide: ["Sem urgência e volume alto → batch", "Saída longa → streaming", "Curta e interativa → síncrono ou streaming"],
  ref: "https://platform.claude.com/docs/en/build-with-claude/batch-processing"
},
{
  id: "k-erros", d: [5], title: "400 vs 401 vs 429 vs 529 vs stop_reason max_tokens",
  svc: [
    ["400 invalid_request_error", "Problema no formato ou conteúdo da requisição."],
    ["401 authentication_error", "Problema com a API key."],
    ["429 rate_limit_error", "Limite de taxa atingido (inclui acceleration limits em picos bruscos)."],
    ["529 overloaded_error", "API temporariamente sobrecarregada."],
    ["stop_reason max_tokens", "Não é erro: a resposta atingiu o seu max_tokens."]
  ],
  rows: [
    ["Repetir resolve?", "Não: corrija a requisição", "Não: corrija a chave", "Sim, com backoff", "Sim, com backoff", "Não: aumente max_tokens ou continue"]
  ],
  kw: [["pico repentino de tráfego", "429 (acceleration limits): crescer gradualmente"], ["alta demanda geral", "529: retry com backoff"], ["resposta cortada", "max_tokens"]],
  traps: "O SDK oficial já repete erros transitórios (conexão, 429, 5xx) com backoff exponencial, 2 vezes por padrão, respeitando retry-after.",
  analogy: "400 é formulário errado; 401 é crachá inválido; 429 é fila na catraca; 529 é o prédio lotado; max_tokens é a folha que acabou.",
  decide: ["4xx (exceto 429) → corrija", "429/529/5xx → backoff", "max_tokens → aumente ou continue"],
  ref: "https://platform.claude.com/docs/en/api/errors"
},
{
  id: "k-agente-multi", d: [1], title: "Chamada única vs Agente único vs Multiagente",
  svc: [
    ["Chamada única otimizada", "Um prompt bem feito, com exemplos e recuperação de contexto."],
    ["Agente único", "Um LLM em loop com tools."],
    ["Multiagente", "Um líder delega para subagentes em paralelo."]
  ],
  rows: [
    ["Tokens (relativo a chat)", "1×", "~4×", "~15×"],
    ["Bom para", "Tarefas bem definidas", "Tarefas abertas e sequenciais", "Pesquisas amplas e paralelizáveis de alto valor"],
    ["Ruim para", "Problemas abertos", "Pesquisas muito amplas (lento)", "Contexto compartilhado e muitas dependências"]
  ],
  kw: [["já atinge a precisão", "Chamada única"], ["amplo, várias direções independentes", "Multiagente"]],
  traps: "A Anthropic recomenda a solução mais simples possível: às vezes, nem construir um sistema agêntico.",
  analogy: "Chamada única é perguntar ao especialista; agente único é o especialista com um computador; multiagente é uma equipe com coordenador — mais rápida em temas amplos, mas bem mais cara.",
  decide: ["Comece simples", "Só suba de nível se a avaliação mostrar ganho", "Multiagente só quando o valor paga ~15× tokens"],
  ref: "https://www.anthropic.com/engineering/multi-agent-research-system"
}
);
