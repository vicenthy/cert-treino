// Claude Certified Architect – Foundations (CCA-F / CCAR-F).
// ATENÇÃO: não temos o exam guide oficial. Formato, domínios e pesos vêm de resumos públicos
// (ver "guide"); as QUESTÕES, porém, são verificadas na documentação oficial da Anthropic (ev/evu).
window.EXAM = {
  id: "cca-f",
  storageKey: "cert-treino-cca-f-v1",
  vendor: "Anthropic",
  code: "CCA-F",
  name: "Claude Certified Architect – Foundations",
  guide: "https://claudecertificationguide.com/blog/claude-certified-architect-foundations-exam-guide",
  unofficialBlueprint: "60 questões em 120 min, nota 720 (100–1000), cenários sorteados de um banco de seis. Confirme no guia oficial da Anthropic se tiver acesso.",
  questions: 60,
  scored: 60,
  minutes: 120,
  passing: 720,
  domains: {
    1: { name: "Arquitetura agêntica e orquestração", en: "Agentic Architecture & Orchestration", weight: 27 },
    2: { name: "Configuração e fluxos do Claude Code", en: "Claude Code Configuration & Workflows", weight: 20 },
    3: { name: "Prompt engineering e saída estruturada", en: "Prompt Engineering & Structured Output", weight: 20 },
    4: { name: "Design de tools e integração MCP", en: "Tool Design & MCP Integration", weight: 18 },
    5: { name: "Gerenciamento de contexto e confiabilidade", en: "Context Management & Reliability", weight: 15 }
  },
  // Cenários da prova (segundo os resumos públicos); cada questão é ancorada em um deles (campo sc)
  scenarios: [
    "Customer Support Resolution Agent",
    "Code Generation with Claude Code",
    "Multi-Agent Research System",
    "Developer Productivity with Claude",
    "Claude Code for Continuous Integration",
    "Structured Data Extraction"
  ],
  // Temas por domínio (usados para variar os pacotes gerados com IA)
  skills: {
    1: ["Workflows vs agents", "Prompt chaining with gates", "Routing", "Parallelization (sectioning, voting)", "Orchestrator-workers", "Evaluator-optimizer", "Stopping conditions and bounded loops", "Human-in-the-loop checkpoints and escalation", "Subagents and context isolation", "Claude Agent SDK agent loop (max_turns, budgets)", "Guardrails for autonomous agents"],
    2: ["CLAUDE.md scopes and load order", "Path-scoped rules (.claude/rules)", "Settings precedence (managed, CLI, local, project, user)", "Permission rules (deny, ask, allow)", "Permission modes and plan mode", "Hooks (PreToolUse, PostToolUse, exit codes)", "Skills and custom commands", "Custom subagents", "Headless mode (claude -p) for CI", "Claude Code GitHub Actions", "MCP servers in Claude Code"],
    3: ["System prompts and roles", "Clear, direct instructions with context", "Few-shot examples", "XML tags to structure prompts", "Long documents and query placement", "Structured outputs (output_config.format)", "Strict tool use", "Output format steering", "Prompt chaining", "Evaluations and success criteria"],
    4: ["Tool descriptions and input schemas", "Tool consolidation and namespacing", "Tool responses with high-signal information", "Error handling with is_error", "tool_result formatting rules", "Parallel tool use", "Tool search for large tool sets", "MCP architecture (host, client, server)", "MCP primitives (tools, resources, prompts)", "MCP transports (stdio, Streamable HTTP)", "MCP scopes in Claude Code", "Poka-yoke tool design"],
    5: ["Prompt caching (prefix order, breakpoints, TTL)", "Context windows and token budgets", "Compaction", "Context editing (tool result clearing)", "Rate limits and retries", "Error codes (429, 529, 5xx)", "Message Batches API", "Graceful degradation and fallbacks", "Long-running agent reliability"]
  },
  docs: {
    label: "platform.claude.com/docs, code.claude.com/docs, modelcontextprotocol.io, anthropic.com e claude.com/resources",
    example: "https://platform.claude.com/docs/en/...",
    allow: [
      "^https://platform\\.claude\\.com/docs/",
      "^https://code\\.claude\\.com/docs/",
      "^https://docs\\.claude\\.com/",
      "^https://modelcontextprotocol\\.io/",
      "^https://www\\.anthropic\\.com/(engineering|research)/",
      "^https://claude\\.com/(blog|resources)/"
    ]
  },
  prompt: {
    expert: "arquitetura de soluções com Claude (Claude API, Claude Code, Agent SDK e MCP)",
    multiShare: 0,
    scope: "Questões de arquitetura e decisão, não de sintaxe. Somente temas do Claude Certified Architect – Foundations."
  },
  cmp: { title: "Comparar conceitos", search: "Buscar (ex.: hooks, MCP, cache)" }
};
window.QB = [];
window.CMP = [];
