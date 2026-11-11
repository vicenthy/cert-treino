// Domínio 3 — Implantação (24%)
QB.push(
{
  id: "d3-01", d: 3, t: "3.4", lvl: "Desafiadora",
  q: "Uma aplicação serverless é implantada com AWS SAM. A equipe quer que novas versões de uma função Lambda recebam 10% do tráfego por 5 minutos antes de receber 100%, com rollback automático se um alarme do CloudWatch disparar. Qual configuração usar?",
  o: [
    "Publicar uma nova versão manualmente e apontar o alias para ela",
    "No template SAM, usar AutoPublishAlias e DeploymentPreference com tipo Canary10Percent5Minutes e a lista de Alarms",
    "Usar a política de implantação Immutable do Elastic Beanstalk",
    "Criar duas stages no API Gateway e alternar entre elas manualmente"
  ],
  a: [1],
  w: [
    "Não há deslocamento gradual nem rollback automático.",
    "O SAM cria um deployment no CodeDeploy que desloca o tráfego do alias de forma canary e reverte automaticamente se os alarmes dispararem.",
    "O Elastic Beanstalk não é usado para implantar funções Lambda.",
    "A troca manual não é gradual por percentual nem automática."
  ],
  kw: ["AWS SAM", "10% do tráfego por 5 minutos", "rollback automático", "alarme do CloudWatch"],
  obj: "Implantação canary de Lambda com rollback.",
  cons: ["Canary 10%/5 min", "Rollback por alarme"],
  el: [2],
  concept: "Implantações graduais com SAM + CodeDeploy",
  trap: "Confundir canary (dois passos) com linear (incrementos iguais).",
  tip: "Canary = X% e depois o resto. Linear = X% a cada N minutos. AllAtOnce = tudo de uma vez.",
  ref: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/automating-updates-to-serverless-apps.html",
  ev: "Deploying serverless applications gradually with AWS SAM AWS Serverless Application Model (AWS SAM) comes built-in with CodeDeploy to provide gradual AWS Lambda deployments.",
  evu: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/automating-updates-to-serverless-apps.html"
},
{
  id: "d3-02", d: 3, t: "3.4", lvl: "Desafiadora",
  q: "Uma REST API no API Gateway tem as stages dev e prod. A função Lambda integrada tem os aliases DEV e PROD. Cada stage deve invocar o alias correspondente usando a MESMA definição de API. Qual solução usar?",
  o: [
    "Criar duas APIs separadas, uma para cada alias",
    "Definir uma stage variable em cada stage e usar ${stageVariables.alias} no ARN da integração Lambda, concedendo permissão de invocação para cada alias",
    "Usar variáveis de ambiente da Lambda para decidir qual código executar",
    "Configurar um canary release na stage prod"
  ],
  a: [1],
  w: [
    "Funciona, mas duplica a definição da API, contrariando o requisito.",
    "As stage variables permitem parametrizar o ARN da integração por stage; cada alias precisa de uma resource-based permission para o API Gateway invocá-lo.",
    "Seria a mesma versão do código decidindo em tempo de execução, sem isolamento de versões.",
    "O canary divide tráfego dentro de uma stage, não mapeia stages para aliases."
  ],
  kw: ["stages dev e prod", "aliases DEV e PROD", "MESMA definição de API"],
  obj: "Mapear stages para aliases da Lambda.",
  cons: ["Uma única API", "Alias por stage"],
  el: [2],
  concept: "Stage variables do API Gateway + aliases da Lambda",
  trap: "Esquecer da permissão: cada alias precisa autorizar o API Gateway a invocá-lo.",
  tip: "Configuração dinâmica por stage → stage variables.",
  ref: "https://docs.aws.amazon.com/apigateway/latest/developerguide/stage-variables.html",
  ev: "Use stage variables for a REST API in API Gateway Stage variables are key-value pairs that you can define as configuration attributes associated with a deployment stage of a REST API.",
  evu: "https://docs.aws.amazon.com/apigateway/latest/developerguide/stage-variables.html"
},
{
  id: "d3-03", d: 3, t: "3.4", lvl: "Pegadinha",
  q: "Uma aplicação no AWS Elastic Beanstalk precisa ser atualizada mantendo a capacidade TOTAL durante a implantação. Em caso de falha, o rollback deve ser rápido e não afetar as instâncias atuais, apenas encerrando as novas. Qual política de implantação usar?",
  o: ["All at once", "Rolling", "Rolling with additional batch", "Immutable"],
  a: [3],
  w: [
    "Implanta em todas as instâncias ao mesmo tempo, com indisponibilidade, e o rollback exige uma nova implantação.",
    "Reduz a capacidade durante os lotes, e o rollback exige reimplantar a versão anterior.",
    "Mantém a capacidade, mas atualiza as instâncias existentes; o rollback exige uma nova implantação.",
    "Cria instâncias novas em um Auto Scaling group temporário; se falhar, basta encerrá-las, e as atuais não são tocadas."
  ],
  kw: ["capacidade TOTAL", "rollback deve ser rápido", "não afetar as instâncias atuais"],
  obj: "Escolher a política de implantação do Beanstalk.",
  cons: ["Capacidade total", "Rollback rápido", "Instâncias atuais intocadas"],
  el: [0],
  concept: "Políticas de implantação do Elastic Beanstalk",
  trap: "Rolling with additional batch mantém a capacidade, mas altera as instâncias antigas.",
  tip: "Instâncias novas + rollback encerrando-as → Immutable (ou Traffic splitting, se pedir % de tráfego).",
  ref: "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html",
  ev: "Immutable deployments perform an immutable update to launch a full set of new instances running the new version of the application in a separate Auto Scaling group, alongside the instances running the old version. [...] If the new instances don't pass health checks, Elastic Beanstalk terminates them, leaving the original instances untouched.",
  evu: "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html"
},
{
  id: "d3-04", d: 3, t: "3.4", lvl: "Intermediária",
  q: "Uma aplicação é implantada em instâncias EC2 com o AWS CodeDeploy. A equipe quer executar um script que confirma que o serviço está respondendo corretamente DEPOIS que a aplicação foi iniciada, como última etapa da implantação. Qual hook do appspec.yml usar?",
  o: ["BeforeInstall", "AfterInstall", "ApplicationStart", "ValidateService"],
  a: [3],
  w: [
    "Roda antes de copiar os arquivos (por exemplo, para preparar diretórios).",
    "Roda após a cópia dos arquivos (configuração, permissões), mas antes de iniciar.",
    "É usado para iniciar a aplicação.",
    "É o último hook do ciclo de vida no EC2, próprio para verificar se a implantação foi bem-sucedida."
  ],
  kw: ["DEPOIS que a aplicação foi iniciada", "última etapa"],
  obj: "Escolher o hook de validação.",
  cons: ["Após o início", "Última etapa"],
  el: [0],
  concept: "Hooks do appspec do CodeDeploy (EC2/on-premises)",
  trap: "ApplicationStart parece o fim, mas há um hook depois dele.",
  tip: "Ordem: ApplicationStop → BeforeInstall → AfterInstall → ApplicationStart → ValidateService.",
  ref: "https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html",
  ev: "ValidateService – This is the last deployment lifecycle event.",
  evu: "https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html"
},
{
  id: "d3-05", d: 3, t: "3.4", lvl: "Intermediária",
  q: "Um projeto do AWS CodeBuild falha logo no início com um erro informando que a especificação de build não foi encontrada. O arquivo buildspec.yml está na pasta /config do repositório. Qual é a solução MAIS simples?",
  o: [
    "Renomear o arquivo para appspec.yml",
    "Mover o buildspec.yml para a raiz do código-fonte ou informar o caminho customizado na configuração do projeto",
    "Adicionar uma fase install vazia ao arquivo",
    "Mudar a imagem de build do projeto"
  ],
  a: [1],
  w: [
    "O appspec.yml é do CodeDeploy, não do CodeBuild.",
    "Por padrão, o CodeBuild procura o buildspec.yml na raiz do diretório do código-fonte; você pode mudar o nome ou o local nas configurações do projeto.",
    "O problema é encontrar o arquivo, não seu conteúdo.",
    "A imagem não muda onde o arquivo é procurado."
  ],
  kw: ["especificação de build não foi encontrada", "na pasta /config"],
  obj: "Corrigir a localização do buildspec.",
  cons: ["Arquivo fora da raiz"],
  el: [3],
  concept: "Buildspec do CodeBuild",
  trap: "Confundir buildspec (CodeBuild) com appspec (CodeDeploy).",
  tip: "buildspec.yml = CodeBuild (raiz). appspec.yml = CodeDeploy. .ebextensions = Beanstalk.",
  ref: "https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html",
  ev: "If you include a buildspec as part of the source code, by default, the buildspec file must be named buildspec.yml and placed in the root of your source directory. [...] You can override the default buildspec file name and location.",
  evu: "https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html"
},
{
  id: "d3-06", d: 3, t: "3.3", lvl: "Intermediária",
  q: "Uma stack do CloudFormation de rede cria uma VPC. Outras stacks de aplicação precisam referenciar o ID dessa VPC sem copiá-lo manualmente. Como fazer isso?",
  o: [
    "Usar Parameters em cada stack de aplicação e digitar o ID",
    "Na stack de rede, declarar o ID nos Outputs com Export; nas stacks de aplicação, usar Fn::ImportValue",
    "Usar Fn::GetAtt diretamente para um recurso de outra stack",
    "Usar nested stacks obrigatoriamente"
  ],
  a: [1],
  w: [
    "Exige cópia manual e é sujeito a erro.",
    "Os outputs exportados podem ser importados por outras stacks da mesma conta e Região com Fn::ImportValue.",
    "Fn::GetAtt só referencia recursos da própria stack.",
    "As nested stacks são uma opção para composição, mas não são obrigatórias; export/import atende diretamente."
  ],
  kw: ["Outras stacks", "sem copiá-lo manualmente"],
  obj: "Compartilhar valores entre stacks.",
  cons: ["Entre stacks", "Sem cópia manual"],
  el: [0],
  concept: "Cross-stack references (Export/ImportValue)",
  trap: "GetAtt é para atributos de recursos da mesma stack.",
  tip: "Referência entre stacks → Outputs + Export + Fn::ImportValue.",
  ref: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/walkthrough-crossstackref.html",
  ev: "Then, use the Fn::ImportValue intrinsic function to import the value.",
  evu: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/walkthrough-crossstackref.html"
},
{
  id: "d3-07", d: 3, t: "3.4", lvl: "Intermediária",
  q: "Antes de atualizar uma stack do CloudFormation em produção, a equipe quer ver exatamente quais recursos serão adicionados, modificados ou substituídos, sem aplicar nada ainda. O que usar?",
  o: ["Drift detection", "Um change set", "Uma stack policy", "Um rollback trigger"],
  a: [1],
  w: [
    "O drift detection compara a stack com o estado real dos recursos (mudanças feitas fora do CloudFormation), não pré-visualiza uma atualização.",
    "O change set mostra as mudanças propostas (incluindo substituições) e só aplica quando é executado.",
    "A stack policy protege recursos contra atualizações, não pré-visualiza mudanças.",
    "Rollback triggers revertem uma atualização com base em alarmes durante a implantação."
  ],
  kw: ["quais recursos serão adicionados, modificados ou substituídos", "sem aplicar nada ainda"],
  obj: "Pré-visualizar mudanças da stack.",
  cons: ["Sem aplicar"],
  el: [3],
  concept: "Change sets do CloudFormation",
  trap: "Drift detection soa como 'diferenças', mas olha para o passado, não para a atualização proposta.",
  tip: "Prévia de update → change set.",
  ref: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html",
  ev: "Change sets allow you to preview how proposed changes to a stack might impact your running resources, including the impact on resource properties and attributes.",
  evu: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html"
},
{
  id: "d3-08", d: 3, t: "3.2", lvl: "Intermediária", multi: true,
  q: "Um desenvolvedor usa AWS SAM e quer testar LOCALMENTE, antes de implantar: (1) uma função com um payload de evento de exemplo do S3 e (2) os endpoints HTTP da API. Quais DOIS comandos usar? (Selecione DOIS.)",
  o: [
    "sam local invoke com um arquivo de evento (gerado por sam local generate-event)",
    "sam local start-api",
    "sam deploy --guided para a conta de produção",
    "aws cloudformation detect-stack-drift",
    "aws deploy create-deployment"
  ],
  a: [0, 1],
  w: [
    "Executa a função localmente em um container com o evento JSON informado.",
    "Sobe um servidor HTTP local que emula o API Gateway e invoca as funções.",
    "Implanta na nuvem (e em produção), o oposto de testar localmente.",
    "O drift detection não testa código.",
    "Esse comando cria um deployment no CodeDeploy, não executa testes locais."
  ],
  kw: ["LOCALMENTE", "payload de evento de exemplo do S3", "endpoints HTTP da API"],
  obj: "Testar funções e API localmente.",
  cons: ["Local", "Evento de exemplo + HTTP"],
  el: [2, 3, 4],
  concept: "Testes locais com a AWS SAM CLI",
  trap: "Comandos que implantam na nuvem parecem \"testar\", mas não rodam localmente.",
  tip: "sam local invoke (evento), sam local start-api (HTTP), sam local generate-event (payloads).",
  ref: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-local.html",
  ev: "Intro to sam local invoke – Initiate a one-time invocation of an AWS Lambda Event Function locally. Intro to sam local start-api – Run your Lambda functions using a local HTTP server.",
  evu: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-local.html"
},
{
  id: "d3-09", d: 3, t: "3.4", lvl: "Intermediária",
  q: "O alias PROD de uma função Lambda aponta para a versão 5, que acabou de ser publicada e está com um bug crítico. A versão 4 funcionava corretamente. Qual é a forma MAIS rápida de fazer rollback?",
  o: [
    "Reimplantar o código antigo e publicar a versão 6",
    "Atualizar o alias PROD para apontar para a versão 4",
    "Excluir a versão 5",
    "Editar o código da versão 5 no console"
  ],
  a: [1],
  w: [
    "Funciona, mas é mais lento que redirecionar o alias.",
    "Os clientes chamam o alias; apontá-lo de volta para a versão 4 (imutável) é instantâneo.",
    "Um alias não pode apontar para uma versão excluída, e isso não resolve o roteamento.",
    "As versões publicadas são imutáveis."
  ],
  kw: ["alias PROD", "versão 5", "versão 4 funcionava", "MAIS rápida"],
  obj: "Rollback de Lambda.",
  cons: ["Velocidade"],
  el: [3],
  concept: "Versões e aliases da Lambda",
  trap: "Lembrar que as versões publicadas são imutáveis; só $LATEST é editável.",
  tip: "Aliases = ponteiros móveis para versões imutáveis → rollback instantâneo.",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html",
  ev: "A Lambda alias is a pointer to a function version that you can update.",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/configuration-aliases.html"
},
{
  id: "d3-10", d: 3, t: "3.1", lvl: "Desafiadora",
  q: "Uma equipe quer liberar uma nova funcionalidade gradualmente para os usuários, alterando apenas configuração (sem reimplantar código), e reverter automaticamente se um alarme do CloudWatch disparar durante a liberação. Qual serviço usar?",
  o: [
    "Variáveis de ambiente da Lambda atualizadas via CLI",
    "AWS AppConfig com feature flags, uma deployment strategy gradual e o alarme como monitor",
    "Parâmetros no Parameter Store lidos a cada requisição",
    "Um canary do CodeDeploy com uma nova versão da função"
  ],
  a: [1],
  w: [
    "Alterar as variáveis cria uma nova configuração da função de uma vez, sem liberação gradual nem rollback por alarme.",
    "O AppConfig implanta configurações de forma gradual, valida, monitora alarmes e faz rollback automático, sem reimplantar o código.",
    "Mudanças são aplicadas imediatamente, sem rollout gradual nem rollback automático.",
    "Exige implantar uma nova versão do código, o que o enunciado quer evitar."
  ],
  kw: ["gradualmente", "apenas configuração (sem reimplantar código)", "reverter automaticamente", "alarme do CloudWatch"],
  obj: "Feature flags com rollout seguro.",
  cons: ["Sem reimplantar", "Gradual", "Rollback por alarme"],
  el: [0],
  concept: "AWS AppConfig (feature flags e deployment strategies)",
  trap: "O canary do CodeDeploy é gradual com rollback, mas implanta código, não configuração.",
  tip: "Configuração dinâmica, feature flag e rollout com rollback → AppConfig.",
  ref: "https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html",
  ev: "Feature flags and toggles – Gradually release new capabilities to targeted users, monitor impact, and instantly roll back changes if issues occur.",
  evu: "https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html"
},
{
  id: "d3-11", d: 3, t: "3.4", lvl: "Desafiadora",
  q: "Uma função Lambda de inferência precisa de bibliotecas de machine learning que somam 1,5 GB descompactadas. O pacote .zip e as camadas excedem os limites da Lambda. Qual opção de empacotamento resolve?",
  o: [
    "Dividir as bibliotecas em 5 Lambda layers",
    "Empacotar a função como imagem de container no Amazon ECR",
    "Aumentar a memória da função para 10.240 MB",
    "Compactar melhor o .zip para ficar abaixo de 50 MB"
  ],
  a: [1],
  w: [
    "O total descompactado da função mais as layers continua limitado a 250 MB.",
    "Funções empacotadas como imagem de container suportam imagens de até 10 GB.",
    "A memória não afeta o limite do pacote de implantação.",
    "O limite de 250 MB vale para o tamanho descompactado; compactar não resolve."
  ],
  kw: ["1,5 GB descompactadas", "excedem os limites"],
  obj: "Empacotar dependências grandes.",
  cons: ["1,5 GB de dependências"],
  el: [2],
  concept: "Opções de empacotamento da Lambda (.zip vs container)",
  trap: "Layers parecem resolver, mas contam no mesmo limite descompactado.",
  tip: ".zip + layers: 250 MB descompactados. Container: até 10 GB.",
  ref: "https://docs.aws.amazon.com/lambda/latest/dg/images-create.html",
  ev: "(Tabela de cotas) Container image code package size: 10 GB (maximum uncompressed image size, including all layers). Deployment package: 250 MB – The maximum size of the contents of a deployment package, including layers and custom runtimes. (unzipped)",
  evu: "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html"
},
{
  id: "d3-12", d: 3, t: "3.3", lvl: "Intermediária",
  q: "Um desenvolvedor adicionou um novo recurso e um novo método a uma REST API no console do API Gateway, mas os clientes continuam recebendo a resposta antiga ao chamar a URL da stage prod. O que está faltando?",
  o: [
    "Limpar o cache do navegador do cliente",
    "Criar uma deployment da API para a stage prod",
    "Habilitar CORS no novo método",
    "Aumentar o throttling da stage"
  ],
  a: [1],
  w: [
    "O problema não está no cliente.",
    "Nas REST APIs, as alterações só ficam disponíveis numa stage após uma nova deployment.",
    "O CORS afeta chamadas de navegador entre origens, não a publicação de mudanças.",
    "O throttling limita a taxa de requisições; não publica alterações."
  ],
  kw: ["no console do API Gateway", "continuam recebendo a resposta antiga", "stage prod"],
  obj: "Publicar alterações de uma REST API.",
  cons: ["Alteração feita no console"],
  el: [3],
  concept: "Deployments e stages do API Gateway",
  trap: "Achar que salvar no console já publica as mudanças.",
  tip: "Alterou a REST API? Crie uma deployment para a stage.",
  ref: "https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-deploy-api.html",
  ev: "Deploy REST APIs in API Gateway After creating your API, you must deploy it to make it callable by your users.",
  evu: "https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-deploy-api.html"
},
{
  id: "d3-13", d: 3, t: "3.4", lvl: "Intermediária",
  q: "Um pipeline do AWS CodePipeline executa build, testes e implantação a cada commit na branch main. A empresa exige que uma pessoa aprove explicitamente antes da implantação em produção. Como implementar com o MENOR esforço?",
  o: [
    "Criar uma Lambda que pausa o pipeline e envia email",
    "Adicionar uma ação de manual approval antes do stage de produção, opcionalmente notificando via tópico SNS",
    "Criar um pipeline separado para produção disparado manualmente",
    "Usar um timeout longo no CodeBuild"
  ],
  a: [1],
  w: [
    "Seria reinventar uma funcionalidade nativa.",
    "A ação de aprovação manual pausa o pipeline até alguém aprovar ou rejeitar e pode notificar via SNS.",
    "Funciona, mas é mais trabalhoso e menos rastreável.",
    "Um timeout não é um mecanismo de aprovação."
  ],
  kw: ["a cada commit", "aprove explicitamente", "MENOR esforço"],
  obj: "Gate de aprovação manual.",
  cons: ["Aprovação humana", "Menor esforço"],
  el: [3],
  concept: "Manual approval no CodePipeline",
  trap: "Criar automações próprias para algo que já é nativo.",
  tip: "Aprovação humana no pipeline → ação Manual approval (+ SNS).",
  ref: "https://docs.aws.amazon.com/codepipeline/latest/userguide/approvals.html",
  ev: "In AWS CodePipeline, you can add an approval action to a stage in a pipeline at the point where you want the pipeline execution to stop so that someone with the required AWS Identity and Access Management permissions can approve or reject the action.",
  evu: "https://docs.aws.amazon.com/codepipeline/latest/userguide/approvals.html"
},
{
  id: "d3-14", d: 3, t: "3.3", lvl: "Intermediária",
  q: "Uma equipe frontend usa o AWS Amplify Hosting e quer que cada feature branch do repositório Git tenha seu próprio ambiente de pré-visualização, criado e atualizado automaticamente a cada push, para testes antes do merge. O que configurar?",
  o: [
    "Um bucket S3 por branch com upload manual",
    "Implantações por branch no Amplify Hosting (detecção automática de branches)",
    "Uma stage do API Gateway por branch",
    "Um alias Lambda por branch"
  ],
  a: [1],
  w: [
    "É manual e não atende ao 'automaticamente'.",
    "O Amplify conecta o repositório e cria ou atualiza um ambiente por branch a cada push, inclusive com detecção automática de branches.",
    "As stages são para APIs, não para hospedar o frontend.",
    "Os aliases são para funções, não para hospedar frontends."
  ],
  kw: ["cada feature branch", "pré-visualização", "automaticamente a cada push"],
  obj: "Ambientes efêmeros por branch.",
  cons: ["Automático", "Por branch"],
  el: [2, 3],
  concept: "Branches do Amplify como ambientes",
  trap: "Misturar mecanismos de ambiente de outros serviços (stages, aliases).",
  tip: "Ambiente por branch Git para web apps → Amplify Hosting.",
  ref: "https://docs.aws.amazon.com/amplify/latest/userguide/multi-environments.html",
  ev: "Amplify uses Git branches to create a new deployment each time you connect a new branch in your repository.",
  evu: "https://docs.aws.amazon.com/amplify/latest/userguide/multi-environments.html"
}
);
