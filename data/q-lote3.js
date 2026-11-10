// Lote 3 — foco em D4 (troubleshooting/otimização) e múltipla resposta.
// Escrito a partir das páginas oficiais; cada questão traz a citação literal em ev/evu.
QB.push(
/* ---------- Domínio 4: Solução de problemas e otimização ---------- */
{
  id: "d4-16", d: 4, t: "4.1", lvl: "Intermediária",
  q: "Uma função Lambda configurada com reserved concurrency de 50 começou a falhar em horários de pico. Os clientes recebem TooManyRequestsException e a métrica Throttles subiu. No CloudWatch, a métrica ConcurrentExecutions (estatística Max) fica travada em 50 nesses horários. Qual é a causa mais provável e a correção?",
  o: [
    "A função atingiu o limite de reserved concurrency; aumentar a reserved concurrency (ou remover o limite) se a conta tiver concorrência disponível",
    "A memória está baixa demais; aumentar a memória elimina os throttles",
    "O timeout da função é curto; aumentar o timeout para 15 minutos",
    "O API Gateway está fazendo cache das respostas de erro"
  ],
  a: [0],
  w: [
    "Quando ConcurrentExecutions chega à reserved concurrency da função, a Lambda faz throttle das requisições adicionais.",
    "Throttle por concorrência não se resolve com memória; o sinal é ConcurrentExecutions colado no limite.",
    "Timeout maior faz cada execução ocupar a concorrência por mais tempo, piorando o throttle.",
    "TooManyRequestsException vem da Lambda, não de cache do API Gateway."
  ],
  kw: ["reserved concurrency de 50", "TooManyRequestsException", "Throttles", "ConcurrentExecutions", "travada em 50"],
  obj: "Diagnosticar a causa dos throttles da função.",
  cons: ["Limite de 50", "Picos de tráfego"],
  el: [3],
  concept: "Métricas de concorrência e throttling da Lambda",
  trap: "Reserved concurrency também é um TETO para a função, não só uma garantia.",
  tip: "Throttles + ConcurrentExecutions no teto = limite de concorrência (da função ou da Região).",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics-types.html",
  ev: "ConcurrentExecutions – The number of Event Function instances that are processing events. If this number reaches your concurrent executions quota for the Region, or the reserved concurrency limit on the Event Function, then Lambda throttles additional invocation requests.",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics-types.html"
},
{
  id: "d4-17", d: 4, t: "4.3", lvl: "Intermediária",
  q: "Um desenvolvedor suspeita que uma função Lambda está lenta por falta de CPU e memória, e quer ver métricas de sistema (CPU time, memória, disco e rede) e informações de cold start por invocação, sem instrumentar o código manualmente. O que deve usar?",
  o: [
    "Amazon CloudWatch Lambda Insights, habilitado na função (extensão fornecida como layer)",
    "AWS CloudTrail com data events da Lambda",
    "Apenas a métrica Duration padrão da Lambda",
    "AWS Config com regras gerenciadas para Lambda"
  ],
  a: [0],
  w: [
    "O Lambda Insights coleta métricas de sistema e diagnósticos como cold starts, por meio de uma extensão em layer.",
    "O CloudTrail registra chamadas de API (quem fez o quê), não uso de CPU e memória.",
    "Duration mostra o tempo, mas não CPU, memória, disco ou rede.",
    "O AWS Config avalia configuração e conformidade, não desempenho em tempo de execução."
  ],
  kw: ["falta de CPU e memória", "métricas de sistema", "cold start", "sem instrumentar o código"],
  obj: "Fazer o profiling de desempenho da função.",
  cons: ["Sem alterar código", "Métricas de sistema"],
  el: [3],
  concept: "CloudWatch Lambda Insights",
  trap: "CloudTrail é auditoria de API; não mede desempenho.",
  tip: "CPU/memória/rede/cold start da Lambda sem código → Lambda Insights.",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/monitoring-insights.html",
  ev: "The solution collects, aggregates, and summarizes system-level metrics including CPU time, memory, disk and network usage. It also collects, aggregates, and summarizes diagnostic information such as cold starts and Lambda worker shutdowns",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/monitoring-insights.html"
},
{
  id: "d4-18", d: 4, t: "4.2", lvl: "Intermediária", multi: true,
  q: "Uma equipe quer enviar em tempo real os eventos de um log group do CloudWatch Logs que correspondam a um padrão para outro serviço processar, usando uma subscription filter. Quais DOIS destinos são suportados DIRETAMENTE por uma subscription filter de log group? (Selecione DOIS.)",
  o: [
    "Amazon Kinesis Data Streams",
    "AWS Lambda",
    "Amazon SQS",
    "Amazon SNS",
    "Um bucket do Amazon S3, sem serviço intermediário"
  ],
  a: [0, 1],
  w: [
    "Kinesis Data Streams é um dos destinos suportados por subscription filters.",
    "A Lambda é destino suportado e recebe os dados em base64 e compactados com gzip.",
    "SQS não está entre os destinos de subscription filter.",
    "SNS não está entre os destinos de subscription filter.",
    "Para chegar ao S3, usa-se o Amazon Data Firehose como destino da subscription."
  ],
  kw: ["em tempo real", "subscription filter", "DIRETAMENTE"],
  obj: "Escolher destinos válidos para streaming de logs.",
  cons: ["Tempo real", "Destino direto"],
  el: [3],
  concept: "Subscription filters do CloudWatch Logs",
  trap: "S3 só é alcançado via Data Firehose; SQS e SNS não são destinos de subscription.",
  tip: "Subscription filter → Kinesis Data Streams, Lambda, Data Firehose ou OpenSearch.",
  ref: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html",
  ev: "You can use a subscription filter with Amazon Kinesis Data Streams, AWS Lambda, Amazon Data Firehose, or Amazon OpenSearch Service. Logs sent to a service through a subscription filter are compressed with the gzip format.",
  evu: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html"
},
{
  id: "d4-19", d: 4, t: "4.2", lvl: "Pegadinha",
  q: "Uma equipe mudou o log format de uma função Lambda em Python de texto para JSON, para ter logs estruturados. Não configuraram nenhum nível de log. Depois da mudança, as mensagens logger.debug() não aparecem no CloudWatch Logs. Por quê?",
  o: [
    "Com formato JSON e sem nível configurado, a Lambda define o nível de log da aplicação como INFO, então mensagens DEBUG são filtradas",
    "O formato JSON só funciona para logs do sistema, nunca para logs da aplicação",
    "É preciso reescrever o código para gerar JSON manualmente antes de qualquer log aparecer",
    "Os logs antigos foram convertidos para JSON e os novos são descartados"
  ],
  a: [0],
  w: [
    "Sem nível definido, ao mudar para JSON a Lambda ajusta os níveis de aplicação e de sistema para INFO; basta definir DEBUG.",
    "Em runtimes suportados, os logs da aplicação também saem em JSON estruturado.",
    "Com bibliotecas de log suportadas, não é preciso mudar o código para capturar JSON.",
    "A mudança não afeta logs já armazenados; só os novos usam o formato novo."
  ],
  kw: ["texto para JSON", "Não configuraram nenhum nível de log", "logger.debug()"],
  obj: "Explicar o sumiço dos logs DEBUG após adotar JSON.",
  cons: ["Sem nível configurado", "Logs estruturados"],
  el: [3],
  concept: "Formato JSON e filtragem por nível de log na Lambda",
  trap: "Mudar para JSON ativa a filtragem por nível com padrão INFO.",
  tip: "Log JSON na Lambda: configure application log level (ex.: DEBUG) se quiser ver debug.",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs-logformat.html",
  ev: "If you change your Event Function's log format to JSON and do not set log level, then Lambda automatically sets your Event Function's application log level and system log level to INFO.",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs-logformat.html"
},
{
  id: "d4-20", d: 4, t: "4.2", lvl: "Desafiadora",
  q: "Um serviço instrumentado para X-Ray roda em 40 instâncias, cada uma com regras de amostragem em um arquivo JSON local. O volume de traces está maior que o esperado e cada ajuste nas regras exige novo deploy. Qual mudança resolve os dois problemas?",
  o: [
    "Definir as sampling rules no console do X-Ray e configurar o SDK/coletor para ler as regras do serviço X-Ray",
    "Aumentar o reservoir no arquivo local de cada instância",
    "Desabilitar a amostragem e registrar 100% das requisições",
    "Mover as regras para variáveis de ambiente de cada instância"
  ],
  a: [0],
  w: [
    "Com regras no serviço, o X-Ray gerencia o reservoir de cada regra e distribui cotas entre as instâncias, sem precisar de redeploy.",
    "Aumentar o reservoir local soma ainda mais amostras nas 40 instâncias.",
    "Registrar tudo aumenta custo e volume, o oposto do desejado.",
    "Variáveis de ambiente continuam por instância e exigem atualização em cada uma."
  ],
  kw: ["40 instâncias", "arquivo JSON local", "maior que o esperado", "exige novo deploy"],
  obj: "Centralizar e controlar a amostragem de traces.",
  cons: ["Várias instâncias", "Sem redeploy"],
  el: [2],
  concept: "Sampling rules do X-Ray (reservoir e rate)",
  trap: "Regras locais: os reservoirs de todas as instâncias se somam.",
  tip: "Muitas instâncias + amostragem estourando → sampling rules centralizadas no X-Ray.",
  ref: "https://docs.aws.amazon.com/xray/latest/devguide/xray-console-sampling.html",
  ev: "However, when you run multiple instances of your service, each instance performs sampling independently. This causes the overall percentage of requests sampled to increase because the reservoirs of all of the instances are effectively added together. Additionally, to update local sampling rules, you must redeploy your code.",
  evu: "https://docs.aws.amazon.com/xray/latest/devguide/xray-console-sampling.html"
},
{
  id: "d4-21", d: 4, t: "4.2", lvl: "Intermediária", multi: true,
  q: "Um desenvolvedor quer que uma função Lambda envie traces ao AWS X-Ray, com a própria Lambda criando os segmentos das invocações. A função é implantada por CloudFormation (não pelo console). Quais DUAS ações são necessárias? (Selecione DUAS.)",
  o: [
    "Habilitar o modo de tracing Active na função",
    "Dar à execution role as permissões xray:PutTraceSegments e xray:PutTelemetryRecords (ex.: política AWSXRayDaemonWriteAccess)",
    "Instalar e executar o daemon do X-Ray dentro do pacote da função",
    "Habilitar o modo PassThrough, que envia todos os traces automaticamente",
    "Criar um VPC endpoint para o X-Ray"
  ],
  a: [0, 1],
  w: [
    "Com tracing Active, a Lambda cria automaticamente os segmentos das invocações e os envia ao X-Ray.",
    "Fora do console, as permissões não são adicionadas automaticamente; a execution role precisa delas.",
    "Não é preciso empacotar o daemon: com tracing Active, a própria Lambda cria e envia os segmentos.",
    "PassThrough apenas propaga o contexto de tracing para serviços seguintes.",
    "VPC endpoint não é requisito para tracing."
  ],
  kw: ["a própria Lambda criando os segmentos", "por CloudFormation (não pelo console)"],
  obj: "Ativar o tracing do X-Ray em uma função Lambda.",
  cons: ["Sem console", "Segmentos criados pela Lambda"],
  el: [4],
  concept: "Active tracing do X-Ray na Lambda",
  trap: "PassThrough não gera segmentos; e o console adiciona as permissões sozinho, o CloudFormation não.",
  tip: "Lambda + X-Ray = TracingConfig Active + PutTraceSegments/PutTelemetryRecords na role.",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html",
  ev: "With Active tracing, Lambda automatically creates trace segments for Event Function invocations and sends them to X-Ray. PassThrough mode, on the other hand, simply propagates the tracing context to downstream services. [...] xray:PutTraceSegments xray:PutTelemetryRecords These permissions are included in the AWSXRayDaemonWriteAccess managed policy.",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html"
},
{
  id: "d4-22", d: 4, t: "4.1", lvl: "Desafiadora",
  q: "Uma REST API do API Gateway com integração Lambda está lenta. No CloudWatch, a métrica Latency tem média de 2.100 ms e a IntegrationLatency tem média de 2.050 ms. Onde o desenvolvedor deve concentrar a investigação?",
  o: [
    "No backend (a função Lambda), pois quase toda a latência ocorre entre o API Gateway repassar a requisição e receber a resposta",
    "No overhead do próprio API Gateway, habilitando o cache da API",
    "Na rede do cliente, porque Latency mede o tempo do lado do cliente",
    "Nos authorizers, porque IntegrationLatency mede apenas a autorização"
  ],
  a: [0],
  w: [
    "IntegrationLatency mede o tempo do backend e explica ~2.050 dos 2.100 ms; o overhead do API Gateway é de ~50 ms.",
    "O overhead do API Gateway é a diferença Latency − IntegrationLatency, aqui pequena.",
    "Latency vai do recebimento da requisição pelo API Gateway até a resposta ao cliente, não inclui a rede do cliente.",
    "IntegrationLatency mede o tempo do backend, não do authorizer."
  ],
  kw: ["Latency tem média de 2.100 ms", "IntegrationLatency tem média de 2.050 ms"],
  obj: "Localizar onde está a latência.",
  cons: ["Latency vs IntegrationLatency"],
  el: [3],
  concept: "Métricas Latency e IntegrationLatency do API Gateway",
  trap: "Latency inclui a IntegrationLatency; compare as duas para isolar o overhead.",
  tip: "IntegrationLatency ≈ Latency → problema no backend.",
  ref: "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-metrics-and-dimensions.html",
  ev: "IntegrationLatency The time between when API Gateway relays a request to the backend and when it receives a response from the backend. [...] Latency The time between when API Gateway receives a request from a client and when it returns a response to the client. The latency includes the integration latency and other API Gateway overhead.",
  evu: "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-metrics-and-dimensions.html"
},
{
  id: "d4-23", d: 4, t: "4.1", lvl: "Desafiadora", multi: true,
  q: "Um desenvolvedor habilitou os logs de execução do CloudWatch em um stage de uma REST API na Região sa-east-1, mas nenhum log aparece e o console mostra um erro sobre a role do CloudWatch Logs. A conta já usa logs de API Gateway em us-east-1. Quais DUAS ações resolvem? (Selecione DUAS.)",
  o: [
    "Criar (ou reutilizar) uma role IAM com apigateway.amazonaws.com como entidade confiável e a política AmazonAPIGatewayPushToCloudWatchLogs",
    "Definir o ARN dessa role na propriedade cloudWatchRoleArn das configurações de Account do API Gateway na Região sa-east-1",
    "Adicionar permissões de logs à execution role da função Lambda de integração",
    "Habilitar o cache da API no stage",
    "Criar uma trail do CloudTrail para o API Gateway"
  ],
  a: [0, 1],
  w: [
    "O API Gateway assume uma role com essa política para gravar no CloudWatch Logs.",
    "O cloudWatchRoleArn é configurado separadamente em cada Região; o de us-east-1 não vale para sa-east-1.",
    "A role da Lambda controla os logs da função, não os do API Gateway.",
    "Cache não tem relação com logging.",
    "O CloudTrail registra chamadas de API de gerenciamento, não os logs de execução."
  ],
  kw: ["logs de execução", "Região sa-east-1", "role do CloudWatch Logs", "já usa logs de API Gateway em us-east-1"],
  obj: "Corrigir a configuração de logs do API Gateway.",
  cons: ["Outra Região", "Role de logs"],
  el: [3, 4],
  concept: "Permissões e configuração de logs do API Gateway (execution/access logging)",
  trap: "A configuração em uma Região não se aplica às outras.",
  tip: "Logs do API Gateway: role com AmazonAPIGatewayPushToCloudWatchLogs + cloudWatchRoleArn por Região.",
  ref: "https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html",
  ev: "To grant these permissions to your account, create an IAM role with apigateway.amazonaws.com as its trusted entity, attach the preceding policy to the IAM role, and set the IAM role ARN on the cloudWatchRoleArn property on your Account. You must set the cloudWatchRoleArn property separately for each AWS Region in which you want to enable CloudWatch Logs.",
  evu: "https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html"
},
{
  id: "d4-24", d: 4, t: "4.1", lvl: "Intermediária",
  q: "Uma tabela do DynamoDB sofre throttling intermitente, embora o consumo total esteja abaixo da capacidade provisionada. A equipe suspeita de algumas chaves 'quentes' e quer identificar quais itens são mais acessados e quais sofrem mais throttling. Qual recurso usar?",
  o: [
    "CloudWatch Contributor Insights for DynamoDB",
    "DynamoDB Streams",
    "Aumentar a capacidade de leitura e escrita da tabela inteira",
    "AWS X-Ray com annotations em cada requisição"
  ],
  a: [0],
  w: [
    "O Contributor Insights mostra os itens mais acessados e mais throttled em uma tabela ou GSI.",
    "Streams registram modificações de itens, não padrões de acesso nem throttling.",
    "Mais capacidade total não resolve uma partição quente e não identifica as chaves.",
    "O X-Ray mostra latência por chamada, mas não ranqueia as chaves mais acessadas."
  ],
  kw: ["throttling intermitente", "abaixo da capacidade provisionada", "chaves 'quentes'", "mais acessados", "mais throttling"],
  obj: "Identificar chaves quentes na tabela.",
  cons: ["Throttling", "Capacidade sobrando"],
  el: [2],
  concept: "CloudWatch Contributor Insights for DynamoDB",
  trap: "Aumentar capacidade é a reação instintiva, mas não mostra a causa (chave quente).",
  tip: "Quais chaves mais acessadas/throttled? → Contributor Insights.",
  ref: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/contributorinsights_HowItWorks.html",
  ev: "Amazon DynamoDB integrates with CloudWatch Contributor Insights to provide information about the most accessed and throttled items in a table or global secondary index.",
  evu: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/contributorinsights_HowItWorks.html"
},
{
  id: "d4-25", d: 4, t: "4.2", lvl: "Intermediária",
  q: "Uma aplicação publica uma métrica personalizada de pedidos com falha. A equipe precisa ver picos que duram poucos segundos e consultar a métrica com período de 10 segundos. Como a métrica deve ser publicada?",
  o: [
    "Como métrica de alta resolução (StorageResolution = 1), com granularidade de 1 segundo",
    "Como métrica de resolução padrão, que já guarda dados a cada segundo",
    "Com detailed monitoring do EC2 habilitado",
    "Como métrica de resolução padrão com o período do alarme em 10 segundos"
  ],
  a: [0],
  w: [
    "Métricas de alta resolução são guardadas com resolução de 1 s e podem ser lidas com períodos de 1, 5, 10, 30 s ou múltiplos de 60 s.",
    "A resolução padrão tem granularidade de um minuto.",
    "Detailed monitoring do EC2 vale para métricas do EC2 (1 minuto), não para métricas personalizadas.",
    "Com resolução padrão, não é possível ler a métrica com período de 10 segundos."
  ],
  kw: ["métrica personalizada", "poucos segundos", "período de 10 segundos"],
  obj: "Publicar métricas com granularidade de segundos.",
  cons: ["Período de 10 s", "Métrica customizada"],
  el: [2],
  concept: "Métricas personalizadas de alta resolução no CloudWatch",
  trap: "Resolução padrão = 1 minuto; abaixo disso só com alta resolução.",
  tip: "Precisa de segundos → StorageResolution 1 (high resolution).",
  ref: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html",
  ev: "When you publish a high-resolution metric, CloudWatch stores it with a resolution of 1 second, and you can read and retrieve it with a period of 1 second, 5 seconds, 10 seconds, 30 seconds, or any multiple of 60 seconds.",
  evu: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/publishingMetrics.html"
},
{
  id: "d4-26", d: 4, t: "4.2", lvl: "Intermediária",
  q: "Uma equipe recebe muitos alertas falsos: um alarme de alta latência dispara sozinho em picos curtos, mesmo sem erros. Ela quer ser notificada SOMENTE quando o alarme de latência E o alarme de taxa de erros 5XX estiverem em ALARM ao mesmo tempo, sem mudar os alarmes existentes. O que usar?",
  o: [
    "Um composite alarm com a regra ALARM(\"Latencia\") AND ALARM(\"Erros5XX\") e a notificação SNS nele",
    "Uma métrica matemática que soma latência e erros em um único alarme",
    "Duas assinaturas SNS no mesmo tópico, uma para cada alarme",
    "Aumentar o período de avaliação de ambos os alarmes para 1 dia"
  ],
  a: [0],
  w: [
    "O composite alarm avalia o estado de outros alarmes e permite combiná-los com AND, OR e NOT.",
    "Somar métricas de unidades diferentes não expressa 'os dois ao mesmo tempo' e exige criar outro alarme.",
    "Duas assinaturas continuam disparando para cada alarme isoladamente.",
    "Um período de 1 dia atrasa demais a detecção de problemas reais."
  ],
  kw: ["alertas falsos", "SOMENTE quando", "ao mesmo tempo", "sem mudar os alarmes existentes"],
  obj: "Reduzir ruído combinando alarmes.",
  cons: ["Os dois em ALARM", "Manter alarmes atuais"],
  el: [3],
  concept: "Composite alarms do CloudWatch",
  trap: "Composite alarm não avalia métricas, só o estado de outros alarmes.",
  tip: "Combinar condições de vários alarmes (AND/OR/NOT) → composite alarm.",
  ref: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html",
  ev: "Composite alarms evaluate only the states of the alarms they reference. They don't evaluate metrics directly. [...] You can change the logical operator in your rule expression from OR to AND or NOT, and you can add parentheses to group your functions.",
  evu: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html"
},
{
  id: "d4-27", d: 4, t: "4.3", lvl: "Intermediária",
  q: "Uma distribuição do CloudFront tem taxa de cache hit baixa. A cache policy inclui TODOS os headers, cookies e query strings na cache key, mas a origem só varia a resposta pelo header Accept-Language. Como melhorar a taxa de acertos?",
  o: [
    "Ajustar a cache policy para incluir na cache key apenas o header Accept-Language",
    "Reduzir o TTL para zero",
    "Incluir também o header User-Agent na cache key",
    "Desabilitar a compressão de objetos"
  ],
  a: [0],
  w: [
    "Menos valores na cache key aumentam a chance de cache hit; inclua só o que muda a resposta.",
    "TTL zero praticamente desliga o cache.",
    "User-Agent tem muitas variações e fragmenta ainda mais o cache.",
    "A compressão não afeta a cache key nem a taxa de acertos."
  ],
  kw: ["taxa de cache hit baixa", "TODOS os headers, cookies e query strings", "só varia a resposta pelo header Accept-Language"],
  obj: "Aumentar o cache hit ratio.",
  cons: ["Variação só por idioma"],
  el: [2],
  concept: "Cache key e cache policies do CloudFront (cache por headers)",
  trap: "Colocar mais coisas na cache key parece 'seguro', mas derruba o hit ratio.",
  tip: "Cache key = só o que realmente muda a resposta.",
  ref: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html",
  ev: "Including fewer values in the cache key increases the likelihood of a cache hit.",
  evu: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/controlling-the-cache-key.html"
},
{
  id: "d4-28", d: 4, t: "4.3", lvl: "Desafiadora", multi: true,
  q: "Uma API em Java na Lambda tem cold starts de vários segundos por causa da inicialização do framework. A equipe avalia o Lambda SnapStart. Quais DUAS afirmações sobre o SnapStart são verdadeiras? (Selecione DUAS.)",
  o: [
    "Funciona apenas em versões publicadas da função (e aliases que apontam para versões), não em $LATEST",
    "Não pode ser usado junto com provisioned concurrency",
    "Mantém ambientes de execução sempre aquecidos, cobrando por hora como provisioned concurrency",
    "Exige reescrever a função para outro runtime",
    "Funciona em qualquer runtime gerenciado, incluindo Node.js"
  ],
  a: [0, 1],
  w: [
    "O SnapStart inicializa a função ao publicar uma versão e tira um snapshot; não se aplica ao $LATEST.",
    "A documentação lista provisioned concurrency entre os recursos não suportados com SnapStart.",
    "Quem mantém ambientes inicializados é a provisioned concurrency; o SnapStart retoma de um snapshot em cache.",
    "Java 11 e posteriores são suportados, normalmente sem mudanças no código.",
    "Node.js não está entre os runtimes suportados (Java, Python 3.12+ e .NET 8+)."
  ],
  kw: ["Java", "cold starts de vários segundos", "inicialização do framework", "SnapStart"],
  obj: "Conhecer requisitos e limites do SnapStart.",
  cons: ["Java", "Cold start na inicialização"],
  el: [3, 4],
  concept: "Lambda SnapStart",
  trap: "SnapStart ≠ provisioned concurrency; e não vale para $LATEST.",
  tip: "Init pesado (Java/Python/.NET) → SnapStart em versão publicada; latência rígida → provisioned concurrency.",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html",
  ev: "SnapStart does not support provisioned concurrency, Amazon Elastic File System (Amazon EFS), Amazon S3 Files, or ephemeral storage greater than 512 MB. Note You can use SnapStart only on published function versions and aliases that point to versions. You can't use SnapStart on a function's unpublished version ($LATEST).",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/snapstart.html"
},
{
  id: "d4-29", d: 4, t: "4.3", lvl: "Intermediária",
  q: "Uma empresa tem centenas de funções Lambda e suspeita que muitas estão com memória super ou subdimensionada. Ela quer recomendações de memória baseadas no uso real, com estimativa de custo, sem testar função por função. Qual serviço usar?",
  o: [
    "AWS Compute Optimizer",
    "AWS Trusted Advisor, verificação de limites de serviço",
    "Aumentar todas as funções para 10.240 MB",
    "AWS Budgets"
  ],
  a: [0],
  w: [
    "O Compute Optimizer gera recomendações de tamanho de memória para funções Lambda, com custo recomendado.",
    "Verificações de limites de serviço tratam de cotas, não de dimensionamento de memória.",
    "Memória máxima para todas aumenta o custo sem base no uso.",
    "O Budgets acompanha gastos, mas não recomenda configuração."
  ],
  kw: ["centenas de funções Lambda", "super ou subdimensionada", "recomendações de memória", "sem testar função por função"],
  obj: "Dimensionar a memória das funções com base em dados.",
  cons: ["Muitas funções", "Baseado no uso"],
  el: [2],
  concept: "Recomendações de memória da Lambda no Compute Optimizer",
  trap: "Na Lambda, CPU é proporcional à memória; o Compute Optimizer considera isso.",
  tip: "Memória mínima/ideal da Lambda em escala → Compute Optimizer.",
  ref: "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-lambda-recommendations.html",
  ev: "AWS Compute Optimizer generates memory size recommendations for AWS Lambda functions.",
  evu: "https://docs.aws.amazon.com/compute-optimizer/latest/ug/view-lambda-recommendations.html"
},
{
  id: "d4-30", d: 4, t: "4.2", lvl: "Intermediária",
  q: "Uma equipe já foi surpreendida ao atingir uma cota de serviço em produção. Ela quer ser avisada ANTES de chegar perto do limite de uma cota que suporta monitoramento de uso, para pedir o aumento a tempo. Qual a forma mais simples?",
  o: [
    "Criar, no console do Service Quotas, um alarme do CloudWatch para a cota com o limite de alerta desejado",
    "Escrever uma função agendada que conta recursos e compara com valores fixos no código",
    "Ativar o AWS CloudTrail e revisar os logs semanalmente",
    "Solicitar preventivamente o valor máximo de todas as cotas"
  ],
  a: [0],
  w: [
    "O Service Quotas permite criar alarmes do CloudWatch que avisam quando o uso se aproxima do limite.",
    "Funciona, mas dá trabalho e os valores fixos ficam desatualizados.",
    "Revisão semanal de logs não gera alerta proativo.",
    "Pedir tudo no máximo não é prático e nem sempre é aprovado."
  ],
  kw: ["ANTES de chegar perto do limite", "suporta monitoramento de uso", "pedir o aumento a tempo"],
  obj: "Receber alerta de proximidade de cota.",
  cons: ["Alerta proativo", "Simplicidade"],
  el: [3],
  concept: "Alarmes do CloudWatch para Service Quotas",
  trap: "Não é preciso construir monitoramento próprio para cotas suportadas.",
  tip: "Aviso de cota → Service Quotas + alarme do CloudWatch.",
  ref: "https://docs.aws.amazon.com/servicequotas/latest/userguide/configure-cloudwatch.html",
  ev: "You can create Amazon CloudWatch alarms to notify you when you're close to a quota value threshold. Setting an alarm can help alert you if you need to request a quota increase.",
  evu: "https://docs.aws.amazon.com/servicequotas/latest/userguide/configure-cloudwatch.html"
},
{
  id: "d4-31", d: 4, t: "4.2", lvl: "Fácil",
  q: "Um desenvolvedor quer receber um e-mail sempre que uma implantação de um deployment group do AWS CodeDeploy falhar ou for interrompida, para investigar logo. O que configurar?",
  o: [
    "Um trigger no deployment group que publica os eventos de falha/parada em um tópico do Amazon SNS com assinatura de e-mail",
    "Um alarme do CloudWatch na métrica CPUUtilization das instâncias",
    "Um lifecycle hook ValidateService que envia e-mail",
    "Habilitar o CloudTrail no CodeDeploy"
  ],
  a: [0],
  w: [
    "Triggers do CodeDeploy enviam notificações de eventos de implantação a um tópico do SNS.",
    "CPU alta não indica falha de implantação.",
    "Hooks executam scripts na implantação; não são o mecanismo de notificação recomendado.",
    "O CloudTrail registra chamadas de API, não notifica falhas."
  ],
  kw: ["receber um e-mail", "falhar ou for interrompida"],
  obj: "Notificar falhas de implantação.",
  cons: ["E-mail", "Falha ou parada"],
  el: [1],
  concept: "Triggers do CodeDeploy com Amazon SNS",
  trap: "Hook do appspec ≠ notificação de evento de implantação.",
  tip: "Aviso de deploy concluído/falho no CodeDeploy → trigger + SNS (ou regra do EventBridge).",
  ref: "https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-sns-event-notifications.html",
  ev: "You can add triggers to a CodeDeploy deployment group to receive notifications about events related to deployments or instances in that deployment group. These notifications are sent to recipients who are subscribed to an Amazon SNS topic you have made part of the trigger's action.",
  evu: "https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-sns-event-notifications.html"
},
{
  id: "d4-32", d: 4, t: "4.1", lvl: "Desafiadora", multi: true,
  q: "Consumidores de uma fila SQS padrão estão ficando para trás e o SLA exige processar cada mensagem em até 5 minutos. A equipe também quer saber quando mensagens caem na dead-letter queue (DLQ). Quais DUAS métricas do CloudWatch são as mais adequadas para esses alarmes? (Selecione DUAS.)",
  o: [
    "ApproximateAgeOfOldestMessage na fila principal",
    "ApproximateNumberOfMessagesVisible na DLQ",
    "NumberOfMessagesSent na DLQ",
    "SentMessageSize na fila principal",
    "NumberOfEmptyReceives na fila principal"
  ],
  a: [0, 1],
  w: [
    "Mede a idade da mensagem mais antiga não processada, ideal para um SLA de tempo.",
    "É a métrica recomendada para monitorar o estado de uma DLQ.",
    "Mensagens movidas para a DLQ por falha não são contadas em NumberOfMessagesSent.",
    "Tamanho de mensagem não indica atraso.",
    "Receives vazios indicam polling sem mensagens, não atraso."
  ],
  kw: ["ficando para trás", "até 5 minutos", "dead-letter queue (DLQ)"],
  obj: "Escolher métricas para atraso e DLQ.",
  cons: ["SLA de 5 min", "Monitorar DLQ"],
  el: [3, 4],
  concept: "Métricas do SQS para backlog e DLQ",
  trap: "NumberOfMessagesSent parece óbvia para a DLQ, mas não conta as mensagens movidas por falha.",
  tip: "Atraso → ApproximateAgeOfOldestMessage; DLQ → ApproximateNumberOfMessagesVisible.",
  ref: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-available-cloudwatch-metrics.html",
  ev: "ApproximateAgeOfOldestMessage The age of the oldest unprocessed message in the queue. [...] Recommended Metric for DLQs – To monitor the state of a DLQ, use the ApproximateNumberOfMessagesVisible metric.",
  evu: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-available-cloudwatch-metrics.html"
},
{
  id: "d4-33", d: 4, t: "4.1", lvl: "Pegadinha",
  q: "Uma REST API Regional do API Gateway chama de forma síncrona uma função Lambda com timeout de 60 segundos. Algumas requisições levam cerca de 45 segundos e falham por timeout no API Gateway, embora a função termine com sucesso. Qual é a explicação?",
  o: [
    "O timeout padrão de integração do API Gateway é de no máximo 29 segundos; é preciso aumentá-lo (possível em APIs Regionais) ou tornar o processamento assíncrono",
    "O timeout máximo da Lambda é de 30 segundos",
    "A função precisa de mais memória para responder em menos de 60 segundos",
    "O API Gateway só aceita integrações com Lambda que terminam em até 3 segundos"
  ],
  a: [0],
  w: [
    "A integração tem limite padrão de 50 ms a 29 s; acima disso, aumente a cota (pode reduzir o throttle da Região) ou use um padrão assíncrono.",
    "O timeout máximo da Lambda é de 900 segundos (15 minutos).",
    "A função termina com sucesso; o corte vem do API Gateway, não da Lambda.",
    "3 segundos é o timeout padrão da Lambda, não um limite do API Gateway."
  ],
  kw: ["REST API Regional", "timeout de 60 segundos", "cerca de 45 segundos", "função termine com sucesso"],
  obj: "Explicar o timeout apesar da função ter sucesso.",
  cons: ["Síncrono", "45 s de processamento"],
  el: [3],
  concept: "Timeout de integração do API Gateway",
  trap: "O timeout da Lambda está correto; quem corta é o API Gateway.",
  tip: "Lambda > 29 s atrás de API Gateway → aumente o timeout de integração (Regional/privada) ou processe de forma assíncrona.",
  ref: "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-execution-service-limits-table.html",
  ev: "Integration timeout for Regional APIs 50 milliseconds - 29 seconds for all integration types, including Lambda, Lambda proxy, HTTP, HTTP proxy, and AWS integrations. [...] You can raise the integration timeout to greater than 29 seconds, but this might require a reduction in your Region-level throttle quota for your account.",
  evu: "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-execution-service-limits-table.html"
},
{
  id: "d4-34", d: 4, t: "4.1", lvl: "Pegadinha",
  q: "Após uma implantação com defeito, TODOS os destinos de um target group de um Application Load Balancer falharam nos health checks, em todas as AZs habilitadas. Mesmo assim, o ALB continua enviando requisições para eles. Por quê?",
  o: [
    "Quando todos os destinos estão unhealthy, o ALB entra em fail open e roteia para todos eles, independentemente do status",
    "O ALB ignora health checks nos primeiros 30 minutos após a implantação",
    "O health check só é avaliado quando o destino é registrado",
    "O ALB só remove destinos unhealthy se o Auto Scaling estiver configurado"
  ],
  a: [0],
  w: [
    "Se o target group só tem destinos unhealthy, o ALB envia tráfego a todos eles (fail open).",
    "Não existe esse período fixo de 30 minutos.",
    "Os health checks são periódicos, não só no registro.",
    "O ALB tira destinos de serviço após UnhealthyThresholdCount falhas, com ou sem Auto Scaling."
  ],
  kw: ["TODOS os destinos", "todas as AZs habilitadas", "continua enviando requisições"],
  obj: "Entender o comportamento do ALB quando todos falham.",
  cons: ["Todos unhealthy"],
  el: [1],
  concept: "Health checks do ALB e fail open",
  trap: "Esperar que o ALB pare de enviar tráfego: com todos unhealthy ele faz fail open.",
  tip: "Todos unhealthy → fail open; poucos unhealthy → removidos após UnhealthyThresholdCount.",
  ref: "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html",
  ev: "If a target group contains only unhealthy registered targets, the load balancer routes requests to all those targets, regardless of their health status. This means that if all targets fail health checks at the same time in all enabled Availability Zones, the load balancer fails open.",
  evu: "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html"
},
{
  id: "d4-35", d: 4, t: "4.1", lvl: "Fácil",
  q: "Uma nova função Lambda, criada com as configurações padrão, chama uma API externa que demora cerca de 8 segundos. Os logs mostram 'Task timed out after 3.00 seconds'. Qual é a correção?",
  o: [
    "Aumentar o timeout da função, cujo padrão é de 3 segundos (máximo de 900 segundos)",
    "Aumentar a reserved concurrency",
    "Habilitar provisioned concurrency",
    "Mover a função para dentro de uma VPC"
  ],
  a: [0],
  w: [
    "O padrão é 3 s; ajuste o timeout acima do tempo esperado da chamada.",
    "Concorrência não muda quanto tempo cada execução pode durar.",
    "Provisioned concurrency reduz cold start, não o limite de tempo.",
    "VPC não aumenta o tempo permitido e pode exigir NAT para chamar APIs externas."
  ],
  kw: ["configurações padrão", "cerca de 8 segundos", "Task timed out after 3.00 seconds"],
  obj: "Corrigir o timeout da função.",
  cons: ["Configuração padrão", "Chamada de 8 s"],
  el: [3],
  concept: "Timeout da Lambda",
  trap: "Concorrência e timeout são coisas diferentes.",
  tip: "'Task timed out after 3.00 seconds' = timeout padrão; aumente o timeout.",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html",
  ev: "The default value for this setting is 3 seconds, but you can adjust this in increments of 1 second up to a maximum value of 900 seconds (15 minutes).",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html"
},

/* ---------- Múltipla resposta em outros domínios ---------- */
{
  id: "d1-24", d: 1, t: "1.2", lvl: "Intermediária", multi: true,
  q: "Um desenvolvedor precisa escolher entre serviços que a Lambda consulta (poll) por meio de uma event source mapping e serviços que invocam a função diretamente. Quais DOIS serviços invocam a Lambda por meio de event source mapping? (Selecione DOIS.)",
  o: [
    "Amazon SQS",
    "Amazon Kinesis Data Streams",
    "Amazon SNS",
    "Amazon S3 (event notifications)",
    "Amazon API Gateway"
  ],
  a: [0, 1],
  w: [
    "O SQS é lido por event pollers de uma event source mapping.",
    "O Kinesis também usa event source mapping, lendo registros do stream em lotes.",
    "O SNS invoca a função diretamente (push), de forma assíncrona.",
    "O S3 envia a notificação diretamente para a função (push).",
    "O API Gateway invoca a função diretamente, de forma síncrona."
  ],
  kw: ["consulta (poll)", "event source mapping", "invocam a função diretamente"],
  obj: "Diferenciar fontes por polling de triggers diretos.",
  cons: ["Poll vs push"],
  el: [4],
  concept: "Event source mappings da Lambda",
  trap: "SNS e S3 parecem 'filas de eventos', mas fazem push direto.",
  tip: "Event source mapping: SQS, Kinesis, DynamoDB Streams, MQ, MSK/Kafka, DocumentDB.",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html",
  ev: "The following services use event source mappings to invoke Lambda Event Functions: Amazon DocumentDB (with MongoDB compatibility) (Amazon DocumentDB) Amazon DynamoDB Amazon Kinesis Amazon MQ Amazon Managed Streaming for Apache Kafka (Amazon MSK) Self-managed Apache Kafka Amazon Simple Queue Service (Amazon SQS)",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html"
},
{
  id: "d1-25", d: 1, t: "1.1", lvl: "Pegadinha", multi: true,
  q: "Ao configurar event notifications de um bucket S3 para avisar outros sistemas sobre novos objetos, a equipe tentou usar uma fila SQS FIFO como destino e recebeu erro. Quais DOIS destinos podem ser configurados DIRETAMENTE nas event notifications do S3? (Selecione DOIS.)",
  o: [
    "Um tópico padrão (Standard) do Amazon SNS",
    "Uma função AWS Lambda",
    "Uma fila Amazon SQS FIFO",
    "Um tópico Amazon SNS FIFO",
    "Um stream do Amazon Kinesis Data Streams"
  ],
  a: [0, 1],
  w: [
    "Tópicos SNS Standard são destinos suportados.",
    "Funções Lambda são destinos suportados.",
    "Filas SQS FIFO não são suportadas; use o EventBridge para chegar a uma fila FIFO.",
    "Tópicos SNS FIFO não são permitidos como destino.",
    "Kinesis não é destino direto de event notifications do S3."
  ],
  kw: ["SQS FIFO", "erro", "DIRETAMENTE"],
  obj: "Conhecer os destinos de event notifications do S3.",
  cons: ["Destino direto"],
  el: [4],
  concept: "Destinos de event notifications do S3",
  trap: "SQS e SNS são suportados, mas as versões FIFO não.",
  tip: "S3 notifica: SNS (Standard), SQS (Standard), Lambda e EventBridge; FIFO → via EventBridge.",
  ref: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html",
  ev: "Amazon Simple Notification Service (Amazon SNS) topics Amazon Simple Queue Service (Amazon SQS) queues AWS Lambda function Amazon EventBridge [...] Amazon Simple Queue Service FIFO (First-In-First-Out) queues aren't supported as an Amazon S3 event notification destination. To send a notification for an Amazon S3 event to an Amazon SQS FIFO queue, you can use Amazon EventBridge.",
  evu: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html"
},
{
  id: "d3-27", d: 3, t: "3.4", lvl: "Intermediária", multi: true,
  q: "Uma equipe usa o AWS CodeDeploy para implantar novas versões de uma função Lambda e quer deslocar o tráfego para a nova versão de forma GRADUAL, para poder reverter antes que todos os usuários sejam afetados. Quais DOIS tipos de deployment configuration atendem? (Selecione DOIS.)",
  o: [
    "Canary (ex.: LambdaCanary10Percent5Minutes)",
    "Linear (ex.: LambdaLinear10PercentEvery1Minute)",
    "All-at-once (LambdaAllAtOnce)",
    "HalfAtATime",
    "Rolling with additional batch"
  ],
  a: [0, 1],
  w: [
    "Canary desloca uma porcentagem primeiro e o restante depois de um intervalo.",
    "Linear desloca o tráfego em incrementos iguais e intervalos iguais.",
    "All-at-once desloca todo o tráfego de uma vez, sem gradualidade.",
    "HalfAtATime é uma configuração para EC2/on-premises, não para Lambda.",
    "Rolling with additional batch é política do Elastic Beanstalk."
  ],
  kw: ["CodeDeploy", "função Lambda", "GRADUAL", "reverter antes"],
  obj: "Escolher configurações de deslocamento gradual para Lambda.",
  cons: ["Lambda", "Gradual"],
  el: [3, 4],
  concept: "Deployment configurations do CodeDeploy para Lambda",
  trap: "HalfAtATime e Rolling soam graduais, mas são de outras plataformas.",
  tip: "Lambda/ECS no CodeDeploy: canary, linear ou all-at-once.",
  ref: "https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html",
  ev: "When you deploy to an AWS Lambda compute platform, the deployment configuration specifies the way traffic is shifted to the new Lambda function versions in your application. You can shift traffic using a canary, linear, or all-at-once deployment configuration.",
  evu: "https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html"
}
);
