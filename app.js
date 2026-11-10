/* DVA Treino — PWA de estudo para AWS DVA-C02.
   Metodologia adaptada do Kiro Study Buddy (aws-samples/sample-kiro-study-buddy, licença MIT). */
(() => {
  "use strict";

  const E = window.EXAM, QB = window.QB, CMP = window.CMP;
  const BYID = Object.fromEntries(QB.map(q => [q.id, q]));
  const BUDGET_S = Math.round((E.minutes * 60) / E.questions); // 120 s por questão
  const PASS_PCT = (E.passing - 100) / 900 * 100;              // 68,9%
  const DAY = 864e5;
  const BOX_DAYS = [0, 1, 3, 7, 16, 35];
  const LETTERS = "ABCDEF";
  const $app = document.getElementById("app");

  /* ---------- armazenamento ---------- */
  const KEY = "dva-treino-v1";
  const blank = () => ({ q: {}, sims: [], days: {}, conf: {}, packs: [] });
  let S = blank();
  try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (_) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (_) {} };
  // Questões importadas (pacotes gerados com IA) entram no banco como as demais
  const CORE = QB.length;
  const mergePacks = () => { for (const q of S.packs) if (!BYID[q.id]) { QB.push(q); BYID[q.id] = q; } };
  mergePacks();
  const today = () => new Date().toISOString().slice(0, 10);

  function record(id, ok, conf) {
    if (id.startsWith("g-")) { const d = today(); S.days[d] = (S.days[d] || 0) + 1; save(); return; } // variações geradas não entram na revisão espaçada
    const r = S.q[id] || { box: 0, due: 0, seen: 0, right: 0, wrong: 0 };
    r.seen++; ok ? r.right++ : r.wrong++;
    r.box = ok ? Math.min(r.box + 1, BOX_DAYS.length - 1) : 0;
    if (conf === "baixa") r.box = 0;
    if (conf === "media") r.box = Math.min(r.box, 1);
    r.due = r.box === 0 ? Date.now() + 10 * 60e3 : Date.now() + BOX_DAYS[r.box] * DAY;
    r.last = Date.now();
    S.q[id] = r;
    const d = today(); S.days[d] = (S.days[d] || 0) + 1;
    save();
  }

  /* ---------- utilidades ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmt = s => { s = Math.max(0, Math.round(s)); const m = Math.floor(s / 60); return `${m}:${String(s % 60).padStart(2, "0")}`; };
  const pct = (c, n) => n ? Math.round(c / n * 100) : 0;
  const scaled = p => Math.round(100 + p / 100 * 900);
  const dname = d => `D${d} · ${E.domains[d].name}`;
  const due = () => QB.filter(q => S.q[q.id] && S.q[q.id].due <= Date.now());
  const sameSet = (a, b) => a.length === b.length && a.every(x => b.includes(x));

  function domainStats() {
    const out = {};
    for (const d of Object.keys(E.domains)) out[d] = { total: 0, seen: 0, right: 0, att: 0 };
    for (const q of QB) {
      const o = out[q.d]; o.total++;
      const r = S.q[q.id]; if (r) { o.seen++; o.right += r.right; o.att += r.right + r.wrong; }
    }
    return out;
  }
  function readiness() {
    const ds = domainStats(); let w = 0, acc = 0;
    for (const d in ds) if (ds[d].att) { acc += pct(ds[d].right, ds[d].att) * E.domains[d].weight; w += E.domains[d].weight; }
    return w ? acc / w : null;
  }
  function streak() {
    let n = 0; const d = new Date();
    if (!S.days[today()]) d.setDate(d.getDate() - 1);
    while (S.days[d.toISOString().slice(0, 10)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  /* Seleção proporcional ao peso dos domínios */
  function pickWeighted(pool, n) {
    const by = {}; for (const q of shuffle(pool)) (by[q.d] = by[q.d] || []).push(q);
    const out = [];
    const ds = Object.keys(E.domains);
    const quota = {}; let given = 0;
    for (const d of ds) { quota[d] = Math.floor(n * E.domains[d].weight / 100); given += quota[d]; }
    for (const d of ds.slice().sort((a, b) => E.domains[b].weight - E.domains[a].weight)) { if (given >= n) break; quota[d]++; given++; }
    for (const d of ds) out.push(...(by[d] || []).splice(0, quota[d]));
    const rest = shuffle(ds.flatMap(d => by[d] || []));
    while (out.length < n && rest.length) out.push(rest.pop());
    return shuffle(out);
  }
  function pickPractice(n, domain, filter) {
    let pool = domain ? QB.filter(q => q.d === +domain) : QB;
    if (filter) pool = pool.filter(filter);
    const dueQ = shuffle(pool.filter(q => S.q[q.id] && S.q[q.id].due <= Date.now()));
    const unseen = pool.filter(q => !S.q[q.id]);
    const seen = pool.filter(q => S.q[q.id] && S.q[q.id].due > Date.now()).sort((a, b) => S.q[a.id].box - S.q[b.id].box);
    let out = dueQ.slice(0, n);
    if (out.length < n) out.push(...(domain ? shuffle(unseen) : pickWeighted(unseen, Math.min(n - out.length, unseen.length))).slice(0, n - out.length));
    if (out.length < n) out.push(...seen.slice(0, n - out.length));
    return shuffle(out);
  }

  /* Apresentação: embaralha as opções e mapeia os índices */
  function present(q) {
    const order = shuffle(q.o.map((_, i) => i));
    return { q, order, picks: [], t0: 0, secs: 0 };
  }
  const need = q => q.a.length;

  function optionsHTML(p, mode, opts = {}) {
    const { q, order } = p;
    return order.map((orig, pos) => {
      let cls = "opt" + (need(q) > 1 ? " multi-opt" : "");
      const picked = p.picks.includes(orig);
      if (mode === "answer") { if (picked) cls += " sel"; }
      if (mode === "review") {
        if (q.a.includes(orig)) cls += " right"; else if (picked) cls += " wrong";
      }
      if (opts.struck && opts.struck.includes(orig)) cls += " struck";
      if (mode === "strike" && opts.struck && opts.struck.includes(orig)) cls += " sel";
      const dis = mode === "review" ? " disabled" : "";
      const why = mode === "review"
        ? `<div class="why"><b>${q.a.includes(orig) ? "✔ Correta" : "✘ Incorreta"}:</b> ${esc(q.w[orig])}</div>` : "";
      return `<button class="${cls}" data-o="${orig}"${dis}><span class="l">${LETTERS[pos]}</span><span class="t">${esc(q.o[orig])}</span></button>${why}`;
    }).join("");
  }

  function qHeader(q, label) {
    return `<div class="qhead"><span>${label}</span><span class="tag">${esc(dname(q.d))}</span></div>
      <div class="qhead"><span>Task ${q.t} · ${esc(E.tasks[q.t] || "")}</span><span>${esc(q.lvl)}</span></div>
      ${need(q) > 1 ? `<span class="multi">Selecione ${need(q) === 2 ? "DUAS" : "TRÊS"}</span>` : ""}
      <p class="qtext">${esc(q.q)}</p>`;
  }

  function learnHTML(q) {
    const evid = q.ev
      ? `<div class="evid"><div class="small"><b>📘 O que diz a documentação oficial${q.src === "ia" ? " (citação informada pela IA: confira no link)" : ""}:</b></div>
          <blockquote lang="en">${esc(q.ev)}</blockquote><a class="small" href="${esc(q.evu || q.ref)}" target="_blank" rel="noopener">Abrir a página ↗</a></div>`
      : q.cmp ? `<div class="evid small">📘 Baseado na comparação <a href="#/comparar/${esc(q.cmp)}">${esc(q.concept)}</a>.</div>` : "";
    return `${evid}<div class="tip"><b>Dica para a prova:</b> ${esc(q.tip)}</div>
      <dl class="kv">
        <dt>Conceito testado</dt><dd>${esc(q.concept)}</dd>
        <dt>Pegadinha</dt><dd>${esc(q.trap)}</dd>
        <dt>Documentação oficial</dt><dd><a href="${esc(q.ref)}" target="_blank" rel="noopener">${esc(q.ref.replace("https://", ""))}</a></dd>
      </dl>
      ${q.src === "ia" ? `<p class="small muted">🤖 Questão importada (gerada por IA, NÃO verificada). Achou um erro? <button class="btn ghost small" data-del="${esc(q.id)}">Excluir do banco</button></p>` : ""}
      ${q.gen ? `<p class="small muted">🎲 Variação gerada: os números e as opções mudam a cada vez.</p>` : ""}`;
  }

  function bindPick(p, onChange) {
    $app.querySelectorAll(".opt[data-o]").forEach(b => b.onclick = () => {
      const o = +b.dataset.o, n = need(p.q);
      if (n === 1) p.picks = [o];
      else if (p.picks.includes(o)) p.picks = p.picks.filter(x => x !== o);
      else if (p.picks.length < n) p.picks.push(o);
      else { p.picks.shift(); p.picks.push(o); }
      onChange();
    });
  }

  /* ---------- telas ---------- */
  const routes = {};
  let cleanup = null;
  function go(hash) { location.hash = hash; }
  function render() {
    if (cleanup) { cleanup(); cleanup = null; }
    const h = location.hash.replace(/^#\/?/, "");
    const [name, arg] = h.split("/");
    const fn = routes[name || "home"] || routes.home;
    document.querySelectorAll(".tabbar a").forEach(a => a.classList.toggle("on",
      a.dataset.tab === ({ "": "home", home: "home", praticar: "praticar", treino: "praticar", revisao: "praticar", destrinchar: "praticar", gerar: "praticar", simulado: "simulado", comparar: "comparar" }[name || ""])));
    fn(arg);
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", render);
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-del]"); if (!b) return;
    const id = b.dataset.del;
    S.packs = S.packs.filter(q => q.id !== id); delete S.q[id]; save();
    const k = QB.findIndex(q => q.id === id); if (k >= 0) QB.splice(k, 1); delete BYID[id];
    b.replaceWith(Object.assign(document.createElement("b"), { textContent: "Excluída ✔" }));
  });
  // Link para a própria rota (ex.: "Outro treino") não dispara hashchange: renderiza de novo.
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (a && a.getAttribute("href") === (location.hash || "#/")) { e.preventDefault(); render(); }
  });

  /* Início */
  routes.home = () => {
    const ds = domainStats(), r = readiness(), dq = due().length;
    const seen = Object.keys(S.q).length, todayN = S.days[today()] || 0;
    const last = S.sims.slice(-3).reverse();
    $app.innerHTML = `
      <h1>Bora treinar 💪</h1>
      <div class="grid2">
        <div class="stat"><b>${r === null ? "—" : scaled(r)}</b><span>Prontidão estimada (meta ${E.passing})</span></div>
        <div class="stat"><b>${todayN}</b><span>Questões hoje · 🔥 ${streak()} dia(s)</span></div>
        <div class="stat"><b>${seen}/${QB.length}</b><span>Questões vistas</span></div>
        <div class="stat"><b>${dq}</b><span>Revisões pendentes</span></div>
      </div>
      <a class="btn" href="#/treino">▶ Treino rápido (10 questões)</a>
      ${dq ? `<a class="btn ghost" href="#/revisao">↻ Revisar ${dq} pendente(s)</a>` : ""}
      <h2>Desempenho por domínio</h2>
      <div class="card">
        ${Object.keys(E.domains).map(d => {
          const o = ds[d], acc = o.att ? pct(o.right, o.att) : null;
          return `<div class="dom"><div class="top"><span>${esc(dname(d))} <span class="muted small">(${E.domains[d].weight}%)</span></span>
            <b>${acc === null ? "—" : acc + "%"}</b></div>
            <div class="bar"><i style="width:${acc || 0}%;${acc !== null && acc < PASS_PCT ? "background:var(--bad)" : ""}"></i></div>
            <div class="small muted">${o.seen}/${o.total} vistas</div></div>`;
        }).join("")}
        <p class="small muted">Linha de corte aproximada: ${Math.round(PASS_PCT)}% de acerto (${E.passing}/1000).</p>
      </div>
      ${last.length ? `<h2>Últimos simulados</h2><div class="card">${last.map(s => `
        <div class="dom"><div class="top"><span>${new Date(s.date).toLocaleDateString("pt-BR")} · ${s.n} questões</span>
        <b>${s.scaled} <span class="pill ${s.pass ? "ok" : "bad"}">${s.pass ? "PASS" : "FAIL"}</span></b></div></div>`).join("")}</div>` : ""}
      <p class="foot">${E.name} (${E.code}) · ${E.questions} questões · ${E.minutes} min · nota mínima ${E.passing}</p>`;
  };

  /* Praticar (hub) */
  routes.praticar = () => {
    const dq = due().length;
    const wrong = QB.filter(q => S.q[q.id] && S.q[q.id].wrong > 0).length;
    $app.innerHTML = `
      <h1>Praticar</h1>
      <div class="menu">
        <a href="#/treino"><span class="ic">⚡</span><span><b>Treino rápido</b><small>10 questões com explicação na hora</small></span></a>
        <a href="#/revisao"><span class="ic">↻</span><span><b>Revisão espaçada</b><small>As que você errou voltam no momento certo</small></span>${dq ? `<span class="badge">${dq}</span>` : ""}</a>
        <a href="#/destrinchar"><span class="ic">🔬</span><span><b>Destrinchar questão</b><small>Método em 4 passos: palavras-chave → eliminar → escolher → refletir</small></span></a>
        <a href="#/treino/gerado"><span class="ic">🎲</span><span><b>Variações geradas</b><small>Cálculos e flashes com números e cenários novos a cada vez</small></span></a>
        <a href="#/gerar"><span class="ic">🤖</span><span><b>Mais questões com IA</b><small>Gere pacotes novos de graça no app do Claude e importe aqui</small></span>${S.packs.length ? `<span class="badge">${S.packs.length}</span>` : ""}</a>
        <a href="#/treino/erradas"><span class="ic">✘</span><span><b>Só as que errei</b><small>${wrong} questão(ões)</small></span></a>
      </div>
      <h2>Treinar por domínio</h2>
      <div class="menu">${Object.keys(E.domains).map(d =>
        `<a href="#/treino/d${d}"><span class="ic">${d}</span><span><b>${esc(E.domains[d].name)}</b><small>${E.domains[d].weight}% da prova · ${QB.filter(q => q.d === +d).length} questões</small></span></a>`).join("")}
      </div>`;
  };

  /* Sessão de prática (treino / revisão) */
  function practice(list, title) {
    if (!list.length) {
      $app.innerHTML = `<h1>${esc(title)}</h1><div class="card center"><p>Nada por aqui agora 🎉</p>
        <a class="btn" href="#/treino">Fazer um treino rápido</a></div>`;
      return;
    }
    const ps = list.map(present); let i = 0; const res = [];
    let tick = null;
    cleanup = () => clearInterval(tick);
    const show = () => {
      const p = ps[i]; p.t0 = Date.now();
      const draw = () => {
        $app.innerHTML = `<div class="simbar"><b>${esc(title)}</b><span class="muted small">${i + 1} de ${ps.length} · <span id="clk">0:00</span></span></div>
          <div class="bar"><i style="width:${pct(i, ps.length)}%"></i></div>
          ${qHeader(p.q, `Questão ${i + 1}`)}
          <div id="opts">${optionsHTML(p, "answer")}</div>
          <div class="sticky-actions"><button class="btn" id="ok" ${p.picks.length === need(p.q) ? "" : "disabled"}>Confirmar</button></div>`;
        bindPick(p, draw);
        document.getElementById("ok").onclick = answer;
        upd();
      };
      const upd = () => { const c = document.getElementById("clk"); if (c) c.textContent = fmt((Date.now() - p.t0) / 1000); };
      clearInterval(tick); tick = setInterval(upd, 1000);
      draw();
    };
    const answer = () => {
      clearInterval(tick);
      const p = ps[i]; p.secs = (Date.now() - p.t0) / 1000;
      const ok = sameSet(p.picks, p.q.a);
      const partial = !ok && need(p.q) > 1 && p.picks.some(x => p.q.a.includes(x));
      record(p.q.id, ok); res.push({ p, ok });
      const within = p.secs <= BUDGET_S;
      $app.innerHTML = `<div class="simbar"><b>${esc(title)}</b><span class="muted small">${i + 1} de ${ps.length}</span></div>
        ${qHeader(p.q, `Questão ${i + 1}`)}
        <div class="verdict ${ok ? "ok" : partial ? "warn" : "bad"}">${ok ? "✅ Correto!" : partial ? "⚠️ Parcialmente correto: conta como erro" : "❌ Incorreto"}
          <small>⏱ ${fmt(p.secs)} · ${within ? "dentro" : "acima"} da meta de ${fmt(BUDGET_S)} por questão</small></div>
        ${optionsHTML(p, "review")}
        ${learnHTML(p.q)}
        <div class="sticky-actions"><button class="btn" id="nx">${i + 1 < ps.length ? "Próxima →" : "Ver resultado"}</button></div>`;
      document.getElementById("nx").onclick = () => { i++; i < ps.length ? show() : summary(); };
    };
    const summary = () => {
      const c = res.filter(r => r.ok).length;
      const tot = res.reduce((s, r) => s + r.p.secs, 0);
      $app.innerHTML = `<h1>Resultado</h1>
        <div class="card score"><div class="big">${c}/${res.length}</div><div class="muted">${pct(c, res.length)}% de acerto · ${fmt(tot)} no total</div></div>
        <div class="card tbl-wrap"><table><tr><th>#</th><th>Resultado</th><th>Tempo</th><th>Domínio</th></tr>
        ${res.map((r, k) => `<tr><td>${k + 1}</td><td>${r.ok ? "✅" : "❌"}</td><td>${fmt(r.p.secs)}</td><td>D${r.p.q.d}</td></tr>`).join("")}</table></div>
        ${res.some(r => !r.ok) ? `<p class="small muted">As que você errou entram na revisão espaçada daqui a ~10 min.</p>` : ""}
        <a class="btn" href="#/treino">Outro treino</a><a class="btn ghost" href="#/">Início</a>`;
    };
    show();
  }
  routes.treino = arg => {
    if (arg === "erradas") return practice(shuffle(QB.filter(q => S.q[q.id] && S.q[q.id].wrong > 0)).slice(0, 10), "Só as que errei");
    if (arg === "gerado") return practice(GEN.many(10), "Variações geradas");
    if (arg === "ia") return practice(pickPractice(10, null, q => q.src === "ia"), "Questões importadas");
    const d = arg && arg[0] === "d" ? arg.slice(1) : null;
    if (d) return practice(pickPractice(10, d), `Domínio ${d}`);
    practice(shuffle([...pickPractice(8), ...GEN.many(2)]), "Treino rápido");
  };
  routes.revisao = () => practice(shuffle(due()).slice(0, 15), "Revisão espaçada");

  /* Simulado */
  let SIM = null; // simulado em andamento (sobrevive à troca de aba)
  routes.simulado = () => {
    if (SIM && !SIM.done) return simRun();
    const sizes = [10, 20, 30, E.scored].filter(n => n <= QB.length);
    if (!sizes.includes(QB.length) && QB.length < E.scored) sizes.push(QB.length);
    let n = sizes[0];
    const draw = () => {
      $app.innerHTML = `<h1>Simulado</h1>
        <p class="muted">Como na prova real: tempo corrido, sem feedback até o fim, com marcação para revisar. Meta de ${fmt(BUDGET_S)} por questão (${E.minutes} min ÷ ${E.questions}).</p>
        <div class="card"><h3>Quantas questões?</h3>
          <div class="chips">${sizes.map(s => `<button class="chip ${s === n ? "on" : ""}" data-n="${s}">${s}${s === E.scored ? " (nº pontuado)" : ""}${s === QB.length && s < E.scored ? " (banco todo)" : ""}</button>`).join("")}</div>
          <table>
            <tr><td>Exame</td><td class="num">${E.code}</td></tr>
            <tr><td>Tempo</td><td class="num">${n} × ${fmt(BUDGET_S)} = ${Math.round(n * BUDGET_S / 60)} min</td></tr>
            <tr><td>Distribuição</td><td class="num">Proporcional aos domínios</td></tr>
          </table>
          <button class="btn" id="go">Começar</button></div>
        <p class="small muted">A nota segue a escala de 100–1000 usada pelo Kiro Study Buddy (100 + % × 9). É uma aproximação: a prova real usa scaled scoring.</p>
        ${S.sims.length ? `<h2>Histórico</h2><div class="card tbl-wrap"><table><tr><th>Data</th><th class="num">Questões</th><th class="num">Nota</th><th></th></tr>
          ${S.sims.slice().reverse().map(s => `<tr><td>${new Date(s.date).toLocaleDateString("pt-BR")}</td><td class="num">${s.n}</td><td class="num">${s.scaled}</td><td><span class="pill ${s.pass ? "ok" : "bad"}">${s.pass ? "PASS" : "FAIL"}</span></td></tr>`).join("")}</table></div>` : ""}`;
      $app.querySelectorAll("[data-n]").forEach(b => b.onclick = () => { n = +b.dataset.n; draw(); });
      document.getElementById("go").onclick = () => {
        const ps = pickWeighted(QB, n).map(present);
        SIM = { ps, i: 0, flags: [], start: Date.now(), limit: n * BUDGET_S * 1000, done: false, lastT: Date.now() };
        simRun();
      };
    };
    draw();
  };
  function simRun() {
    let tick;
    cleanup = () => { clearInterval(tick); acc(); };
    const acc = () => { const p = SIM.ps[SIM.i]; const now = Date.now(); p.secs += (now - SIM.lastT) / 1000; SIM.lastT = now; };
    const left = () => SIM.limit - (Date.now() - SIM.start);
    const clock = () => {
      const l = left();
      if (l <= 0) return finish();
      const c = document.getElementById("clk"); if (!c) return;
      c.textContent = fmt(l / 1000); c.classList.toggle("low", l < 5 * 60e3);
    };
    const goto = k => { acc(); SIM.i = k; draw(); };
    const draw = () => {
      SIM.lastT = Date.now();
      const p = SIM.ps[SIM.i], k = SIM.i, n = SIM.ps.length;
      const answered = SIM.ps.filter(x => x.picks.length).length;
      $app.innerHTML = `<div class="simbar"><span class="muted small">${k + 1}/${n} · ${answered} respondidas</span><span class="clock" id="clk"></span></div>
        <div class="bar"><i style="width:${pct(answered, n)}%"></i></div>
        ${qHeader(p.q, `Questão ${k + 1}`)}
        ${optionsHTML(p, "answer")}
        <div class="row"><button class="btn ghost small" id="fl">${SIM.flags.includes(k) ? "⚑ Desmarcar" : "⚐ Marcar p/ revisar"}</button></div>
        <details><summary>Ir para questão</summary><div><div class="navgrid">${SIM.ps.map((x, j) =>
          `<button data-j="${j}" class="${x.picks.length ? "ans" : ""} ${j === k ? "cur" : ""} ${SIM.flags.includes(j) ? "flag" : ""}">${j + 1}</button>`).join("")}</div></div></details>
        <div class="sticky-actions"><div class="row">
          <button class="btn ghost" id="pv" ${k ? "" : "disabled"}>← Anterior</button>
          ${k + 1 < n ? `<button class="btn" id="nx">Próxima →</button>` : `<button class="btn" id="end">Finalizar</button>`}
        </div><button class="btn ghost small" id="end2">Finalizar agora</button></div>`;
      bindPick(p, () => { const y = window.scrollY; acc(); draw(); window.scrollTo(0, y); });
      document.getElementById("fl").onclick = () => { SIM.flags = SIM.flags.includes(k) ? SIM.flags.filter(x => x !== k) : [...SIM.flags, k]; acc(); draw(); };
      $app.querySelectorAll("[data-j]").forEach(b => b.onclick = () => goto(+b.dataset.j));
      const pv = document.getElementById("pv"); if (pv) pv.onclick = () => goto(k - 1);
      const nx = document.getElementById("nx"); if (nx) nx.onclick = () => goto(k + 1);
      const end = () => confirmEnd();
      ["end", "end2"].forEach(id => { const b = document.getElementById(id); if (b) b.onclick = end; });
      clock();
    };
    const confirmEnd = () => {
      acc();
      const blank = SIM.ps.filter(x => x.picks.length < need(x.q)).length;
      $app.innerHTML = `<h1>Finalizar simulado?</h1><div class="card">
        <p>${blank ? `<b>${blank}</b> questão(ões) sem resposta completa: contam como erro.` : "Todas as questões foram respondidas."}</p>
        ${SIM.flags.length ? `<p>Você marcou ${SIM.flags.length} para revisar: ${SIM.flags.map(x => x + 1).join(", ")}.</p>` : ""}
        <button class="btn" id="y">Sim, ver resultado</button><button class="btn ghost" id="n">Voltar à prova</button></div>`;
      document.getElementById("y").onclick = finish;
      document.getElementById("n").onclick = () => draw();
    };
    const finish = () => {
      if (SIM.done) return;
      clearInterval(tick); SIM.done = true; cleanup = null;
      const ps = SIM.ps, n = ps.length;
      const ok = ps.map(p => sameSet(p.picks, p.q.a));
      ps.forEach((p, j) => record(p.q.id, ok[j]));
      const c = ok.filter(Boolean).length, rp = pct(c, n), sc = scaled(c / n * 100);
      const pass = sc >= E.passing;
      const doms = {}; for (const d in E.domains) doms[d] = { c: 0, a: 0 };
      ps.forEach((p, j) => { doms[p.q.d].a++; if (ok[j]) doms[p.q.d].c++; });
      const used = (Date.now() - SIM.start) / 1000;
      S.sims.push({ date: Date.now(), n, correct: c, scaled: sc, pass, doms, secs: Math.round(used) }); save();
      const weak = Object.keys(doms).filter(d => !doms[d].a || pct(doms[d].c, doms[d].a) < PASS_PCT);
      $app.innerHTML = `<h1>Exam transcript</h1>
        <div class="card score"><div class="muted small">${E.name} · ${E.code}</div>
          <div class="big">${sc}<span class="muted" style="font-size:20px"> / 1000</span></div>
          <span class="res ${pass ? "pass" : "fail"}">${pass ? "PASS ✅" : "FAIL ❌"}</span>
          <p>${pass ? "🎉 Parabéns! Você demonstrou conhecimento suficiente neste simulado. Mantenha o ritmo!" : "💪 Ainda não foi desta vez. Veja abaixo os domínios a reforçar: cada simulado te deixa mais perto!"}</p>
          <p class="muted small">${c}/${n} (${rp}%) · tempo usado ${fmt(used)} de ${fmt(SIM.limit / 1000)}</p></div>
        <h2>Desempenho por domínio</h2>
        <div class="card tbl-wrap"><table><tr><th>Domínio</th><th class="num">Peso</th><th class="num">Acertos</th><th></th></tr>
          ${Object.keys(doms).map(d => { const o = doms[d], meets = o.a && pct(o.c, o.a) >= PASS_PCT;
            return `<tr><td>${esc(E.domains[d].name)}</td><td class="num">${E.domains[d].weight}%</td><td class="num">${o.c}/${o.a}</td>
              <td><span class="pill ${meets ? "ok" : "bad"}">${meets ? "Atende" : "Reforçar"}</span></td></tr>`; }).join("")}
        </table></div>
        <p><b>Foco:</b> ${weak.length ? weak.map(d => esc(E.domains[d].name)).join(", ") : "nenhum, continue assim!"}</p>
        <h2>Revisar questões</h2>
        <div class="navgrid">${ps.map((p, j) => `<button data-r="${j}" class="${ok[j] ? "r" : "w"}">${j + 1}</button>`).join("")}</div>
        <div id="rev"></div>
        <a class="btn" href="#/simulado" id="again">Novo simulado</a>`;
      document.getElementById("again").onclick = () => { SIM = null; };
      $app.querySelectorAll("[data-r]").forEach(b => b.onclick = () => {
        const p = ps[+b.dataset.r];
        document.getElementById("rev").innerHTML = `<div class="card">${qHeader(p.q, `Questão ${+b.dataset.r + 1} · ⏱ ${fmt(p.secs)}`)}${optionsHTML(p, "review")}${learnHTML(p.q)}</div>`;
        document.getElementById("rev").scrollIntoView({ behavior: "smooth" });
      });
      window.scrollTo(0, 0);
    };
    tick = setInterval(clock, 1000);
    draw();
  }

  /* Destrinchar (método de 4 passos do Kiro Study Buddy, adaptado para toque) */
  let BD = { n: 0, ok: 0 };
  routes.destrinchar = arg => {
    let q = arg && BYID[arg];
    if (!q) {
      const unseen = QB.filter(x => !(S.conf[x.id]));
      q = shuffle(unseen.length ? unseen : QB)[0];
    }
    const p = present(q);
    let step = 1, picksTok = new Set(), struck = [];
    const tokens = []; // {text, start, end, word}
    q.q.split(/(\s+)/).reduce((pos, t) => { tokens.push({ t, s: pos, e: pos + t.length, w: /\S/.test(t) }); return pos + t.length; }, 0);
    const ranges = q.kw.map(k => { const s = q.q.indexOf(k); return [s, s + k.length]; }).filter(r => r[0] >= 0);
    const isKey = tk => ranges.some(([s, e]) => tk.s < e && tk.e > s);
    const stepsBar = () => `<div class="steps">${[1, 2, 3, 4].map(s => `<i class="${s <= step ? "on" : ""}"></i>`).join("")}</div>`;
    const head = t => `<div class="simbar"><b>🔬 Destrinchar · Passo ${step}/4</b><span class="muted small">${esc(t)}</span></div>${stepsBar()}`;

    const s1 = (compare) => {
      $app.innerHTML = `${head("Palavras-chave")}
        <div class="qhead"><span class="tag">${esc(dname(q.d))}</span><span>${esc(q.lvl)}</span></div>
        <p class="muted small">${compare ? "Compare sua marcação com a análise:" : "Toque nas palavras que definem a resposta: serviços, objetivo (\"MENOR custo\", \"MAIS seguro\") e restrições."}</p>
        <div class="tokens">${tokens.map((tk, k) => tk.w
          ? `<span class="tok ${picksTok.has(k) ? "pick" : ""} ${compare && isKey(tk) ? "key" : ""}" data-k="${k}">${esc(tk.t)}</span>` : esc(tk.t)).join("")}</div>
        ${compare ? (() => {
          const hit = ranges.filter(([s, e]) => [...picksTok].some(k => tokens[k].s < e && tokens[k].e > s)).length;
          const extra = [...picksTok].filter(k => !isKey(tokens[k])).length;
          if (!ranges.length) return `<dl class="kv"><dt>🎯 Objetivo</dt><dd>${esc(q.obj || "—")}</dd><dt>🔒 Restrições</dt><dd><ul class="clean">${q.cons.map(c => `<li>${esc(c)}</li>`).join("")}</ul></dd></dl>
            <div class="sticky-actions"><button class="btn" id="nx">Passo 2: eliminar →</button></div>`;
          return `<div class="legend"><span><i style="background:var(--accent)"></i>Você marcou</span><span><i style="background:var(--key);box-shadow:inset 0 -3px 0 var(--ok)"></i>Trecho-chave</span></div>
          <div class="verdict ${hit === ranges.length ? "ok" : hit ? "warn" : "bad"}">Você pegou ${hit} de ${ranges.length} trechos-chave${extra ? ` <small>${extra} palavra(s) marcadas fora dos trechos-chave: nem sempre é erro, mas foque no que muda a resposta.</small>` : ""}</div>
          <dl class="kv"><dt>🎯 Objetivo</dt><dd>${esc(q.obj)}</dd><dt>🔒 Restrições</dt><dd><ul class="clean">${q.cons.map(c => `<li>${esc(c)}</li>`).join("")}</ul></dd></dl>
          <div class="sticky-actions"><button class="btn" id="nx">Passo 2: eliminar →</button></div>`;
        })() : `<div class="sticky-actions"><button class="btn" id="cmp">Comparar com a análise</button></div>`}`;
      if (!compare) {
        $app.querySelectorAll(".tok").forEach(el => el.onclick = () => { const k = +el.dataset.k; picksTok.has(k) ? picksTok.delete(k) : picksTok.add(k); el.classList.toggle("pick"); });
        document.getElementById("cmp").onclick = () => s1(true);
      } else document.getElementById("nx").onclick = () => { step = 2; s2(false); };
    };

    const s2 = (compare) => {
      const keyBlock = `<div class="card small"><b>Objetivo:</b> ${esc(q.obj)}<br><b>Restrições:</b> ${q.cons.map(esc).join(" · ")}</div>`;
      if (!compare) {
        $app.innerHTML = `${head("Eliminação")}${keyBlock}
          <p class="muted small">Toque nas alternativas que você descartaria de cara, com base nas restrições.</p>
          ${optionsHTML(p, "strike", { struck })}
          <div class="sticky-actions"><button class="btn" id="cmp" ${struck.length ? "" : "disabled"}>Comparar eliminação</button></div>`;
        $app.querySelectorAll(".opt[data-o]").forEach(b => b.onclick = () => {
          const o = +b.dataset.o; struck = struck.includes(o) ? struck.filter(x => x !== o) : [...struck, o]; s2(false);
        });
        document.getElementById("cmp").onclick = () => s2(true);
        return;
      }
      const killedRight = struck.filter(o => q.a.includes(o));
      $app.innerHTML = `${head("Eliminação")}
        ${killedRight.length ? `<div class="verdict bad">⚠️ Você eliminou uma alternativa correta. Releia as restrições: ela atende a todas.</div>` : `<div class="verdict ok">Boa! Você não eliminou nenhuma alternativa correta.</div>`}
        ${p.order.map((o, pos) => {
          const you = struck.includes(o), exp = q.el.includes(o);
          return `<div class="card small"><b>${LETTERS[pos]}) ${esc(q.o[o])}</b><br>
            Você: ${you ? "eliminou" : "manteve"} · Análise: ${exp ? "<b>elimina de cara</b>" : "plausível, exige comparação"}
            ${exp || you ? `<div class="muted">${q.a.includes(o) ? "" : esc(q.w[o])}</div>` : ""}</div>`;
        }).join("")}
        <div class="sticky-actions"><button class="btn" id="nx">Passo 3: escolher →</button></div>`;
      document.getElementById("nx").onclick = () => { step = 3; struck = struck.filter(o => !q.a.includes(o)); s3(false); };
    };

    const s3 = (done) => {
      if (!done) {
        $app.innerHTML = `${head("Escolha final")}
          ${need(q) > 1 ? `<span class="multi">Selecione ${need(q) === 2 ? "DUAS" : "TRÊS"}</span>` : ""}
          <p class="qtext">${esc(q.q)}</p>
          <p class="muted small">Entre as que sobraram, qual atende a TODAS as restrições?</p>
          ${optionsHTML(p, "answer", { struck })}
          <div class="sticky-actions"><button class="btn" id="ok" ${p.picks.length === need(q) ? "" : "disabled"}>Confirmar</button></div>`;
        bindPick(p, () => s3(false));
        document.getElementById("ok").onclick = () => s3(true);
        return;
      }
      const ok = sameSet(p.picks, q.a); p.ok = ok;
      $app.innerHTML = `${head("Escolha final")}
        <div class="verdict ${ok ? "ok" : "bad"}">${ok ? "✅ Correto!" : "❌ Não foi dessa vez"}</div>
        ${optionsHTML(p, "review")}
        <div class="sticky-actions"><button class="btn" id="nx">Passo 4: refletir →</button></div>`;
      document.getElementById("nx").onclick = () => { step = 4; s4(); };
    };

    const s4 = () => {
      $app.innerHTML = `${head("Reflexão")}
        <div class="card"><h3>📖 Resumo da reflexão</h3>
          <dl class="kv"><dt>Conceito AWS testado</dt><dd>${esc(q.concept)}</dd>
          <dt>Domínio e task</dt><dd>${esc(dname(q.d))} · Task ${q.t}: ${esc(E.tasks[q.t])}</dd>
          <dt>Padrão de pegadinha</dt><dd>${esc(q.trap)}</dd>
          <dt>Para levar para a prova</dt><dd>${esc(q.tip)}</dd>
          <dt>Documentação</dt><dd><a href="${esc(q.ref)}" target="_blank" rel="noopener">${esc(q.ref.replace("https://", ""))}</a></dd></dl></div>
        <h3>Quão confiante você está nesse conceito?</h3>
        <div class="row"><button class="btn ghost" data-c="alta">Alta</button><button class="btn ghost" data-c="media">Média</button><button class="btn ghost" data-c="baixa">Baixa</button></div>
        <div id="after"></div>`;
      $app.querySelectorAll("[data-c]").forEach(b => b.onclick = () => {
        const c = b.dataset.c; S.conf[q.id] = c; record(q.id, !!p.ok, c);
        BD.n++; if (p.ok) BD.ok++;
        $app.querySelectorAll("[data-c]").forEach(x => { x.disabled = true; x.classList.toggle("ghost", x !== b); });
        document.getElementById("after").innerHTML = `
          ${c !== "alta" ? `<div class="tip">💡 Tudo bem: reconhecer o ponto fraco já é meio caminho. Revise <b>${esc(q.concept)}</b> na <a href="${esc(q.ref)}" target="_blank" rel="noopener">documentação oficial</a>. Essa questão vai voltar na sua revisão espaçada.</div>` : ""}
          <p class="muted small">Sessão: ${BD.n} questão(ões) destrinchada(s), ${BD.ok} certa(s).</p>
          <a class="btn" href="#/destrinchar/x${Date.now()}">Outra questão</a><a class="btn ghost" href="#/praticar" id="stop">Encerrar</a>`;
        document.getElementById("stop").onclick = () => { BD = { n: 0, ok: 0 }; };
      });
    };
    s1(false);
  };

  /* Comparar */
  routes.comparar = arg => {
    if (arg && CMP.find(c => c.id === arg)) return cmpDetail(CMP.find(c => c.id === arg));
    const draw = (f = "") => {
      const list = CMP.filter(c => !f || (c.title + c.svc.map(s => s.join(" ")).join(" ")).toLowerCase().includes(f.toLowerCase()));
      document.getElementById("cl").innerHTML = list.map(c => `<a href="#/comparar/${c.id}"><span class="ic">⇄</span><span><b>${esc(c.title)}</b><small>${c.d.map(d => "D" + d).join(" · ")}</small></span></a>`).join("") || `<p class="muted">Nada encontrado.</p>`;
    };
    $app.innerHTML = `<h1>Comparar serviços</h1>
      <p class="muted small">Pares que mais confundem no DVA-C02: tabela, palavras-chave da prova, analogia e regra de decisão.</p>
      <input type="search" id="f" placeholder="Buscar (ex.: SQS, Cognito, KMS)">
      <div class="menu" id="cl"></div>`;
    document.getElementById("f").oninput = e => draw(e.target.value);
    draw();
  };
  function cmpDetail(c) {
    const cols = c.svc.map(s => s[0]);
    $app.innerHTML = `<a href="#/comparar" class="small">← Comparações</a><h1>${esc(c.title)}</h1>
      <div class="card">${c.svc.map(s => `<p class="cmp-svc"><b>${esc(s[0])}:</b> ${esc(s[1])}</p>`).join("")}</div>
      <h2>Diferenças</h2>
      <div class="card tbl-wrap"><table><tr><th></th>${cols.map(x => `<th>${esc(x)}</th>`).join("")}</tr>
        ${c.rows.map(r => `<tr><td><b>${esc(r[0])}</b></td>${r.slice(1).map(v => `<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</table></div>
      <h2>Ângulo da prova</h2>
      <div class="card"><p class="small muted">Domínios: ${c.d.map(d => esc(dname(d))).join(", ")}</p>
        <table><tr><th>Se a questão fala em…</th><th>Escolha</th></tr>${c.kw.map(k => `<tr><td>${esc(k[0])}</td><td><b>${esc(k[1])}</b></td></tr>`).join("")}</table>
        <div class="tip"><b>Pegadinha:</b> ${esc(c.traps)}</div></div>
      <h2>Analogia</h2><div class="card">${esc(c.analogy)}</div>
      <h2>Decisão rápida</h2><div class="card"><ul class="clean">${c.decide.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        <p class="small"><a href="${esc(c.ref)}" target="_blank" rel="noopener">Documentação oficial ↗</a></p></div>`;
  }

  /* Mais questões com IA: monta o prompt (regras do Kiro Study Buddy) e importa o JSON de volta */
  function weakestDomain() {
    const ds = domainStats();
    return Object.keys(E.domains).map(d => ({ d, acc: ds[d].att ? ds[d].right / ds[d].att : -1, w: E.domains[d].weight }))
      .sort((a, b) => a.acc - b.acc || b.w - a.w)[0].d;
  }
  function buildPrompt(d, n) {
    const skills = shuffle(E.skills[d]).slice(0, 6);
    const known = [...new Set(QB.filter(q => q.d === +d).map(q => q.concept))];
    const tasks = Object.entries(E.tasks).filter(([k]) => k[0] === String(d)).map(([k, v]) => `${k} ${v}`).join("; ");
    const two = Math.max(1, Math.round(n * .2));
    return `Você é um instrutor especialista em certificações AWS. Gere ${n} questões ORIGINAIS de prática para o exame ${E.name} (${E.code}), em português do Brasil (nomes de serviços e termos técnicos em inglês).

DOMÍNIO: ${d} — ${E.domains[d].en} (${E.domains[d].weight}% da prova). Tasks: ${tasks}.
FOQUE NESTAS SKILLS DO EXAM GUIDE (distribua entre elas):
${skills.map(s => "- " + s).join("\n")}

NÃO repita estes conceitos, que já estão no meu banco: ${known.join("; ")}.

REGRAS (iguais às do Kiro Study Buddy):
1. Somente questões de cenário realista de cliente; nada de definição ou decoreba.
2. Prova Associate: ${n - two} de escolha única (4 opções, 1 correta) e ${two} de múltipla resposta (5 opções, exatamente 2 corretas, com "(Selecione DUAS.)" no enunciado).
3. Distratores plausíveis: serviços ou abordagens reais que PODERIAM funcionar, mas não são a MELHOR resposta para as restrições.
4. Use palavras-sinal da prova: "MENOR esforço", "MENOR custo", "MAIS seguro", "menor sobrecarga operacional", "sem alterar o código" etc.
5. Misture a dificuldade: Intermediária, Desafiadora e Pegadinha (distratores muito próximos da correta).
6. NÃO invente recursos, limites ou comportamentos. Baseie-se na documentação oficial (docs.aws.amazon.com) e confira na web se puder. Na dúvida, escolha outro tema.
7. Sem leitura ou escrita de código. Somente serviços no escopo do ${E.code}.
8. Não reproduza questões de provas reais ou de dumps.

FORMATO: responda APENAS com um array JSON válido dentro de um bloco \`\`\`json, sem texto antes ou depois. Cada item:
{
  "d": ${d},
  "t": "${d}.1",                          // task do exam guide (ex.: "${d}.2")
  "lvl": "Intermediária" | "Desafiadora" | "Pegadinha",
  "q": "enunciado do cenário",
  "o": ["opção 1", "opção 2", "opção 3", "opção 4"],     // 4 opções (ou 5 nas de múltipla resposta)
  "a": [1],                                // índices (base 0) das corretas
  "w": ["por que a opção 1 está errada/certa", "..."],   // um por opção, na mesma ordem
  "kw": ["trecho exato do enunciado", "..."], // 2 a 5 trechos COPIADOS LITERALMENTE do campo q
  "obj": "o que a questão realmente pede",
  "cons": ["restrição 1", "restrição 2"],
  "el": [3],                               // índices das opções elimináveis de cara
  "concept": "conceito AWS testado",
  "trap": "padrão de pegadinha usado",
  "tip": "regra curta para levar para a prova",
  "ref": "https://docs.aws.amazon.com/... (página oficial real)",
  "ev": "frase COPIADA LITERALMENTE (em inglês) da página ref que comprova a resposta correta",
  "evu": "URL exata da página de onde a frase foi copiada"
}

OBRIGATÓRIO: só inclua uma questão se você tiver aberto a página oficial e copiado a frase de "ev" dela. Se não conseguir comprovar com a documentação, descarte a questão. Prefiro menos questões, todas corretas.`;
  }
  function importPack(text) {
    const s = text.indexOf("["), e = text.lastIndexOf("]");
    if (s < 0 || e < s) throw new Error("Não encontrei um array JSON no texto colado.");
    const arr = JSON.parse(text.slice(s, e + 1));
    if (!Array.isArray(arr)) throw new Error("O JSON precisa ser um array de questões.");
    const norm = t => t.toLowerCase().replace(/\s+/g, " ").trim();
    const have = new Set(QB.map(q => norm(q.q)));
    const hash = t => { let h = 0; for (const c of t) h = (h * 31 + c.charCodeAt(0)) | 0; return (h >>> 0).toString(36); };
    let ok = 0; const bad = [];
    arr.forEach((x, k) => {
      const why = (() => {
        if (!x || typeof x.q !== "string" || x.q.length < 40) return "enunciado ausente ou curto";
        if (!Array.isArray(x.o) || x.o.length < 4 || x.o.length > 6 || x.o.some(o => typeof o !== "string")) return "opções inválidas";
        if (!Array.isArray(x.a) || !x.a.length || x.a.length >= x.o.length || x.a.some(i => !Number.isInteger(i) || i < 0 || i >= x.o.length) || new Set(x.a).size !== x.a.length) return "gabarito inválido";
        if (!Array.isArray(x.w) || x.w.length !== x.o.length) return "explicações não batem com as opções";
        if (![1, 2, 3, 4].includes(+x.d)) return "domínio inválido";
        if (have.has(norm(x.q))) return "repetida";
        if (typeof x.ev !== "string" || x.ev.length < 20) return "sem citação da documentação (ev)";
        if (!/^https:\/\/docs\.aws\.amazon\.com\//.test(x.evu || x.ref || "")) return "sem link da documentação oficial";
      })();
      if (why) { bad.push(`#${k + 1}: ${why}`); return; }
      const q = {
        id: "u-" + hash(x.q), d: +x.d, t: E.tasks[x.t] ? x.t : `${x.d}.1`, lvl: x.lvl || "IA", src: "ia",
        q: x.q, o: x.o, a: x.a, w: x.w.map(String),
        kw: (x.kw || []).filter(k => typeof k === "string" && k && x.q.includes(k)),
        obj: x.obj || "", cons: Array.isArray(x.cons) ? x.cons.map(String) : [],
        el: (x.el || []).filter(i => Number.isInteger(i) && i >= 0 && i < x.o.length && !x.a.includes(i)),
        concept: x.concept || "", trap: x.trap || "", tip: x.tip || "",
        ref: /^https:\/\/(docs\.)?aws\.amazon\.com\//.test(x.ref || "") ? x.ref : E.guide,
        ev: x.ev, evu: x.evu || x.ref
      };
      if (x.a.length > 1) q.multi = true;
      have.add(norm(q.q)); S.packs.push(q); ok++;
    });
    save(); mergePacks();
    return { ok, bad };
  }
  routes.gerar = () => {
    let d = weakestDomain(), n = 10;
    const draw = () => {
      $app.innerHTML = `<a href="#/praticar" class="small">← Praticar</a><h1>Mais questões com IA</h1>
        <p class="muted small">Sem custo: copie o prompt, cole no app do Claude (o plano gratuito serve), copie o JSON da resposta e cole aqui. Cada prompt sorteia skills diferentes do exam guide e evita os conceitos que você já tem.</p>
        <div class="card"><h3>1. Escolha o foco</h3>
          <div class="chips">${Object.keys(E.domains).map(k => `<button class="chip ${k === d ? "on" : ""}" data-d="${k}">D${k} · ${esc(E.domains[k].name)}</button>`).join("")}</div>
          <p class="small muted">Pré-selecionado: seu domínio mais fraco.</p>
          <div class="chips">${[5, 10, 15].map(k => `<button class="chip ${k === n ? "on" : ""}" data-n="${k}">${k} questões</button>`).join("")}</div>
          <h3>2. Copie o prompt</h3>
          <textarea id="pr" readonly rows="6" style="width:100%;font:12px/1.4 ui-monospace,monospace;border-radius:10px;border:1px solid var(--line);background:var(--bg);color:var(--ink);padding:10px">${esc(buildPrompt(d, n))}</textarea>
          <button class="btn" id="cp">📋 Copiar prompt</button>
          <a class="btn ghost" href="https://claude.ai/new" target="_blank" rel="noopener">Abrir o Claude ↗</a>
        </div>
        <div class="card"><h3>3. Cole a resposta (JSON)</h3>
          <textarea id="js" rows="6" placeholder="Cole aqui o bloco JSON" style="width:100%;font:12px/1.4 ui-monospace,monospace;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink);padding:10px"></textarea>
          <button class="btn" id="im">Importar</button><div id="out"></div></div>
        <p class="small muted">⚠️ Questões geradas por IA podem ter erros. Confira na documentação em caso de dúvida; dá para excluir uma questão ruim na tela de explicação. Você tem ${S.packs.length} questões importadas.</p>
        ${S.packs.length ? `<button class="btn ghost small" id="clr">Apagar todas as importadas</button>` : ""}`;
      $app.querySelectorAll("[data-d]").forEach(b => b.onclick = () => { d = b.dataset.d; draw(); });
      $app.querySelectorAll("[data-n]").forEach(b => b.onclick = () => { n = +b.dataset.n; draw(); });
      document.getElementById("cp").onclick = e => {
        const t = document.getElementById("pr");
        const done = () => { e.target.textContent = "✅ Copiado!"; };
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t.value).then(done, () => { t.select(); document.execCommand("copy"); done(); });
        else { t.select(); document.execCommand("copy"); done(); }
      };
      document.getElementById("im").onclick = () => {
        const out = document.getElementById("out");
        try {
          const r = importPack(document.getElementById("js").value);
          out.innerHTML = `<div class="verdict ${r.ok ? "ok" : "bad"}">${r.ok} questão(ões) importada(s)${r.bad.length ? `<small>Rejeitadas: ${esc(r.bad.join("; "))}</small>` : ""}</div>
            ${r.ok ? `<a class="btn" href="#/treino/ia">Treinar as novas agora</a>` : ""}`;
          document.getElementById("js").value = "";
        } catch (err) { out.innerHTML = `<div class="verdict bad">❌ ${esc(err.message || "JSON inválido")}<small>Confira se copiou o bloco inteiro, do [ ao ].</small></div>`; }
      };
      const clr = document.getElementById("clr");
      if (clr) { let armed = false; clr.onclick = () => {
        if (!armed) { armed = true; clr.textContent = "Toque de novo para confirmar"; return; }
        const ids = new Set(S.packs.map(q => q.id)); S.packs = [];
        for (let k = QB.length - 1; k >= 0; k--) if (ids.has(QB[k].id)) { delete BYID[QB[k].id]; delete S.q[QB[k].id]; QB.splice(k, 1); }
        save(); draw();
      }; }
    };
    draw();
  };

  /* Ajustes */
  routes.ajustes = () => {
    $app.innerHTML = `<h1>Ajustes</h1>
      <div class="card"><h3>Seu progresso</h3>
        <p class="small muted">O progresso fica salvo só neste aparelho. Exporte para ter backup ou para passar para outro aparelho.</p>
        <button class="btn ghost" id="ex">⬇ Exportar progresso</button>
        <label class="btn ghost">⬆ Importar progresso<input type="file" id="im" accept="application/json" class="hidden"></label>
        <button class="btn ghost" id="rs">Zerar progresso</button><p id="msg" class="small"></p></div>
      <div class="card"><h3>Sobre</h3>
        <p class="small">Banco: ${CORE} questões curadas + ${S.packs.length} importadas + variações geradas infinitas · ${CMP.length} comparações. Exame: ${E.name} (${E.code}).</p>
        <p class="small">Metodologia (modos, transcript e destrinchar em 4 passos) adaptada do <a href="https://github.com/aws-samples/sample-kiro-study-buddy" target="_blank" rel="noopener">Kiro Study Buddy</a> (licença MIT). Domínios e pesos do <a href="${E.guide}" target="_blank" rel="noopener">exam guide oficial</a>.</p>
        <p class="small muted">Material de estudo independente, não oficial e sem conteúdo de provas reais. As questões são originais e podem conter imprecisões: confira sempre na documentação oficial.</p></div>`;
    const msg = t => document.getElementById("msg").textContent = t;
    document.getElementById("ex").onclick = () => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: "application/json" }));
      a.download = `dva-treino-${today()}.json`; a.click();
    };
    document.getElementById("im").onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then(t => { const d = JSON.parse(t); if (!d.q) throw 0; S = Object.assign(blank(), d); mergePacks(); save(); msg("✅ Progresso importado."); })
        .catch(() => msg("❌ Arquivo inválido."));
    };
    let armed = false;
    document.getElementById("rs").onclick = e => {
      if (!armed) { armed = true; e.target.textContent = "Toque de novo para confirmar"; return; }
      const packs = S.packs; S = blank(); S.packs = packs; save(); SIM = null; msg("Progresso zerado (os pacotes importados foram mantidos)."); e.target.textContent = "Zerar progresso"; armed = false;
    };
  };

  render();
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost"))
    navigator.serviceWorker.register("sw.js").catch(() => {});
})();
