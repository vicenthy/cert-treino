// Domínio 2 — Segurança (26%)
QB.push(
{
  id: "d2-01", d: 2, t: "2.1", lvl: "Intermediária",
  q: "Um app móvel precisa de cadastro e login de usuários, e as chamadas para uma REST API no API Gateway só podem ser aceitas de usuários autenticados. A equipe quer escrever o MÍNIMO de código de autenticação. Qual solução usar?",
  o: [
    "Criar um usuário IAM para cada cliente do app",
    "Usar um Amazon Cognito user pool e configurar um authorizer do tipo Cognito user pool no API Gateway",
    "Usar apenas um Cognito identity pool, sem user pool, e validar os tokens em uma Lambda",
    "Implementar um Lambda authorizer que valida JWTs emitidos por um serviço de login próprio"
  ],
  a: [1],
  w: [
    "Usuários IAM não servem para usuários finais de aplicações e não escalam para clientes.",
    "O user pool oferece cadastro, login e emissão de JWT; o authorizer Cognito valida o token sem nenhum código.",
    "O identity pool troca identidades por credenciais AWS temporárias; ele não é um diretório de usuários com login próprio.",
    "Funciona, mas exige construir e manter o serviço de login e o authorizer."
  ],
  kw: ["cadastro e login de usuários", "usuários autenticados", "MÍNIMO de código"],
  obj: "Autenticar usuários finais e proteger a API.",
  cons: ["Cadastro e login", "Proteção da API", "Mínimo de código"],
  el: [0],
  concept: "Cognito user pool + authorizer do API Gateway",
  trap: "Confundir user pool (autenticação, JWT) com identity pool (credenciais AWS).",
  tip: "Login e tokens → user pool. Credenciais AWS temporárias para o app → identity pool.",
  ref: "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html",
  ev: "After the API is deployed, the client must first sign the user in to the user pool, obtain an identity or access token for the user, and then call the API method with one of the tokens, which are typically set to the request's Authorization header.",
  evu: "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html"
},
{
  id: "d2-02", d: 2, t: "2.1", lvl: "Desafiadora", multi: true,
  q: "Usuários autenticados de um app móvel precisam enviar fotos diretamente para o Amazon S3, e cada usuário só pode acessar o próprio prefixo (pasta) no bucket. Quais DUAS ações atendem ao requisito? (Selecione DUAS.)",
  o: [
    "Usar um Amazon Cognito identity pool para obter credenciais AWS temporárias para o usuário",
    "Na policy da role IAM autenticada, restringir o recurso usando a variável ${cognito-identity.amazonaws.com:sub} no prefixo",
    "Criar grupos no user pool, um para cada usuário",
    "Distribuir no app as chaves de acesso de um usuário IAM com acesso ao bucket",
    "Habilitar ACLs públicas no bucket com permissão de escrita"
  ],
  a: [0, 1],
  w: [
    "O identity pool troca o login do usuário por credenciais temporárias de uma role IAM.",
    "A variável de política substitui o ID da identidade de cada usuário, limitando o acesso ao próprio prefixo.",
    "Criar um grupo por usuário não escala e, sozinho, não gera credenciais AWS.",
    "Chaves de longo prazo embutidas no app podem ser extraídas e são compartilhadas por todos os usuários.",
    "Uma ACL pública para escrita expõe o bucket a qualquer pessoa."
  ],
  kw: ["diretamente para o Amazon S3", "só pode acessar o próprio prefixo"],
  obj: "Dar acesso direto e isolado por usuário ao S3.",
  cons: ["Acesso direto ao S3", "Isolamento por usuário"],
  el: [3, 4],
  concept: "Identity pool + variáveis de política do IAM",
  trap: "Grupos do user pool parecem isolar usuários, mas não fornecem credenciais AWS sozinhos.",
  tip: "Isolamento por usuário em S3 ou DynamoDB → variável de política com o ID do usuário.",
  ref: "https://docs.aws.amazon.com/cognito/latest/developerguide/iam-roles.html",
  ev: "Amazon Cognito indicates the authentication state in the amr claim in the identity pool token. cognito-identity.amazonaws.com:sub Restricts the role to one or more users by UUID.",
  evu: "https://docs.aws.amazon.com/cognito/latest/developerguide/iam-roles.html"
},
{
  id: "d2-03", d: 2, t: "2.1", lvl: "Intermediária",
  q: "Uma aplicação em instâncias EC2 precisa ler objetos de um bucket S3. Hoje, as chaves de acesso de um usuário IAM estão em um arquivo de configuração na instância. Qual é a forma MAIS segura de conceder o acesso?",
  o: [
    "Mover as chaves de acesso para variáveis de ambiente",
    "Criar uma role IAM com permissão de leitura no bucket e associá-la às instâncias por um instance profile",
    "Criptografar o arquivo de configuração com o AWS KMS",
    "Tornar o bucket público para leitura"
  ],
  a: [1],
  w: [
    "Continua usando credenciais de longo prazo, só que em outro lugar.",
    "A role fornece credenciais temporárias, rotacionadas automaticamente e obtidas pelo SDK via metadados da instância, sem chaves armazenadas.",
    "Melhora um pouco, mas mantém credenciais de longo prazo e cria o problema de gerenciar a chave de decriptação.",
    "Expõe os dados para qualquer pessoa."
  ],
  kw: ["instâncias EC2", "chaves de acesso de um usuário IAM", "MAIS segura"],
  obj: "Dar acesso a serviços AWS sem chaves de longo prazo.",
  cons: ["Workload em EC2", "Máxima segurança"],
  el: [3],
  concept: "Roles IAM e instance profiles",
  trap: "Variáveis de ambiente parecem mais seguras que arquivos, mas a credencial continua sendo de longo prazo.",
  tip: "Código rodando na AWS acessando a AWS → sempre role (instance profile, task role, execution role).",
  ref: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html",
  ev: "Instead, you can and should use an IAM role to manage temporary credentials for applications that run on an Amazon EC2 instance.",
  evu: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2.html"
},
{
  id: "d2-04", d: 2, t: "2.1", lvl: "Desafiadora",
  q: "Uma aplicação na conta A precisa ler itens de uma tabela do DynamoDB na conta B. A equipe de segurança proíbe credenciais de longo prazo compartilhadas. Qual solução atende ao requisito?",
  o: [
    "Criar um usuário IAM na conta B e copiar as chaves de acesso para a aplicação na conta A",
    "Criar na conta B uma role com permissão de leitura na tabela e uma trust policy confiando na conta A; a aplicação chama sts:AssumeRole",
    "Adicionar uma resource-based policy à tabela que permita acesso público",
    "Replicar a tabela para a conta A com o DynamoDB Streams"
  ],
  a: [1],
  w: [
    "São credenciais de longo prazo compartilhadas: violam o requisito.",
    "O AssumeRole entre contas retorna credenciais temporárias; a trust policy define quem pode assumir a role, e a permissions policy define o que ela pode fazer.",
    "Acesso público é inseguro e desnecessário.",
    "A replicação é complexa, duplica os dados e não resolve o acesso de forma simples."
  ],
  kw: ["conta A", "conta B", "proíbe credenciais de longo prazo compartilhadas"],
  obj: "Acesso entre contas com credenciais temporárias.",
  cons: ["Entre contas", "Sem credenciais de longo prazo"],
  el: [2],
  concept: "Acesso entre contas com AssumeRole",
  trap: "Lembrar que a conta A também precisa de permissão sts:AssumeRole na identidade que chama a API.",
  tip: "Entre contas → role na conta dona do recurso + trust policy + sts:AssumeRole.",
  ref: "https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html",
  ev: "When you create the role, you define the Originating account as a trusted entity and specify a permissions policy that allows trusted users to update the amzn-s3-demo-bucket-shared-container bucket.",
  evu: "https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html"
},
{
  id: "d2-05", d: 2, t: "2.1", lvl: "Intermediária",
  q: "Uma REST API no API Gateway precisa aceitar bearer tokens emitidos por um provedor de identidade de terceiros que NÃO é OIDC e cuja validação exige chamar um endpoint de introspecção do provedor. Qual mecanismo de autorização usar?",
  o: [
    "Authorizer do tipo Cognito user pool",
    "Lambda authorizer (TOKEN) que valida o token no provedor e retorna uma policy IAM, com cache do resultado",
    "Autorização IAM com assinatura SigV4",
    "Chaves de API (API keys) com usage plans"
  ],
  a: [1],
  w: [
    "O authorizer Cognito só valida tokens emitidos pelo próprio user pool.",
    "O Lambda authorizer permite qualquer lógica de validação personalizada e pode ter o resultado em cache por um TTL para reduzir chamadas.",
    "O SigV4 exige credenciais AWS, não tokens do provedor terceiro.",
    "As API keys servem para identificar clientes e aplicar cotas, não para autenticar usuários."
  ],
  kw: ["provedor de identidade de terceiros", "NÃO é OIDC", "endpoint de introspecção"],
  obj: "Autorizar com uma lógica de validação personalizada.",
  cons: ["Token de terceiro", "Validação customizada"],
  el: [3],
  concept: "Lambda authorizers",
  trap: "API keys parecem 'autenticação', mas não substituem um mecanismo de autorização.",
  tip: "Lógica de autenticação customizada → Lambda authorizer. Tokens Cognito → Cognito authorizer.",
  ref: "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html",
  ev: "Use a Lambda authorizer to implement a custom authorization scheme.",
  evu: "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html"
},
{
  id: "d2-06", d: 2, t: "2.2", lvl: "Desafiadora",
  q: "Uma aplicação precisa criptografar arquivos de 50 MB com uma chave do AWS KMS antes de armazená-los. As chamadas diretas à API Encrypt estão falhando. Qual abordagem o desenvolvedor deve usar?",
  o: [
    "Dividir o arquivo em pedaços de 4 KB e chamar Encrypt para cada um",
    "Usar envelope encryption: chamar GenerateDataKey, criptografar o arquivo localmente com a data key em texto claro e armazenar a data key criptografada junto com o arquivo",
    "Aumentar a cota da API Encrypt do KMS",
    "Usar uma chave gerenciada pela AWS (aws/s3) em vez de uma customer managed key"
  ],
  a: [1],
  w: [
    "Funciona tecnicamente, mas gera milhares de chamadas ao KMS, com alta latência, custo e risco de throttling.",
    "A API Encrypt aceita no máximo 4 KB de dados. Com envelope encryption, o KMS gera uma data key que criptografa grandes volumes localmente.",
    "O limite de 4 KB é de tamanho do payload, não de taxa de chamadas.",
    "O tipo da chave não muda o limite de tamanho da API Encrypt."
  ],
  kw: ["50 MB", "chamadas diretas à API Encrypt estão falhando"],
  obj: "Criptografar dados grandes com o KMS.",
  cons: ["Arquivo de 50 MB", "Limite da API Encrypt"],
  el: [3],
  concept: "Envelope encryption com o KMS",
  trap: "Dividir em blocos parece engenhoso, mas é ineficiente e não é a prática recomendada.",
  tip: "Mais de 4 KB → GenerateDataKey (envelope encryption).",
  ref: "https://docs.aws.amazon.com/kms/latest/developerguide/kms-cryptography.html",
  ev: "Envelope encryption is the practice of encrypting plaintext data with a data key, and then encrypting the data key under another key. [...] You can safely store the encrypted data key alongside the encrypted data.",
  evu: "https://docs.aws.amazon.com/kms/latest/developerguide/kms-cryptography.html"
},
{
  id: "d2-07", d: 2, t: "2.2", lvl: "Intermediária",
  q: "Uma empresa precisa armazenar documentos no Amazon S3 com criptografia no servidor, controlar quem pode usar a chave por meio de uma key policy e auditar cada uso da chave no AWS CloudTrail. Qual opção de criptografia atende a TODOS os requisitos?",
  o: [
    "SSE-S3 (chaves gerenciadas pelo Amazon S3)",
    "SSE-KMS com uma customer managed key",
    "SSE-C (chaves fornecidas pelo cliente)",
    "Criptografia no cliente com chaves armazenadas na aplicação"
  ],
  a: [1],
  w: [
    "No SSE-S3, a AWS gerencia as chaves: não há key policy controlada por você nem auditoria de uso da chave.",
    "O SSE-KMS com customer managed key permite definir a key policy, e cada uso da chave é registrado no CloudTrail.",
    "No SSE-C, você fornece a chave em cada requisição e a AWS não a armazena; não há key policy na AWS.",
    "Não é criptografia no servidor e não oferece auditoria pela AWS."
  ],
  kw: ["criptografia no servidor", "key policy", "auditar cada uso da chave no AWS CloudTrail"],
  obj: "Escolher o tipo de criptografia do S3.",
  cons: ["Server-side", "Controle da key policy", "Auditoria"],
  el: [3],
  concept: "SSE-S3 vs SSE-KMS vs SSE-C",
  trap: "O SSE-S3 é o padrão e 'já criptografa', mas não oferece controle nem auditoria da chave.",
  tip: "Auditoria e controle da chave → SSE-KMS (customer managed key).",
  ref: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html",
  ev: "You can also use the default encryption context ARN value to track relevant requests in AWS CloudTrail by viewing which Amazon S3 ARN was used with which encryption key.",
  evu: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html"
},
{
  id: "d2-08", d: 2, t: "2.2", lvl: "Intermediária",
  q: "A equipe de segurança exige que TODAS as requisições a um bucket S3 usem criptografia em trânsito. Como garantir isso?",
  o: [
    "Habilitar a criptografia padrão do bucket com SSE-KMS",
    "Adicionar uma bucket policy que negue (Deny) requisições quando aws:SecureTransport for false",
    "Habilitar o versionamento do bucket",
    "Habilitar o S3 Object Lock"
  ],
  a: [1],
  w: [
    "Isso é criptografia em repouso, não em trânsito.",
    "A condição aws:SecureTransport identifica requisições sem HTTPS, e o Deny as bloqueia.",
    "O versionamento protege contra sobrescrita e exclusão, não criptografa o tráfego.",
    "O Object Lock impede a exclusão (WORM); não tem relação com o transporte."
  ],
  kw: ["TODAS as requisições", "criptografia em trânsito"],
  obj: "Forçar HTTPS no S3.",
  cons: ["Em trânsito", "Todas as requisições"],
  el: [2, 3],
  concept: "Criptografia em trânsito vs em repouso",
  trap: "Confundir criptografia em repouso (SSE) com criptografia em trânsito (TLS).",
  tip: "Forçar HTTPS → bucket policy com Deny se aws:SecureTransport = false.",
  ref: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html",
  ev: "We recommend allowing only encrypted connections over HTTPS (TLS) by using the aws:SecureTransport condition in your Amazon S3 bucket policies.",
  evu: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html"
},
{
  id: "d2-09", d: 2, t: "2.3", lvl: "Intermediária",
  q: "Uma aplicação acessa um banco Amazon RDS for MySQL. A política da empresa exige que a senha do banco seja armazenada com segurança e rotacionada automaticamente a cada 30 dias, sem desenvolver uma solução de rotação própria. O que usar?",
  o: [
    "Parâmetro SecureString no AWS Systems Manager Parameter Store",
    "AWS Secrets Manager com rotação automática configurada",
    "Variável de ambiente criptografada na função Lambda",
    "Arquivo criptografado com KMS em um bucket S3"
  ],
  a: [1],
  w: [
    "O Parameter Store armazena com segurança, mas não oferece rotação automática nativa de credenciais de banco.",
    "O Secrets Manager tem rotação gerenciada para bancos como o RDS, com agendamento configurável.",
    "Seria preciso implementar a rotação e atualizar a função manualmente.",
    "Não há rotação, e a gestão fica por conta da equipe."
  ],
  kw: ["rotacionada automaticamente a cada 30 dias", "sem desenvolver uma solução de rotação própria"],
  obj: "Armazenar e rotacionar credenciais de banco.",
  cons: ["Rotação automática", "Sem código de rotação próprio"],
  el: [3],
  concept: "Secrets Manager vs Parameter Store",
  trap: "O SecureString também é criptografado, mas a rotação automática é o diferencial.",
  tip: "Rotação automática de segredos → Secrets Manager.",
  ref: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html",
  ev: "Rotation is the process of periodically updating a secret.",
  evu: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html"
},
{
  id: "d2-10", d: 2, t: "2.3", lvl: "Pegadinha",
  q: "Uma aplicação precisa de dezenas de parâmetros de configuração organizados por ambiente (/dev, /prod), alguns sensíveis (como uma chave de API de terceiros que nunca muda). A solução deve ter o MENOR custo e não há requisito de rotação. O que usar?",
  o: [
    "AWS Secrets Manager para todos os parâmetros",
    "AWS Systems Manager Parameter Store (nível standard), com SecureString para os valores sensíveis",
    "Arquivos .env versionados no repositório Git",
    "Tabela do DynamoDB com os parâmetros em texto claro"
  ],
  a: [1],
  w: [
    "Atenderia, mas cobra por segredo armazenado: não é o menor custo sem necessidade de rotação.",
    "O Parameter Store standard não tem cobrança adicional por armazenamento, suporta hierarquia por caminhos e SecureString criptografado com KMS.",
    "Segredos em repositórios são uma prática insegura.",
    "Texto claro para dados sensíveis viola as boas práticas."
  ],
  kw: ["organizados por ambiente (/dev, /prod)", "alguns sensíveis", "MENOR custo", "não há requisito de rotação"],
  obj: "Armazenar configurações e segredos simples com baixo custo.",
  cons: ["Hierarquia", "Menor custo", "Sem rotação"],
  el: [2, 3],
  concept: "Parameter Store hierárquico e SecureString",
  trap: "Associar 'sensível' automaticamente ao Secrets Manager e ignorar o critério de custo.",
  tip: "Sem rotação + custo mínimo → Parameter Store. Rotação → Secrets Manager.",
  ref: "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html",
  ev: "(Tabela de tiers) Standard – Use case: Best for most configuration data and low-scale workloads. Cost: No additional charge. Advanced – Cost: Charges apply.",
  evu: "https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-advanced-parameters.html"
},
{
  id: "d2-11", d: 2, t: "2.2", lvl: "Desafiadora",
  q: "Uma equipe quer habilitar a rotação automática de uma customer managed key simétrica do AWS KMS, mas teme que os dados já criptografados deixem de ser decriptáveis após a rotação. O que é verdade sobre esse cenário?",
  o: [
    "Todos os dados precisam ser recriptografados manualmente após cada rotação",
    "A rotação automática gera novo material de chave, mas o KMS mantém o material antigo, então os dados antigos continuam decriptáveis sem mudanças",
    "A rotação automática só está disponível para chaves gerenciadas pela AWS",
    "É preciso criar uma nova chave e atualizar todas as aplicações para usar o novo ARN"
  ],
  a: [1],
  w: [
    "Não é necessário: o KMS sabe qual material de chave usou em cada ciphertext.",
    "O ID e o ARN da chave não mudam; os dados novos usam o material atual e os antigos são decriptados com o material anterior, que o KMS preserva.",
    "As customer managed keys simétricas suportam rotação automática (que você habilita).",
    "Isso descreve a rotação manual (criar uma nova chave e trocar o alias), usada para chaves que não suportam rotação automática, como chaves assimétricas, HMAC ou em custom key stores."
  ],
  kw: ["rotação automática", "customer managed key simétrica", "dados já criptografados"],
  obj: "Entender o comportamento da rotação de chaves do KMS.",
  cons: ["Chave simétrica", "Dados existentes"],
  el: [0],
  concept: "Rotação automática de chaves do KMS",
  trap: "Confundir a rotação automática com a manual (que exige alias e um novo ARN).",
  tip: "Rotação automática do KMS: mesmo ARN, material antigo preservado, nada a recriptografar.",
  ref: "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html",
  ev: "When you use the rotated KMS key to decrypt ciphertext, AWS KMS uses the key material that was used to encrypt it.",
  evu: "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html"
},
{
  id: "d2-12", d: 2, t: "2.2", lvl: "Desafiadora", multi: true,
  q: "Dados em um bucket S3 da conta A são criptografados com SSE-KMS usando uma customer managed key da conta A. Uma role na conta B precisa ler e decriptar esses objetos. Além da bucket policy, quais DUAS configurações são necessárias para o KMS? (Selecione DUAS.)",
  o: [
    "Na key policy da chave (conta A), permitir kms:Decrypt para a conta B",
    "Na conta B, anexar à role uma policy IAM que permita kms:Decrypt no ARN da chave da conta A",
    "Copiar a chave KMS para a conta B",
    "Trocar para a chave gerenciada pela AWS aws/s3, que é compartilhável",
    "Transformar a chave em uma chave multi-Região"
  ],
  a: [0, 1],
  w: [
    "A key policy precisa permitir o principal externo; sem isso, nenhuma permissão IAM na conta B funciona.",
    "A conta B também precisa delegar a permissão ao principal com uma policy IAM: são necessárias as duas permissões.",
    "Não é possível copiar uma chave KMS entre contas.",
    "A key policy das chaves gerenciadas pela AWS não pode ser alterada, então elas não servem para acesso entre contas.",
    "Multi-Região replica a chave entre Regiões da mesma conta, não entre contas."
  ],
  kw: ["conta A", "conta B", "customer managed key", "ler e decriptar"],
  obj: "Uso de uma chave KMS entre contas.",
  cons: ["Entre contas", "Customer managed key"],
  el: [2, 4],
  concept: "Criptografia entre fronteiras de conta",
  trap: "Esquecer que entre contas é sempre preciso permissão dos DOIS lados (recurso e identidade).",
  tip: "Entre contas = key policy (dono) + IAM policy (consumidor).",
  ref: "https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html",
  ev: "Cross-account access requires permission in the key policy of the KMS key and in an IAM policy in the external user's account.",
  evu: "https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-modifying-external-accounts.html"
},
{
  id: "d2-13", d: 2, t: "2.3", lvl: "Intermediária",
  q: "Uma auditoria descobriu que uma aplicação está gravando números de cartão de crédito e emails de clientes nos logs do Amazon CloudWatch Logs. Enquanto o código não é corrigido, a equipe precisa que, a partir de agora, esses dados apareçam mascarados para quem lê os logs, SEM alterar o código. Qual solução usar?",
  o: [
    "Criptografar o log group com uma chave do AWS KMS",
    "Configurar uma data protection policy no log group para identificar e mascarar dados sensíveis",
    "Usar o Amazon Macie no log group",
    "Reduzir a retenção dos logs para 1 dia"
  ],
  a: [1],
  w: [
    "Quem tem permissão de leitura continua vendo os dados decriptados.",
    "As data protection policies do CloudWatch Logs detectam e mascaram dados sensíveis (com managed data identifiers para dados financeiros e PII) na ingestão; só quem tem logs:Unmask vê o valor original. Atenção: eventos ingeridos ANTES da política não são mascarados.",
    "O Macie analisa dados em buckets S3, não log groups do CloudWatch.",
    "Reduz a exposição, mas os dados continuam visíveis durante a retenção."
  ],
  kw: ["números de cartão de crédito e emails", "a partir de agora", "mascarados para quem lê os logs", "SEM alterar o código"],
  obj: "Mascarar PII em logs sem mudar o código.",
  cons: ["Sem mudar o código", "Mascaramento"],
  el: [3],
  concept: "Data protection no CloudWatch Logs e sanitização de PII",
  trap: "Criptografia em repouso não esconde os dados de quem tem acesso de leitura. E a política não é retroativa: só mascara o que for ingerido depois dela.",
  tip: "Esconder PII de quem lê logs → data protection policy (vale para novos eventos) + sanitizar no código.",
  ref: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html",
  ev: "Only users who have the logs:Unmask IAM permission can view unmasked data. [...] When you set a data protection policy, log events ingested to the log group before that time are not masked.",
  evu: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/mask-sensitive-log-data.html"
},
{
  id: "d2-14", d: 2, t: "2.3", lvl: "Desafiadora",
  q: "Uma aplicação SaaS multi-tenant armazena dados de todos os clientes em uma única tabela do DynamoDB com tenantId como chave de partição. É preciso garantir no nível do IAM que cada tenant só acesse os itens com seu próprio tenantId. Qual solução usar?",
  o: [
    "Filtrar os itens por tenantId no código da aplicação após cada Scan",
    "Usar uma policy IAM com a condição dynamodb:LeadingKeys vinculada ao identificador do tenant (por exemplo, uma tag do principal)",
    "Criptografar os itens de cada tenant com uma chave KMS diferente",
    "Criar um GSI por tenant"
  ],
  a: [1],
  w: [
    "Um filtro no código não é um controle de acesso: um bug expõe os dados de outros tenants.",
    "A condição dynamodb:LeadingKeys restringe o acesso a itens cuja chave de partição corresponde ao valor permitido, garantindo o isolamento no IAM.",
    "Ajuda no isolamento criptográfico, mas não impede consultas a itens de outros tenants e complica a solução.",
    "Os GSIs não são mecanismo de controle de acesso e têm limite por tabela."
  ],
  kw: ["multi-tenant", "única tabela", "no nível do IAM", "seu próprio tenantId"],
  obj: "Isolamento de tenants com controle de acesso refinado.",
  cons: ["Tabela compartilhada", "Controle no IAM"],
  el: [3],
  concept: "Controle de acesso refinado no DynamoDB (LeadingKeys)",
  trap: "O filtro na aplicação parece suficiente, mas não é imposto pela AWS.",
  tip: "Item-level access no DynamoDB → condição dynamodb:LeadingKeys.",
  ref: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/specifying-conditions.html",
  ev: "The following are the DynamoDB service-specific condition keys that apply to DynamoDB. dynamodb:LeadingKeys Represents the first key attribute of a table—in other words, the partition key.",
  evu: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/specifying-conditions.html"
},
{
  id: "d2-15", d: 2, t: "2.1", lvl: "Intermediária",
  q: "Um microsserviço em AWS Lambda precisa chamar uma REST API interna de outro microsserviço exposta no API Gateway. A comunicação deve ser autenticada sem segredos compartilhados e usando as permissões IAM da função. Qual solução usar?",
  o: [
    "Proteger a API com API keys e armazenar a chave na Lambda",
    "Configurar autorização AWS_IAM no método e assinar as requisições com SigV4 usando as credenciais da execution role",
    "Usar um authorizer Cognito e criar um usuário no user pool para o serviço",
    "Restringir a API por endereço IP com uma resource policy"
  ],
  a: [1],
  w: [
    "As API keys são segredos compartilhados e não são mecanismo de autenticação recomendado.",
    "Com AWS_IAM, o API Gateway valida a assinatura SigV4 e a policy IAM do chamador, usando credenciais temporárias da role.",
    "Criar um 'usuário de serviço' com senha é um segredo compartilhado e é desnecessário.",
    "Funções Lambda não têm IP fixo, e IP não é identidade."
  ],
  kw: ["sem segredos compartilhados", "permissões IAM da função"],
  obj: "Autenticação entre serviços.",
  cons: ["Sem segredos", "Baseado em IAM"],
  el: [3],
  concept: "Autorização IAM (SigV4) no API Gateway",
  trap: "API key parece autenticação, mas é para cotas e identificação.",
  tip: "Serviço AWS chamando API → autorização IAM + SigV4.",
  ref: "https://docs.aws.amazon.com/apigateway/latest/developerguide/permissions.html",
  ev: "The API developer sets the method's authorizationType property to AWS_IAM to require that the caller submit the user's credentials to be authenticated.",
  evu: "https://docs.aws.amazon.com/apigateway/latest/developerguide/permissions.html"
}
);
