// Lote 2 — escrito a partir das páginas oficiais (cada questão traz a citação em ev/evu)
QB.push(
/* ---------- Domínio 2: Segurança ---------- */
{
  id: "d2-16", d: 2, t: "2.1", lvl: "Intermediária",
  q: "Um app de catálogo permite que visitantes SEM login vejam imagens de produtos armazenadas em um bucket S3 privado, enquanto usuários autenticados também podem enviar avaliações. A equipe quer credenciais AWS temporárias com permissões diferentes para cada tipo de usuário. Qual solução usar?",
  o: [
    "Um Amazon Cognito identity pool com acesso de convidado (guest) habilitado e roles IAM distintas para identidades autenticadas e não autenticadas",
    "Um Cognito user pool com um usuário genérico compartilhado para os visitantes",
    "Tornar o bucket público e usar o user pool só para as avaliações",
    "Chaves de acesso de um usuário IAM embutidas no app para os visitantes"
  ],
  a: [0],
  w: [
    "Os identity pools emitem credenciais temporárias tanto para convidados quanto para usuários autenticados, cada tipo com sua própria role.",
    "Um usuário compartilhado é uma credencial de longo prazo distribuída para todos e não separa as permissões corretamente.",
    "Tornar o bucket público expõe todo o conteúdo e contraria o requisito de bucket privado.",
    "Chaves embutidas no app podem ser extraídas e são credenciais de longo prazo."
  ],
  kw: ["SEM login", "bucket S3 privado", "credenciais AWS temporárias", "permissões diferentes para cada tipo de usuário"],
  obj: "Dar credenciais temporárias a convidados e a usuários autenticados.",
  cons: ["Acesso de convidado", "Bucket privado", "Permissões distintas"],
  el: [3],
  concept: "Identidades autenticadas e não autenticadas no Cognito identity pool",
  trap: "O user pool autentica, mas não emite credenciais AWS, e não tem 'convidado'.",
  tip: "Visitante sem login precisando de credenciais AWS → identity pool com guest access.",
  ref: "https://docs.aws.amazon.com/cognito/latest/developerguide/identity-pools.html",
  ev: "Amazon Cognito identity pools provide temporary AWS credentials for users who are guests (unauthenticated) and for users who have been authenticated and received a token.",
  evu: "https://docs.aws.amazon.com/cognito/latest/developerguide/identity-pools.html"
},
{
  id: "d2-17", d: 2, t: "2.2", lvl: "Pegadinha",
  q: "Uma equipe solicitou um certificado público no AWS Certificate Manager (ACM) na Região sa-east-1 (São Paulo) para usar HTTPS com um domínio próprio em uma distribuição do Amazon CloudFront, mas o certificado não aparece na lista ao configurar a distribuição. O que deve ser feito?",
  o: [
    "Exportar o certificado do ACM e importá-lo manualmente no CloudFront",
    "Solicitar (ou importar) o certificado no ACM na Região US East (N. Virginia), us-east-1",
    "Aguardar a replicação automática do certificado para todas as Regiões",
    "Usar o AWS Private CA para emitir o certificado público"
  ],
  a: [1],
  w: [
    "Não resolve: o problema é a Região. O CloudFront só usa certificados do ACM que estejam em us-east-1.",
    "Para usar um certificado do ACM no CloudFront, ele precisa estar em us-east-1.",
    "O ACM não replica certificados entre Regiões.",
    "O Private CA emite certificados PRIVADOS, que não são confiáveis para navegadores na internet."
  ],
  kw: ["Região sa-east-1 (São Paulo)", "Amazon CloudFront", "não aparece na lista"],
  obj: "Usar um certificado do ACM no CloudFront.",
  cons: ["CloudFront", "Certificado do ACM"],
  el: [2],
  concept: "Requisito de Região do ACM para o CloudFront",
  trap: "Pedir o certificado na Região 'mais próxima' parece lógico, mas o CloudFront exige us-east-1.",
  tip: "ACM + CloudFront (e API Gateway edge-optimized) → certificado em us-east-1.",
  ref: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html",
  ev: "To use an ACM certificate with a CloudFront distribution, make sure you request (or import) the certificate in the US East (N. Virginia) Region (us-east-1).",
  evu: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html"
},
{
  id: "d2-18", d: 2, t: "2.2", lvl: "Intermediária",
  q: "Uma empresa precisa emitir certificados TLS para a comunicação entre microsserviços INTERNOS (mTLS), que não são acessados pela internet. A equipe não quer operar uma autoridade certificadora (CA) própria em servidores on-premises. Qual serviço usar?",
  o: [
    "Certificados públicos do AWS Certificate Manager validados por DNS",
    "AWS Private CA para criar uma hierarquia de CA privada e emitir os certificados",
    "Certificados autoassinados gerados com OpenSSL em cada serviço",
    "Chaves do AWS KMS usadas diretamente como certificados"
  ],
  a: [1],
  w: [
    "Certificados públicos servem para nomes de domínio públicos; para identidades internas o adequado é uma CA privada.",
    "O AWS Private CA cria hierarquias de CA privada (raiz e subordinadas) sem o custo de manter uma CA on-premises.",
    "Certificados autoassinados por serviço são difíceis de gerenciar e de confiar em escala.",
    "Chaves do KMS não são certificados X.509."
  ],
  kw: ["microsserviços INTERNOS (mTLS)", "não são acessados pela internet", "não quer operar uma autoridade certificadora (CA) própria"],
  obj: "Emitir certificados privados sem operar uma CA.",
  cons: ["Uso interno", "Sem CA on-premises"],
  el: [3],
  concept: "AWS Private CA",
  trap: "O ACM público é o primeiro que vem à mente, mas o cenário é interno (privado).",
  tip: "Certificado para uso interno ou mTLS → AWS Private CA.",
  ref: "https://docs.aws.amazon.com/privateca/latest/userguide/PcaWelcome.html",
  ev: "AWS Private CA enables creation of private certificate authority (CA) hierarchies, including root and subordinate CAs, without the investment and maintenance costs of operating an on-premises CA.",
  evu: "https://docs.aws.amazon.com/privateca/latest/userguide/PcaWelcome.html"
},
{
  id: "d2-19", d: 2, t: "2.2", lvl: "Desafiadora",
  q: "Por exigência regulatória, os dados de pacientes precisam ser criptografados na própria aplicação ANTES de serem enviados ao Amazon S3, usando chaves do AWS KMS e seguindo as boas práticas (uma data key única por objeto). A equipe quer evitar implementar a criptografia manualmente. O que usar?",
  o: [
    "SSE-KMS com uma customer managed key no bucket",
    "AWS Encryption SDK com um keyring do AWS KMS",
    "SSE-S3 com criptografia padrão do bucket",
    "Chamar kms:Encrypt diretamente para cada objeto"
  ],
  a: [1],
  w: [
    "O SSE-KMS criptografa no servidor (dentro do S3), não antes do envio.",
    "O Encryption SDK é uma biblioteca de criptografia client-side que gera uma data key única por objeto (envelope encryption) usando o KMS.",
    "O SSE-S3 é criptografia no servidor com chaves do S3.",
    "A API Encrypt aceita no máximo 4.096 bytes e não implementa envelope encryption por você."
  ],
  kw: ["na própria aplicação ANTES de serem enviados", "uma data key única por objeto", "evitar implementar a criptografia manualmente"],
  obj: "Fazer criptografia client-side com KMS sem implementá-la à mão.",
  cons: ["Client-side", "Data key por objeto", "Sem implementação própria"],
  el: [2],
  concept: "Client-side encryption com o AWS Encryption SDK",
  trap: "O SSE-KMS também usa o KMS, mas é server-side.",
  tip: "Criptografar antes de enviar → client-side (Encryption SDK). No destino → SSE.",
  ref: "https://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/introduction.html",
  ev: "The AWS Encryption SDK is a client-side encryption library designed to make it easy for everyone to encrypt and decrypt data using industry standards and best practices. [...] By default, the AWS Encryption SDK generates a unique data key for each data object that it encrypts.",
  evu: "https://docs.aws.amazon.com/encryption-sdk/latest/developer-guide/introduction.html"
},
{
  id: "d2-20", d: 2, t: "2.1", lvl: "Intermediária",
  q: "Uma role IAM tem uma policy que permite s3:* em todos os buckets. Outra policy anexada à MESMA role nega explicitamente s3:DeleteObject no bucket de auditoria. O que acontece quando a aplicação tenta excluir um objeto desse bucket?",
  o: [
    "A exclusão é permitida, porque a permissão mais ampla (s3:*) prevalece",
    "A exclusão é negada, porque um Deny explícito sempre prevalece sobre um Allow",
    "Depende da ordem em que as policies foram anexadas",
    "A exclusão é permitida se a requisição usar HTTPS"
  ],
  a: [1],
  w: [
    "Na avaliação do IAM, a amplitude da permissão não importa diante de um Deny explícito.",
    "Um Deny explícito em qualquer policy aplicável sobrepõe qualquer Allow.",
    "A ordem de anexação não influencia a avaliação.",
    "O protocolo da requisição não muda o resultado (a não ser que exista uma condição para isso)."
  ],
  kw: ["permite s3:*", "nega explicitamente s3:DeleteObject", "MESMA role"],
  obj: "Aplicar a lógica de avaliação de policies do IAM.",
  cons: ["Allow amplo", "Deny explícito específico"],
  el: [3],
  concept: "Lógica de avaliação de policies do IAM",
  trap: "Achar que a permissão mais 'forte' (curinga) vence.",
  tip: "Ordem mental: Deny explícito > Allow explícito > Deny implícito (padrão).",
  ref: "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
  ev: "An explicit deny in either of these policies overrides the allow.",
  evu: "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html"
},
{
  id: "d2-21", d: 2, t: "2.1", lvl: "Intermediária",
  q: "Desenvolvedores usam a AWS CLI no notebook com chaves de acesso de longo prazo salvas no arquivo de credenciais. A empresa já usa o AWS IAM Identity Center e quer eliminar essas chaves, mantendo o uso da CLI. Qual é a solução recomendada?",
  o: [
    "Rotacionar as chaves de acesso a cada 30 dias",
    "Configurar perfis da CLI com o IAM Identity Center e usar aws sso login para obter credenciais temporárias",
    "Guardar as chaves de acesso no AWS Secrets Manager",
    "Criar um usuário IAM por projeto em vez de um por desenvolvedor"
  ],
  a: [1],
  w: [
    "A rotação reduz o risco, mas mantém as credenciais de longo prazo.",
    "Com o IAM Identity Center, a CLI obtém e armazena em cache credenciais temporárias após o login no navegador.",
    "Continua dependendo de chaves de longo prazo.",
    "Piora a rastreabilidade e mantém chaves de longo prazo."
  ],
  kw: ["chaves de acesso de longo prazo", "IAM Identity Center", "mantendo o uso da CLI"],
  obj: "Acesso programático sem chaves de longo prazo.",
  cons: ["CLI", "Identity Center já existe"],
  el: [3],
  concept: "Acesso programático com o IAM Identity Center",
  trap: "Rotacionar chaves parece 'boa prática', mas não elimina as credenciais de longo prazo.",
  tip: "Desenvolvedor humano na CLI → IAM Identity Center (aws sso login).",
  ref: "https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html",
  ev: "Use the aws sso login command to request and retrieve the credentials needed to run commands.",
  evu: "https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html"
},
{
  id: "d2-22", d: 2, t: "2.1", lvl: "Desafiadora",
  q: "Uma API é protegida por tokens de um Amazon Cognito user pool. Agora alguns endpoints de escrita (por exemplo, POST /pedidos) só podem ser chamados por clientes autorizados a ESCREVER, enquanto outros podem apenas ler. Como implementar essa autorização refinada com recursos nativos do Cognito?",
  o: [
    "Criar um user pool separado para cada endpoint",
    "Definir um resource server com escopos personalizados (por exemplo, pedidos/read e pedidos/write) e exigir o escopo adequado em cada método",
    "Usar apenas o ID token e checar o email do usuário",
    "Usar um identity pool com acesso de convidado"
  ],
  a: [1],
  w: [
    "Seria complexo e não escalaria.",
    "Os escopos personalizados de um resource server entram no access token e podem ser exigidos por método no authorizer.",
    "Checar o email é frágil e não é o mecanismo de escopos do OAuth 2.0.",
    "O identity pool fornece credenciais AWS e não resolve autorização por escopo da API."
  ],
  kw: ["só podem ser chamados por clientes autorizados a ESCREVER", "recursos nativos do Cognito"],
  obj: "Autorização por operação usando OAuth 2.0.",
  cons: ["User pool existente", "Ler vs escrever"],
  el: [3],
  concept: "Resource servers e escopos personalizados no Cognito",
  trap: "Usar o ID token para autorização de API em vez do access token com escopos.",
  tip: "Permissão por operação da API → escopos personalizados no access token.",
  ref: "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-define-resource-servers.html",
  ev: "You can choose the scopes that you want the authorization server to add to access tokens. Scopes authorize access to resource servers and user data. A resource server is an OAuth 2.0 API server.",
  evu: "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-define-resource-servers.html"
},
{
  id: "d2-23", d: 2, t: "2.3", lvl: "Desafiadora",
  q: "Uma função Lambda de alto volume busca a mesma credencial no AWS Secrets Manager a cada invocação, aumentando a latência e o custo de chamadas de API. A equipe quer reduzir as chamadas sem escrever lógica de cache própria. O que usar?",
  o: [
    "Copiar o valor do segredo para uma variável de ambiente durante o deploy",
    "Adicionar a AWS Parameters and Secrets Lambda Extension como layer e ler o segredo pelo endpoint local da extensão",
    "Aumentar a memória da função",
    "Usar provisioned concurrency"
  ],
  a: [1],
  w: [
    "Expõe o segredo na configuração da função e quebra a rotação (o valor fica desatualizado).",
    "A extensão busca e mantém o segredo em cache (por padrão, 300 segundos), reduzindo latência e chamadas de API sem código de cache.",
    "Mais memória não reduz as chamadas ao Secrets Manager.",
    "Elimina cold starts, mas cada invocação continuaria chamando a API."
  ],
  kw: ["a cada invocação", "latência e o custo de chamadas de API", "sem escrever lógica de cache própria"],
  obj: "Cachear segredos na Lambda.",
  cons: ["Alto volume", "Sem cache próprio"],
  el: [2],
  concept: "AWS Parameters and Secrets Lambda Extension",
  trap: "A variável de ambiente parece 'cache', mas expõe o segredo e ignora a rotação.",
  tip: "Segredos ou parâmetros lidos com frequência na Lambda → extensão com cache.",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/with-secrets-manager.html",
  ev: "When your function requests a secret, the cache is checked first. If the secret is available and hasn't expired, it's returned immediately. Otherwise, it's retrieved from Secrets Manager, cached, and returned. This caching mechanism results in faster response times and reduced costs by minimizing API calls.",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/with-secrets-manager.html"
},
{
  id: "d2-24", d: 2, t: "2.2", lvl: "Intermediária",
  q: "Um bucket S3 com milhões de objetos usa SSE-KMS com uma customer managed key. A conta de AWS KMS está alta por causa do volume de requisições do S3 ao KMS. Como reduzir esse custo mantendo o SSE-KMS?",
  o: [
    "Trocar para SSE-S3",
    "Habilitar S3 Bucket Keys no bucket",
    "Desabilitar a rotação automática da chave",
    "Usar uma chave KMS diferente para cada objeto"
  ],
  a: [1],
  w: [
    "Reduz o custo, mas abandona o SSE-KMS (e o controle e a auditoria da chave).",
    "As Bucket Keys reduzem o tráfego de requisições do S3 ao KMS e o custo em até 99%.",
    "A rotação não afeta o número de requisições ao KMS.",
    "Aumentaria a complexidade sem reduzir as requisições."
  ],
  kw: ["milhões de objetos", "volume de requisições do S3 ao KMS", "mantendo o SSE-KMS"],
  obj: "Reduzir o custo de KMS no S3.",
  cons: ["Manter SSE-KMS"],
  el: [3],
  concept: "S3 Bucket Keys",
  trap: "Trocar para SSE-S3 resolve o custo, mas viola a restrição.",
  tip: "SSE-KMS caro ou com throttling no KMS → S3 Bucket Keys.",
  ref: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html",
  ev: "Using a bucket-level key for SSE-KMS can reduce AWS KMS request costs by up to 99 percent by decreasing the request traffic from Amazon S3 to AWS KMS.",
  evu: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html"
},
{
  id: "d2-25", d: 2, t: "2.1", lvl: "Intermediária",
  q: "Um desenvolvedor configurou notificações de eventos de um bucket S3 para invocar uma função Lambda, mas as invocações não acontecem por falta de permissão. A execution role da função já tem acesso de leitura ao bucket. O que está faltando?",
  o: [
    "Adicionar s3:GetObject à execution role",
    "Adicionar à resource-based policy da função uma permissão lambda:InvokeFunction para o principal s3.amazonaws.com (restrita ao bucket de origem)",
    "Anexar a policy AWSLambdaBasicExecutionRole à role",
    "Tornar a função pública"
  ],
  a: [1],
  w: [
    "A execution role define o que a FUNÇÃO pode acessar, não quem pode invocá-la.",
    "Quem invoca a função (o S3) precisa de permissão na resource-based policy da função.",
    "Essa policy dá permissão de escrever logs, não de ser invocada.",
    "Inseguro e desnecessário."
  ],
  kw: ["invocar uma função Lambda", "falta de permissão", "execution role da função já tem acesso"],
  obj: "Permitir que um serviço AWS invoque a função.",
  cons: ["Invocação pelo S3"],
  el: [3],
  concept: "Resource-based policy vs execution role na Lambda",
  trap: "Confundir 'o que a função pode fazer' (execution role) com 'quem pode chamar a função' (resource policy).",
  tip: "Serviço chamando a Lambda → resource-based policy. Lambda chamando um serviço → execution role.",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/access-control-resource-based.html",
  ev: "With resource-based permissions policies, you can grant other AWS accounts, users, organizations, and AWS services access to your Lambda Event Functions.",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/access-control-resource-based.html"
},
{
  id: "d2-26", d: 2, t: "2.3", lvl: "Intermediária",
  q: "Uma empresa armazena milhares de arquivos enviados por clientes em buckets S3 e precisa DESCOBRIR quais deles contêm dados sensíveis, como PII, para classificá-los. A solução deve ser gerenciada e usar machine learning e correspondência de padrões. Qual serviço usar?",
  o: ["Amazon Macie", "Amazon GuardDuty", "AWS Config", "Amazon Inspector"],
  a: [0],
  w: [
    "O Macie descobre e reporta dados sensíveis armazenados no Amazon S3.",
    "O GuardDuty detecta ameaças e atividades suspeitas, não classifica o conteúdo dos objetos.",
    "O Config avalia a configuração dos recursos, não o conteúdo dos arquivos.",
    "O Inspector procura vulnerabilidades em cargas de trabalho, não dados sensíveis no S3."
  ],
  kw: ["DESCOBRIR quais deles contêm dados sensíveis", "buckets S3", "PII"],
  obj: "Descobrir e classificar dados sensíveis no S3.",
  cons: ["S3", "Gerenciado"],
  el: [2],
  concept: "Classificação de dados com o Amazon Macie",
  trap: "O GuardDuty também é de segurança, mas olha ameaças, não conteúdo.",
  tip: "PII ou dados sensíveis no S3 → Macie.",
  ref: "https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html",
  ev: "Amazon Macie is a data security service that discovers sensitive data by using machine learning and pattern matching, provides visibility into data security risks, and enables automated protection against those risks. [...] Macie also automates discovery and reporting of sensitive data to provide you with a better understanding of the data that your organization stores in Amazon S3.",
  evu: "https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html"
},
{
  id: "d2-27", d: 2, t: "2.1", lvl: "Intermediária",
  q: "Uma HTTP API no Amazon API Gateway precisa aceitar access tokens JWT emitidos por um provedor OpenID Connect externo (por exemplo, Auth0), validando issuer e audience SEM escrever código. Qual tipo de authorizer usar?",
  o: [
    "Lambda authorizer",
    "JWT authorizer nativo da HTTP API",
    "Autorização IAM (SigV4)",
    "API keys"
  ],
  a: [1],
  w: [
    "Funcionaria, mas exige escrever e manter código de validação.",
    "O JWT authorizer das HTTP APIs valida tokens de provedores OIDC e OAuth 2.0 (issuer e audience) sem código.",
    "O SigV4 exige credenciais AWS, não tokens OIDC.",
    "API keys não validam identidade."
  ],
  kw: ["HTTP API", "provedor OpenID Connect externo", "SEM escrever código"],
  obj: "Validar JWT de um provedor externo sem código.",
  cons: ["HTTP API", "OIDC externo", "Sem código"],
  el: [3],
  concept: "JWT authorizers em HTTP APIs",
  trap: "O Lambda authorizer resolve tudo, mas não é 'sem código'.",
  tip: "HTTP API + JWT de qualquer provedor OIDC → JWT authorizer.",
  ref: "https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html",
  ev: "You can use JSON Web Tokens (JWTs) as a part of OpenID Connect (OIDC) and OAuth 2.0 frameworks to restrict client access to your APIs. If you configure a JWT authorizer for a route of your API, API Gateway validates the JWTs that clients submit with API requests.",
  evu: "https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html"
},

/* ---------- Domínio 3: Implantação ---------- */
{
  id: "d3-15", d: 3, t: "3.4", lvl: "Desafiadora",
  q: "Uma aplicação Lambda é implantada com o CodeDeploy usando deslocamento de tráfego canary. A equipe quer executar testes automatizados contra a NOVA versão da função ANTES que qualquer tráfego de produção seja deslocado para ela, abortando o deploy se os testes falharem. Qual hook do AppSpec usar?",
  o: ["BeforeInstall", "BeforeAllowTraffic", "AfterAllowTraffic", "ValidateService"],
  a: [1],
  w: [
    "BeforeInstall não existe para implantações Lambda (é um hook de EC2 e ECS).",
    "BeforeAllowTraffic roda antes de o tráfego ser deslocado para a nova versão; a função de validação informa Succeeded ou Failed ao CodeDeploy.",
    "AfterAllowTraffic roda DEPOIS do deslocamento: tarde demais para o requisito.",
    "ValidateService é um hook de EC2/on-premises."
  ],
  kw: ["NOVA versão da função", "ANTES que qualquer tráfego", "abortando o deploy"],
  obj: "Validar a nova versão antes do deslocamento de tráfego.",
  cons: ["Lambda", "Antes do tráfego"],
  el: [3],
  concept: "Hooks do AppSpec para implantações Lambda",
  trap: "ValidateService é o hook de validação 'famoso', mas não existe para Lambda.",
  tip: "Lambda: BeforeAllowTraffic / AfterAllowTraffic. EC2: ... ApplicationStart → ValidateService.",
  ref: "https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html",
  ev: "BeforeAllowTraffic – Use to run tasks before traffic is shifted to the deployed Lambda function version.",
  evu: "https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html"
},
{
  id: "d3-16", d: 3, t: "3.2", lvl: "Intermediária",
  q: "Uma aplicação AWS SAM precisa ser implantada em dev, staging e prod, cada ambiente com nome de stack e parâmetros próprios. A equipe quer evitar digitar os parâmetros a cada deploy. Qual abordagem usar?",
  o: [
    "Manter três cópias do template, uma por ambiente",
    "Definir um ambiente por estágio no arquivo samconfig e implantar com sam deploy --config-env <ambiente>",
    "Usar sam local start-api com variáveis de ambiente",
    "Editar o template antes de cada deploy"
  ],
  a: [1],
  w: [
    "Duplicar templates causa divergência e retrabalho.",
    "O arquivo de configuração do SAM CLI aceita vários ambientes nomeados, escolhidos com --config-env.",
    "Isso é teste local, não implantação.",
    "É manual e sujeito a erros."
  ],
  kw: ["dev, staging e prod", "nome de stack e parâmetros próprios", "evitar digitar"],
  obj: "Reutilizar configurações de deploy por ambiente.",
  cons: ["Vários ambientes", "Sem digitação manual"],
  el: [2],
  concept: "Ambientes no arquivo de configuração do SAM CLI",
  trap: "Achar que cada ambiente exige um template separado.",
  tip: "SAM em vários ambientes → samconfig + --config-env.",
  ref: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-config.html",
  ev: "An environment is a named identifier that contains a unique set of configuration settings. You can have multiple environments in a single AWS SAM application. [...] Use the AWS SAM CLI --config-env option to specify the environment to use.",
  evu: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-config.html"
},
{
  id: "d3-17", d: 3, t: "3.4", lvl: "Intermediária",
  q: "Uma stack do CloudFormation cria um bucket S3 com dados de clientes. A equipe quer que, se a stack for EXCLUÍDA, o bucket seja mantido com os dados. O que configurar no recurso?",
  o: [
    "DeletionPolicy: Retain",
    "Uma stack policy que negue Update:Delete",
    "Habilitar termination protection na stack",
    "UpdateReplacePolicy: Snapshot"
  ],
  a: [0],
  w: [
    "Com DeletionPolicy Retain, o recurso é mantido quando a stack é excluída.",
    "A stack policy protege contra ATUALIZAÇÕES, não contra a exclusão da stack.",
    "A termination protection impede a exclusão da stack inteira, mas o requisito é manter o bucket caso a stack seja excluída.",
    "UpdateReplacePolicy vale para substituições em updates, e Snapshot não se aplica a buckets S3."
  ],
  kw: ["se a stack for EXCLUÍDA", "o bucket seja mantido"],
  obj: "Preservar um recurso ao excluir a stack.",
  cons: ["Exclusão da stack", "Manter os dados"],
  el: [3],
  concept: "DeletionPolicy do CloudFormation",
  trap: "A termination protection impede excluir, mas não 'mantém o recurso se excluir'.",
  tip: "Manter o recurso após excluir a stack → DeletionPolicy: Retain (ou Snapshot, onde suportado).",
  ref: "https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-deletionpolicy.html",
  ev: "To keep a resource when its stack is deleted, specify Retain for that resource. You can use Retain for any resource.",
  evu: "https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-deletionpolicy.html"
},
{
  id: "d3-18", d: 3, t: "3.4", lvl: "Desafiadora",
  q: "Uma REST API no API Gateway vai receber uma nova versão. A equipe quer enviar uma pequena porcentagem do tráfego da stage prod para a nova deployment, mantendo o restante na versão atual NA MESMA STAGE, e depois promovê-la. Qual recurso usar?",
  o: [
    "Criar uma nova stage prod2 e trocar o DNS",
    "Configurar um canary release na stage prod",
    "Usar stage variables para alternar manualmente",
    "Habilitar o cache da stage"
  ],
  a: [1],
  w: [
    "Exige outra stage e não divide o tráfego por porcentagem na mesma stage.",
    "No canary release, o tráfego da stage é dividido aleatoriamente entre a versão de produção e a canary, com uma proporção configurada.",
    "Alternar stage variables é tudo-ou-nada, não uma divisão percentual.",
    "O cache não divide tráfego."
  ],
  kw: ["pequena porcentagem do tráfego", "NA MESMA STAGE", "promovê-la"],
  obj: "Liberar uma nova versão da API de forma gradual.",
  cons: ["Mesma stage", "Percentual"],
  el: [3],
  concept: "Canary release no API Gateway",
  trap: "Stage variables parecem flexíveis, mas não dividem o tráfego por percentual.",
  tip: "API Gateway: % de tráfego para a nova versão → canary release na stage.",
  ref: "https://docs.aws.amazon.com/apigateway/latest/developerguide/canary-release.html",
  ev: "In a canary release deployment, total API traffic is separated at random into a production release and a canary release with a pre-configured ratio.",
  evu: "https://docs.aws.amazon.com/apigateway/latest/developerguide/canary-release.html"
},
{
  id: "d3-19", d: 3, t: "3.1", lvl: "Intermediária",
  q: "Um único template do CloudFormation deve criar uma instância maior e réplicas extras em prod, mas recursos reduzidos em test, para economizar. A equipe quer MANTER UM ÚNICO TEMPLATE. Como fazer?",
  o: [
    "Criar dois templates e manter os dois sincronizados",
    "Usar um parâmetro de ambiente (por exemplo, EnvironmentType) e a seção Conditions para decidir quais recursos criar e como configurá-los",
    "Usar nested stacks obrigatoriamente",
    "Editar o template à mão antes de cada deploy"
  ],
  a: [1],
  w: [
    "Viola o requisito de template único.",
    "As Conditions permitem reutilizar o mesmo template em contextos diferentes, como test e prod.",
    "As nested stacks organizam templates, mas não são o mecanismo para variar por ambiente.",
    "É manual e propenso a erro."
  ],
  kw: ["prod", "test", "MANTER UM ÚNICO TEMPLATE"],
  obj: "Variar recursos por ambiente num mesmo template.",
  cons: ["Template único"],
  el: [3],
  concept: "Conditions do CloudFormation",
  trap: "Duplicar templates por ambiente.",
  tip: "Mesmo template, ambientes diferentes → Parameters + Conditions (e Mappings).",
  ref: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/conditions-section-structure.html",
  ev: "You can use conditions when you want to reuse a template to create resources in different contexts, such as test versus production environments.",
  evu: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/conditions-section-structure.html"
},
{
  id: "d3-20", d: 3, t: "3.1", lvl: "Intermediária",
  q: "Times de desenvolvimento precisam compartilhar bibliotecas internas (npm e Maven) entre projetos e também consumir pacotes públicos com um repositório gerenciado, sem manter servidores próprios de pacotes. Qual serviço usar?",
  o: ["AWS CodeArtifact", "Amazon ECR", "Um bucket S3 com os pacotes compactados", "AWS CodeCommit"],
  a: [0],
  w: [
    "O CodeArtifact é um repositório de artefatos gerenciado, compatível com npm, Maven, pip e outros, e pode se conectar a repositórios públicos.",
    "O ECR armazena imagens de container, não pacotes npm ou Maven.",
    "Um bucket não fala o protocolo dos gerenciadores de pacotes.",
    "O CodeCommit é um repositório Git de código-fonte, não de pacotes."
  ],
  kw: ["bibliotecas internas (npm e Maven)", "pacotes públicos", "sem manter servidores próprios"],
  obj: "Gerenciar dependências de pacotes.",
  cons: ["npm e Maven", "Gerenciado"],
  el: [2],
  concept: "AWS CodeArtifact",
  trap: "ECR e CodeCommit também são repositórios, mas de outros tipos de artefato.",
  tip: "Pacotes npm/Maven/pip privados → CodeArtifact. Imagens → ECR.",
  ref: "https://docs.aws.amazon.com/codeartifact/latest/ug/welcome.html",
  ev: "You can use CodeArtifact with popular build tools and package managers such as the NuGet CLI, Maven, Gradle, npm, yarn, pip, and twine. [...] You can create a connection between your private CodeArtifact repository and an external, public repository, such as npmjs.com or Maven Central.",
  evu: "https://docs.aws.amazon.com/codeartifact/latest/ug/welcome.html"
},
{
  id: "d3-21", d: 3, t: "3.4", lvl: "Desafiadora",
  q: "Um build no AWS CodeBuild precisa de um token de API sensível. Hoje, o token está em texto claro na seção env/variables do buildspec.yml versionado no Git. Qual é a forma recomendada de fornecê-lo ao build?",
  o: [
    "Mover o token para um arquivo .env no repositório",
    "Armazenar o token no Secrets Manager (ou no Parameter Store) e referenciá-lo em env/secrets-manager (ou env/parameter-store) no buildspec",
    "Passar o token como argumento na linha de comando do build",
    "Criptografar o buildspec.yml com o KMS"
  ],
  a: [1],
  w: [
    "Continua versionando o segredo.",
    "O buildspec suporta mapear variáveis a partir do Secrets Manager e do Parameter Store, e a documentação recomenda isso para valores sensíveis.",
    "Expõe o valor em logs e históricos.",
    "O CodeBuild precisa ler o buildspec; criptografá-lo não é o mecanismo previsto."
  ],
  kw: ["token de API sensível", "texto claro", "versionado no Git"],
  obj: "Injetar segredos no build.",
  cons: ["Valor sensível", "Fora do Git"],
  el: [0],
  concept: "Variáveis de ambiente seguras no CodeBuild",
  trap: "Arquivos .env parecem separados do código, mas continuam no repositório.",
  tip: "Segredo no build → env/secrets-manager ou env/parameter-store no buildspec.",
  ref: "https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html",
  ev: "For sensitive values, we recommend that you use parameter-store or secrets-manager mapping instead, as described later in this section.",
  evu: "https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html"
},
{
  id: "d3-22", d: 3, t: "3.4", lvl: "Intermediária",
  q: "Os builds de um projeto no AWS CodeBuild demoram porque baixam as mesmas dependências e camadas Docker a cada execução. Como reduzir o tempo de build com o MENOR esforço?",
  o: [
    "Usar uma imagem de build com mais vCPUs",
    "Habilitar o cache do CodeBuild (S3 ou local, por exemplo com Docker layer cache)",
    "Dividir o build em dois projetos",
    "Aumentar o timeout do build"
  ],
  a: [1],
  w: [
    "Pode ajudar um pouco, mas não evita baixar tudo de novo.",
    "O cache guarda partes reutilizáveis do ambiente de build entre execuções; há cache em S3 ou local (source, Docker layer e custom).",
    "Não elimina downloads repetidos.",
    "Só permite que o build demore mais."
  ],
  kw: ["baixam as mesmas dependências e camadas Docker", "MENOR esforço"],
  obj: "Acelerar builds repetitivos.",
  cons: ["Dependências repetidas"],
  el: [3],
  concept: "Cache de build no CodeBuild",
  trap: "Mais compute parece resolver lentidão, mas o gargalo é o download repetido.",
  tip: "Build baixando tudo toda vez → cache (S3 ou local).",
  ref: "https://docs.aws.amazon.com/codebuild/latest/userguide/build-caching.html",
  ev: "A cache can store reusable pieces of your build environment and use them across multiple builds. Your build project can use one of two types of caching: Amazon S3 or local.",
  evu: "https://docs.aws.amazon.com/codebuild/latest/userguide/build-caching.html"
},
{
  id: "d3-23", d: 3, t: "3.1", lvl: "Intermediária",
  q: "Uma aplicação no Elastic Beanstalk precisa que cada implantação configure opções do ambiente e recursos adicionais da AWS a partir do próprio código-fonte. Onde colocar esses arquivos de configuração no source bundle?",
  o: [
    "Em arquivos .config (YAML ou JSON) dentro de uma pasta chamada .ebextensions",
    "Em um arquivo appspec.yml na raiz",
    "Em um buildspec.yml na raiz",
    "Em um template.yaml do SAM"
  ],
  a: [0],
  w: [
    "Os arquivos de configuração do Beanstalk são documentos YAML ou JSON com extensão .config na pasta .ebextensions do source bundle.",
    "O appspec.yml é do CodeDeploy.",
    "O buildspec.yml é do CodeBuild.",
    "O template.yaml é do AWS SAM."
  ],
  kw: ["Elastic Beanstalk", "a partir do próprio código-fonte", "source bundle"],
  obj: "Customizar um ambiente do Beanstalk pelo código.",
  cons: ["Dentro do bundle"],
  el: [3],
  concept: ".ebextensions no Elastic Beanstalk",
  trap: "Misturar os arquivos de cada serviço de CI/CD.",
  tip: ".ebextensions/*.config = Beanstalk · appspec.yml = CodeDeploy · buildspec.yml = CodeBuild.",
  ref: "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/ebextensions.html",
  ev: "Configuration files are YAML- or JSON-formatted documents with a .config file extension that you place in a folder named .ebextensions and deploy in your application source bundle.",
  evu: "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/ebextensions.html"
},
{
  id: "d3-24", d: 3, t: "3.4", lvl: "Intermediária",
  q: "Uma empresa tem as APIs de pedidos e de clientes no API Gateway e quer expô-las sob o mesmo domínio próprio: api.exemplo.com/pedidos e api.exemplo.com/clientes, cada caminho apontando para a stage de produção da API correspondente. O que configurar?",
  o: [
    "Um custom domain name com API mappings (API, stage e caminho)",
    "Stage variables em cada API",
    "Um Lambda authorizer que roteie pelos caminhos",
    "Uma única API com integração mock"
  ],
  a: [0],
  w: [
    "Os API mappings conectam stages a um domínio próprio, com um caminho opcional para cada mapeamento.",
    "As stage variables parametrizam uma stage, não o roteamento de domínio.",
    "Authorizers controlam acesso, não roteamento.",
    "Uma integração mock não roteia para APIs reais."
  ],
  kw: ["mesmo domínio próprio", "cada caminho apontando para a stage"],
  obj: "Publicar várias APIs sob um domínio.",
  cons: ["Domínio único", "Caminhos por API"],
  el: [3],
  concept: "Custom domains e API mappings no API Gateway",
  trap: "Achar que é preciso fundir as APIs numa só.",
  tip: "Várias APIs/stages em um domínio → custom domain + API mappings (base path).",
  ref: "https://docs.aws.amazon.com/apigateway/latest/developerguide/rest-api-mappings.html",
  ev: "An API mapping specifies an API, a stage, and optionally a path to use for the mapping. For example, you can map https://api.example.com/orders to the production stage of an API.",
  evu: "https://docs.aws.amazon.com/apigateway/latest/developerguide/rest-api-mappings.html"
},
{
  id: "d3-25", d: 3, t: "3.2", lvl: "Intermediária",
  q: "O time de frontend precisa começar a integrar com um novo endpoint de uma REST API, mas o backend ainda não está pronto. A equipe quer que o API Gateway devolva respostas de exemplo fixas, sem nenhum backend. O que configurar?",
  o: [
    "Uma integração mock no método",
    "Uma integração Lambda que retorna dados fixos",
    "Uma integração HTTP para um site público",
    "O cache da stage com TTL alto"
  ],
  a: [0],
  w: [
    "A integração mock gera as respostas diretamente no API Gateway, sem backend.",
    "Funciona, mas exige criar e manter uma função: há um backend.",
    "Depende de um backend externo.",
    "O cache não gera respostas sem uma integração."
  ],
  kw: ["backend ainda não está pronto", "respostas de exemplo fixas", "sem nenhum backend"],
  obj: "Simular respostas de API sem backend.",
  cons: ["Sem backend"],
  el: [3],
  concept: "Integrações mock no API Gateway",
  trap: "Uma Lambda 'fake' parece rápida, mas ainda é um backend.",
  tip: "Resposta fixa sem backend (para teste ou contrato) → mock integration.",
  ref: "https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-mock-integration.html",
  ev: "This feature enables API developers to generate API responses from API Gateway directly, without the need for an integration backend.",
  evu: "https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-mock-integration.html"
},
{
  id: "d3-26", d: 3, t: "3.3", lvl: "Intermediária",
  q: "Vários desenvolvedores testam a mesma função Lambda pelo console e cada um recria manualmente os mesmos eventos JSON de teste. A equipe quer que os eventos criados por um fiquem disponíveis para os outros usuários da conta. O que usar?",
  o: [
    "Eventos de teste privados",
    "Eventos de teste compartilháveis (shareable test events)",
    "Variáveis de ambiente com o JSON",
    "Um alias por desenvolvedor"
  ],
  a: [1],
  w: [
    "Os eventos privados só ficam visíveis para quem os criou.",
    "Os eventos compartilháveis podem ser usados por outros usuários com acesso à função.",
    "Não é a finalidade das variáveis de ambiente.",
    "Aliases apontam para versões; não guardam eventos de teste."
  ],
  kw: ["recria manualmente os mesmos eventos JSON", "disponíveis para os outros usuários"],
  obj: "Compartilhar eventos de teste.",
  cons: ["Console", "Compartilhar"],
  el: [3],
  concept: "Eventos de teste da Lambda no console",
  trap: "Achar que os eventos de teste do console são sempre pessoais.",
  tip: "Teste no console: evento privado (só você) ou compartilhável (time).",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/testing-functions.html",
  ev: "Create a test event Before you can test in the console, you need to create a private or shareable test event.",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/testing-functions.html"
},

/* ---------- Domínio 1: Desenvolvimento ---------- */
{
  id: "d1-22", d: 1, t: "1.1", lvl: "Desafiadora",
  q: "Uma fila SQS FIFO recebe eventos de pedidos de milhares de clientes. Os eventos de um MESMO cliente precisam ser processados estritamente em ordem, mas eventos de clientes diferentes devem ser processados em paralelo para ganhar vazão. Como definir o MessageGroupId?",
  o: [
    "Usar o mesmo MessageGroupId fixo para todas as mensagens",
    "Usar o ID do cliente como MessageGroupId",
    "Usar um UUID aleatório por mensagem",
    "Não definir MessageGroupId e usar uma fila padrão"
  ],
  a: [1],
  w: [
    "Um único grupo processa tudo uma mensagem por vez: sem paralelismo.",
    "Mensagens do mesmo grupo são processadas uma por vez e em ordem; grupos diferentes (clientes diferentes) podem ser processados em paralelo.",
    "Cada mensagem em um grupo próprio perde a ordem por cliente.",
    "A fila padrão não garante ordem."
  ],
  kw: ["MESMO cliente", "estritamente em ordem", "clientes diferentes devem ser processados em paralelo"],
  obj: "Ordem por cliente com paralelismo.",
  cons: ["Ordem por cliente", "Paralelo entre clientes"],
  el: [3],
  concept: "MessageGroupId em filas FIFO",
  trap: "O grupo fixo garante ordem, mas mata o paralelismo.",
  tip: "FIFO: MessageGroupId = entidade que precisa de ordem (cliente, pedido).",
  ref: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/using-messagegroupid-property.html",
  ev: "Messages within the same message group are always processed one at a time, in strict order, ensuring that no two messages from the same group are processed simultaneously.",
  evu: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/using-messagegroupid-property.html"
},
{
  id: "d1-23", d: 1, t: "1.3", lvl: "Pegadinha",
  q: "Uma tabela do DynamoDB guarda sessões que devem ser removidas após expirar. A equipe habilitou o TTL com um atributo de expiração, mas percebe que itens expirados ainda aparecem em consultas por algum tempo. O que é verdade e o que fazer?",
  o: [
    "O TTL apaga itens exatamente no segundo da expiração; há um bug na configuração",
    "O TTL remove itens expirados em geral dentro de alguns dias, sem consumir capacidade de escrita; a aplicação deve filtrar itens com expiração no passado",
    "É preciso provisionar WCUs extras para o TTL apagar mais rápido",
    "O TTL só funciona em tabelas on-demand"
  ],
  a: [1],
  w: [
    "A exclusão não é imediata.",
    "A documentação diz que o DynamoDB exclui os itens expirados em alguns dias, sem consumir throughput de escrita; até lá, a aplicação deve filtrá-los.",
    "A exclusão por TTL não consome capacidade de escrita, e WCUs extras não aceleram o processo.",
    "O TTL não depende do modo de capacidade."
  ],
  kw: ["habilitou o TTL", "itens expirados ainda aparecem"],
  obj: "Entender o comportamento do TTL.",
  cons: ["Expiração não imediata"],
  el: [3],
  concept: "Time to Live (TTL) do DynamoDB",
  trap: "Supor que o TTL é exato no tempo.",
  tip: "TTL = limpeza assíncrona e gratuita (dias). Precisa de corte exato → filtre na leitura.",
  ref: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html",
  ev: "DynamoDB automatically deletes expired items within a few days of their expiration time, without consuming write throughput.",
  evu: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html"
},

/* ---------- Domínio 4: Troubleshooting e otimização ---------- */
{
  id: "d4-13", d: 4, t: "4.1", lvl: "Intermediária",
  q: "Uma aplicação legada escreve linhas como \"PAYMENT_FAILED\" nos logs do CloudWatch Logs. A equipe quer um alarme quando houver mais de 10 falhas em 5 minutos, SEM alterar o código da aplicação. Qual é o primeiro passo?",
  o: [
    "Instrumentar o código com o embedded metric format",
    "Criar um metric filter no log group que conte as ocorrências de PAYMENT_FAILED e gere uma métrica, depois criar o alarme sobre ela",
    "Habilitar o AWS X-Ray",
    "Criar uma regra do AWS Config"
  ],
  a: [1],
  w: [
    "O EMF exige alterar o código.",
    "Os metric filters transformam padrões dos logs em métricas numéricas do CloudWatch, nas quais dá para criar alarmes.",
    "O X-Ray faz tracing, não conta padrões de logs.",
    "O Config avalia a configuração de recursos."
  ],
  kw: ["\"PAYMENT_FAILED\" nos logs", "alarme", "SEM alterar o código"],
  obj: "Criar uma métrica a partir de logs existentes.",
  cons: ["Sem mudar o código"],
  el: [3],
  concept: "Metric filters do CloudWatch Logs",
  trap: "O EMF é o caminho moderno para métricas customizadas, mas exige mudar o código.",
  tip: "Métrica a partir de texto de log, sem código → metric filter. Com código → EMF.",
  ref: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html",
  ev: "CloudWatch Logs uses these metric filters to turn log data into numerical CloudWatch metrics that you can graph or set an alarm on.",
  evu: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html"
},
{
  id: "d4-14", d: 4, t: "4.2", lvl: "Intermediária",
  q: "Uma API pública tem pouco tráfego de madrugada, e a equipe quer descobrir problemas no fluxo de login ANTES dos clientes, verificando o endpoint continuamente mesmo sem usuários reais. O que usar?",
  o: [
    "Alarmes do CloudWatch sobre a métrica 5XXError",
    "Canaries do CloudWatch Synthetics agendados que executam o fluxo de login",
    "Logs de acesso do API Gateway",
    "AWS CloudTrail"
  ],
  a: [1],
  w: [
    "As métricas dependem de tráfego real; sem usuários, não há sinal.",
    "Os canaries são scripts agendados que repetem as ações de um cliente, detectando problemas mesmo sem tráfego.",
    "Os logs só registram requisições que aconteceram.",
    "O CloudTrail audita chamadas de API da AWS."
  ],
  kw: ["pouco tráfego", "ANTES dos clientes", "mesmo sem usuários reais"],
  obj: "Monitoramento sintético.",
  cons: ["Sem tráfego real", "Contínuo"],
  el: [3],
  concept: "CloudWatch Synthetics (canaries)",
  trap: "Alarmes de métricas parecem suficientes, mas dependem de tráfego.",
  tip: "Testar continuamente um endpoint ou jornada, mesmo sem usuários → Synthetics canary.",
  ref: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html",
  ev: "Canaries follow the same routes and perform the same actions as a customer, which makes it possible for you to continually verify your customer experience even when you don't have any customer traffic on your applications.",
  evu: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html"
},
{
  id: "d4-15", d: 4, t: "4.1", lvl: "Intermediária",
  q: "A criação de uma stack do CloudFormation falhou e entrou em ROLLBACK_COMPLETE. O desenvolvedor precisa descobrir qual recurso falhou primeiro e por quê. Onde olhar?",
  o: [
    "Nos eventos da stack (stack events), procurando o primeiro evento com status de falha e o motivo (status reason)",
    "No AWS Trusted Advisor",
    "Nas métricas do CloudWatch da stack",
    "No Cost Explorer"
  ],
  a: [0],
  w: [
    "Os stack events mostram cada operação de recurso com status e motivo; filtros de falha ajudam a achar a causa raiz.",
    "O Trusted Advisor dá recomendações gerais, não diagnóstica uma implantação.",
    "O CloudFormation não publica o motivo das falhas como métricas.",
    "O Cost Explorer trata de custos."
  ],
  kw: ["ROLLBACK_COMPLETE", "qual recurso falhou primeiro e por quê"],
  obj: "Diagnosticar uma falha de implantação.",
  cons: ["Stack com falha"],
  el: [3],
  concept: "Troubleshooting do CloudFormation com stack events",
  trap: "Olhar o último evento (o rollback) em vez do primeiro erro.",
  tip: "Falha de stack → stack events, procure o PRIMEIRO *_FAILED e seu status reason.",
  ref: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/troubleshooting.html",
  ev: "You can filter stack events by operation ID to focus on specific deployment phases and use failure filters to quickly identify the root cause of deployment failures.",
  evu: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/troubleshooting.html"
}
);
