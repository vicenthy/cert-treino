// CCA-F · Lote 2 — escrito a partir da documentação oficial e dos artigos de engenharia da Anthropic.
QB.push(
/* ---------- Domínio 1: Arquitetura agêntica e orquestração ---------- */
{
  id: "a1-10", d: 1, t: "1", sc: "Multi-Agent Research System", lvl: "Desafiadora",
  q: "Uma empresa quer trocar seu assistente de agente único por um sistema multiagente para TODAS as tarefas, incluindo respostas rápidas de FAQ e tarefas em que todos os agentes precisariam compartilhar o mesmo contexto. O que a experiência da Anthropic indica?",
  o: [
    "Multiagente consome muito mais tokens (cerca de 15× um chat) e só compensa em tarefas de alto valor; não combina bem com tarefas que exigem contexto compartilhado ou muitas dependências entre agentes",
    "Multiagente sempre reduz custo, porque cada agente usa um modelo menor",
    "Multiagente é indicado justamente quando todos os agentes precisam do mesmo contexto",
    "O número de tokens não muda entre agente único e multiagente"
  ],
  a: [0],
  w: [
    "Multiagente usa cerca de 15× mais tokens que chats e não é bom para domínios com contexto compartilhado ou muitas dependências.",
    "O custo em tokens aumenta bastante, mesmo com modelos menores nos subagentes.",
    "Contexto compartilhado e muitas dependências são justamente os casos que NÃO combinam com multiagente.",
    "A diferença de consumo é grande e documentada."
  ],
  kw: ["TODAS as tarefas", "respostas rápidas de FAQ", "compartilhar o mesmo contexto"],
  obj: "Avaliar quando multiagente compensa.",
  cons: ["Custo", "Contexto compartilhado"],
  el: [3],
  concept: "Custo e adequação de sistemas multiagente",
  trap: "Achar que multiagente é sempre melhor por ter mais 'cérebros'.",
  tip: "Multiagente: tarefas amplas, paralelizáveis e de alto valor; evite com contexto compartilhado.",
  ref: "https://www.anthropic.com/engineering/multi-agent-research-system",
  ev: "In our data, agents typically use about 4× more tokens than chat interactions, and multi-agent systems use about 15× more tokens than chats. For economic viability, multi-agent systems require tasks where the value of the task is high enough to pay for the increased performance. Further, some domains that require all agents to share the same context or involve many dependencies between agents are not a good fit for multi-age",
  evu: "https://www.anthropic.com/engineering/multi-agent-research-system"
},
{
  id: "a1-11", d: 1, t: "1", sc: "Multi-Agent Research System", lvl: "Intermediária",
  q: "Em um sistema de pesquisa, o agente líder envia instruções curtas como 'pesquise a escassez de semicondutores'. Vários subagentes acabam fazendo as mesmas buscas e deixam lacunas. Como corrigir?",
  o: [
    "Ensinar o orquestrador a delegar: cada subtarefa deve ter objetivo, formato de saída, orientação sobre ferramentas e fontes, e limites claros",
    "Aumentar o número de subagentes",
    "Deixar os subagentes conversarem livremente entre si",
    "Trocar todos os subagentes pelo modelo mais caro"
  ],
  a: [0],
  w: [
    "Sem descrições detalhadas, os agentes duplicam trabalho, deixam lacunas ou não encontram a informação.",
    "Mais subagentes com instruções vagas aumentam a duplicação.",
    "Conversa livre não substitui uma divisão de trabalho clara.",
    "Um modelo melhor não corrige uma delegação mal especificada."
  ],
  kw: ["instruções curtas", "mesmas buscas", "deixam lacunas"],
  obj: "Melhorar a delegação para subagentes.",
  cons: ["Duplicação", "Lacunas"],
  el: [3],
  concept: "Delegação no padrão orquestrador–subagentes",
  trap: "Atribuir ao modelo um problema de especificação da tarefa.",
  tip: "Subtarefa = objetivo + formato de saída + ferramentas/fontes + limites.",
  ref: "https://www.anthropic.com/engineering/multi-agent-research-system",
  ev: "Each subagent needs an objective, an output format, guidance on the tools and sources to use, and clear task boundaries. Without detailed task descriptions, agents duplicate work, leave gaps, or fail to find necessary information.",
  evu: "https://www.anthropic.com/engineering/multi-agent-research-system"
},
{
  id: "a1-12", d: 1, t: "1", sc: "Multi-Agent Research System", lvl: "Intermediária",
  q: "Um sistema multiagente gasta 10 subagentes até para perguntas simples como 'qual é a capital da Austrália?'. Qual ajuste no prompt do orquestrador segue a prática da Anthropic?",
  o: [
    "Incluir regras explícitas de escala de esforço conforme a complexidade da pergunta (ex.: fatos simples com 1 agente e poucas chamadas)",
    "Proibir o uso de subagentes",
    "Fixar sempre 10 subagentes para manter consistência",
    "Aumentar o max_tokens do orquestrador"
  ],
  a: [0],
  w: [
    "Agentes têm dificuldade de julgar o esforço adequado; regras de escala no prompt evitam investimento excessivo em perguntas simples.",
    "Perguntas complexas ainda se beneficiam de subagentes.",
    "Um número fixo desperdiça recursos nas perguntas simples.",
    "max_tokens não controla quantos subagentes são criados."
  ],
  kw: ["10 subagentes até para perguntas simples"],
  obj: "Ajustar o esforço à complexidade.",
  cons: ["Perguntas simples", "Custo"],
  el: [3],
  concept: "Escalar o esforço conforme a complexidade",
  trap: "Achar que o modelo sempre calibra sozinho quanto esforço usar.",
  tip: "Coloque no prompt do orquestrador quantos agentes/chamadas usar por tipo de pergunta.",
  ref: "https://www.anthropic.com/engineering/multi-agent-research-system",
  ev: "Agents struggle to judge appropriate effort for different tasks, so we embedded scaling rules in the prompts. Simple fact-finding requires just 1 agent with 3-10 tool calls, direct comparisons might need 2-4 subagents with 10-15 calls each, and complex research might use more than 10 subagents with clearly divided responsibilities.",
  evu: "https://www.anthropic.com/engineering/multi-agent-research-system"
},
{
  id: "a1-13", d: 1, t: "1", sc: "Multi-Agent Research System", lvl: "Intermediária",
  q: "Um sistema de pesquisa está lento porque o agente líder cria um subagente de cada vez e cada subagente faz uma busca por vez. Qual mudança reduz MAIS o tempo de pesquisa?",
  o: [
    "Paralelizar em dois níveis: o líder cria vários subagentes em paralelo e cada subagente usa várias ferramentas em paralelo",
    "Usar um único agente fazendo buscas sequenciais",
    "Aumentar o timeout de cada busca",
    "Diminuir o número de fontes consultadas"
  ],
  a: [0],
  w: [
    "As duas formas de paralelização reduziram o tempo de pesquisa em até 90% em consultas complexas.",
    "Buscas sequenciais são justamente o gargalo.",
    "Timeout maior não acelera nada.",
    "Menos fontes reduz a cobertura e a qualidade."
  ],
  kw: ["um subagente de cada vez", "uma busca por vez", "reduz MAIS o tempo"],
  obj: "Acelerar pesquisas complexas.",
  cons: ["Muitas fontes", "Tempo"],
  el: [2],
  concept: "Paralelização de subagentes e de tool calls",
  trap: "Cortar cobertura em vez de remover o gargalo sequencial.",
  tip: "Lentidão em pesquisa ampla → subagentes em paralelo + tools em paralelo.",
  ref: "https://www.anthropic.com/engineering/multi-agent-research-system",
  ev: "For speed, we introduced two kinds of parallelization: (1) the lead agent spins up 3-5 subagents in parallel rather than serially; (2) the subagents use 3+ tools in parallel. These changes cut research time by up to 90% for complex queries",
  evu: "https://www.anthropic.com/engineering/multi-agent-research-system"
},
{
  id: "a1-14", d: 1, t: "1", sc: "Multi-Agent Research System", lvl: "Desafiadora",
  q: "Agentes de longa duração ficam rodando por muito tempo e mantêm estado. Ao publicar uma nova versão do código dos agentes, a equipe não pode interromper as execuções em andamento. Qual estratégia de implantação a Anthropic descreve para isso?",
  o: [
    "Rainbow deployments: deslocar o tráfego gradualmente da versão antiga para a nova, mantendo as duas rodando ao mesmo tempo",
    "Atualizar todos os agentes de uma vez, reiniciando as execuções",
    "Pausar o sistema até todas as execuções terminarem",
    "Implantar a nova versão só em ambiente de teste"
  ],
  a: [0],
  w: [
    "Rainbow deployments evitam interromper agentes em execução, mantendo as versões lado a lado.",
    "Atualizar tudo de uma vez quebra execuções em andamento.",
    "Pausar o sistema indefinidamente não é viável.",
    "Isso não coloca a nova versão em produção."
  ],
  kw: ["longa duração", "mantêm estado", "não pode interromper as execuções em andamento"],
  obj: "Atualizar agentes sem interromper execuções.",
  cons: ["Execuções longas", "Estado"],
  el: [3],
  concept: "Rainbow deployments para agentes",
  trap: "Tratar agentes de longa duração como serviços stateless.",
  tip: "Agentes stateful em produção → rainbow deployment.",
  ref: "https://www.anthropic.com/engineering/multi-agent-research-system",
  ev: "Instead, we use rainbow deployments to avoid disrupting running agents, by gradually shifting traffic from old to new versions while keeping both running simultaneously.",
  evu: "https://www.anthropic.com/engineering/multi-agent-research-system"
},
{
  id: "a1-15", d: 1, t: "1", sc: "Multi-Agent Research System", lvl: "Intermediária",
  q: "Os relatórios de um sistema de pesquisa são texto livre e raramente têm uma única resposta correta, o que dificulta a avaliação automática. Como avaliar a qualidade em escala?",
  o: [
    "Um LLM como juiz, avaliando cada saída contra uma rubrica (precisão factual, precisão das citações, completude, qualidade das fontes, eficiência no uso de tools)",
    "Comparação exata de strings com uma resposta de referência",
    "Medir apenas o tamanho do relatório",
    "Não avaliar e confiar no feedback espontâneo dos usuários"
  ],
  a: [0],
  w: [
    "Saídas livres são difíceis de avaliar programaticamente; um LLM juiz com rubrica escala bem.",
    "Não há uma única resposta correta para comparar.",
    "Tamanho não mede qualidade.",
    "Feedback espontâneo é lento e enviesado."
  ],
  kw: ["texto livre", "raramente têm uma única resposta correta", "em escala"],
  obj: "Avaliar saídas abertas.",
  cons: ["Sem gabarito único"],
  el: [2],
  concept: "LLM-as-judge com rubrica",
  trap: "Tentar avaliar texto livre com métricas exatas.",
  tip: "Saída aberta → LLM juiz com rubrica explícita.",
  ref: "https://www.anthropic.com/engineering/multi-agent-research-system",
  ev: "Research outputs are difficult to evaluate programmatically, since they are free-form text and rarely have a single correct answer. LLMs are a natural fit for grading outputs. We used an LLM judge that evaluated each output against criteria in a rubric:",
  evu: "https://www.anthropic.com/engineering/multi-agent-research-system"
},
{
  id: "a1-16", d: 1, t: "1", sc: "Developer Productivity with Claude", lvl: "Intermediária",
  q: "Uma equipe adia qualquer teste do seu agente até montar uma suíte com centenas de casos, o que vai levar meses. Enquanto isso, mudanças de prompt são feitas no escuro. O que a Anthropic recomenda?",
  o: [
    "Começar já com testes em pequena escala, com poucos exemplos, em vez de esperar por avaliações completas",
    "Esperar a suíte completa, porque poucos exemplos não dizem nada",
    "Testar só em produção",
    "Parar de mudar o prompt até a suíte ficar pronta"
  ],
  a: [0],
  w: [
    "Suítes grandes são úteis, mas é melhor começar já com testes pequenos: no início, as mudanças costumam ter efeitos grandes.",
    "Poucos exemplos já mostram mudanças grandes no início do desenvolvimento.",
    "Testar só em produção expõe usuários a regressões.",
    "Congelar o desenvolvimento atrasa o projeto sem necessidade."
  ],
  kw: ["adia qualquer teste", "centenas de casos", "no escuro"],
  obj: "Começar a avaliar cedo.",
  cons: ["Sem avaliação hoje"],
  el: [2],
  concept: "Avaliações começando pequenas",
  trap: "Achar que só avaliação grande tem valor.",
  tip: "Avalie desde o início com poucos casos; aumente depois.",
  ref: "https://www.anthropic.com/engineering/multi-agent-research-system",
  ev: "However, it’s best to start with small-scale testing right away with a few examples, rather than delaying until you can build more thorough evals.",
  evu: "https://www.anthropic.com/engineering/multi-agent-research-system"
},
{
  id: "a1-17", d: 1, t: "1", sc: "Customer Support Resolution Agent", lvl: "Desafiadora",
  q: "Um agente de suporte construído com o Claude Agent SDK pode emitir reembolsos. A empresa quer que chamadas que não estejam cobertas por regras de permissão sejam decididas em tempo de execução, por exemplo pedindo a aprovação de um supervisor. Qual recurso do SDK usar?",
  o: [
    "O callback canUseTool, que trata em tempo de execução o que as regras e os modos de permissão não decidiram",
    "permissionMode bypassPermissions",
    "Remover a tool de reembolso e pedir ao cliente que ligue",
    "Aumentar max_turns"
  ],
  a: [0],
  w: [
    "Modos e regras definem o que é automático; o canUseTool trata o restante em tempo de execução, como uma aprovação humana.",
    "bypassPermissions aprova antes de consultar o callback.",
    "Remover a tool elimina a funcionalidade em vez de controlá-la.",
    "max_turns limita o loop, não aprova ações."
  ],
  kw: ["Claude Agent SDK", "não estejam cobertas por regras de permissão", "em tempo de execução"],
  obj: "Adicionar aprovação humana em tempo de execução.",
  cons: ["Ações sensíveis", "Decisão em runtime"],
  el: [3],
  concept: "Permissões no Agent SDK (modos, regras e canUseTool)",
  trap: "bypassPermissions desliga justamente o ponto de controle.",
  tip: "Human-in-the-loop no Agent SDK → canUseTool.",
  ref: "https://code.claude.com/docs/en/agent-sdk/permissions",
  ev: "Use permission modes and rules to define what's allowed automatically, and the canUseTool callback to handle everything else at runtime.",
  evu: "https://code.claude.com/docs/en/agent-sdk/permissions"
},
{
  id: "a1-18", d: 1, t: "1", sc: "Developer Productivity with Claude", lvl: "Fácil",
  q: "Em uma revisão de arquitetura, alguém pergunta qual é a diferença entre um 'workflow' e um 'agent' na definição da Anthropic. Qual resposta está correta?",
  o: [
    "Workflows orquestram LLMs e tools por caminhos de código predefinidos; agents são sistemas em que o LLM dirige dinamicamente o próprio processo e o uso de tools",
    "Workflows usam tools e agents não usam",
    "Agents sempre usam vários modelos; workflows usam apenas um",
    "Não há diferença: são sinônimos"
  ],
  a: [0],
  w: [
    "É exatamente a distinção arquitetural feita pela Anthropic.",
    "Ambos podem usar tools.",
    "O número de modelos não define a diferença.",
    "A Anthropic faz uma distinção arquitetural clara."
  ],
  kw: ["'workflow'", "'agent'"],
  obj: "Distinguir workflows de agents.",
  cons: ["Definição oficial"],
  el: [3],
  concept: "Workflows vs agents",
  trap: "Achar que a diferença é usar ou não tools.",
  tip: "Caminho definido no código → workflow; o modelo decide o caminho → agent.",
  ref: "https://www.anthropic.com/research/building-effective-agents",
  ev: "Workflows are systems where LLMs and tools are orchestrated through predefined code paths. Agents, on the other hand, are systems where LLMs dynamically direct their own processes and tool usage, maintaining control over how they accomplish tasks.",
  evu: "https://www.anthropic.com/research/building-effective-agents"
},
{
  id: "a1-19", d: 1, t: "1", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Os operadores de um agente de suporte não entendem por que ele tomou certas decisões, e isso dificulta a confiança e a depuração. Qual princípio da Anthropic para construir agentes trata diretamente disso?",
  o: [
    "Priorizar a transparência, mostrando explicitamente as etapas de planejamento do agente",
    "Aumentar o número de tools",
    "Esconder o raciocínio para respostas mais curtas",
    "Usar um framework com mais camadas de abstração"
  ],
  a: [0],
  w: [
    "Transparência (mostrar o planejamento) é um dos três princípios centrais, junto com simplicidade e um bom ACI.",
    "Mais tools aumentam a complexidade e a ambiguidade.",
    "Esconder o raciocínio piora a depuração.",
    "A recomendação é reduzir camadas de abstração ao ir para produção."
  ],
  kw: ["não entendem por que ele tomou certas decisões", "confiança e a depuração"],
  obj: "Aumentar a confiança e a depurabilidade do agente.",
  cons: ["Decisões opacas"],
  el: [1],
  concept: "Princípios para agentes: simplicidade, transparência e ACI",
  trap: "Achar que frameworks com mais abstração ajudam a entender o agente.",
  tip: "Agentes: simples, transparentes (mostram o plano) e com ACI bem documentado.",
  ref: "https://www.anthropic.com/research/building-effective-agents",
  ev: "When implementing agents, we try to follow three core principles: Maintain simplicity in your agent's design. Prioritize transparency by explicitly showing the agent’s planning steps. Carefully craft your agent-computer interface (ACI) through thorough tool documentation and testing.",
  evu: "https://www.anthropic.com/research/building-effective-agents"
},

/* ---------- Domínio 2: Configuração e fluxos do Claude Code ---------- */
{
  id: "b2-08", d: 2, t: "2", sc: "Code Generation with Claude Code", lvl: "Intermediária",
  q: "Um monorepo tem regras longas que só valem para a API em src/api/. Hoje elas ficam no CLAUDE.md da raiz e ocupam contexto mesmo quando o Claude trabalha no frontend. Qual é a MELHOR forma de organizar?",
  o: [
    "Criar uma regra em .claude/rules/ com frontmatter paths: \"src/api/**/*.ts\", que só se aplica ao trabalhar com arquivos correspondentes",
    "Mover as regras para o CLAUDE.local.md",
    "Importar as regras com @ no CLAUDE.md da raiz",
    "Duplicar as regras no CLAUDE.md do usuário"
  ],
  a: [0],
  w: [
    "Regras com o campo paths só se aplicam quando o Claude trabalha com arquivos que casam com os padrões.",
    "CLAUDE.local.md continua sendo carregado sempre e é pessoal.",
    "Imports carregam junto com o CLAUDE.md que importa.",
    "O CLAUDE.md do usuário vale para todos os projetos."
  ],
  kw: ["só valem para a API em src/api/", "ocupam contexto mesmo quando"],
  obj: "Carregar regras só onde se aplicam.",
  cons: ["Regras específicas de pasta", "Economia de contexto"],
  el: [3],
  concept: "Regras por caminho (.claude/rules com paths)",
  trap: "Achar que imports economizam contexto.",
  tip: "Regra de uma parte do código → .claude/rules/ com paths.",
  ref: "https://code.claude.com/docs/en/memory",
  ev: "Rules can be scoped to specific files using YAML frontmatter with the paths field. These conditional rules only apply when Claude is working with files matching the specified patterns.",
  evu: "https://code.claude.com/docs/en/memory"
},
{
  id: "b2-09", d: 2, t: "2", sc: "Code Generation with Claude Code", lvl: "Pegadinha",
  q: "Um desenvolvedor inicia o Claude Code na raiz de um repositório que tem um CLAUDE.md na raiz e outro em packages/billing/. Quando o CLAUDE.md de packages/billing/ entra no contexto?",
  o: [
    "Sob demanda, quando o Claude lê, escreve ou edita arquivos nesse subdiretório",
    "Sempre na inicialização, junto com o da raiz",
    "Nunca: só o CLAUDE.md da raiz é usado",
    "Só se for importado com @ pelo CLAUDE.md da raiz"
  ],
  a: [0],
  w: [
    "Arquivos acima do diretório de trabalho carregam na inicialização; os de subdiretórios carregam sob demanda.",
    "Os de subdiretórios não carregam na inicialização.",
    "CLAUDE.md de subdiretórios também são descobertos.",
    "Não é preciso importar: o carregamento sob demanda é automático."
  ],
  kw: ["na raiz de um repositório", "packages/billing/", "Quando"],
  obj: "Entender a ordem de carregamento dos CLAUDE.md.",
  cons: ["CLAUDE.md em subdiretório"],
  el: [2],
  concept: "Carregamento dos CLAUDE.md na hierarquia de diretórios",
  trap: "Achar que todos os CLAUDE.md do repositório carregam no início.",
  tip: "Acima do diretório de trabalho → na inicialização; abaixo → sob demanda.",
  ref: "https://code.claude.com/docs/en/memory",
  ev: "CLAUDE.md and CLAUDE.local.md files in the directory hierarchy above the working directory are loaded at launch. Files in subdirectories load on demand.",
  evu: "https://code.claude.com/docs/en/memory"
},
{
  id: "b2-10", d: 2, t: "2", sc: "Claude Code for Continuous Integration", lvl: "Desafiadora",
  q: "Em um pipeline de CI bem restrito, o Claude Code deve usar apenas ferramentas pré-aprovadas; qualquer ação que normalmente pediria permissão deve ser negada automaticamente, já que não há ninguém para responder. Qual permission mode atende?",
  o: [
    "dontAsk",
    "bypassPermissions",
    "acceptEdits",
    "plan"
  ],
  a: [0],
  w: [
    "No dontAsk só rodam leituras no diretório de trabalho e ferramentas pré-aprovadas; o que pediria permissão é negado. É indicado para CI e scripts restritos.",
    "bypassPermissions libera tudo e só é indicado para containers e VMs isolados.",
    "acceptEdits libera edições sem perguntar, mas não nega o resto.",
    "plan não faz edições até a aprovação do plano."
  ],
  kw: ["bem restrito", "apenas ferramentas pré-aprovadas", "negada automaticamente"],
  obj: "Escolher o modo para CI restrito.",
  cons: ["Sem humano", "Somente pré-aprovado"],
  el: [3],
  concept: "Permission modes do Claude Code",
  trap: "Escolher bypassPermissions por ser 'não interativo'.",
  tip: "CI travado → dontAsk; container descartável isolado → bypassPermissions.",
  ref: "https://code.claude.com/docs/en/permission-modes",
  ev: "dontAsk | File reads inside your working directories and pre-approved tools; anything that would prompt is denied, though a mod you installed can still approve some of those calls | Locked-down CI and scripts",
  evu: "https://code.claude.com/docs/en/permission-modes"
},
{
  id: "b2-11", d: 2, t: "2", sc: "Developer Productivity with Claude", lvl: "Pegadinha",
  q: "Um desenvolvedor cansado dos prompts de permissão quer rodar o Claude Code em bypassPermissions direto no seu notebook de trabalho, com acesso às credenciais da empresa. Para que ambiente a documentação indica esse modo?",
  o: [
    "Somente containers e VMs isolados",
    "Qualquer máquina de desenvolvimento",
    "Somente sessões de plan mode",
    "Ambientes de produção, para agilizar correções"
  ],
  a: [0],
  w: [
    "bypassPermissions libera tudo e é indicado apenas para containers e VMs isolados.",
    "Em uma máquina com credenciais reais, qualquer ação roda sem revisão.",
    "Plan mode é outro modo, não um ambiente.",
    "Produção é o pior lugar para pular todas as verificações."
  ],
  kw: ["bypassPermissions", "notebook de trabalho", "credenciais da empresa"],
  obj: "Saber onde usar bypassPermissions.",
  cons: ["Credenciais reais"],
  el: [3],
  concept: "bypassPermissions e isolamento",
  trap: "Usar o modo mais permissivo para resolver 'prompt fatigue' em máquina real.",
  tip: "Muitos prompts? Use regras de allow, acceptEdits ou auto mode, não bypass fora de sandbox.",
  ref: "https://code.claude.com/docs/en/permission-modes",
  ev: "bypassPermissions | Everything | Isolated containers and VMs only",
  evu: "https://code.claude.com/docs/en/permission-modes"
},
{
  id: "b2-12", d: 2, t: "2", sc: "Claude Code for Continuous Integration", lvl: "Intermediária",
  q: "Um time criou a skill /deploy, que publica em produção. Eles querem que ela rode SOMENTE quando alguém digitar /deploy, nunca porque o Claude achou que o código parecia pronto. Como configurar?",
  o: [
    "Adicionar disable-model-invocation: true ao frontmatter da skill",
    "Adicionar user-invocable: false ao frontmatter",
    "Deixar a descrição da skill vazia",
    "Mover a skill para o CLAUDE.md"
  ],
  a: [0],
  w: [
    "Com disable-model-invocation: true, o Claude não invoca a skill sozinho: ideal para fluxos com efeitos colaterais, como deploy.",
    "user-invocable: false faz o oposto: só o Claude pode invocar.",
    "Sem descrição, o Claude usa a primeira linha do conteúdo; não impede a invocação.",
    "No CLAUDE.md o procedimento vira instrução sempre carregada."
  ],
  kw: ["publica em produção", "SOMENTE quando alguém digitar /deploy"],
  obj: "Impedir invocação automática de uma skill perigosa.",
  cons: ["Efeito colateral", "Só manual"],
  el: [3],
  concept: "Controle de invocação de skills",
  trap: "Confundir disable-model-invocation com user-invocable.",
  tip: "Skill com efeito colateral (deploy, commit, envio) → disable-model-invocation: true.",
  ref: "https://code.claude.com/docs/en/skills",
  ev: "disable-model-invocation: true: Claude can't invoke the skill on its own. Use this for workflows with side effects or that you want to control timing, like /commit, /deploy, or /send-slack-message.",
  evu: "https://code.claude.com/docs/en/skills"
},
{
  id: "b2-13", d: 2, t: "2", sc: "Code Generation with Claude Code", lvl: "Intermediária",
  q: "Um time criou um subagent 'code-reviewer' em .claude/agents/ sem o campo tools, e percebeu que ele às vezes edita arquivos. O revisor deveria apenas ler o código. O que fazer?",
  o: [
    "Definir o campo tools com uma lista só de leitura, como Read, Grep, Glob, porque sem esse campo o subagent herda todas as ferramentas",
    "Escrever 'não edite arquivos' na descrição do subagent",
    "Mover o subagent para ~/.claude/agents/",
    "Usar o modelo haiku no subagent"
  ],
  a: [0],
  w: [
    "Se tools for omitido, o subagent herda todas as ferramentas disponíveis para subagents.",
    "A descrição serve para decidir quando delegar, não para restringir ferramentas.",
    "Mudar o escopo do arquivo não muda as ferramentas.",
    "O modelo não restringe o acesso às ferramentas."
  ],
  kw: ["sem o campo tools", "às vezes edita arquivos", "apenas ler o código"],
  obj: "Restringir as ferramentas de um subagent.",
  cons: ["Somente leitura"],
  el: [2],
  concept: "Ferramentas de subagents",
  trap: "Achar que omitir tools significa 'sem tools'.",
  tip: "Subagent read-only → tools: Read, Grep, Glob.",
  ref: "https://code.claude.com/docs/en/sub-agents",
  ev: "Inherits every tool available to subagents if omitted.",
  evu: "https://code.claude.com/docs/en/sub-agents"
},
{
  id: "b2-14", d: 2, t: "2", sc: "Claude Code for Continuous Integration", lvl: "Fácil",
  q: "Um time quer pedir ao Claude, direto em um comentário de pull request ou issue no GitHub, que analise o código, implemente mudanças e faça commits. Qual é a solução oficial?",
  o: [
    "Claude Code GitHub Actions, acionado ao mencionar @claude (configuração rápida com /install-github-app)",
    "Um webhook próprio chamando a API de completions",
    "Rodar o Claude Code em plan mode no servidor do GitHub",
    "Copiar o diff manualmente para o claude.ai"
  ],
  a: [0],
  w: [
    "A GitHub Action roda o Claude Code nos workflows; mencionar @claude em PR ou issue aciona a análise e as mudanças.",
    "Possível, mas reinventa o que a Action já oferece.",
    "Plan mode não faz mudanças nem commits.",
    "Processo manual, sem integração."
  ],
  kw: ["comentário de pull request ou issue", "faça commits"],
  obj: "Integrar o Claude Code ao GitHub.",
  cons: ["Acionado por comentário"],
  el: [3],
  concept: "Claude Code GitHub Actions",
  trap: "Construir integração própria quando há uma Action oficial.",
  tip: "@claude em PR/issue → Claude Code GitHub Actions (/install-github-app).",
  ref: "https://code.claude.com/docs/en/github-actions",
  ev: "Mention @claude in a pull request or issue comment to have Claude analyze code, implement changes, and push commits.",
  evu: "https://code.claude.com/docs/en/github-actions"
},
{
  id: "b2-15", d: 2, t: "2", sc: "Claude Code for Continuous Integration", lvl: "Intermediária",
  q: "Um script de CI roda claude -p em vários repositórios e precisa registrar o custo estimado de cada execução sem consultar o painel de uso. Qual opção usar?",
  o: [
    "--output-format json, cujo resultado inclui total_cost_usd e o custo por modelo",
    "--verbose e ler o custo no log de texto",
    "Rodar em plan mode",
    "--allowedTools com todas as ferramentas"
  ],
  a: [0],
  w: [
    "Com --output-format json, a saída traz total_cost_usd e o detalhamento por modelo (estimativas do cliente).",
    "Texto livre é frágil de interpretar em script.",
    "Plan mode não informa custo.",
    "--allowedTools aprova ferramentas, não informa custo."
  ],
  kw: ["claude -p", "custo estimado de cada execução", "sem consultar o painel"],
  obj: "Obter custo de forma programática.",
  cons: ["Script", "Sem painel"],
  el: [2],
  concept: "Saída estruturada no modo não interativo",
  trap: "Tentar extrair dados de saída em texto livre.",
  tip: "Script precisa de dados (custo, resultado) → --output-format json.",
  ref: "https://code.claude.com/docs/en/headless",
  ev: "With --output-format json, the response payload includes total_cost_usd and a per-model cost breakdown, so scripted callers can track spend without consulting the usage dashboard.",
  evu: "https://code.claude.com/docs/en/headless"
},
{
  id: "b2-16", d: 2, t: "2", sc: "Code Generation with Claude Code", lvl: "Intermediária",
  q: "Um time quer que o formatador de código rode automaticamente sempre que o Claude Code editar um arquivo com sucesso, sem depender de o Claude lembrar. Qual evento de hook usar?",
  o: [
    "PostToolUse, com matcher Edit|Write",
    "PreToolUse",
    "SessionStart",
    "UserPromptSubmit"
  ],
  a: [0],
  w: [
    "PostToolUse dispara depois que uma chamada de ferramenta é bem-sucedida.",
    "PreToolUse roda antes da edição; o arquivo ainda não mudou.",
    "SessionStart roda só quando a sessão começa ou é retomada.",
    "UserPromptSubmit roda quando o usuário envia um prompt."
  ],
  kw: ["sempre que o Claude Code editar um arquivo com sucesso", "sem depender de o Claude lembrar"],
  obj: "Automatizar uma ação após edições.",
  cons: ["Após sucesso", "Determinístico"],
  el: [3],
  concept: "Eventos de hooks",
  trap: "Usar PreToolUse para algo que precisa do arquivo já editado.",
  tip: "Antes de executar/bloquear → PreToolUse; depois de executar → PostToolUse.",
  ref: "https://code.claude.com/docs/en/hooks",
  ev: "PostToolUse | After a tool call succeeds",
  evu: "https://code.claude.com/docs/en/hooks"
},
{
  id: "b2-17", d: 2, t: "2", sc: "Developer Productivity with Claude", lvl: "Intermediária",
  q: "Uma skill de 'gerar changelog' raramente é usada automaticamente pelo Claude, mesmo quando o usuário pede algo como 'resuma as mudanças da release'. O frontmatter tem description: 'utilitário'. Qual é a correção mais provável?",
  o: [
    "Reescrever a description dizendo o que a skill faz e quando usá-la, com o caso de uso principal primeiro",
    "Renomear a pasta da skill",
    "Mover a skill para o CLAUDE.md",
    "Adicionar disable-model-invocation: true"
  ],
  a: [0],
  w: [
    "O Claude usa a description para decidir quando aplicar a skill.",
    "O nome da pasta define o comando, não quando aplicar.",
    "Isso carregaria o procedimento em toda sessão.",
    "Isso impediria de vez a invocação pelo Claude."
  ],
  kw: ["raramente é usada automaticamente", "description: 'utilitário'"],
  obj: "Fazer o Claude reconhecer quando usar a skill.",
  cons: ["Invocação automática"],
  el: [3],
  concept: "Description de skills",
  trap: "Descrições genéricas impedem que a skill seja escolhida.",
  tip: "Description = o que faz + quando usar (caso principal primeiro).",
  ref: "https://code.claude.com/docs/en/skills",
  ev: "What the skill does and when to use it. Claude uses this to decide when to apply the skill.",
  evu: "https://code.claude.com/docs/en/skills"
},
{
  id: "b2-18", d: 2, t: "2", sc: "Developer Productivity with Claude", lvl: "Intermediária",
  q: "A área de segurança de uma empresa quer que TODOS os usuários do Claude Code da organização recebam as mesmas instruções de compliance, gerenciadas pela TI, em todos os projetos. Onde essas instruções devem ficar?",
  o: [
    "No CLAUDE.md de managed policy (ex.: /etc/claude-code/CLAUDE.md no Linux), distribuído pela TI",
    "No ./CLAUDE.md de cada repositório",
    "No ~/.claude/CLAUDE.md de cada desenvolvedor, configurado por ele",
    "No CLAUDE.local.md de cada projeto"
  ],
  a: [0],
  w: [
    "O managed policy é para instruções de toda a organização, geridas por TI/DevOps.",
    "Depende de cada repositório ter e manter o arquivo.",
    "Depende de cada pessoa e não é gerido pela TI.",
    "É pessoal e fica fora do controle de versão."
  ],
  kw: ["TODOS os usuários", "gerenciadas pela TI", "todos os projetos"],
  obj: "Distribuir instruções obrigatórias para a organização.",
  cons: ["Toda a organização", "Gestão central"],
  el: [3],
  concept: "CLAUDE.md de managed policy",
  trap: "Contar com cada desenvolvedor ou repositório para aplicar regras corporativas.",
  tip: "Organização inteira → managed policy; time → projeto; você → usuário/local.",
  ref: "https://code.claude.com/docs/en/memory",
  ev: "Organization-wide instructions managed by IT/DevOps | Company coding standards, security policies, compliance requirements | All users in organization",
  evu: "https://code.claude.com/docs/en/memory"
},

/* ---------- Domínio 3: Prompt engineering e saída estruturada ---------- */
{
  id: "c3-07", d: 3, t: "3", sc: "Customer Support Resolution Agent", lvl: "Fácil",
  q: "As respostas de um assistente de suporte técnico saem genéricas e com o tom errado. Qual ajuste simples, recomendado pela Anthropic, costuma focar o comportamento e o tom?",
  o: [
    "Definir um papel (role) no system prompt, por exemplo 'Você é um especialista de suporte do produto X'",
    "Aumentar a temperatura",
    "Remover o system prompt",
    "Pedir respostas mais longas"
  ],
  a: [0],
  w: [
    "Definir um papel no system prompt foca o comportamento e o tom; até uma frase faz diferença.",
    "Temperatura aumenta variação, não foco.",
    "Sem system prompt, perde-se o contexto do papel.",
    "Respostas mais longas não corrigem tom nem foco."
  ],
  kw: ["genéricas", "tom errado"],
  obj: "Ajustar foco e tom.",
  cons: ["Ajuste simples"],
  el: [2],
  concept: "Role prompting no system prompt",
  trap: "Mexer em parâmetros de amostragem para um problema de instrução.",
  tip: "Tom/foco → papel no system prompt.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "Setting a role in the system prompt focuses Claude’s behavior and tone for your use case. Even a single sentence makes a difference:",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},
{
  id: "c3-08", d: 3, t: "3", sc: "Structured Data Extraction", lvl: "Desafiadora",
  q: "Um sistema responde perguntas sobre contratos e pede no prompt que o Claude cite trechos literais. Às vezes as citações não batem com o documento, e os trechos citados aumentam o custo de saída. Qual recurso da API resolve os dois problemas?",
  o: [
    "O recurso de citations nos blocos de documento: as citações apontam para trechos válidos e o cited_text não conta como tokens de saída",
    "Structured outputs com um campo 'citacao'",
    "Aumentar o max_tokens",
    "Pedir que o Claude 'verifique duas vezes' as citações"
  ],
  a: [0],
  w: [
    "Com citations, as citações têm ponteiros válidos para os documentos e o cited_text não conta como saída.",
    "Um schema garante o formato, não que o texto exista no documento.",
    "max_tokens não melhora a precisão das citações.",
    "Instruções não garantem ponteiros válidos."
  ],
  kw: ["citações não batem", "aumentam o custo de saída"],
  obj: "Citações confiáveis e mais baratas.",
  cons: ["Citações exatas", "Custo de saída"],
  el: [2],
  concept: "Citations da API",
  trap: "Structured outputs valida formato, não veracidade da citação.",
  tip: "Respostas com fonte comprovável → citations.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/citations",
  ev: "Cost savings: If your prompt-based approach asks Claude to output direct quotes, you might see cost savings because cited_text does not count toward your output tokens. Better citation reliability: Because the API parses citations into the response formats described in the following sections and extracts cited_text directly, citations are guaranteed to contain valid pointers to the provided documents.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/citations"
},
{
  id: "c3-09", d: 3, t: "3", sc: "Customer Support Resolution Agent", lvl: "Desafiadora",
  q: "O system prompt de um agente tem centenas de linhas de 'se X então Y', difíceis de manter e que quebram em casos novos. Uma versão anterior era vaga demais e o agente não sabia o que fazer. Qual é a recomendação da Anthropic?",
  o: [
    "Escrever o prompt na 'altitude certa': específico o bastante para guiar o comportamento, mas flexível para dar ao modelo heurísticas fortes",
    "Adicionar ainda mais regras para cobrir os casos novos",
    "Voltar à versão vaga e confiar no modelo",
    "Mover as regras para os nomes das tools"
  ],
  a: [0],
  w: [
    "A altitude certa equilibra os dois erros: lógica rígida e frágil de um lado, orientação vaga do outro.",
    "Mais regras aumentam a fragilidade e a manutenção.",
    "Vago demais não dá sinais concretos ao modelo.",
    "Nomes de tools não são lugar de política."
  ],
  kw: ["centenas de linhas de 'se X então Y'", "vaga demais"],
  obj: "Calibrar o nível de detalhe do system prompt.",
  cons: ["Manutenção", "Casos novos"],
  el: [3],
  concept: "Altitude certa do system prompt",
  trap: "Achar que mais regras sempre aumentam o controle.",
  tip: "Nem regra para tudo, nem vago: heurísticas claras.",
  ref: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
  ev: "At one extreme, we see engineers hardcoding complex, brittle logic in their prompts to elicit exact agentic behavior. This approach creates fragility and increases maintenance complexity over time. At the other extreme, engineers sometimes provide vague, high-level guidance that fails to give the LLM concrete signals for desired outputs or falsely assumes shared context.",
  evu: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
},
{
  id: "c3-10", d: 3, t: "3", sc: "Structured Data Extraction", lvl: "Intermediária",
  q: "Um agente chama a tool create_invoice, e às vezes os inputs vêm sem campos obrigatórios ou com tipos errados. A equipe quer garantia de validação no nome e nos inputs da tool, não no texto da resposta. O que usar?",
  o: [
    "Strict tool use (strict: true na definição da tool)",
    "JSON outputs (output_config.format)",
    "Um exemplo de chamada no system prompt",
    "Diminuir a temperatura"
  ],
  a: [0],
  w: [
    "Strict tool use garante a validação do schema nos nomes e inputs das tools.",
    "output_config.format controla o formato da RESPOSTA, não os inputs de tools.",
    "Exemplos ajudam, mas não garantem.",
    "Temperatura não garante schema."
  ],
  kw: ["inputs vêm sem campos obrigatórios", "nome e nos inputs da tool"],
  obj: "Garantir inputs válidos de tools.",
  cons: ["Validação garantida"],
  el: [3],
  concept: "Structured outputs: JSON outputs vs strict tool use",
  trap: "Usar output_config.format para validar inputs de tools.",
  tip: "Resposta em JSON → output_config.format; input de tool → strict: true.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs",
  ev: "JSON outputs (output_config.format): Get Claude’s response in a specific JSON format, for example to extract data from images or text, generate structured reports, or format API responses. This page covers JSON outputs. Strict tool use (strict: true): Guarantee schema validation on tool names and inputs.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs"
},
{
  id: "c3-11", d: 3, t: "3", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Para cobrir todos os casos, um time colocou no prompt uma lista com 60 casos de borda, cada um com sua regra. O agente ficou mais confuso. O que a Anthropic recomenda no lugar disso?",
  o: [
    "Curar um conjunto de exemplos diversos e canônicos que mostrem o comportamento esperado",
    "Aumentar a lista para 200 casos",
    "Remover todos os exemplos",
    "Colocar os casos em um arquivo anexo sem referência no prompt"
  ],
  a: [0],
  w: [
    "Em vez de uma lista enorme de casos de borda, recomenda-se um conjunto de exemplos diversos e canônicos.",
    "Mais casos agravam o problema.",
    "Exemplos continuam sendo uma prática fortemente recomendada.",
    "Sem referência, o conteúdo não ajuda."
  ],
  kw: ["60 casos de borda", "mais confuso"],
  obj: "Ensinar comportamento com exemplos eficazes.",
  cons: ["Muitas regras"],
  el: [3],
  concept: "Exemplos canônicos vs lista de casos de borda",
  trap: "Tentar listar toda regra possível.",
  tip: "Exemplos diversos e canônicos > lista exaustiva de regras.",
  ref: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
  ev: "However, teams will often stuff a laundry list of edge cases into a prompt in an attempt to articulate every possible rule the LLM should follow for a particular task. We do not recommend this. Instead, we recommend working to curate a set of diverse, canonical examples that effectively portray the expected behavior of the agent.",
  evu: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
},
{
  id: "c3-12", d: 3, t: "3", sc: "Developer Productivity with Claude", lvl: "Intermediária",
  q: "Um time quer 'melhorar o prompt' de um assistente, mas não tem uma definição do que é sucesso nem uma forma de testar as mudanças. Segundo a Anthropic, o que deve vir antes do prompt engineering?",
  o: [
    "Definir critérios de sucesso claros e formas de testá-los empiricamente, além de ter um primeiro rascunho do prompt",
    "Trocar para o maior modelo disponível",
    "Reescrever o prompt do zero várias vezes até parecer melhor",
    "Adicionar exemplos aleatórios"
  ],
  a: [0],
  w: [
    "O guia pressupõe critérios de sucesso, formas de testá-los e um primeiro rascunho do prompt.",
    "Trocar o modelo não define o que é sucesso.",
    "Sem critério, 'parecer melhor' é subjetivo.",
    "Exemplos aleatórios podem piorar o resultado."
  ],
  kw: ["não tem uma definição do que é sucesso", "forma de testar"],
  obj: "Preparar o terreno para prompt engineering.",
  cons: ["Sem critérios", "Sem testes"],
  el: [3],
  concept: "Critérios de sucesso e avaliações antes do prompt engineering",
  trap: "Ajustar prompts sem medir.",
  tip: "Primeiro: critérios de sucesso + avaliação; depois: prompt engineering.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview",
  ev: "This guide assumes that you have: A clear definition of the success criteria for your use case Some ways to empirically test against those criteria A first draft prompt you want to improve",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview"
},
{
  id: "c3-13", d: 3, t: "3", sc: "Customer Support Resolution Agent", lvl: "Pegadinha",
  q: "Um time passou semanas ajustando o prompt para reduzir a latência de um classificador simples de alto volume, sem sucesso. Qual alternativa a documentação de prompt engineering lembra que pode ser mais eficaz?",
  o: [
    "Escolher outro modelo, já que latência e custo às vezes melhoram mais facilmente assim do que com prompt engineering",
    "Adicionar mais exemplos ao prompt",
    "Pedir respostas com raciocínio passo a passo",
    "Aumentar o max_tokens"
  ],
  a: [0],
  w: [
    "Nem todo critério se resolve com prompt; latência e custo às vezes melhoram mais trocando de modelo.",
    "Mais exemplos aumentam a entrada e podem piorar a latência.",
    "Raciocínio passo a passo aumenta a saída e a latência.",
    "max_tokens maior não reduz a latência."
  ],
  kw: ["reduzir a latência", "classificador simples de alto volume", "sem sucesso"],
  obj: "Saber quando prompt engineering não é a ferramenta certa.",
  cons: ["Latência", "Tarefa simples"],
  el: [3],
  concept: "Quando fazer prompt engineering",
  trap: "Achar que todo problema se resolve no prompt.",
  tip: "Latência/custo → considere outro modelo (ou menor esforço) antes de reescrever prompts.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview",
  ev: "Not every success criterion or failing eval is best solved by prompt engineering. For example, you can sometimes improve latency and cost more easily by choosing a different model.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview"
},
{
  id: "c3-14", d: 3, t: "3", sc: "Multi-Agent Research System", lvl: "Intermediária",
  q: "Um assistente analisa vários documentos de uma vez, colados em texto corrido, e às vezes confunde de qual arquivo veio cada informação. Como estruturar os documentos no prompt?",
  o: [
    "Envolver cada documento em <document>, com subtags <document_content> e <source> (e outros metadados)",
    "Separar os documentos com uma linha em branco",
    "Juntar todos os documentos em um único bloco sem metadados",
    "Enviar só o nome dos arquivos"
  ],
  a: [0],
  w: [
    "Com vários documentos, a recomendação é usar <document> com subtags de conteúdo e fonte.",
    "Uma linha em branco não identifica a fonte.",
    "Sem metadados, a origem se perde.",
    "Sem o conteúdo, não há o que analisar."
  ],
  kw: ["vários documentos", "texto corrido", "de qual arquivo veio"],
  obj: "Preservar a origem de cada documento.",
  cons: ["Vários documentos", "Atribuição da fonte"],
  el: [3],
  concept: "Estrutura de vários documentos com XML",
  trap: "Achar que separadores visuais bastam.",
  tip: "Vários documentos → <documents><document><source>…<document_content>….",
  ref: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
  ev: "Structure document content and metadata with XML tags: When using multiple documents, wrap each document in <document> tags with <document_content> and <source> (and other metadata) subtags for clarity.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
},
{
  id: "c3-15", d: 3, t: "3", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Um chatbot de FAQ de alto volume responde bem, mas gasta tokens demais em respostas simples. A equipe quer reduzir o consumo sem trocar de modelo, aceitando respostas menos minuciosas. Qual parâmetro da API ajustar?",
  o: [
    "O effort (output_config.effort), que equilibra minúcia da resposta e eficiência de tokens",
    "temperature",
    "stop_sequences",
    "top_k"
  ],
  a: [0],
  w: [
    "O effort controla quantos tokens o Claude usa, trocando minúcia por eficiência.",
    "Parâmetros de amostragem não controlam o gasto de tokens (e são rejeitados nos modelos mais novos).",
    "stop_sequences cortam a saída em pontos fixos, de forma frágil.",
    "top_k é de amostragem, não de esforço."
  ],
  kw: ["gasta tokens demais", "sem trocar de modelo", "menos minuciosas"],
  obj: "Reduzir o consumo de tokens mantendo o modelo.",
  cons: ["Mesmo modelo", "Alto volume"],
  el: [2],
  concept: "Parâmetro effort",
  trap: "Achar que temperatura controla o tamanho/esforço.",
  tip: "Tarefa simples e volumosa → effort baixo.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/effort",
  ev: "Control how many tokens Claude uses when responding with the effort parameter, trading off between response thoroughness and token efficiency.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/effort"
},

/* ---------- Domínio 4: Design de tools e integração MCP ---------- */
{
  id: "d4-08", d: 4, t: "4", sc: "Developer Productivity with Claude", lvl: "Desafiadora",
  q: "Um agente corporativo tem mais de 200 tools vindas de vários servidores MCP. As definições consomem dezenas de milhares de tokens e o Claude passou a escolher tools erradas. Qual solução da API ataca os dois problemas?",
  o: [
    "Tool search tool, com defer_loading: true nas tools que não precisam carregar de início",
    "Juntar todas as definições em uma descrição única",
    "Aumentar a janela de contexto",
    "Remover as descrições das tools para economizar tokens"
  ],
  a: [0],
  w: [
    "Com tool search, só a ferramenta de busca e as não adiadas entram no contexto; as demais são carregadas sob demanda, mantendo a precisão alta.",
    "Uma descrição única aumenta a ambiguidade.",
    "Contexto maior não melhora a seleção, que piora acima de 30–50 tools.",
    "Sem descrições, a escolha piora ainda mais."
  ],
  kw: ["mais de 200 tools", "dezenas de milhares de tokens", "escolher tools erradas"],
  obj: "Escalar o número de tools sem perder precisão.",
  cons: ["Muitas tools", "Contexto e precisão"],
  el: [3],
  concept: "Tool search e defer_loading",
  trap: "Achar que janela de contexto maior resolve a seleção de tools.",
  tip: "Mais de 30–50 tools → tool search com defer_loading.",
  ref: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool",
  ev: "Tool selection accuracy: Claude’s ability to pick the right tool degrades once you exceed 30–50 available tools. Because tool search loads only a focused set of relevant tools on demand, selection accuracy stays high even across thousands of tools.",
  evu: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool"
},
{
  id: "d4-09", d: 4, t: "4", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Uma tool get_customer devolve o registro completo do banco (80 campos, incluindo IDs internos opacos como 'ref_9f2a'). O agente se perde e gasta contexto. Como redesenhar a resposta da tool?",
  o: [
    "Retornar só informações de alto sinal: identificadores semânticos e estáveis (slugs, UUIDs) e apenas os campos de que o Claude precisa para o próximo passo",
    "Retornar o registro completo em XML em vez de JSON",
    "Retornar só o ID interno, para economizar tokens",
    "Retornar o registro completo duas vezes, para reforçar"
  ],
  a: [0],
  w: [
    "As respostas devem trazer identificadores semânticos e estáveis e só os campos necessários para o raciocínio.",
    "O formato não resolve o excesso de campos.",
    "Um ID opaco sozinho não é útil para o raciocínio.",
    "Duplicar só gasta mais contexto."
  ],
  kw: ["80 campos", "IDs internos opacos", "gasta contexto"],
  obj: "Projetar respostas de tools enxutas.",
  cons: ["Contexto", "IDs opacos"],
  el: [3],
  concept: "Respostas de tools com alto sinal",
  trap: "Achar que devolver tudo 'para garantir' ajuda o agente.",
  tip: "Resposta de tool: só o necessário, com IDs com significado.",
  ref: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools",
  ev: "Design tool responses to return only high-signal information. Return semantic, stable identifiers (for example, slugs or UUIDs) rather than opaque internal references, and include only the fields Claude needs to reason about its next step.",
  evu: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools"
},
{
  id: "d4-10", d: 4, t: "4", sc: "Developer Productivity with Claude", lvl: "Desafiadora",
  q: "Uma tool de busca no Slack às vezes precisa devolver IDs (thread_ts, channel_id) para chamadas seguintes, mas na maioria das vezes o agente só precisa do conteúdo. Qual design a Anthropic sugere?",
  o: [
    "Expor um parâmetro enum response_format (ex.: \"concise\" ou \"detailed\") para o agente escolher o nível de detalhe",
    "Sempre devolver a resposta detalhada",
    "Criar duas tools idênticas com nomes diferentes",
    "Nunca devolver IDs"
  ],
  a: [0],
  w: [
    "Um enum response_format deixa o agente controlar se recebe resposta concisa ou detalhada.",
    "Sempre detalhado gasta tokens à toa (no exemplo, ~3× mais).",
    "Tools duplicadas criam ambiguidade.",
    "Sem IDs, chamadas seguintes ficam impossíveis."
  ],
  kw: ["às vezes precisa devolver IDs", "na maioria das vezes", "só precisa do conteúdo"],
  obj: "Equilibrar detalhe e eficiência na resposta da tool.",
  cons: ["IDs às vezes", "Economia de tokens"],
  el: [3],
  concept: "Parâmetro response_format em tools",
  trap: "Resolver com tools duplicadas.",
  tip: "Nível de detalhe variável → enum response_format.",
  ref: "https://www.anthropic.com/engineering/writing-tools-for-agents",
  ev: "You can enable both by exposing a simple response_format enum parameter in your tool, allowing your agent to control whether tools return “concise” or “detailed” responses",
  evu: "https://www.anthropic.com/engineering/writing-tools-for-agents"
},
{
  id: "d4-11", d: 4, t: "4", sc: "Code Generation with Claude Code", lvl: "Intermediária",
  q: "Uma tool search_logs pode devolver milhões de linhas e às vezes estoura o contexto do agente. Qual combinação de práticas a Anthropic recomenda para respostas que podem consumir muito contexto?",
  o: [
    "Paginação, seleção de intervalo, filtragem e/ou truncamento com valores padrão sensatos, orientando o agente quando truncar",
    "Devolver tudo e confiar na compaction",
    "Remover a tool",
    "Comprimir a resposta em base64"
  ],
  a: [0],
  w: [
    "Para respostas grandes, combine paginação, intervalos, filtros e truncamento com bons padrões; o Claude Code limita respostas de tools a 25.000 tokens por padrão.",
    "Compaction é um remédio posterior, não um design de tool.",
    "A tool é necessária.",
    "base64 aumenta o tamanho e é ilegível para o raciocínio."
  ],
  kw: ["milhões de linhas", "estoura o contexto"],
  obj: "Limitar o tamanho das respostas de tools.",
  cons: ["Respostas enormes"],
  el: [3],
  concept: "Eficiência de tokens em respostas de tools",
  trap: "Contar com recursos de contexto em vez de projetar a tool.",
  tip: "Tool que pode devolver muito → paginar/filtrar/truncar com padrões.",
  ref: "https://www.anthropic.com/engineering/writing-tools-for-agents",
  ev: "We suggest implementing some combination of pagination, range selection, filtering, and/or truncation with sensible default parameter values for any tool responses that could use up lots of context. For Claude Code, we restrict tool responses to 25,000 tokens by default.",
  evu: "https://www.anthropic.com/engineering/writing-tools-for-agents"
},
{
  id: "d4-12", d: 4, t: "4", sc: "Developer Productivity with Claude", lvl: "Intermediária",
  q: "Um assistente de agenda tem as tools list_users, list_events e create_event, e quase sempre as encadeia para marcar uma reunião, gastando várias chamadas e contexto. Qual redesign a Anthropic sugere?",
  o: [
    "Uma tool schedule_event que encontra disponibilidade e agenda o evento em uma única chamada",
    "Adicionar uma tool list_all que devolva todos os dados",
    "Manter as três tools e pedir ao Claude para ser rápido",
    "Dividir create_event em mais tools menores"
  ],
  a: [0],
  w: [
    "Tools podem consolidar tarefas multietapa frequentes em uma chamada só.",
    "Listar tudo enche o contexto.",
    "Pedir rapidez não reduz as chamadas necessárias.",
    "Mais tools menores aumentam o encadeamento."
  ],
  kw: ["quase sempre as encadeia", "várias chamadas e contexto"],
  obj: "Consolidar fluxos frequentes.",
  cons: ["Encadeamento frequente"],
  el: [3],
  concept: "Consolidar funcionalidade em tools de alto nível",
  trap: "Espelhar a API interna 1:1 nas tools.",
  tip: "Sequência de chamadas sempre igual → uma tool de mais alto nível.",
  ref: "https://www.anthropic.com/engineering/writing-tools-for-agents",
  ev: "Instead of implementing a list_users, list_events, and create_event tools, consider implementing a schedule_event tool which finds availability and schedules an event.",
  evu: "https://www.anthropic.com/engineering/writing-tools-for-agents"
},
{
  id: "d4-13", d: 4, t: "4", sc: "Multi-Agent Research System", lvl: "Pegadinha",
  q: "Um agente pede 3 buscas em paralelo em uma única resposta. O código cliente devolve cada resultado em uma mensagem de user separada. Com o tempo, o Claude passa a fazer chamadas uma de cada vez. Por quê?",
  o: [
    "Resultados em mensagens separadas 'ensinam' o Claude a evitar chamadas paralelas; todos os resultados devem ir juntos em uma única mensagem de user",
    "A API limita chamadas paralelas a uma por minuto",
    "Chamadas paralelas só funcionam com tool search",
    "É preciso ativar parallel_tool_use: true no topo da requisição"
  ],
  a: [0],
  w: [
    "Formatar resultados em mensagens separadas reduz o uso paralelo; o correto é uma única mensagem com todos os resultados.",
    "Não existe esse limite.",
    "Chamadas paralelas não dependem de tool search.",
    "O paralelismo já é o padrão; o que existe é disable_parallel_tool_use, dentro de tool_choice."
  ],
  kw: ["3 buscas em paralelo", "mensagem de user separada", "uma de cada vez"],
  obj: "Manter o uso de tools em paralelo.",
  cons: ["Formato do histórico"],
  el: [1],
  concept: "Parallel tool use e formato dos resultados",
  trap: "Procurar uma 'flag' em vez de olhar o formato do histórico.",
  tip: "N tool_use paralelos → N tool_result em UMA mensagem de user.",
  ref: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use",
  ev: "Wrong: a separate user message for each tool result Correct: all tool results together in a single user message",
  evu: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/parallel-tool-use"
},
{
  id: "d4-14", d: 4, t: "4", sc: "Developer Productivity with Claude", lvl: "Intermediária",
  q: "Uma equipe vai expor um servidor MCP para centenas de usuários pela internet, e outro servidor que só roda na máquina de cada desenvolvedor, para um único cliente. Qual transporte é típico de cada um?",
  o: [
    "Streamable HTTP para o servidor remoto com muitos clientes; stdio para o servidor local com um cliente",
    "stdio para os dois",
    "stdio para o remoto e Streamable HTTP para o local",
    "WebSocket é obrigatório nos dois casos"
  ],
  a: [0],
  w: [
    "Servidores locais via stdio costumam atender um único cliente; servidores remotos via Streamable HTTP atendem muitos clientes.",
    "stdio é um processo local; não serve centenas de usuários pela internet.",
    "Está invertido.",
    "WebSocket não é o transporte padrão descrito."
  ],
  kw: ["centenas de usuários pela internet", "só roda na máquina de cada desenvolvedor"],
  obj: "Escolher o transporte MCP.",
  cons: ["Remoto vs local"],
  el: [3],
  concept: "Transportes do MCP (stdio e Streamable HTTP)",
  trap: "Inverter os transportes.",
  tip: "Local, um cliente → stdio; remoto, muitos clientes → Streamable HTTP.",
  ref: "https://modelcontextprotocol.io/docs/learn/architecture",
  ev: "Local MCP servers that use the STDIO transport typically serve a single MCP client, whereas remote MCP servers that use the Streamable HTTP transport will typically serve many MCP clients.",
  evu: "https://modelcontextprotocol.io/docs/learn/architecture"
},
{
  id: "d4-15", d: 4, t: "4", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Um servidor MCP de reservas de viagem, no meio de uma operação, precisa perguntar ao usuário a preferência de assento antes de concluir a reserva. Qual recurso do MCP serve para isso?",
  o: [
    "Elicitation, que permite ao servidor pedir informações específicas ao usuário durante a interação",
    "Resources",
    "Prompts",
    "Roots"
  ],
  a: [0],
  w: [
    "Elicitation dá ao servidor uma forma estruturada de pedir informações ao usuário sob demanda.",
    "Resources expõem dados para contexto, não perguntas ao usuário.",
    "Prompts são templates invocados pelo usuário.",
    "Roots indicam diretórios de foco e estão obsoletos desde 2026-07-28."
  ],
  kw: ["no meio de uma operação", "perguntar ao usuário"],
  obj: "Coletar dados do usuário a partir do servidor.",
  cons: ["Durante a operação"],
  el: [3],
  concept: "Elicitation no MCP",
  trap: "Confundir prompts (iniciados pelo usuário) com elicitation (iniciada pelo servidor).",
  tip: "Servidor precisa perguntar algo ao usuário → elicitation.",
  ref: "https://modelcontextprotocol.io/docs/learn/client-concepts",
  ev: "Elicitation enables servers to request specific information from users during interactions, providing a structured way for servers to gather information on demand.",
  evu: "https://modelcontextprotocol.io/docs/learn/client-concepts"
},
{
  id: "d4-16", d: 4, t: "4", sc: "Developer Productivity with Claude", lvl: "Intermediária",
  q: "Um servidor MCP precisa expor o schema do banco de dados e a documentação da API como dados somente leitura, que a aplicação decide como usar como contexto. Qual primitiva usar?",
  o: [
    "Resources",
    "Tools",
    "Prompts",
    "Elicitation"
  ],
  a: [0],
  w: [
    "Resources são fontes de dados passivas, somente leitura, controladas pela aplicação.",
    "Tools são funções que o modelo chama e podem ter efeitos.",
    "Prompts são templates de interação.",
    "Elicitation pede informações ao usuário."
  ],
  kw: ["somente leitura", "a aplicação decide como usar"],
  obj: "Expor dados de contexto via MCP.",
  cons: ["Somente leitura", "Controlado pela aplicação"],
  el: [3],
  concept: "Resources no MCP",
  trap: "Implementar uma tool 'get_schema' para dados estáticos de contexto.",
  tip: "Dado passivo para contexto → resource.",
  ref: "https://modelcontextprotocol.io/docs/learn/server-concepts",
  ev: "Passive data sources that provide read-only access to information for context, such as file contents, database schemas, or API documentation.",
  evu: "https://modelcontextprotocol.io/docs/learn/server-concepts"
},
{
  id: "d4-17", d: 4, t: "4", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Ao revisar o conjunto de tools de um agente, nem os engenheiros do time conseguem dizer com certeza qual tool usar em várias situações. Qual é a conclusão segundo a Anthropic?",
  o: [
    "O conjunto está inchado/ambíguo: se um engenheiro não sabe qual tool usar, não dá para esperar que o agente saiba; é preciso curar um conjunto mínimo e claro",
    "O agente vai resolver a ambiguidade melhor que os humanos",
    "Basta adicionar mais tools para cobrir as dúvidas",
    "O problema é só de temperatura"
  ],
  a: [0],
  w: [
    "Conjuntos inchados e ambíguos são uma das falhas mais comuns; um conjunto mínimo e claro é mais confiável.",
    "Se humanos não decidem, o agente também não.",
    "Mais tools aumentam a ambiguidade.",
    "Temperatura não resolve ambiguidade de design."
  ],
  kw: ["nem os engenheiros do time conseguem dizer"],
  obj: "Diagnosticar um conjunto de tools ruim.",
  cons: ["Ambiguidade"],
  el: [3],
  concept: "Conjunto mínimo e claro de tools",
  trap: "Esperar que o modelo resolva ambiguidades de design.",
  tip: "Teste: um humano saberia qual tool usar? Se não, redesenhe.",
  ref: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
  ev: "One of the most common failure modes we see is bloated tool sets that cover too much functionality or lead to ambiguous decision points about which tool to use. If a human engineer can’t definitively say which tool should be used in a given situation, an AI agent can’t be expected to do better.",
  evu: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
},

/* ---------- Domínio 5: Gerenciamento de contexto e confiabilidade ---------- */
{
  id: "e5-07", d: 5, t: "5", sc: "Multi-Agent Research System", lvl: "Pegadinha",
  q: "Como o modelo tem janela de contexto de 1 milhão de tokens, um time decide colocar no prompt TODA a base de conhecimento em todas as requisições, 'para garantir'. As respostas pioram. Qual fenômeno explica isso?",
  o: [
    "Context rot: à medida que os tokens aumentam, a precisão e a recuperação de informações degradam",
    "Prompt caching expirado",
    "Rate limit por tokens de entrada",
    "Erro 529 de sobrecarga"
  ],
  a: [0],
  w: [
    "Mais contexto não é automaticamente melhor: com mais tokens, precisão e recuperação degradam.",
    "Cache afeta custo e latência, não a qualidade.",
    "Rate limit causa erro 429, não respostas piores.",
    "529 é um erro, não piora de qualidade."
  ],
  kw: ["1 milhão de tokens", "TODA a base de conhecimento", "As respostas pioram"],
  obj: "Entender por que mais contexto pode piorar.",
  cons: ["Contexto enorme"],
  el: [3],
  concept: "Context rot",
  trap: "Achar que janela grande significa usar tudo sempre.",
  tip: "Contexto é recurso finito: cure o que entra.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/context-windows",
  ev: "A larger context window allows the model to handle more complex and lengthy prompts, but more context isn’t automatically better. As token count grows, accuracy and recall degrade, a phenomenon known as context rot.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/context-windows"
},
{
  id: "e5-08", d: 5, t: "5", sc: "Structured Data Extraction", lvl: "Desafiadora",
  q: "Um agente de análise de dados precisa trabalhar com tabelas gigantes que não cabem no contexto. Qual estratégia de contexto a Anthropic descreve para esse caso?",
  o: [
    "Contexto 'just in time': manter identificadores leves (caminhos, consultas, links) e carregar dados sob demanda com tools, por exemplo consultas direcionadas e head/tail",
    "Pré-carregar todas as tabelas no system prompt",
    "Converter as tabelas em imagens",
    "Usar o cache de 1 hora para caber mais dados"
  ],
  a: [0],
  w: [
    "No just in time, o agente guarda referências e carrega dados em tempo de execução, sem trazer objetos inteiros ao contexto.",
    "Não cabe e piora a qualidade.",
    "Imagens não resolvem o volume.",
    "Cache não aumenta a janela de contexto."
  ],
  kw: ["tabelas gigantes", "não cabem no contexto"],
  obj: "Trabalhar com dados maiores que o contexto.",
  cons: ["Volume grande"],
  el: [2],
  concept: "Recuperação de contexto just in time",
  trap: "Achar que cache aumenta o contexto disponível.",
  tip: "Dados grandes → referências leves + carga sob demanda via tools.",
  ref: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
  ev: "Rather than pre-processing all relevant data up front, agents built with the “just in time” approach maintain lightweight identifiers (file paths, stored queries, web links, etc.) and use these references to dynamically load data into context at runtime using tools.",
  evu: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
},
{
  id: "e5-09", d: 5, t: "5", sc: "Code Generation with Claude Code", lvl: "Intermediária",
  q: "Um agente executa uma migração que leva dezenas de etapas e várias sessões. Ele perde o controle do que já foi feito à medida que o contexto é renovado. Qual técnica simples a Anthropic recomenda?",
  o: [
    "Anotações estruturadas (agentic memory): o agente grava notas fora da janela de contexto, como um NOTES.md ou uma lista de tarefas, e as consulta depois",
    "Aumentar o max_tokens",
    "Reiniciar a migração em cada sessão",
    "Desligar a compaction"
  ],
  a: [0],
  w: [
    "Notas persistidas fora do contexto dão memória persistente com pouco overhead e acompanham o progresso.",
    "max_tokens não preserva o estado entre sessões.",
    "Reiniciar desperdiça o trabalho feito.",
    "Desligar a compaction não resolve a falta de memória entre sessões."
  ],
  kw: ["dezenas de etapas e várias sessões", "perde o controle do que já foi feito"],
  obj: "Manter o estado de tarefas longas.",
  cons: ["Várias sessões"],
  el: [2],
  concept: "Structured note-taking (agentic memory)",
  trap: "Achar que o contexto basta como memória de longo prazo.",
  tip: "Tarefas longas e multissessão → notas persistidas (NOTES.md, to-do).",
  ref: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
  ev: "Structured note-taking, or agentic memory, is a technique where the agent regularly writes notes persisted to memory outside of the context window. These notes get pulled back into the context window at later times.",
  evu: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
},
{
  id: "e5-10", d: 5, t: "5", sc: "Structured Data Extraction", lvl: "Pegadinha",
  q: "Um job envia 10 mil requisições em um Message Batch e grava os resultados na ordem em que chegam, assumindo a mesma ordem do envio. Alguns documentos ficam com os dados de outros. Qual é a correção?",
  o: [
    "Associar cada resultado à requisição pelo custom_id, porque os resultados podem vir em qualquer ordem",
    "Enviar lotes de uma requisição só",
    "Ordenar os resultados por tamanho",
    "Usar streaming no batch"
  ],
  a: [0],
  w: [
    "Os resultados podem não seguir a ordem de envio; use sempre o custom_id para casar resultados e requisições.",
    "Lotes unitários perdem o propósito do batch.",
    "Tamanho não identifica a requisição.",
    "O batch é assíncrono; streaming não se aplica aos resultados."
  ],
  kw: ["na ordem em que chegam", "mesma ordem do envio", "dados de outros"],
  obj: "Casar resultados de batch com as requisições.",
  cons: ["Ordem não garantida"],
  el: [2],
  concept: "custom_id na Message Batches API",
  trap: "Assumir ordem de saída igual à de entrada.",
  tip: "Batch → sempre case pelo custom_id.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/batch-processing",
  ev: "Batch results can be returned in any order, and may not match the ordering of requests when the batch was created. In the preceding example, the result for the second batch request is returned before the first. To correctly match results with their corresponding requests, always use the custom_id field.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/batch-processing"
},
{
  id: "e5-11", d: 5, t: "5", sc: "Structured Data Extraction", lvl: "Intermediária",
  q: "Algumas respostas de um pipeline de geração de relatórios chegam cortadas no meio. Ao inspecionar, o stop_reason dessas respostas é max_tokens. O que fazer?",
  o: [
    "Aumentar o max_tokens ou continuar a resposta a partir de onde parou",
    "Tratar como erro 500 e repetir igual",
    "Diminuir o max_tokens",
    "Ignorar: o relatório está completo"
  ],
  a: [0],
  w: [
    "max_tokens indica que a resposta atingiu o limite; aumente-o ou continue a resposta.",
    "Não é erro do servidor; repetir igual dá o mesmo corte.",
    "Diminuir piora o corte.",
    "A resposta foi truncada."
  ],
  kw: ["cortadas no meio", "max_tokens"],
  obj: "Tratar respostas truncadas.",
  cons: ["Respostas longas"],
  el: [3],
  concept: "Stop reasons: max_tokens",
  trap: "Tratar truncamento como falha transitória.",
  tip: "Sempre cheque stop_reason; max_tokens = resposta incompleta.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons",
  ev: "max_tokens | The response reached your max_tokens limit. | Raise max_tokens or continue the response.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons"
},
{
  id: "e5-12", d: 5, t: "5", sc: "Multi-Agent Research System", lvl: "Intermediária",
  q: "Requisições não streaming que geram relatórios muito longos às vezes falham por tempo limite antes de a resposta começar. Qual é a recomendação da documentação para requisições longas?",
  o: [
    "Usar a Messages API com streaming",
    "Diminuir o max_tokens para valores muito baixos",
    "Repetir a requisição imediatamente várias vezes",
    "Dividir o relatório em requisições de um parágrafo cada, sem contexto"
  ],
  a: [0],
  w: [
    "Para requisições longas, a recomendação é usar streaming.",
    "Valores baixos truncam o relatório.",
    "Repetir causa o mesmo timeout.",
    "Sem contexto, a coerência se perde."
  ],
  kw: ["não streaming", "relatórios muito longos", "tempo limite"],
  obj: "Evitar timeouts em respostas longas.",
  cons: ["Respostas longas"],
  el: [2],
  concept: "Streaming para requisições longas",
  trap: "Achar que streaming é só para UX em tempo real.",
  tip: "Saída longa ou max_tokens alto → streaming.",
  ref: "https://platform.claude.com/docs/en/api/errors",
  ev: "For long-running Messages API requests, use the streaming Messages API.",
  evu: "https://platform.claude.com/docs/en/api/errors"
},
{
  id: "e5-13", d: 5, t: "5", sc: "Developer Productivity with Claude", lvl: "Intermediária",
  q: "Um roteador decide se cada pedido vai para um modelo menor ou maior conforme o tamanho do prompt, e também precisa ajustar prompts a um tamanho-alvo. Como medir os tokens ANTES de enviar a requisição?",
  o: [
    "Usar a API de token counting",
    "Estimar 1 token por palavra",
    "Enviar a requisição e ler usage na resposta",
    "Contar caracteres e dividir por 10"
  ],
  a: [0],
  w: [
    "A token counting conta os tokens antes do envio e serve para rate limits, custos, roteamento e ajuste de tamanho.",
    "Estimativas grosseiras erram, ainda mais com tokenizers novos.",
    "Ler usage só funciona depois de já ter pago a requisição.",
    "Regra fixa não reflete o tokenizer."
  ],
  kw: ["ANTES de enviar"],
  obj: "Medir tokens antes do envio.",
  cons: ["Antes do envio", "Roteamento"],
  el: [3],
  concept: "Token counting",
  trap: "Usar heurísticas de caracteres ou palavras.",
  tip: "Precisa saber o tamanho antes → count_tokens.",
  ref: "https://platform.claude.com/docs/en/build-with-claude/token-counting",
  ev: "Count the tokens in a message before you send it to Claude. Use token counts to manage rate limits and costs, make model routing decisions, and fit prompts to a target length.",
  evu: "https://platform.claude.com/docs/en/build-with-claude/token-counting"
},
{
  id: "e5-14", d: 5, t: "5", sc: "Structured Data Extraction", lvl: "Desafiadora",
  q: "Uma aplicação nova passa de quase nenhum tráfego para milhares de requisições por minuto de uma vez e recebe 429 mesmo abaixo dos limites do tier. Qual é a causa provável e a orientação?",
  o: [
    "Acceleration limits por aumento brusco de uso; aumentar o tráfego gradualmente e manter um padrão consistente",
    "A API key expirou",
    "O modelo foi descontinuado",
    "O 429 indica erro no JSON da requisição"
  ],
  a: [0],
  w: [
    "Um aumento brusco de uso pode gerar 429 por acceleration limits; a orientação é crescer gradualmente.",
    "Chave inválida gera 401.",
    "Modelo inexistente gera outro erro, não 429.",
    "Erro de formato gera 400."
  ],
  kw: ["de uma vez", "429", "abaixo dos limites do tier"],
  obj: "Diagnosticar 429 em picos repentinos.",
  cons: ["Aumento brusco"],
  el: [3],
  concept: "Acceleration limits",
  trap: "Achar que 429 só acontece acima do limite do tier.",
  tip: "Rampa de tráfego gradual evita 429 por aceleração.",
  ref: "https://platform.claude.com/docs/en/api/errors",
  ev: "In rare cases, if your organization has a sharp increase in usage, you might see 429 errors because of acceleration limits on the API. To avoid hitting acceleration limits, increase your traffic gradually and maintain consistent usage patterns.",
  evu: "https://platform.claude.com/docs/en/api/errors"
},
{
  id: "e5-15", d: 5, t: "5", sc: "Customer Support Resolution Agent", lvl: "Intermediária",
  q: "Após atingir o rate limit, um engenheiro supõe que a capacidade só volta no início do próximo minuto e programa o sistema para parar até lá. Como a API realmente repõe a capacidade?",
  o: [
    "Pelo algoritmo token bucket: a capacidade é reposta continuamente até o limite máximo, não zerada em intervalos fixos",
    "Zera a cada minuto cheio",
    "Zera a cada hora cheia",
    "Só volta depois de um pedido ao suporte"
  ],
  a: [0],
  w: [
    "A API usa token bucket: a capacidade é reposta continuamente até o máximo.",
    "Não há reset em intervalos fixos.",
    "Também não há reset por hora.",
    "Não é preciso pedir nada ao suporte."
  ],
  kw: ["início do próximo minuto", "Como a API realmente repõe"],
  obj: "Entender a reposição do rate limit.",
  cons: ["Rate limit"],
  el: [3],
  concept: "Rate limits com token bucket",
  trap: "Supor janelas fixas de reset.",
  tip: "Rate limit = token bucket (reposição contínua) + retry com backoff.",
  ref: "https://platform.claude.com/docs/en/api/rate-limits",
  ev: "The API uses the token bucket algorithm to do rate limiting. This means that your capacity is continuously replenished up to your maximum limit, rather than being reset at fixed intervals.",
  evu: "https://platform.claude.com/docs/en/api/rate-limits"
}
);
