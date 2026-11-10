// Geradores de questões com parâmetros aleatórios: cada chamada produz uma variação nova.
// Todas seguem o mesmo esquema do banco (QB). Os cálculos usam regras documentadas pela AWS.
(() => {
  const rnd = a => a[Math.floor(Math.random() * a.length)];
  const int = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const uid = () => Math.random().toString(36).slice(2, 8);

  // Monta as opções a partir de [texto, porquê, correta?], sem duplicar textos
  function build(base, items) {
    const seen = new Set(), o = [], w = [], a = [];
    for (const [t, why, ok] of items) {
      if (seen.has(t)) continue; seen.add(t);
      if (ok) a.push(o.length);
      o.push(t); w.push(why);
    }
    return Object.assign({ lvl: "Gerada", gen: true, el: [] }, base, { o, w, a });
  }
  // Garante pelo menos 4 opções numéricas distintas
  function numOpts(correct, wrongs, unit, fmt = v => `${v} ${unit}`) {
    const items = [[fmt(correct), null, true]];
    const used = new Set([correct]);
    for (const [v, why] of wrongs) if (v > 0 && !used.has(v)) { used.add(v); items.push([fmt(v), why, false]); }
    let k = 1;
    while (items.length < 4) { const v = correct + k * (k % 2 ? 1 : -1) * Math.max(1, Math.round(correct * .25)); k++; if (v > 0 && !used.has(v)) { used.add(v); items.push([fmt(v), "Valor sem base no cálculo correto.", false]); } }
    return items;
  }

  const G = {};

  /* DynamoDB: RCU/WCU */
  G.capacity = () => {
    const write = Math.random() < .45;
    const size = write ? rnd([0.5, 1, 1.5, 2, 3, 3.5, 5, 7, 12]) : rnd([1, 2, 3, 4, 5, 6, 7, 9, 11, 13, 17, 20]);
    const rate = rnd([5, 8, 10, 12, 20, 25, 40, 50, 100]);
    const mode = write ? rnd(["padrão", "padrão", "transacional"]) : rnd(["fortemente consistentes", "eventualmente consistentes", "transacionais"]);
    const block = write ? 1 : 4;
    const units = Math.ceil(size / block);
    const factor = write ? (mode === "transacional" ? 2 : 1) : (mode.startsWith("forte") ? 1 : mode.startsWith("event") ? .5 : 2);
    const ans = Math.ceil(rate * units * factor);
    const U = write ? "WCUs" : "RCUs";
    const sizeTxt = `${String(size).replace(".", ",")} KB`;
    const opName = write ? `escritas ${mode}` : `leituras ${mode}`;
    const q = `Uma aplicação precisa realizar ${rate} ${opName} por segundo em uma tabela do DynamoDB em modo provisionado. Cada item tem ${sizeTxt}. Quantas ${U} são necessárias?`;
    const ruleR = "1 RCU = 1 leitura fortemente consistente/s de até 4 KB; eventual = metade; transacional = o dobro.";
    const ruleW = "1 WCU = 1 escrita/s de até 1 KB; transacional = o dobro.";
    const wrongs = [
      [Math.ceil(rate * (size / block) * factor), "Esqueceu de arredondar o tamanho do item para cima, para o próximo bloco."],
      [Math.ceil(rate * units * (factor === 1 ? (write ? 2 : .5) : 1)), "Aplicou o multiplicador de consistência/transação errado."],
      [Math.ceil(rate * Math.ceil(size) * factor), write ? "Arredondou para KB inteiro, mas o fator de transação/consistência não bate." : "Usou blocos de 1 KB (regra de escrita) em vez de 4 KB (leitura)."],
      [Math.ceil(rate * Math.ceil(size / (write ? 4 : 1)) * factor), write ? "Usou blocos de 4 KB (regra de leitura) em vez de 1 KB." : "Usou blocos de 1 KB (regra de escrita)."]
    ];
    const items = numOpts(ans, wrongs, U);
    items[0][1] = `${sizeTxt} → ${units} bloco(s) de ${block} KB × ${rate}/s × ${factor} = ${ans} ${U}. ${write ? ruleW : ruleR}`;
    return build({
      id: "g-cap-" + uid(), d: 1, t: "1.3", q,
      kw: [`${rate} ${opName}`, sizeTxt],
      obj: `Calcular as ${U} necessárias.`, cons: [`${rate}/s`, sizeTxt, mode],
      concept: `Cálculo de ${U} no DynamoDB`, trap: "Esquecer o arredondamento para cima ou o multiplicador de consistência/transação.",
      tip: write ? "WCU: arredonde para KB inteiro; transacional ×2." : "RCU: arredonde para múltiplos de 4 KB; forte ×1, eventual ×0,5, transacional ×2.",
      ref: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html",
      ev: "For an item up to 4 KB, one read capacity unit (RCU) represents one strongly consistent read operation per second, or two eventually consistent read operations per second. [...] A write capacity unit (WCU) represents one write per second for an item up to 1 KB.",
      evu: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html"
    }, shuffle(items));
  };

  /* Lambda: concorrência = requisições/s × duração média (s) */
  G.concurrency = () => {
    const rps = rnd([50, 100, 150, 200, 300, 400, 500, 800, 1200]);
    const ms = rnd([100, 200, 250, 400, 500, 800, 1500, 2000, 3000]);
    const ans = Math.ceil(rps * ms / 1000);
    const q = `Uma API recebe em média ${rps} requisições por segundo, cada uma tratada por uma função Lambda com duração média de ${ms} ms. Qual é a concorrência aproximada que a função vai usar em regime estável?`;
    const wrongs = [
      [rps, "É a taxa de requisições, não a concorrência: ignora quanto tempo cada execução dura."],
      [rps * ms, "Multiplicou pela duração em milissegundos, não em segundos."],
      [Math.max(1, Math.round(rps / (ms / 1000))), "Dividiu pela duração em vez de multiplicar."]
    ];
    const items = numOpts(ans, wrongs, "execuções simultâneas");
    items[0][1] = `Concorrência ≈ requisições/s × duração média (s) = ${rps} × ${ms / 1000} = ${ans}.${ans > 1000 ? " Isso passa da cota padrão de 1.000 por Região: é preciso pedir aumento de cota." : ""}`;
    return build({
      id: "g-conc-" + uid(), d: 4, t: "4.3", q,
      kw: [`${rps} requisições por segundo`, `${ms} ms`, "concorrência aproximada"],
      obj: "Estimar a concorrência da Lambda.", cons: [`${rps} req/s`, `${ms} ms por execução`],
      concept: "Definição de concorrência na Lambda", trap: "Confundir requisições por segundo com execuções simultâneas.",
      tip: "Concorrência = req/s × duração (s). A cota padrão é de 1.000 por Região (compartilhada entre as funções).",
      ref: "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html",
      ev: "Concurrency = (average requests per second) * (average request duration in seconds) [...] By default, Lambda provides your account with a total concurrency limit of 1,000 concurrent executions across all Event Functions in an AWS Region.",
      evu: "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html"
    }, shuffle(items));
  };

  /* KMS: Encrypt direto (até 4 KB) vs envelope encryption */
  G.kms = () => {
    const [label, kb] = rnd([["um token de 1 KB", 1], ["uma senha de 200 bytes", .2], ["uma chave de API de 2 KB", 2], ["um JSON de 3 KB", 3],
      ["um documento PDF de 2 MB", 2048], ["um arquivo de log de 50 MB", 51200], ["um backup de 5 GB", 5e6], ["uma imagem de 600 KB", 600]]);
    const small = kb <= 4;
    const q = `Uma aplicação precisa criptografar ${label} usando uma customer managed key do AWS KMS. Qual é a abordagem MAIS adequada e simples?`;
    const items = [
      ["Chamar a API kms:Encrypt diretamente com os dados", small ? "A API Encrypt aceita até 4 KB de dados: para esse tamanho, é a forma mais simples." : "A API Encrypt aceita no máximo 4 KB: esse volume exige envelope encryption.", small],
      ["Chamar kms:GenerateDataKey, criptografar localmente com a data key e guardar a data key criptografada junto aos dados", small ? "Funciona, mas é mais complexo que o necessário para dados de até 4 KB." : "Envelope encryption: o padrão para dados maiores que 4 KB, com o processamento feito localmente.", !small],
      ["Exportar a chave do KMS para a aplicação e criptografar localmente com ela", "As chaves do KMS nunca saem do serviço sem criptografia: não é possível exportá-las.", false],
      ["Usar kms:ReEncrypt para criptografar os dados pela primeira vez", "O ReEncrypt troca a chave de um ciphertext já existente; não faz a criptografia inicial.", false]
    ];
    return build({
      id: "g-kms-" + uid(), d: 2, t: "2.2", q,
      kw: [label, "MAIS adequada e simples"],
      obj: "Escolher a API do KMS conforme o tamanho dos dados.", cons: [label],
      el: [2, 3],
      concept: "Limite de 4 KB da API Encrypt e envelope encryption", trap: "Usar envelope encryption para dados minúsculos ou Encrypt direto para arquivos grandes.",
      tip: "Até 4 KB → Encrypt. Mais que isso → GenerateDataKey (envelope).",
      ref: "https://docs.aws.amazon.com/kms/latest/APIReference/API_Encrypt.html",
      ev: "Encrypts plaintext of up to 4,096 bytes using a KMS key. [...] Envelope encryption is the practice of encrypting plaintext data with a data key, and then encrypting the data key under another key.",
      evu: "https://docs.aws.amazon.com/kms/latest/APIReference/API_Encrypt.html"
    }, items);
  };

  /* SQS: visibility timeout vs tempo de processamento */
  G.visibility = () => {
    const [ptxt, ps] = rnd([["45 segundos", 45], ["2 minutos", 120], ["5 minutos", 300], ["10 minutos", 600], ["40 minutos", 2400]]);
    const f = s => s < 60 ? `${s} segundos` : s < 3600 ? `${Math.round(s / 60)} minutos` : `${(s / 3600).toString().replace(".", ",")} horas`;
    const good = Math.round(ps * 1.5);
    const q = `Os consumidores de uma fila SQS padrão levam no máximo ${ptxt} para processar cada mensagem, e mensagens estão sendo processadas em duplicidade. O visibility timeout está no padrão (30 segundos). Qual novo valor é o MAIS adequado?`;
    const items = shuffle([
      [f(good), `Cobre o tempo máximo de processamento (${ptxt}) com folga: a mensagem não reaparece enquanto está sendo processada. A AWS recomenda partir do tempo máximo típico de processamento.`, true],
      [f(Math.max(20, Math.round(ps / 2))), "Menor que o tempo de processamento: a mensagem reaparece antes da exclusão e é reprocessada.", false],
      [f(ps === 45 ? 30 : Math.round(ps * .8)), "Abaixo do tempo máximo de processamento: ainda haverá reprocessamento.", false],
      ["13 horas", "O visibility timeout máximo é de 12 horas, e um valor alto demais atrasa o reprocessamento de falhas reais.", false]
    ]);
    return build({
      id: "g-vis-" + uid(), d: 1, t: "1.1", q,
      kw: [`no máximo ${ptxt}`, "em duplicidade", "padrão (30 segundos)"],
      obj: "Dimensionar o visibility timeout.", cons: [`Processamento de até ${ptxt}`, "Máximo de 12 h"],
      concept: "Visibility timeout do SQS", trap: "Escolher um valor alto demais ou acima do máximo de 12 h.",
      tip: "Visibility timeout > tempo de processamento (com margem). Processamento variável → ChangeMessageVisibility.",
      ref: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
      ev: "Start by setting the visibility timeout to match the maximum time your application typically needs to process and delete a message. [...] Keep in mind that the visibility timeout has a maximum limit of 12 hours from when the message is first received.",
      evu: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html"
    }, items);
  };

  /* Flash de palavras-chave, a partir das comparações */
  G.flash = () => {
    const pool = (window.CMP || []).filter(c => c.kw.length >= 2);
    const c = rnd(pool), row = rnd(c.kw);
    const others = c.kw.filter(k => k[1] !== row[1]);
    const items = shuffle([[row[1], `Correto. ${c.decide.join(" ")}`, true],
      ...others.map(k => [k[1], `Essa escolha se aplica quando a questão fala em: ${k[0]}.`, false])]).slice(0, 5);
    if (!items.some(i => i[2])) items[0] = [row[1], `Correto. ${c.decide.join(" ")}`, true];
    const q = `Flash (${c.title}): o enunciado destaca "${row[0]}". Qual opção tende a ser a correta?`;
    return build({
      id: "g-flash-" + uid(), d: c.d[0], t: { 1: "1.1", 2: "2.1", 3: "3.4", 4: "4.3" }[c.d[0]], lvl: "Flash", q,
      kw: [row[0]], obj: "Associar as palavras-chave do enunciado ao serviço certo.", cons: [row[0]],
      concept: c.title, trap: c.traps, tip: c.decide.join(" "), ref: c.ref, cmp: c.id
    }, items);
  };

  const KINDS = { capacity: 2, concurrency: 1, kms: 1, visibility: 1, flash: 4 };
  window.GEN = {
    kinds: Object.keys(KINDS),
    one(kind) {
      if (!kind) { const bag = Object.entries(KINDS).flatMap(([k, n]) => Array(n).fill(k)); kind = rnd(bag); }
      return G[kind]();
    },
    many(n) { return Array.from({ length: n }, () => this.one()); }
  };
})();
