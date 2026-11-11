// Comparador de serviços (estrutura inspirada no modo service-comparator do Kiro Study Buddy)
// svc: [[nome, resumo]], rows: [[aspecto, valor1, valor2, ...]], kw: palavras-chave → escolha
CMP.push(
{
  id: "c-sqs-sns-eb", d: [1, 4], title: "SQS vs SNS vs EventBridge",
  svc: [
    ["Amazon SQS", "Fila: guarda mensagens até um consumidor buscá-las (pull)."],
    ["Amazon SNS", "Pub/sub: empurra (push) cada mensagem para todos os assinantes."],
    ["Amazon EventBridge", "Barramento de eventos: roteia eventos por regras de conteúdo para vários alvos, inclusive SaaS e agendamentos."]
  ],
  rows: [
    ["Modelo", "Pull, 1 consumidor por mensagem", "Push, N assinantes", "Push por regras, N alvos"],
    ["Retenção/buffer", "Sim (dias)", "Não guarda mensagens", "Não é fila (tem archive/replay)"],
    ["Filtragem", "Não (no consumidor)", "Filter policies por assinatura", "Event patterns ricos por regra"],
    ["Ordem", "FIFO opcional", "Tópico FIFO opcional", "Sem garantia de ordem"],
    ["Escolha quando", "Desacoplar e absorver picos", "Fanout simples e notificações", "Integração orientada a eventos, SaaS e cron"]
  ],
  kw: [
    ["buffer, picos, processar no próprio ritmo, worker", "SQS"],
    ["fanout, notificar vários assinantes, email/SMS", "SNS"],
    ["eventos de serviços AWS/SaaS, roteamento por conteúdo, agendamento", "EventBridge"]
  ],
  traps: "Uma fila com vários consumidores NÃO entrega a mesma mensagem para todos. Para isso: SNS → SQS (fanout).",
  analogy: "SQS é a caixa de correio; SNS é o alto-falante; EventBridge é a central que lê o envelope e decide para quem encaminhar.",
  decide: ["Precisa guardar até processar? → SQS", "Mesma mensagem para vários? → SNS (+ SQS para buffer)", "Rotear por conteúdo, eventos AWS/SaaS ou cron? → EventBridge"],
  ref: "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html"
},
{
  id: "c-sqs-std-fifo", d: [1], title: "SQS Standard vs SQS FIFO",
  svc: [
    ["SQS Standard", "Vazão praticamente ilimitada, entrega pelo menos uma vez, ordem por melhor esforço."],
    ["SQS FIFO", "Ordem garantida por message group e deduplicação (processamento exatamente uma vez)."]
  ],
  rows: [
    ["Ordem", "Melhor esforço", "Garantida por MessageGroupId"],
    ["Duplicatas", "Possíveis", "Deduplicação por ID ou conteúdo (janela de 5 min)"],
    ["Vazão", "Praticamente ilimitada", "Limitada (maior com batching/alta vazão)"],
    ["Nome", "Qualquer", "Precisa terminar em .fifo"]
  ],
  kw: [["ordem, exatamente uma vez, sem duplicatas", "FIFO"], ["máxima vazão, a ordem não importa", "Standard"]],
  traps: "Mesmo na FIFO, se o visibility timeout expirar antes do DeleteMessage, a mensagem reaparece.",
  analogy: "Standard é uma pilha de cartas jogadas numa caixa; FIFO é uma fila de banco com senha.",
  decide: ["Precisa de ordem ou deduplicação? → FIFO", "Senão → Standard"],
  ref: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-fifo-queues.html"
},
{
  id: "c-cognito", d: [2], title: "Cognito: user pool vs identity pool",
  svc: [
    ["User pool", "Diretório de usuários: cadastro, login, MFA, emite JWTs (ID/access token)."],
    ["Identity pool", "Troca uma identidade (do user pool, Google, SAML...) por credenciais AWS temporárias de uma role IAM."]
  ],
  rows: [
    ["Resultado", "Tokens JWT", "Credenciais AWS (STS)"],
    ["Uso típico", "Autenticar no app ou na API (authorizer)", "Acessar S3/DynamoDB direto do app"],
    ["Convidados", "Não", "Sim (identidades não autenticadas)"]
  ],
  kw: [["login, cadastro, JWT, authorizer do API Gateway", "User pool"], ["credenciais AWS temporárias, acesso direto ao S3, convidado", "Identity pool"]],
  traps: "O identity pool não faz login sozinho: ele confia num provedor (que pode ser o user pool).",
  analogy: "O user pool é a portaria que confere seu documento; o identity pool é o crachá temporário que abre portas específicas da AWS.",
  decide: ["Quem é o usuário? → user pool", "O que ele pode fazer na AWS diretamente? → identity pool"],
  ref: "https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html"
},
{
  id: "c-secrets", d: [2], title: "Secrets Manager vs Parameter Store",
  svc: [
    ["AWS Secrets Manager", "Segredos com rotação automática gerenciada (ex.: RDS) e replicação entre Regiões."],
    ["SSM Parameter Store", "Configurações hierárquicas e segredos (SecureString) com baixo custo."]
  ],
  rows: [
    ["Rotação automática", "Sim (nativa para RDS e outros, ou via Lambda)", "Não nativa"],
    ["Custo", "Por segredo/mês + chamadas", "Standard sem custo adicional de armazenamento"],
    ["Criptografia", "KMS sempre", "KMS em SecureString"],
    ["Hierarquia", "Nomes livres", "Caminhos (/app/prod/db)"]
  ],
  kw: [["rotação automática, credenciais de banco", "Secrets Manager"], ["menor custo, configurações, hierarquia, sem rotação", "Parameter Store"]],
  traps: "\"Sensível\" não significa automaticamente Secrets Manager: veja se a questão pede rotação ou custo.",
  analogy: "O Secrets Manager é o cofre que troca o segredo sozinho; o Parameter Store é o armário trancado e organizado.",
  decide: ["Rotação? → Secrets Manager", "Custo e configuração? → Parameter Store"],
  ref: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html"
},
{
  id: "c-concurrency", d: [1, 4], title: "Lambda: reserved vs provisioned concurrency",
  svc: [
    ["Reserved concurrency", "Reserva e limita o número máximo de execuções simultâneas de uma função."],
    ["Provisioned concurrency", "Mantém ambientes pré-inicializados prontos, eliminando cold starts."]
  ],
  rows: [
    ["Resolve", "Garantia/limite de capacidade", "Latência de cold start"],
    ["Custo extra", "Não", "Sim (enquanto configurada)"],
    ["Onde configura", "Na função", "Em versão ou alias"],
    ["Efeito colateral", "Também é teto (0 = função desligada)", "Acima do provisionado, volta ao on-demand"]
  ],
  kw: [["garantir capacidade, não deixar outra função consumir tudo, limitar, proteger downstream", "Reserved"], ["cold start, latência consistente, primeiras requisições", "Provisioned"]],
  traps: "Reserved concurrency NÃO pré-aquece nada.",
  analogy: "Reserved é reservar mesas no restaurante; provisioned é deixar a comida já pronta na mesa.",
  decide: ["Problema de throttling entre funções? → reserved", "Problema de latência inicial? → provisioned"],
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html"
},
{
  id: "c-gsi-lsi", d: [1], title: "DynamoDB: GSI vs LSI",
  svc: [
    ["GSI", "Índice com chave de partição (e de ordenação) diferente da tabela."],
    ["LSI", "Mesma chave de partição da tabela, com outra chave de ordenação."]
  ],
  rows: [
    ["Quando criar", "A qualquer momento", "Somente na criação da tabela"],
    ["Chave de partição", "Diferente", "A mesma"],
    ["Consistência", "Apenas eventual", "Eventual ou forte"],
    ["Capacidade", "Própria (separada)", "Compartilha com a tabela"]
  ],
  kw: [["nova chave de acesso, tabela existente", "GSI"], ["mesma partição, outra ordenação, leitura forte no índice", "LSI"]],
  traps: "Tabela já existente → LSI está fora de cogitação.",
  analogy: "O GSI é um novo catálogo da biblioteca; o LSI é reordenar a mesma prateleira por outro critério.",
  decide: ["Tabela existe ou partition key diferente? → GSI", "Mesma partição + leitura forte? → LSI (na criação)"],
  ref: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html"
},
{
  id: "c-query-scan", d: [1, 4], title: "DynamoDB: Query vs Scan",
  svc: [
    ["Query", "Busca itens de UMA partição pela chave (com condição opcional na sort key)."],
    ["Scan", "Lê a tabela (ou índice) inteira e filtra depois."]
  ],
  rows: [
    ["Custo", "Proporcional ao resultado", "Proporcional à tabela toda"],
    ["Requer", "Valor da partition key", "Nada"],
    ["FilterExpression", "Depois da leitura", "Depois da leitura (paga tudo)"],
    ["Acelerar", "Modelar chaves e GSI", "Parallel scan (ainda lê tudo)"]
  ],
  kw: [["eficiente, menor custo, por cliente/entidade", "Query"], ["exportar ou analisar tudo, sem chave", "Scan"]],
  traps: "A FilterExpression não reduz RCU consumida.",
  analogy: "Query é ir direto à gaveta etiquetada; Scan é abrir todas as gavetas.",
  decide: ["Tem a chave? → Query", "Não tem? → crie um GSI ou aceite o Scan"],
  ref: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-query-scan.html"
},
{
  id: "c-dax-elasticache", d: [1, 4], title: "DAX vs ElastiCache",
  svc: [
    ["DynamoDB Accelerator (DAX)", "Cache em memória compatível com a API do DynamoDB."],
    ["Amazon ElastiCache", "Cache em memória genérico (Redis OSS/Valkey/Memcached) para qualquer fonte."]
  ],
  rows: [
    ["Mudança de código", "Mínima (trocar o cliente)", "Lógica de cache na aplicação"],
    ["Fonte de dados", "Só DynamoDB", "Qualquer (RDS, APIs, cálculos)"],
    ["Latência", "Microssegundos", "Sub-milissegundo"],
    ["Uso extra", "—", "Sessões, rankings, pub/sub"]
  ],
  kw: [["DynamoDB, microssegundos, mínima mudança", "DAX"], ["RDS, sessões, cache genérico, lazy loading/write-through", "ElastiCache"]],
  traps: "Para DynamoDB com mínima mudança de código, ElastiCache é distrator clássico.",
  analogy: "O DAX é um acessório feito sob medida para o DynamoDB; o ElastiCache é uma caixa de ferramentas universal.",
  decide: ["DynamoDB + pouco código? → DAX", "Outro banco ou caso genérico? → ElastiCache"],
  ref: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html"
},
{
  id: "c-dlq-dest", d: [1], title: "Lambda: DLQ vs Destinations",
  svc: [
    ["Dead-letter queue", "Envia o evento que falhou (após as retentativas) para SQS ou SNS."],
    ["Destinations", "Envia um registro da invocação (requisição + resposta) para SQS, SNS, Lambda, EventBridge (e S3 em falhas) em caso de sucesso ou de falha."]
  ],
  rows: [
    ["Condições", "Só falha", "Sucesso e falha"],
    ["Conteúdo", "Payload do evento", "Registro com detalhes de requisição e resposta"],
    ["Alvos", "SQS, SNS", "SQS, SNS, Lambda, EventBridge, S3"],
    ["Aplica-se a", "Invocações assíncronas", "Assíncronas (e falhas de alguns event source mappings)"]
  ],
  kw: [["sucesso e falha, detalhes da resposta, EventBridge", "Destinations"], ["guardar eventos com falha", "DLQ (ou Destination OnFailure)"]],
  traps: "Para SQS como origem (event source mapping), a DLQ deve ficar na fila de origem, não na função.",
  analogy: "A DLQ é a caixa de achados e perdidos; Destinations é o relatório de entrega com cópia para cada setor.",
  decide: ["Precisa do resultado de sucesso? → Destinations", "Só guardar falhas? → DLQ ou OnFailure"],
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-retain-records.html"
},
{
  id: "c-s3-enc", d: [2], title: "S3: SSE-S3 vs SSE-KMS vs SSE-C vs client-side",
  svc: [
    ["SSE-S3", "O S3 gerencia as chaves (padrão para novos objetos)."],
    ["SSE-KMS", "Chaves do KMS, com key policy, auditoria no CloudTrail e controle de rotação."],
    ["SSE-C", "Você envia a chave em cada requisição (HTTPS obrigatório); a AWS não a guarda."],
    ["Client-side", "Você criptografa antes de enviar; o S3 recebe dados já cifrados."]
  ],
  rows: [
    ["Quem guarda a chave", "AWS (S3)", "AWS KMS", "Você", "Você (ou KMS no cliente)"],
    ["Auditoria de uso", "Não", "Sim (CloudTrail)", "Não", "Depende"],
    ["Controle de acesso à chave", "Não", "Key policy/IAM", "Seu", "Seu"]
  ],
  kw: [["mais simples, sem gerenciar", "SSE-S3"], ["auditoria, controle, rotação, key policy", "SSE-KMS"], ["cliente fornece a chave, a AWS não pode guardar", "SSE-C"], ["dados nunca em claro na AWS", "Client-side"]],
  traps: "Uma carga muito alta de SSE-KMS pode bater em cotas do KMS (S3 Bucket Keys reduzem as chamadas).",
  analogy: "SSE-S3: o hotel guarda a chave. SSE-KMS: um cofre com registro de quem abriu. SSE-C: você leva a chave no bolso. Client-side: você já entrega a mala trancada.",
  decide: ["Auditoria/controle? → SSE-KMS", "Chave própria fora da AWS? → SSE-C ou client-side", "Padrão simples? → SSE-S3"],
  ref: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/serv-side-encryption.html"
},
{
  id: "c-eb-deploy", d: [3], title: "Elastic Beanstalk: políticas de implantação",
  svc: [
    ["All at once", "Todas as instâncias de uma vez (mais rápido, com indisponibilidade)."],
    ["Rolling", "Em lotes; a capacidade cai durante a implantação."],
    ["Rolling + additional batch", "Lote extra novo para manter a capacidade total."],
    ["Immutable", "Instâncias novas em um ASG temporário; rollback encerra as novas."],
    ["Traffic splitting", "Instâncias novas recebem um % do tráfego (canary) antes da troca total."]
  ],
  rows: [
    ["Downtime", "Sim", "Não", "Não", "Não", "Não"],
    ["Capacidade total", "Não", "Não", "Sim", "Sim", "Sim"],
    ["Rollback", "Reimplantar", "Reimplantar", "Reimplantar", "Encerrar novas", "Reverter o tráfego"],
    ["Custo extra", "Não", "Não", "Pouco", "Alto (temporário)", "Alto (temporário)"]
  ],
  kw: [["mais rápido, dev", "All at once"], ["sem custo extra, aceita menos capacidade", "Rolling"], ["capacidade total, custo controlado", "Rolling + batch"], ["rollback rápido, instâncias novas", "Immutable"], ["% do tráfego, canary", "Traffic splitting"]],
  traps: "Blue/green no Beanstalk = dois ambientes + Swap Environment URLs (troca de CNAME), não é uma política.",
  analogy: "Trocar todos os pneus de uma vez (all at once), um por um (rolling) ou montar um carro novo e só depois passar para ele (immutable).",
  decide: ["Downtime ok? → All at once", "Capacidade total? → Rolling + batch / Immutable", "Testar com % de tráfego? → Traffic splitting"],
  ref: "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.deploy-existing-version.html"
},
{
  id: "c-codedeploy", d: [3], title: "CodeDeploy (Lambda/ECS): canary vs linear vs all-at-once",
  svc: [
    ["Canary", "Desloca X% do tráfego, espera N minutos e depois move o restante (ex.: Canary10Percent5Minutes)."],
    ["Linear", "Desloca X% a cada N minutos em incrementos iguais (ex.: Linear10PercentEvery1Minute)."],
    ["All-at-once", "Todo o tráfego de uma vez."]
  ],
  rows: [
    ["Passos", "2", "Vários iguais", "1"],
    ["Exposição ao risco", "Baixa no 1º passo", "Gradual", "Total"],
    ["Rollback", "Por alarmes ou hooks", "Por alarmes ou hooks", "Por alarmes (após o deslocamento)"]
  ],
  kw: [["teste pequeno e depois tudo", "Canary"], ["aumentar aos poucos, de forma constante", "Linear"], ["imediato", "AllAtOnce"]],
  traps: "No EC2/on-premises, as configurações são AllAtOnce, HalfAtATime e OneAtATime (in-place), não canary/linear.",
  analogy: "Canary: provar uma colher antes de servir. Linear: servir prato por prato. All-at-once: servir o banquete inteiro.",
  decide: ["Validar com amostra pequena? → canary", "Rampa constante? → linear"],
  ref: "https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html"
},
{
  id: "c-sfn", d: [1], title: "Step Functions: Standard vs Express",
  svc: [
    ["Standard", "Fluxos longos e auditáveis, execução exatamente uma vez, histórico visual."],
    ["Express", "Alto volume e curta duração (até 5 min), cobrança por execução e duração."]
  ],
  rows: [
    ["Duração máxima", "1 ano", "5 minutos"],
    ["Semântica", "Exatamente uma vez", "Pelo menos uma vez (assíncrono) / no máximo uma vez (síncrono)"],
    ["Histórico", "No console", "No CloudWatch Logs"],
    ["Uso típico", "Pedidos, aprovação humana", "Ingestão de eventos, IoT, streaming"]
  ],
  kw: [["dias, aprovação humana, auditoria", "Standard"], ["milhares de eventos por segundo, curto", "Express"]],
  traps: "Espera longa (callback, Wait) elimina o Express.",
  analogy: "Standard é um processo cartorial com protocolo; Express é a esteira de fábrica.",
  decide: ["Mais de 5 min ou humano no fluxo? → Standard", "Curto e massivo? → Express"],
  ref: "https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html"
},
{
  id: "c-apigw-auth", d: [2], title: "API Gateway: IAM vs Cognito vs Lambda authorizer",
  svc: [
    ["IAM (SigV4)", "O chamador assina com credenciais AWS; a policy IAM decide."],
    ["Cognito authorizer", "Valida JWT de um Cognito user pool sem código."],
    ["Lambda authorizer", "Sua função valida qualquer token ou parâmetro e retorna uma policy."]
  ],
  rows: [
    ["Quem chama", "Serviços/roles AWS", "Usuários do user pool", "Qualquer"],
    ["Código", "Nenhum", "Nenhum", "Sim"],
    ["Cache", "—", "—", "Sim (TTL)"]
  ],
  kw: [["serviço a serviço, roles, SigV4", "IAM"], ["user pool, JWT, sem código", "Cognito"], ["token de terceiros, lógica customizada, headers", "Lambda authorizer"]],
  traps: "API keys + usage plans são para cotas e identificação, não para autenticação.",
  analogy: "IAM é o crachá da empresa, Cognito é o ingresso emitido pela própria bilheteria e o Lambda authorizer é o segurança que confere qualquer documento.",
  decide: ["Chamador AWS? → IAM", "Usuários Cognito? → Cognito authorizer", "Outro esquema? → Lambda authorizer"],
  ref: "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-control-access-to-api.html"
},
{
  id: "c-xray", d: [4], title: "X-Ray: annotations vs metadata",
  svc: [
    ["Annotations", "Pares chave-valor indexados (string, número, booleano) usados em filter expressions."],
    ["Metadata", "Qualquer objeto, não indexado, para contexto extra."]
  ],
  rows: [
    ["Indexado", "Sim", "Não"],
    ["Pesquisável", "Sim (filter expressions, grupos)", "Não"],
    ["Tipos", "Simples", "Qualquer (objetos, listas)"]
  ],
  kw: [["filtrar, buscar traces por X", "Annotation"], ["guardar contexto ou objeto de depuração", "Metadata"]],
  traps: "Se a questão diz \"pesquisar\" ou \"filtrar\", nunca é metadata.",
  analogy: "Annotation é a etiqueta na caixa; metadata é o conteúdo dentro dela.",
  decide: ["Vai filtrar? → annotation", "Senão → metadata"],
  ref: "https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html"
},
{
  id: "c-kinesis-sqs", d: [1], title: "Kinesis Data Streams vs SQS",
  svc: [
    ["Kinesis Data Streams", "Stream de dados com shards, ordem por partition key, vários consumidores lendo os mesmos dados e replay."],
    ["Amazon SQS", "Fila de mensagens: cada mensagem é processada e excluída por um consumidor."]
  ],
  rows: [
    ["Releitura (replay)", "Sim, dentro da retenção", "Não (excluída após o processamento)"],
    ["Vários consumidores dos mesmos dados", "Sim", "Não (use fanout)"],
    ["Ordem", "Por shard (partition key)", "Só na FIFO"],
    ["Escala", "Shards (ou on-demand)", "Automática"]
  ],
  kw: [["tempo real, analytics, replay, vários consumidores, ordem por chave", "Kinesis"], ["desacoplar tarefas, workers, tarefas independentes", "SQS"]],
  traps: "Hot shard: uma partition key de baixa cardinalidade concentra a carga num único shard.",
  analogy: "O Kinesis é uma gravação que todos podem assistir e voltar; a SQS é uma pilha de tarefas que alguém pega e risca.",
  decide: ["Replay ou vários leitores? → Kinesis", "Fila de trabalho? → SQS"],
  ref: "https://docs.aws.amazon.com/streams/latest/dev/introduction.html"
}
);
