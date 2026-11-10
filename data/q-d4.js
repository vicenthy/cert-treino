// Domínio 4 — Solução de problemas e otimização (18%)
QB.push(
{
  id: "d4-01", d: 4, t: "4.2", lvl: "Intermediária",
  q: "Uma aplicação instrumentada com o AWS X-Ray precisa permitir que a equipe FILTRE traces pelo ID do cliente no console para investigar reclamações específicas. Como registrar o ID do cliente?",
  o: [
    "Como metadata no segmento",
    "Como annotation no segmento",
    "Em uma mensagem de log no CloudWatch Logs",
    "Como uma tag na função Lambda"
  ],
  a: [1],
  w: [
    "A metadata aceita qualquer objeto, mas NÃO é indexada, então não pode ser usada em filter expressions.",
    "As annotations são pares chave-valor indexados que podem ser usados em filter expressions para buscar traces.",
    "Os logs não permitem filtrar traces no console do X-Ray.",
    "As tags de recurso não ficam associadas a cada trace individual."
  ],
  kw: ["FILTRE traces pelo ID do cliente"],
  obj: "Tornar um campo pesquisável nos traces.",
  cons: ["Filtrar no X-Ray"],
  el: [3],
  concept: "Annotations vs metadata no X-Ray",
  trap: "A metadata parece adequada para 'dados extras', mas não é indexada.",
  tip: "Precisa filtrar → annotation. Só guardar contexto → metadata.",
  ref: "https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html",
  ev: "Annotations are simple key-value pairs that are indexed for use with filter expressions.",
  evu: "https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html"
},
{
  id: "d4-02", d: 4, t: "4.2", lvl: "Desafiadora", multi: true,
  q: "Uma aplicação em instâncias EC2 foi instrumentada com o SDK do X-Ray, mas nenhum trace aparece no console. Quais DUAS ações provavelmente resolvem o problema? (Selecione DUAS.)",
  o: [
    "Instalar e executar o daemon do X-Ray (ou o agente do CloudWatch com X-Ray habilitado) na instância",
    "Garantir que a role da instância tenha permissões para enviar segmentos (por exemplo, a policy AWSXRayDaemonWriteAccess)",
    "Habilitar VPC Flow Logs",
    "Habilitar o AWS CloudTrail",
    "Aumentar o tamanho da instância"
  ],
  a: [0, 1],
  w: [
    "O SDK envia segmentos via UDP para um daemon ou agente local, que os repassa à API do X-Ray; sem ele, os dados não chegam.",
    "O daemon precisa de permissão (xray:PutTraceSegments e afins) na role da instância.",
    "Os Flow Logs registram tráfego de rede, não traces de aplicação.",
    "O CloudTrail audita chamadas de API, não gera traces.",
    "O tamanho da instância não afeta o envio de traces."
  ],
  kw: ["instâncias EC2", "instrumentada com o SDK", "nenhum trace aparece"],
  obj: "Corrigir o envio de traces a partir do EC2.",
  cons: ["EC2", "SDK já instrumentado"],
  el: [2, 3, 4],
  concept: "Daemon do X-Ray e permissões",
  trap: "Na Lambda basta ativar o tracing; no EC2 é preciso o daemon/agente e a role.",
  tip: "Sem traces no EC2/ECS → daemon (ou agente) rodando + permissão IAM. Atualização: desde 25/02/2026 os SDKs e o daemon do X-Ray estão em modo de manutenção, e a AWS recomenda migrar para OpenTelemetry (ADOT / agente do CloudWatch).",
  ref: "https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html",
  ev: "The AWS X-Ray daemon is a software application that listens for traffic on UDP port 2000, gathers raw segment data, and relays it to the AWS X-Ray API. [...] On February 25th, 2026, the AWS X-Ray SDKs/Daemon will enter maintenance mode.",
  evu: "https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html"
},
{
  id: "d4-03", d: 4, t: "4.1", lvl: "Intermediária",
  q: "Após um incidente, a equipe precisa encontrar rapidamente todas as mensagens de erro com um requestId específico em vários log groups de funções Lambda e contar os erros por minuto. Qual ferramenta usar?",
  o: [
    "Baixar os logs e usar grep localmente",
    "CloudWatch Logs Insights com uma consulta em vários log groups",
    "AWS CloudTrail Lake",
    "AWS X-Ray service map"
  ],
  a: [1],
  w: [
    "É lento e manual.",
    "O Logs Insights permite consultar vários log groups, filtrar e agregar (por exemplo, stats count(*) by bin(1m)).",
    "O CloudTrail registra chamadas de API da AWS, não os logs da aplicação.",
    "O service map mostra dependências e latências, não busca texto em logs."
  ],
  kw: ["vários log groups", "contar os erros por minuto"],
  obj: "Consultar e agregar logs.",
  cons: ["Vários log groups", "Agregação"],
  el: [0],
  concept: "CloudWatch Logs Insights",
  trap: "CloudTrail soa como 'logs', mas é auditoria de API.",
  tip: "Consultar e agregar logs de aplicação → Logs Insights.",
  ref: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html",
  ev: "With CloudWatch Logs Insights, you can interactively search and analyze your log data in Amazon CloudWatch Logs.",
  evu: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html"
},
{
  id: "d4-04", d: 4, t: "4.1", lvl: "Desafiadora",
  q: "Uma função Lambda de alto volume precisa publicar métricas de negócio customizadas (por exemplo, valor do pedido por região) no CloudWatch, sem adicionar a latência de chamadas síncronas de API em cada invocação. Qual abordagem usar?",
  o: [
    "Chamar PutMetricData a cada invocação",
    "Escrever os logs no CloudWatch embedded metric format (EMF)",
    "Gravar as métricas no DynamoDB e criar um painel",
    "Habilitar o Lambda Insights"
  ],
  a: [1],
  w: [
    "Adiciona latência e chamadas de API em cada invocação.",
    "Com o EMF, a função escreve um log JSON estruturado e o CloudWatch extrai as métricas de forma assíncrona, sem chamadas de API no caminho crítico.",
    "Não gera métricas do CloudWatch e adiciona escrita e custo.",
    "O Lambda Insights coleta métricas de sistema (CPU, memória), não métricas de negócio personalizadas."
  ],
  kw: ["alto volume", "métricas de negócio customizadas", "sem adicionar a latência de chamadas síncronas"],
  obj: "Publicar métricas customizadas de forma eficiente.",
  cons: ["Sem chamadas síncronas", "Métricas customizadas"],
  el: [2],
  concept: "CloudWatch embedded metric format",
  trap: "O PutMetricData é o caminho 'clássico', mas viola a restrição de latência.",
  tip: "Métricas customizadas a partir da Lambda sem chamadas de API → EMF.",
  ref: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html",
  ev: "Embedding metrics within logs The CloudWatch embedded metric format allows you to generate custom metrics asynchronously in the form of logs written to CloudWatch Logs.",
  evu: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html"
},
{
  id: "d4-05", d: 4, t: "4.1", lvl: "Desafiadora",
  q: "Uma REST API usa integração Lambda proxy. A função executa sem erros nos logs, mas o cliente recebe HTTP 502 Bad Gateway. Qual é a causa MAIS provável?",
  o: [
    "A função excedeu o timeout de integração",
    "A função retornou uma resposta fora do formato esperado (por exemplo, sem statusCode, ou com body que não é string)",
    "O cliente não enviou a API key",
    "A função atingiu o limite de concorrência"
  ],
  a: [1],
  w: [
    "Um timeout de integração gera 504 Gateway Timeout.",
    "Na integração proxy, o API Gateway espera um objeto com statusCode, headers e body (string); um formato inválido resulta em 502.",
    "A falta de API key em um método que a exige gera 403.",
    "Se a função fosse limitada por concorrência, ela nem executaria: apareceria na métrica Throttles, o que contradiz \"executa sem erros\"."
  ],
  kw: ["integração Lambda proxy", "executa sem erros", "HTTP 502"],
  obj: "Diagnosticar um 502 na integração proxy.",
  cons: ["A função executa com sucesso"],
  el: [2],
  concept: "Formato de resposta da integração Lambda proxy",
  trap: "502 vs 504: o timeout é 504.",
  tip: "Proxy + 502 com função OK → formato de retorno inválido.",
  ref: "https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html",
  ev: "If the function output is of a different format, API Gateway returns a 502 Bad Gateway error response.",
  evu: "https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html"
},
{
  id: "d4-06", d: 4, t: "4.3", lvl: "Desafiadora",
  q: "Durante picos, uma função Lambda de processamento em lote consome toda a concorrência disponível da conta, e uma função crítica de checkout começa a receber erros de throttling. Como garantir capacidade para o checkout?",
  o: [
    "Configurar provisioned concurrency na função de lote",
    "Configurar reserved concurrency na função de checkout (e, opcionalmente, limitar a de lote com reserved concurrency)",
    "Aumentar a memória da função de checkout",
    "Aumentar o timeout da função de checkout"
  ],
  a: [1],
  w: [
    "A provisioned concurrency pré-inicializa ambientes para reduzir cold starts; não protege o checkout.",
    "A reserved concurrency reserva uma parte do pool da conta para a função (garantia) e também funciona como limite máximo, evitando que a de lote consuma tudo.",
    "A memória não afeta a disponibilidade de concorrência.",
    "Um timeout maior pode até piorar o consumo de concorrência."
  ],
  kw: ["consome toda a concorrência disponível da conta", "função crítica", "throttling"],
  obj: "Isolar a capacidade de concorrência.",
  cons: ["Função crítica", "Pool compartilhado"],
  el: [3],
  concept: "Reserved vs provisioned concurrency",
  trap: "Provisioned concurrency é sobre cold start; reserved é sobre garantia e limite.",
  tip: "Garantir ou limitar a concorrência → reserved. Eliminar cold start → provisioned.",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html",
  ev: "When an Event Function has reserved concurrency, no other Event Function can use that concurrency. [...] Reserved concurrency is useful for ensuring that your most critical functions always have enough concurrency to handle incoming requests.",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html"
},
{
  id: "d4-07", d: 4, t: "4.3", lvl: "Intermediária",
  q: "Uma API síncrona com Lambda tem latência alta e imprevisível nas primeiras requisições após períodos de inatividade e nos picos de manhã. A equipe quer latência de inicialização consistentemente baixa. O que configurar?",
  o: [
    "Reserved concurrency",
    "Provisioned concurrency em um alias ou versão da função",
    "Aumentar o timeout",
    "Mover a inicialização para dentro do handler"
  ],
  a: [1],
  w: [
    "A reserved concurrency garante capacidade, mas não pré-inicializa ambientes.",
    "A provisioned concurrency mantém ambientes inicializados prontos, eliminando cold starts (e pode ser agendada com o Application Auto Scaling para os picos).",
    "Não reduz o tempo de inicialização.",
    "Piora: a inicialização passaria a rodar em toda invocação."
  ],
  kw: ["primeiras requisições após períodos de inatividade", "latência de inicialização consistentemente baixa"],
  obj: "Eliminar cold starts.",
  cons: ["Latência consistente", "Síncrono"],
  el: [2, 3],
  concept: "Provisioned concurrency",
  trap: "Reserved concurrency é confundida com 'deixar pronto'.",
  tip: "Cold start → provisioned concurrency (configurada em versão ou alias, nunca no $LATEST).",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html",
  ev: "Provisioned concurrency – This is the number of pre-initialized execution environments allocated to your Event Function.",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html"
},
{
  id: "d4-08", d: 4, t: "4.3", lvl: "Intermediária",
  q: "Uma função Lambda que processa imagens (uso intenso de CPU) está configurada com 128 MB e demora muito para concluir. O uso de memória observado é baixo. Qual mudança tende a reduzir a duração?",
  o: [
    "Aumentar o timeout",
    "Aumentar a memória configurada, pois a CPU alocada é proporcional à memória",
    "Habilitar reserved concurrency",
    "Usar uma layer com as bibliotecas de imagem"
  ],
  a: [1],
  w: [
    "Só permite que a função rode por mais tempo; não a deixa mais rápida.",
    "Na Lambda, a CPU é alocada proporcionalmente à memória: mais memória significa mais CPU, o que acelera cargas CPU-bound (e pode até reduzir o custo total).",
    "Não muda o desempenho de cada execução.",
    "As layers organizam dependências; não mudam o desempenho."
  ],
  kw: ["uso intenso de CPU", "128 MB", "uso de memória observado é baixo"],
  obj: "Acelerar uma função CPU-bound.",
  cons: ["CPU-bound", "Memória sobrando"],
  el: [3],
  concept: "Memória e CPU na Lambda",
  trap: "\"A memória está sobrando, então não preciso de mais\": ignora que a CPU acompanha a memória.",
  tip: "Lambda lenta e CPU-bound → aumentar a memória (teste com Lambda Power Tuning ou Compute Optimizer).",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html",
  ev: "Configure Lambda Event Function memory Lambda allocates CPU power in proportion to the amount of memory configured.",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html"
},
{
  id: "d4-09", d: 4, t: "4.3", lvl: "Intermediária",
  q: "Várias funções Lambda assinam um tópico do Amazon SNS de pedidos, mas uma delas só precisa processar pedidos com o atributo tipo = \"premium\". Hoje ela é invocada para todos os pedidos e descarta a maioria. Como otimizar?",
  o: [
    "Filtrar no código da função e retornar cedo",
    "Adicionar uma subscription filter policy na assinatura da função",
    "Criar uma fila SQS FIFO entre o SNS e a função",
    "Reduzir a memória da função"
  ],
  a: [1],
  w: [
    "Continua invocando e pagando por mensagens irrelevantes.",
    "A filter policy faz o SNS entregar à assinatura apenas as mensagens que casam com o filtro (por atributos ou pelo corpo).",
    "Adiciona complexidade sem filtrar.",
    "Reduz o custo por invocação, mas não o número de invocações."
  ],
  kw: ["só precisa processar pedidos com o atributo tipo = \"premium\"", "descarta a maioria"],
  obj: "Reduzir mensagens irrelevantes.",
  cons: ["Por assinatura", "Sem afetar os outros assinantes"],
  el: [3],
  concept: "Filtragem de mensagens no SNS",
  trap: "O filtro no código parece simples, mas ainda gera custo de invocação.",
  tip: "Assinante recebendo mensagens demais → subscription filter policy.",
  ref: "https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html",
  ev: "To receive only a subset of the messages, a subscriber must assign a filter policy to the topic subscription.",
  evu: "https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html"
},
{
  id: "d4-10", d: 4, t: "4.3", lvl: "Desafiadora",
  q: "Uma REST API no API Gateway retorna catálogos de produtos que mudam poucas vezes ao dia, e a resposta depende do header Accept-Language. A equipe quer reduzir as chamadas ao backend sem servir o idioma errado. Qual solução usar?",
  o: [
    "Habilitar o cache da stage sem configurar mais nada",
    "Habilitar o cache da stage e incluir o header Accept-Language como parâmetro da chave de cache do método",
    "Aumentar o throttling da stage",
    "Habilitar compressão de payload"
  ],
  a: [1],
  w: [
    "Sem incluir o header na chave, usuários de idiomas diferentes poderiam receber a mesma resposta em cache.",
    "Com o header na chave de cache, cada idioma tem sua própria entrada de cache, e o TTL controla a atualização.",
    "O throttling limita requisições, não reduz chamadas ao backend.",
    "A compressão reduz o tamanho da resposta, não o número de chamadas ao backend."
  ],
  kw: ["mudam poucas vezes ao dia", "depende do header Accept-Language", "sem servir o idioma errado"],
  obj: "Cache que varia por header.",
  cons: ["Cache correto por idioma"],
  el: [2, 3],
  concept: "Chaves de cache do API Gateway",
  trap: "Habilitar o cache sozinho parece suficiente, mas ignora a variação por header.",
  tip: "A resposta varia por header ou query string → inclua-o na chave de cache.",
  ref: "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html",
  ev: "You can use a method or integration parameter as cache keys to index cached responses. This includes custom headers, URL paths, or query strings.",
  evu: "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-caching.html"
},
{
  id: "d4-11", d: 4, t: "4.3", lvl: "Intermediária",
  q: "Uma tabela do DynamoDB em modo provisionado recebe tráfego muito imprevisível, com picos súbitos que geram ProvisionedThroughputExceededException mesmo com auto scaling habilitado. A equipe quer eliminar o gerenciamento de capacidade. O que fazer?",
  o: [
    "Aumentar o intervalo de cooldown do auto scaling",
    "Mudar a tabela para o modo de capacidade on-demand",
    "Criar um LSI para distribuir a carga",
    "Usar Scan em vez de Query"
  ],
  a: [1],
  w: [
    "Deixaria o ajuste ainda mais lento.",
    "O on-demand se adapta automaticamente ao tráfego, sem planejamento de capacidade, e é ideal para cargas imprevisíveis.",
    "O LSI compartilha a partição da tabela; não resolve picos.",
    "O Scan consome MAIS capacidade."
  ],
  kw: ["muito imprevisível", "picos súbitos", "eliminar o gerenciamento de capacidade"],
  obj: "Lidar com tráfego imprevisível.",
  cons: ["Sem gerenciar capacidade"],
  el: [2, 3],
  concept: "Modos de capacidade do DynamoDB",
  trap: "Ficar ajustando o auto scaling em vez de trocar de modo.",
  tip: "Tráfego imprevisível ou sem gestão de capacidade → on-demand.",
  ref: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html",
  ev: "DynamoDB on-demand enables you to create a table without worrying about capacity planning, monitoring usage, and configuring scaling policies.",
  evu: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html"
},
{
  id: "d4-12", d: 4, t: "4.2", lvl: "Intermediária",
  q: "A equipe quer ser notificada por email sempre que a métrica Errors de uma função Lambda passar de 5 em um período de 5 minutos. Qual solução usar?",
  o: [
    "Uma regra do AWS Config",
    "Um alarme do CloudWatch na métrica Errors com uma ação de notificação para um tópico SNS com assinatura de email",
    "Uma trilha do CloudTrail com notificações",
    "Um painel (dashboard) do CloudWatch"
  ],
  a: [1],
  w: [
    "O Config avalia a conformidade da configuração dos recursos, não métricas de execução.",
    "O alarme do CloudWatch avalia o limiar e aciona o tópico SNS, que envia o email.",
    "O CloudTrail registra chamadas de API, não erros de execução.",
    "Os dashboards visualizam dados, mas não notificam."
  ],
  kw: ["notificada por email", "passar de 5 em um período de 5 minutos"],
  obj: "Alertar com base em uma métrica.",
  cons: ["Limiar", "Email"],
  el: [0, 3],
  concept: "Alarmes do CloudWatch + SNS",
  trap: "Um dashboard mostra o problema, mas não avisa ninguém.",
  tip: "Métrica + limiar + notificação → alarme do CloudWatch → SNS.",
  ref: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html",
  ev: "You can create alarms that watch metrics and send notifications or automatically make changes to the resources you are monitoring when a threshold is breached. [...] The action can be sending a notification to an Amazon SNS topic [...].",
  evu: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html"
}
);
