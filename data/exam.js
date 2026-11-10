// Metadados oficiais do exame (fonte: exam guide DVA-C02, docs.aws.amazon.com/aws-certification)
window.EXAM = {
  code: "DVA-C02",
  name: "AWS Certified Developer - Associate",
  guide: "https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02.html",
  questions: 65,          // 50 pontuadas + 15 não pontuadas
  scored: 50,
  minutes: 130,
  passing: 720,           // escala 100–1000
  domains: {
    1: { name: "Desenvolvimento com serviços AWS", en: "Development with AWS Services", weight: 32 },
    2: { name: "Segurança", en: "Security", weight: 26 },
    3: { name: "Implantação", en: "Deployment", weight: 24 },
    4: { name: "Solução de problemas e otimização", en: "Troubleshooting and Optimization", weight: 18 }
  },
  // Skills do exam guide (usadas para variar os temas dos pacotes gerados com IA)
  skills: {
    1: ["Architectural patterns (event-driven, microservices, monolithic, choreography, orchestration, fanout)", "Stateful vs stateless", "Tightly vs loosely coupled components", "Synchronous vs asynchronous patterns", "Fault-tolerant and resilient application code", "Create, extend and maintain APIs (request/response transformations, validation, status code overrides)", "Unit tests in development environments (AWS SAM)", "Code that uses messaging services", "Interacting with AWS services via APIs and SDKs", "Handling streaming data", "Amazon Q Developer to assist development", "Amazon EventBridge event-driven patterns", "Resilient third-party integrations (retry, circuit breakers, error handling)", "Lambda access to private resources in VPCs", "Lambda configuration (env vars, memory, concurrency, timeout, runtime, handler, layers, extensions, triggers, destinations)", "Lambda event lifecycle and errors (Destinations, DLQs)", "Testing Lambda code with AWS tools", "Integrating Lambda with AWS services", "Tuning Lambda performance", "Near-real-time data processing with Lambda", "High-cardinality partition keys", "Consistency models (strong vs eventual)", "Query vs Scan", "DynamoDB keys and indexing", "Serialization/deserialization for persistence", "Using and maintaining data stores", "Data lifecycle management (TTL, S3 lifecycle)", "Data caching services", "Specialized data stores by access pattern (e.g., OpenSearch)"],
    2: ["Federated access with an identity provider (Cognito, IAM)", "Bearer tokens", "Programmatic access to AWS", "Authenticated calls to AWS services (SigV4)", "Assuming an IAM role", "Permissions for IAM principals", "Application-level fine-grained authorization", "Cross-service authentication in microservices", "Encryption at rest and in transit", "Certificate management (ACM, AWS Private CA)", "Client-side vs server-side encryption", "Using keys to encrypt/decrypt data (KMS)", "Certificates and SSH keys for development", "Encryption across account boundaries", "Enabling/disabling key rotation", "Data classification (PII, PHI)", "Encrypting environment variables with sensitive data", "Secret management services", "Sanitizing sensitive data", "Application-level data masking", "Data access patterns for multi-tenant applications"],
    3: ["Managing code dependencies (env vars, config files, container images)", "Organizing files and directories for deployment", "Code repositories in deployment environments", "Resource requirements (memory, cores)", "Environment-specific configuration (AWS AppConfig)", "Testing deployed code with AWS tools", "Integration tests and mock APIs", "Development endpoints (API Gateway stages)", "Deploying stack updates to existing environments (SAM to another stage)", "Testing event-driven applications", "Test events (JSON payloads for Lambda, API Gateway, SAM)", "Deploying API resources to environments", "Approved versions for integration testing (Lambda aliases, image tags, Amplify branches, Copilot environments)", "IaC templates (SAM, CloudFormation)", "Environments within services (dev/test/prod in API Gateway)", "Amazon Q Developer to generate automated tests", "Lambda deployment packaging options", "API Gateway stages and custom domains", "Updating IaC templates", "Managing application environments", "Deployment strategies for application versions", "Commits triggering build/test/deploy", "Orchestrated workflows across environments", "Rollbacks with existing deployment strategies", "Labels and branches for release management", "Runtime configurations for dynamic deployments (stage variables)", "Blue/green, canary, rolling deployments"],
    4: ["Debugging code to find defects", "Interpreting metrics, logs and traces", "Querying logs", "Custom metrics (CloudWatch EMF)", "Dashboards and insights for application health", "Troubleshooting deployment failures with service logs", "Debugging service integration issues", "Logging vs monitoring vs observability", "Effective logging strategy", "Code that emits custom metrics", "Tracing annotations", "Notification alerts (quota limits, deployment completion)", "Tracing with AWS services and tools (X-Ray, ADOT)", "Structured logging", "Health checks and readiness probes", "Concurrency", "Profiling application performance", "Minimum memory and compute for an application", "Subscription filter policies for messaging", "Caching based on request headers", "Application-level caching", "Optimizing resource usage", "Analyzing performance issues", "Using logs to find bottlenecks"]
  },
  tasks: {
    "1.1": "Desenvolver código para aplicações hospedadas na AWS",
    "1.2": "Desenvolver código para AWS Lambda",
    "1.3": "Usar armazenamentos de dados no desenvolvimento",
    "2.1": "Implementar autenticação e/ou autorização",
    "2.2": "Implementar criptografia com serviços AWS",
    "2.3": "Gerenciar dados sensíveis no código",
    "3.1": "Preparar artefatos de aplicação para implantação",
    "3.2": "Testar aplicações em ambientes de desenvolvimento",
    "3.3": "Automatizar testes de implantação",
    "3.4": "Implantar código com serviços de CI/CD da AWS",
    "4.1": "Apoiar a análise de causa raiz",
    "4.2": "Instrumentar código para observabilidade",
    "4.3": "Otimizar aplicações com serviços e recursos AWS"
  }
};
window.QB = [];
window.CMP = [];
