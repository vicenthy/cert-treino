// Domínio 1 — Desenvolvimento com serviços AWS (32%)
// Campos: id, d (domínio), t (task), lvl, q (enunciado), o (opções), a (índices corretos),
// w (por que cada opção está certa/errada), kw (trechos-chave do enunciado), obj (objetivo),
// cons (restrições), el (opções elimináveis de cara), concept, trap, tip, ref
QB.push(
{
  id: "d1-01", d: 1, t: "1.2", lvl: "Intermediária",
  q: "Uma função Lambda é invocada de forma assíncrona por notificações de eventos do Amazon S3. A equipe precisa enviar os registros de invocações bem-sucedidas para um barramento do Amazon EventBridge e os registros de invocações que falharam após todas as tentativas para uma fila do Amazon SQS, incluindo detalhes da resposta da função. A solução deve exigir o MENOR esforço de desenvolvimento.",
  o: [
    "Configurar uma dead-letter queue (DLQ) do SQS na função e publicar manualmente no EventBridge dentro do código",
    "Configurar Lambda Destinations: OnSuccess para o EventBridge e OnFailure para a fila SQS",
    "Envolver o código em try/catch e chamar as APIs do EventBridge e do SQS dentro do handler",
    "Habilitar o AWS X-Ray e criar uma regra do EventBridge que leia os traces com erro"
  ],
  a: [1],
  w: [
    "A DLQ só captura falhas e envia apenas o evento original; o caminho de sucesso continuaria exigindo código próprio.",
    "Destinations para invocações assíncronas suportam condições de sucesso e de falha separadas, sem código, e o registro de invocação inclui detalhes da requisição e da resposta.",
    "Funciona, mas exige código, tratamento de retentativas e permissões extras: não é o menor esforço.",
    "O X-Ray serve para rastreamento e observabilidade, não para rotear resultados de invocações."
  ],
  kw: ["de forma assíncrona", "bem-sucedidas", "que falharam após todas as tentativas", "detalhes da resposta", "MENOR esforço"],
  obj: "Rotear resultados de sucesso e de falha de uma Lambda assíncrona para destinos diferentes.",
  cons: ["Invocação assíncrona", "Sucesso e falha em destinos distintos", "Menor esforço (sem código)"],
  el: [3],
  concept: "Lambda Destinations (OnSuccess/OnFailure) em invocações assíncronas",
  trap: "DLQ parece resolver, mas cobre apenas falhas e envia só o payload do evento.",
  tip: "Assíncrono + sucesso E falha → Destinations. Só falha → DLQ ou Destination OnFailure.",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html",
  ev: "You can configure separate destinations for events that are processed successfully, and events that fail all processing attempts. [...] The invocation record contains details about the request and response in JSON format.",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/invocation-async-retain-records.html"
},
{
  id: "d1-02", d: 1, t: "1.1", lvl: "Intermediária",
  q: "Uma aplicação consome mensagens de uma fila padrão do Amazon SQS. Cada mensagem leva cerca de 2 minutos para ser processada. A equipe percebe que muitas mensagens estão sendo processadas mais de uma vez por consumidores diferentes. Qual é a correção MAIS adequada?",
  o: [
    "Habilitar long polling definindo o tempo de espera da fila para 20 segundos",
    "Configurar uma delay queue de 2 minutos",
    "Aumentar o visibility timeout da fila para um valor maior que o tempo de processamento",
    "Migrar para uma fila FIFO para garantir a ordem das mensagens"
  ],
  a: [2],
  w: [
    "Long polling reduz recebimentos vazios e custo, mas não impede que a mensagem volte a ficar visível durante o processamento.",
    "A delay queue atrasa a primeira entrega, mas não protege a mensagem enquanto ela está sendo processada.",
    "Com visibility timeout padrão de 30 s, a mensagem reaparece antes de o processamento terminar e outro consumidor a recebe. O timeout precisa cobrir o tempo de processamento.",
    "FIFO garante ordem e deduplicação no envio, mas a mensagem também volta a ficar visível se o visibility timeout expirar antes da exclusão."
  ],
  kw: ["cerca de 2 minutos", "processadas mais de uma vez", "consumidores diferentes"],
  obj: "Evitar reprocessamento de mensagens durante o processamento.",
  cons: ["Processamento leva ~2 min", "Fila padrão", "Múltiplos consumidores"],
  el: [0],
  concept: "Visibility timeout do SQS",
  trap: "A FIFO é lembrada por 'exatamente uma vez', mas a deduplicação vale para o envio, não para o processamento demorado.",
  tip: "Mensagem duplicada + processamento longo → aumentar o visibility timeout (ou chamar ChangeMessageVisibility).",
  ref: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
  ev: "The default visibility timeout for a queue is 30 seconds, but you can adjust this to match the time your application needs to process and delete a message.",
  evu: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html"
},
{
  id: "d1-03", d: 1, t: "1.1", lvl: "Intermediária",
  q: "Um worker consulta uma fila do Amazon SQS em loop contínuo. A fila fica vazia na maior parte do tempo e a conta mostra um número alto de chamadas ReceiveMessage que retornam vazias, aumentando o custo. Qual mudança reduz o custo de forma MAIS eficiente?",
  o: [
    "Diminuir o visibility timeout da fila",
    "Configurar ReceiveMessageWaitTimeSeconds na fila para habilitar long polling",
    "Aumentar o período de retenção de mensagens",
    "Usar uma fila FIFO com deduplicação baseada em conteúdo"
  ],
  a: [1],
  w: [
    "O visibility timeout controla mensagens em processamento, não o número de recebimentos vazios.",
    "Long polling espera até 20 segundos por mensagens antes de responder, reduzindo drasticamente as respostas vazias e o custo.",
    "A retenção define por quanto tempo as mensagens ficam na fila; não tem relação com chamadas vazias.",
    "A deduplicação evita duplicatas no envio; não reduz o polling vazio."
  ],
  kw: ["vazia na maior parte do tempo", "retornam vazias", "reduz o custo"],
  obj: "Reduzir chamadas ReceiveMessage vazias.",
  cons: ["Fila quase sempre vazia", "Polling contínuo", "Foco em custo"],
  el: [2, 3],
  concept: "Short polling vs long polling no SQS",
  trap: "Opções que mexem em outros parâmetros da fila parecem técnicas, mas não atacam o problema.",
  tip: "Muitas respostas vazias → long polling (WaitTimeSeconds até 20).",
  ref: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html",
  ev: "The maximum long polling wait time is 20 seconds.",
  evu: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html"
},
{
  id: "d1-04", d: 1, t: "1.3", lvl: "Desafiadora",
  q: "Uma tabela do Amazon DynamoDB armazena pedidos usando o atributo status (PENDENTE, PAGO, ENVIADO) como chave de partição. Mesmo com capacidade provisionada suficiente no total, a aplicação recebe erros de throttling. O que o desenvolvedor deve fazer para distribuir melhor a carga?",
  o: [
    "Aumentar a capacidade de leitura e escrita provisionada da tabela",
    "Redesenhar a chave de partição usando um atributo de alta cardinalidade, como o ID do pedido",
    "Criar um índice secundário local usando status como chave de ordenação",
    "Habilitar o DynamoDB Streams na tabela"
  ],
  a: [1],
  w: [
    "Mais capacidade total não resolve partições 'quentes': a carga continua concentrada em poucos valores de chave.",
    "Uma chave com muitos valores distintos espalha as requisições por várias partições e elimina o hot partition.",
    "O LSI usa a mesma chave de partição da tabela, então mantém o mesmo problema de distribuição.",
    "O Streams captura alterações de itens; não muda a distribuição de leituras e escritas."
  ],
  kw: ["status (PENDENTE, PAGO, ENVIADO) como chave de partição", "capacidade provisionada suficiente no total", "throttling"],
  obj: "Eliminar o throttling causado por má distribuição da chave de partição.",
  cons: ["Chave com apenas 3 valores", "Capacidade total suficiente"],
  el: [3],
  concept: "Chaves de partição de alta cardinalidade",
  trap: "Aumentar a capacidade parece o óbvio, mas o enunciado diz que o total já é suficiente.",
  tip: "Throttling com capacidade 'sobrando' → hot partition → chave de alta cardinalidade.",
  ref: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html",
  ev: "You should design your application for uniform activity across all partition keys in the table and its secondary indexes.",
  evu: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html"
},
{
  id: "d1-05", d: 1, t: "1.3", lvl: "Pegadinha",
  q: "Uma tabela do DynamoDB em produção usa customerId como chave de partição. Surge um novo requisito: consultar pedidos por email do cliente, com bom desempenho, sem recriar a tabela. Qual solução atende ao requisito?",
  o: [
    "Adicionar um índice secundário local (LSI) com email como chave de ordenação",
    "Adicionar um índice secundário global (GSI) com email como chave de partição",
    "Usar uma operação Scan com FilterExpression no atributo email",
    "Habilitar o DynamoDB Accelerator (DAX) na tabela"
  ],
  a: [1],
  w: [
    "O LSI só pode ser criado junto com a tabela e mantém a mesma chave de partição (customerId); não permite buscar só pelo email.",
    "O GSI pode ser criado a qualquer momento e permite uma chave de partição diferente, viabilizando Query por email.",
    "O Scan lê a tabela inteira: funciona, mas com custo e latência altos à medida que a tabela cresce.",
    "O DAX acelera leituras de padrões de acesso existentes, mas não cria um novo padrão de acesso por email."
  ],
  kw: ["em produção", "consultar pedidos por email", "bom desempenho", "sem recriar a tabela"],
  obj: "Criar um novo padrão de acesso (por email) numa tabela existente.",
  cons: ["Tabela já existe", "Não pode recriar", "Consulta eficiente"],
  el: [3],
  concept: "GSI vs LSI no DynamoDB",
  trap: "O LSI parece mais 'barato', mas só pode ser criado na criação da tabela e exige a mesma partition key.",
  tip: "Tabela existente + nova chave de partição → GSI. LSI = mesma partition key, só na criação.",
  ref: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html",
  ev: "You can also add a new global secondary index to an existing table, or delete an existing global secondary index. [...] You cannot add a local secondary index to an existing table, nor can you delete any local secondary indexes that currently exist.",
  evu: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html"
},
{
  id: "d1-06", d: 1, t: "1.3", lvl: "Intermediária",
  q: "Logo após gravar um item no DynamoDB com PutItem, a aplicação lê o mesmo item com GetItem na tabela base e às vezes recebe a versão antiga. A aplicação precisa SEMPRE ler o dado mais recente. O que o desenvolvedor deve fazer?",
  o: [
    "Definir ConsistentRead como true na chamada GetItem",
    "Ler o item a partir de um índice secundário global",
    "Adicionar um cluster DAX na frente da tabela",
    "Aumentar as unidades de capacidade de escrita da tabela"
  ],
  a: [0],
  w: [
    "Leituras fortemente consistentes na tabela base retornam o resultado de todas as escritas confirmadas antes da leitura.",
    "GSIs só suportam leituras eventualmente consistentes.",
    "O DAX é um cache de escrita direta (write-through) e, para leituras fortemente consistentes, repassa a chamada ao DynamoDB; ele não resolve o problema sozinho.",
    "WCU afeta a taxa de escrita, não a consistência da leitura."
  ],
  kw: ["Logo após gravar", "às vezes recebe a versão antiga", "SEMPRE ler o dado mais recente"],
  obj: "Garantir read-after-write.",
  cons: ["Leitura na tabela base", "Precisa do dado mais recente"],
  el: [3],
  concept: "Modelos de consistência do DynamoDB",
  trap: "O GSI parece alternativa de leitura, mas só oferece consistência eventual.",
  tip: "\"Dado mais recente\" na tabela base → ConsistentRead=true (custa 2x as RCUs da leitura eventual).",
  ref: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html",
  ev: "If you set ConsistentRead to true, DynamoDB returns a response with the most up-to-date data, reflecting the updates from all prior write operations that were successful. [...] Strongly consistent reads from a global secondary index or a DynamoDB stream are not supported.",
  evu: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html"
},
{
  id: "d1-07", d: 1, t: "1.3", lvl: "Desafiadora",
  q: "Uma aplicação precisa executar 10 leituras fortemente consistentes por segundo em uma tabela do DynamoDB com capacidade provisionada. Cada item tem 6 KB. Quantas unidades de capacidade de leitura (RCUs) são necessárias?",
  o: ["10 RCUs", "15 RCUs", "20 RCUs", "60 RCUs"],
  a: [2],
  w: [
    "10 seria o valor para leituras eventualmente consistentes (metade do custo).",
    "15 resulta de dividir 6 KB por 4 KB sem arredondar para cima.",
    "1 RCU = 1 leitura fortemente consistente/s de até 4 KB. 6 KB arredonda para 8 KB = 2 RCUs por leitura × 10 leituras = 20 RCUs.",
    "60 confunde o tamanho em KB com unidades de capacidade."
  ],
  kw: ["10 leituras fortemente consistentes por segundo", "6 KB"],
  obj: "Calcular RCUs.",
  cons: ["Fortemente consistente", "6 KB por item", "10 leituras/s"],
  el: [3],
  concept: "Cálculo de RCU",
  trap: "Esquecer de arredondar o tamanho para o próximo múltiplo de 4 KB.",
  tip: "RCU: arredonde o item para múltiplos de 4 KB; forte = 1×, eventual = 0,5×, transacional = 2×.",
  ref: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html",
  ev: "For an item up to 4 KB, one read capacity unit (RCU) represents one strongly consistent read operation per second, or two eventually consistent read operations per second.",
  evu: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html"
},
{
  id: "d1-08", d: 1, t: "1.3", lvl: "Intermediária",
  q: "Uma tabela do DynamoDB com milhões de itens usa orderId como chave de partição. A aplicação lista todos os pedidos de um cliente usando Scan com FilterExpression em customerId, e a operação ficou lenta e cara. Qual é a solução MAIS eficiente?",
  o: [
    "Usar parallel scan para dividir o Scan entre vários workers",
    "Criar um GSI com customerId como chave de partição e usar Query nesse índice",
    "Reduzir o parâmetro Limit do Scan para paginar os resultados",
    "Aumentar a capacidade de leitura provisionada"
  ],
  a: [1],
  w: [
    "O parallel scan reduz o tempo total, mas continua lendo e cobrando a tabela inteira.",
    "O Query lê apenas os itens da partição do cliente; com um GSI por customerId, o custo é proporcional ao resultado.",
    "Paginar não reduz a quantidade total de dados lidos pelo Scan.",
    "Mais capacidade aumenta o custo sem corrigir o padrão de acesso ineficiente."
  ],
  kw: ["milhões de itens", "Scan com FilterExpression", "lenta e cara", "MAIS eficiente"],
  obj: "Buscar itens por cliente sem varrer a tabela.",
  cons: ["Tabela grande", "Custo e latência"],
  el: [3],
  concept: "Query vs Scan",
  trap: "A FilterExpression é aplicada DEPOIS da leitura: você paga por tudo o que foi lido.",
  tip: "Scan + filtro em tabela grande é quase sempre a resposta errada. Modele a chave (ou um GSI) e use Query.",
  ref: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html",
  ev: "Performance considerations for scans In general, Scan operations are less efficient than other operations in DynamoDB.",
  evu: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-query-scan.html"
},
{
  id: "d1-09", d: 1, t: "1.3", lvl: "Desafiadora",
  q: "Dois microsserviços podem atualizar o mesmo item de estoque no DynamoDB ao mesmo tempo, e algumas atualizações estão sobrescrevendo outras. O desenvolvedor precisa garantir que uma atualização só seja aplicada se o item não tiver sido alterado desde a leitura. Qual abordagem atende ao requisito?",
  o: [
    "Usar leituras fortemente consistentes antes de cada atualização",
    "Adicionar um atributo de versão e usar uma ConditionExpression no UpdateItem comparando a versão lida",
    "Colocar um cluster DAX na frente da tabela",
    "Habilitar o DynamoDB Streams e reprocessar os conflitos"
  ],
  a: [1],
  w: [
    "Ler o dado mais recente não impede que outro processo grave entre a sua leitura e a sua escrita.",
    "Optimistic locking: a escrita condicional falha (ConditionalCheckFailedException) se a versão mudou, evitando lost updates.",
    "O DAX acelera leituras e não oferece controle de concorrência.",
    "O Streams permite reagir depois do fato; não impede a sobrescrita."
  ],
  kw: ["ao mesmo tempo", "sobrescrevendo outras", "só seja aplicada se o item não tiver sido alterado"],
  obj: "Evitar lost updates com escritas concorrentes.",
  cons: ["Escritas concorrentes", "Atualização condicional"],
  el: [2],
  concept: "Escritas condicionais / optimistic locking",
  trap: "A leitura forte parece resolver, mas não cria atomicidade entre ler e gravar.",
  tip: "\"Só atualizar se não mudou\" → ConditionExpression com número de versão.",
  ref: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html",
  ev: "The condition expression must evaluate to true in order for the operation to succeed; otherwise, the operation fails.",
  evu: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html"
},
{
  id: "d1-10", d: 1, t: "1.3", lvl: "Intermediária",
  q: "Uma aplicação de leitura intensa sobre o DynamoDB precisa reduzir a latência de leitura de milissegundos para microssegundos. A equipe quer fazer o MÍNIMO de mudanças no código e não quer implementar lógica de cache própria. Qual solução usar?",
  o: [
    "Amazon ElastiCache (Redis OSS) com estratégia lazy loading",
    "Amazon DynamoDB Accelerator (DAX)",
    "Réplicas de leitura do DynamoDB",
    "Aumentar as RCUs e usar leituras fortemente consistentes"
  ],
  a: [1],
  w: [
    "O ElastiCache funciona, mas exige escrever a lógica de cache (ler, invalidar, gravar) na aplicação.",
    "O DAX é um cache em memória compatível com a API do DynamoDB: basta trocar o cliente, sem lógica de cache própria, com latência de microssegundos.",
    "O DynamoDB não tem 'réplicas de leitura' como o RDS (as global tables são multi-Região, para outro objetivo).",
    "Mais RCUs aumentam a vazão, não reduzem a latência para microssegundos."
  ],
  kw: ["leitura intensa", "microssegundos", "MÍNIMO de mudanças no código", "não quer implementar lógica de cache"],
  obj: "Cache de leitura transparente para o DynamoDB.",
  cons: ["Latência de microssegundos", "Mínimo de código"],
  el: [2, 3],
  concept: "DAX vs ElastiCache",
  trap: "ElastiCache também é cache em memória, mas exige código de cache na aplicação.",
  tip: "DynamoDB + microssegundos + pouca mudança → DAX.",
  ref: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html",
  ev: "DAX reduces operational and application complexity by providing a managed service that is API-compatible with DynamoDB.",
  evu: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html"
},
{
  id: "d1-11", d: 1, t: "1.3", lvl: "Desafiadora", multi: true,
  q: "Uma aplicação usa Amazon ElastiCache com lazy loading na frente de um banco de dados. Os usuários reclamam de dados desatualizados após atualizações, e o cache está ficando cheio de chaves que nunca mais são lidas. Quais DUAS ações resolvem esses problemas? (Selecione DUAS.)",
  o: [
    "Implementar write-through, atualizando o cache sempre que o banco for gravado",
    "Adicionar um TTL (time to live) às chaves do cache",
    "Manter apenas lazy loading e aumentar o tipo de nó do cluster",
    "Habilitar Multi-AZ no cluster do ElastiCache",
    "Mover o cache para o armazenamento /tmp da função Lambda"
  ],
  a: [0, 1],
  w: [
    "Com write-through, toda escrita no banco também atualiza o cache, eliminando dados desatualizados.",
    "O TTL expira chaves antigas ou pouco usadas, liberando espaço e limitando o tempo máximo de desatualização.",
    "Um nó maior adia o problema do espaço, mas não resolve dados desatualizados.",
    "Multi-AZ melhora a disponibilidade, não a atualização dos dados.",
    "O /tmp é local de cada ambiente de execução, efêmero e não compartilhado."
  ],
  kw: ["lazy loading", "dados desatualizados após atualizações", "cheio de chaves que nunca mais são lidas"],
  obj: "Reduzir dados obsoletos e o desperdício de espaço no cache.",
  cons: ["Dados obsoletos", "Chaves não usadas"],
  el: [3, 4],
  concept: "Estratégias de cache: lazy loading, write-through e TTL",
  trap: "Write-through sozinho enche o cache de dados nunca lidos, por isso a combinação com TTL.",
  tip: "Write-through = dados frescos; TTL = limpeza; lazy loading = só cacheia o que é lido.",
  ref: "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html",
  ev: "If data is written to the cache only when there is a cache miss, data in the cache can become stale. [...] To address this issue, you can use the Write-through and Adding TTL strategies.",
  evu: "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html"
},
{
  id: "d1-12", d: 1, t: "1.1", lvl: "Intermediária",
  q: "Quando um pedido é criado, três serviços independentes (faturamento, estoque e notificações) precisam processar o MESMO evento, cada um no seu ritmo e com buffer caso algum fique indisponível. Qual arquitetura atende ao requisito com baixo acoplamento?",
  o: [
    "Uma única fila SQS consultada pelos três serviços",
    "Um tópico do Amazon SNS com uma fila SQS assinada para cada serviço (fanout)",
    "Uma fila SQS FIFO com um message group para cada serviço",
    "Uma função Lambda que chama os três serviços de forma síncrona e sequencial"
  ],
  a: [1],
  w: [
    "Numa única fila, cada mensagem é consumida por apenas UM consumidor (consumidores competindo); os outros não receberiam o evento.",
    "O fanout SNS + SQS entrega uma cópia para cada fila, e cada serviço consome no seu ritmo com buffer durável.",
    "Os message groups ordenam mensagens, mas cada mensagem continua sendo entregue a apenas um consumidor.",
    "Chamadas síncronas acoplam os serviços: se um falha, o fluxo inteiro é afetado."
  ],
  kw: ["três serviços independentes", "MESMO evento", "cada um no seu ritmo", "com buffer", "baixo acoplamento"],
  obj: "Entregar o mesmo evento a vários consumidores, cada um com buffer próprio.",
  cons: ["Três consumidores", "Ritmos diferentes", "Tolerância a indisponibilidade"],
  el: [3],
  concept: "Padrão fanout (SNS + SQS)",
  trap: "Várias aplicações lendo a mesma fila parece distribuir o evento, mas cada mensagem vai para um só consumidor.",
  tip: "Mesmo evento para N consumidores com buffer → SNS (ou EventBridge) → N filas SQS.",
  ref: "https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html",
  ev: "When you subscribe an Amazon SQS queue to an Amazon SNS topic, you can publish a message to the topic and Amazon SNS sends an Amazon SQS message to the subscribed queue.",
  evu: "https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html"
},
{
  id: "d1-13", d: 1, t: "1.2", lvl: "Desafiadora",
  q: "Uma função Lambda foi conectada a subnets privadas de uma VPC para acessar um banco de dados Amazon RDS. Depois disso, as chamadas da função para uma API de pagamentos externa na internet começaram a dar timeout. Como restaurar o acesso à internet mantendo o acesso ao RDS?",
  o: [
    "Atribuir um IP público à função Lambda",
    "Criar um NAT gateway em uma subnet pública e rotear o tráfego de saída das subnets privadas para ele",
    "Criar um interface VPC endpoint para a API de pagamentos",
    "Adicionar uma rota das subnets privadas diretamente para o internet gateway"
  ],
  a: [1],
  w: [
    "Funções Lambda em VPC não recebem IP público, nem mesmo em subnets públicas.",
    "As funções em subnets privadas saem para a internet por um NAT gateway numa subnet pública, que tem rota para o internet gateway.",
    "VPC endpoints dão acesso a serviços da AWS e a serviços PrivateLink, não a APIs arbitrárias da internet.",
    "Sem IP público, uma rota direta para o IGW não funciona para a função."
  ],
  kw: ["subnets privadas", "acessar um banco de dados Amazon RDS", "API de pagamentos externa na internet", "timeout"],
  obj: "Dar acesso à internet para uma Lambda em VPC.",
  cons: ["Precisa manter o acesso ao RDS na VPC", "Destino na internet pública"],
  el: [0],
  concept: "Lambda em VPC e acesso à internet",
  trap: "VPC endpoint parece resolver 'acesso externo', mas só serve para serviços AWS e PrivateLink.",
  tip: "Lambda em VPC + internet → NAT gateway. Lambda em VPC + serviço AWS → VPC endpoint ou NAT.",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc-internet.html",
  ev: "Connecting a function to a public subnet doesn't give it internet access or a public IP address.",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html"
},
{
  id: "d1-14", d: 1, t: "1.2", lvl: "Intermediária",
  q: "Uma função Lambda abre uma nova conexão com o banco de dados e cria um novo cliente do SDK a cada invocação, o que aumenta a latência. Qual mudança de código é a MAIS adequada para melhorar o desempenho?",
  o: [
    "Aumentar o timeout da função",
    "Inicializar o cliente do SDK e a conexão fora do handler para reutilizá-los entre invocações",
    "Armazenar a conexão em uma variável de ambiente",
    "Habilitar provisioned concurrency mantendo a inicialização dentro do handler"
  ],
  a: [1],
  w: [
    "O timeout só define quanto a função pode rodar; não reduz o trabalho repetido.",
    "O código fora do handler roda na inicialização do ambiente de execução, e os objetos ficam disponíveis para as invocações seguintes no mesmo ambiente.",
    "Variáveis de ambiente guardam strings de configuração, não objetos de conexão.",
    "A provisioned concurrency elimina cold starts, mas se a conexão continua sendo criada no handler, o custo se repete a cada chamada."
  ],
  kw: ["a cada invocação", "aumenta a latência", "mudança de código"],
  obj: "Reutilizar recursos caros entre invocações.",
  cons: ["Mudança de código", "Reduzir latência"],
  el: [2],
  concept: "Reuso do ambiente de execução (código fora do handler)",
  trap: "A provisioned concurrency resolve cold start, não trabalho repetido dentro do handler.",
  tip: "Clientes do SDK, conexões e configurações carregadas → fora do handler.",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html",
  ev: "Initialize SDK clients and database connections outside of the function handler, and cache static assets locally in the /tmp directory.",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html"
},
{
  id: "d1-15", d: 1, t: "1.2", lvl: "Pegadinha",
  q: "Uma função Lambda processa mensagens de uma fila SQS em lotes de 10. Quando apenas uma mensagem do lote falha, todas as 10 voltam para a fila e são reprocessadas. Como evitar o reprocessamento das mensagens bem-sucedidas SEM reduzir a vazão?",
  o: [
    "Definir o tamanho do lote como 1",
    "Configurar uma dead-letter queue na própria função Lambda",
    "Habilitar ReportBatchItemFailures no event source mapping e retornar os IDs das mensagens que falharam",
    "Aumentar o visibility timeout da fila"
  ],
  a: [2],
  w: [
    "Funciona, mas reduz a vazão, o que o enunciado proíbe.",
    "A DLQ da função vale para invocações assíncronas; o event source mapping do SQS é síncrono (a DLQ deve ficar na fila de origem).",
    "Com partial batch response, a Lambda devolve à fila apenas as mensagens listadas em batchItemFailures.",
    "O visibility timeout muda quando a mensagem reaparece, não quais mensagens voltam."
  ],
  kw: ["em lotes de 10", "apenas uma mensagem do lote falha", "SEM reduzir a vazão"],
  obj: "Reprocessar só as mensagens que falharam.",
  cons: ["Manter o tamanho do lote", "Falhas parciais"],
  el: [3],
  concept: "Partial batch response (ReportBatchItemFailures)",
  trap: "O lote de tamanho 1 'resolve', mas viola a restrição de vazão.",
  tip: "SQS + Lambda + falha parcial → ReportBatchItemFailures.",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html",
  ev: "You can also customize error handling behavior by configuring your SQS event source mapping to return partial batch responses.",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html"
},
{
  id: "d1-16", d: 1, t: "1.1", lvl: "Desafiadora",
  q: "Milhares de dispositivos IoT enviam leituras para o Amazon Kinesis Data Streams. As leituras de um MESMO dispositivo precisam ser processadas na ordem em que foram geradas, e o stream precisa escalar para vários shards. Como o produtor deve definir a partition key?",
  o: [
    "Usar um valor aleatório (UUID) para distribuir a carga igualmente",
    "Usar o ID do dispositivo como partition key",
    "Usar a mesma partition key fixa para todos os registros",
    "Não usar Kinesis e trocar por uma fila SQS padrão"
  ],
  a: [1],
  w: [
    "Um UUID distribui a carga, mas espalha registros do mesmo dispositivo por shards diferentes, perdendo a ordem.",
    "Registros com a mesma partition key vão para o mesmo shard, que preserva a ordem; com muitos dispositivos, a carga se distribui entre os shards.",
    "Uma chave fixa manda tudo para um único shard, criando hot shard e impedindo a escala.",
    "A SQS padrão não garante ordem."
  ],
  kw: ["MESMO dispositivo", "na ordem em que foram geradas", "escalar para vários shards"],
  obj: "Manter a ordem por dispositivo e escalar.",
  cons: ["Ordem por dispositivo", "Vários shards"],
  el: [3],
  concept: "Partition key e ordenação por shard no Kinesis",
  trap: "O UUID 'distribui bem', mas quebra a ordem por entidade.",
  tip: "Ordem por entidade → partition key = ID da entidade (alta cardinalidade).",
  ref: "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html",
  ev: "Partition Key A partition key is used to group data by shard within a stream.",
  evu: "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html"
},
{
  id: "d1-17", d: 1, t: "1.1", lvl: "Intermediária",
  q: "Uma REST API no Amazon API Gateway integra com uma função Lambda. Muitas requisições chegam sem campos obrigatórios no corpo JSON, gerando invocações e custo desnecessários. Qual solução rejeita essas requisições ANTES de invocar a Lambda com o MENOR esforço?",
  o: [
    "Adicionar validação no início do código da Lambda",
    "Configurar um request validator no método com um model (JSON Schema) para o corpo",
    "Criar um Lambda authorizer que valide o corpo da requisição",
    "Colocar o AWS WAF na frente da API com regras gerenciadas"
  ],
  a: [1],
  w: [
    "A Lambda continuaria sendo invocada e cobrada.",
    "O API Gateway valida o corpo contra o model e retorna 400 sem chamar a integração, sem código.",
    "Authorizers tratam autenticação e autorização, além de serem uma Lambda a mais para manter.",
    "As regras gerenciadas do WAF protegem contra ameaças comuns, não validam o esquema de negócio do corpo."
  ],
  kw: ["sem campos obrigatórios", "ANTES de invocar a Lambda", "MENOR esforço"],
  obj: "Validar o payload no API Gateway.",
  cons: ["Sem invocar a Lambda", "Sem código"],
  el: [3],
  concept: "Validação de requisições no API Gateway",
  trap: "O authorizer roda antes da integração, mas não é feito para validar esquema.",
  tip: "Validar corpo, parâmetros ou headers sem código → request validator + model.",
  ref: "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-method-request-validation.html",
  ev: "Request validation for REST APIs in API Gateway You can configure API Gateway to perform basic validation of an API request before proceeding with the integration request.",
  evu: "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-method-request-validation.html"
},
{
  id: "d1-18", d: 1, t: "1.1", lvl: "Intermediária",
  q: "Uma equipe precisa executar uma função Lambda todos os dias às 02:00 (horário UTC) para gerar relatórios. A solução deve ser serverless e ter a MENOR sobrecarga operacional. O que usar?",
  o: [
    "Uma instância EC2 com cron que invoca a função",
    "Um agendamento no Amazon EventBridge Scheduler com expressão cron apontando para a função",
    "Uma fila SQS com delay de 24 horas",
    "Uma máquina de estado do Step Functions em loop com um estado Wait de 24 horas"
  ],
  a: [1],
  w: [
    "Exige gerenciar um servidor: não é serverless.",
    "O EventBridge Scheduler (ou uma regra agendada do EventBridge) invoca alvos com cron ou rate, sem servidor.",
    "O delay máximo de uma fila SQS é de 15 minutos.",
    "Funcionaria, mas é uma solução complexa e com custo contínuo para um simples agendamento."
  ],
  kw: ["todos os dias às 02:00", "serverless", "MENOR sobrecarga operacional"],
  obj: "Agendar a execução periódica de uma Lambda.",
  cons: ["Serverless", "Agendamento diário"],
  el: [0, 2],
  concept: "Agendamentos com o Amazon EventBridge",
  trap: "O Step Functions consegue esperar, mas é exagero para cron.",
  tip: "Executar algo periodicamente sem servidor → EventBridge Scheduler (ou regra agendada).",
  ref: "https://docs.aws.amazon.com/scheduler/latest/UserGuide/what-is-scheduler.html",
  ev: "With EventBridge Scheduler, you can create schedules using cron and rate expressions for recurring patterns, or configure one-time invocations.",
  evu: "https://docs.aws.amazon.com/scheduler/latest/UserGuide/what-is-scheduler.html"
},
{
  id: "d1-19", d: 1, t: "1.1", lvl: "Intermediária",
  q: "Uma aplicação chama uma API de terceiros que, em horários de pico, retorna erros HTTP 429 (Too Many Requests) e 503. A equipe quer tornar a integração resiliente sem sobrecarregar ainda mais o serviço externo. Qual abordagem é a MAIS indicada?",
  o: [
    "Repetir imediatamente a requisição em loop até ter sucesso",
    "Implementar retentativas com backoff exponencial e jitter, com um número máximo de tentativas",
    "Aumentar a memória da função que faz a chamada",
    "Disparar várias requisições paralelas e usar a primeira resposta"
  ],
  a: [1],
  w: [
    "Retentativas imediatas aumentam a carga sobre um serviço já sobrecarregado (efeito manada).",
    "O backoff exponencial espaça as tentativas e o jitter evita que clientes sincronizados tentem ao mesmo tempo; o limite evita loops infinitos.",
    "Mais memória não muda os limites do serviço externo.",
    "Requisições paralelas multiplicam a carga e pioram o throttling."
  ],
  kw: ["429 (Too Many Requests) e 503", "resiliente", "sem sobrecarregar ainda mais"],
  obj: "Tratar erros transitórios com resiliência.",
  cons: ["Não aumentar a carga", "Erros transitórios"],
  el: [2],
  concept: "Retry com backoff exponencial e jitter",
  trap: "Retentativa sem espera parece resiliente, mas agrava a falha.",
  tip: "Throttling ou erro 5xx transitório → backoff exponencial + jitter (os SDKs da AWS já fazem isso).",
  ref: "https://docs.aws.amazon.com/sdkref/latest/guide/feature-retry-behavior.html",
  ev: "The SDK uses exponential backoff with full jitter. [...] Full jitter spreads retries uniformly across the entire backoff window so the service receives a steady trickle of requests instead of synchronized spikes.",
  evu: "https://docs.aws.amazon.com/sdkref/latest/guide/feature-retry-behavior.html"
},
{
  id: "d1-20", d: 1, t: "1.1", lvl: "Pegadinha",
  q: "Um fluxo de pedidos tem várias etapas (reservar estoque, cobrar, emitir nota) e precisa de retentativas por etapa, compensação em caso de falha e uma pausa de até 3 dias aguardando aprovação humana. A equipe quer visualizar cada execução. Qual solução usar?",
  o: [
    "Funções Lambda que chamam umas às outras em cadeia",
    "Um fluxo Express do AWS Step Functions",
    "Um fluxo Standard do AWS Step Functions com Retry e Catch",
    "Filas SQS entre cada etapa, com um consumidor por fila"
  ],
  a: [2],
  w: [
    "O encadeamento de Lambdas acopla as etapas, dificulta a compensação e não tem visualização.",
    "Fluxos Express duram no máximo 5 minutos: não suportam a espera de 3 dias.",
    "O Standard suporta execuções de até 1 ano, Retry e Catch por estado (compensação), espera por callback (aprovação) e histórico visual.",
    "As filas desacoplam, mas a orquestração, a compensação e a visualização ficariam por sua conta."
  ],
  kw: ["várias etapas", "retentativas por etapa", "compensação", "até 3 dias", "visualizar cada execução"],
  obj: "Orquestrar um fluxo longo com tratamento de erros.",
  cons: ["Duração de dias", "Compensação", "Visualização"],
  el: [0],
  concept: "Step Functions Standard vs Express",
  trap: "Express parece bom por ser 'mais barato', mas o limite de 5 minutos o elimina.",
  tip: "Fluxo longo, auditável ou com espera humana → Standard. Alto volume e curta duração → Express.",
  ref: "https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html",
  ev: "Standard Workflows are ideal for long-running (up to one year), durable, and auditable workflows.",
  evu: "https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html"
},
{
  id: "d1-21", d: 1, t: "1.1", lvl: "Intermediária",
  q: "Um app móvel precisa enviar vídeos de até 2 GB para um bucket S3 privado. O app já se autentica no backend da empresa e não deve conter credenciais da AWS. A equipe quer evitar que os arquivos passem pelo backend. Qual solução usar?",
  o: [
    "Tornar o bucket público para escrita",
    "Embutir no app as chaves de acesso de um usuário IAM com permissão de PutObject",
    "O backend gera uma URL pré-assinada (presigned URL) de upload, e o app envia o arquivo direto para o S3",
    "Enviar o arquivo para o API Gateway, que repassa para uma Lambda gravar no S3"
  ],
  a: [2],
  w: [
    "Um bucket público para escrita é um grave risco de segurança.",
    "Credenciais de longo prazo embutidas no app podem ser extraídas.",
    "A URL pré-assinada concede acesso temporário a uma operação específica usando as credenciais do backend; o upload vai direto ao S3.",
    "O API Gateway tem limite de payload de 10 MB, e o arquivo passaria pelo backend."
  ],
  kw: ["até 2 GB", "bucket S3 privado", "não deve conter credenciais da AWS", "evitar que os arquivos passem pelo backend"],
  obj: "Upload direto e seguro para o S3.",
  cons: ["Bucket privado", "Sem credenciais no app", "Sem passar pelo backend"],
  el: [0, 1],
  concept: "URLs pré-assinadas do S3",
  trap: "O API Gateway + Lambda parece 'serverless e certo', mas esbarra no limite de payload.",
  tip: "Acesso temporário a um objeto sem credenciais AWS no cliente → presigned URL.",
  ref: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html",
  ev: "Uploading objects with presigned URLs You may use presigned URLs to allow someone to upload an object to your Amazon S3 bucket.",
  evu: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html"
}
);
