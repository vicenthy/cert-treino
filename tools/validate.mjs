// Valida todas as certificações registradas em certs.js: banco de questões, comparações e geradores.
// Uso: node tools/validate.mjs [--refs]
import { readFileSync } from "node:fs";
import vm from "node:vm";
const root = new URL("../", import.meta.url);
const read = p => readFileSync(new URL(p, root), "utf8");
const load = (files, base) => {
  const ctx = { console }; ctx.window = ctx; vm.createContext(ctx);
  for (const f of files) vm.runInContext(read(base + f), ctx, { filename: base + f });
  return ctx;
};
const { CERTS } = load(["certs.js"], "");
const errs = [];
const refs = new Set();

for (const cert of CERTS) {
  const html = read(cert.path + "index.html");
  const files = [...html.matchAll(/<script src="(data\/[^"]+)"/g)].map(m => m[1]);
  if (!files.length) { console.log(`${cert.code}: sem arquivos de dados (em preparação)`); if (cert.total) errs.push(`${cert.code}: total ${cert.total} mas nenhum dado`); continue; }
  const { EXAM, QB, CMP = [], GEN } = load(files, cert.path);
  const E = EXAM, err = m => errs.push(`${cert.code} ${m}`);
  if (E.id !== cert.id) err(`EXAM.id (${E.id}) ≠ registro (${cert.id})`);
  if ((E.storageKey || `cert-treino-${E.id}-v1`) !== cert.storageKey) err("storageKey diferente do registro");
  const w = Object.values(E.domains).reduce((s, d) => s + d.weight, 0);
  if (w !== 100) err(`pesos dos domínios somam ${w}`);
  const docRe = (E.docs && E.docs.allow || []).map(r => new RegExp(r));
  const isDoc = u => docRe.some(r => r.test(u || ""));
  const check = (q, where) => {
    const e = m => err(`${where} ${q.id}: ${m}`);
    if (!q.q || !Array.isArray(q.o)) return e("sem enunciado/opções");
    if (q.o.length < (q.gen ? 2 : 4)) e(`poucas opções (${q.o.length})`);
    if (q.w.length !== q.o.length) e("w ≠ o");
    if (!q.a.length || q.a.some(i => i < 0 || i >= q.o.length)) e("gabarito inválido");
    if (!q.gen && q.a.length > 1 !== !!q.multi) e("flag multi inconsistente");
    if (q.a.length === 2 && !/DUAS|DOIS/.test(q.q)) e("múltipla resposta sem 'DUAS' no enunciado");
    for (const k of q.kw) if (!q.q.includes(k)) e(`kw não está no enunciado: "${k}"`);
    for (const i of q.el) if (q.a.includes(i)) e("el contém a resposta correta");
    if (!E.domains[q.d]) e(`domínio inválido ${q.d}`);
    if (E.tasks) { if (!E.tasks[q.t]) e(`task inválida ${q.t}`); if (String(q.d) !== String(q.t)[0]) e("domínio ≠ task"); }
    if (E.scenarios && !q.gen && !E.scenarios.includes(q.sc)) e(`cenário inválido "${q.sc}"`);
    for (const f of ["obj", "concept", "trap", "tip", "ref"]) if (!q[f]) e(`falta ${f}`);
    if (!q.cmp && (!q.ev || !q.evu)) e("sem evidência da documentação (ev/evu)");
    if (!q.cmp && docRe.length && !isDoc(q.evu)) e(`evu fora da documentação oficial: ${q.evu}`);
    if (new Set(q.o).size !== q.o.length) e("opções duplicadas");
  };
  const ids = new Set();
  for (const q of QB) { if (ids.has(q.id)) err(`id duplicado ${q.id}`); ids.add(q.id); check(q, "banco"); refs.add(q.ref); if (q.evu) refs.add(q.evu); }
  if (GEN) {
    for (let i = 0; i < 3000; i++) check(GEN.one(), "gerador");
    for (const k of GEN.kinds) for (let i = 0; i < 300; i++) { const q = GEN.one(k); if (q.a.length !== 1) err(`gerador ${k}: ${q.a.length} corretas`); }
  }
  for (const c of CMP) { refs.add(c.ref); for (const r of c.rows) if (r.length !== c.svc.length + 1) err(`comparação ${c.id}: linha "${r[0]}" com ${r.length - 1} colunas, esperado ${c.svc.length}`); }
  if (QB.length !== cert.total) err(`certs.js diz total ${cert.total}, banco tem ${QB.length}`);
  const byD = {}; QB.forEach(q => byD[q.d] = (byD[q.d] || 0) + 1);
  console.log(`${cert.code}: ${QB.length} questões`, byD, `· múltipla resposta: ${QB.filter(q => q.multi).length} · comparações: ${CMP.length}${GEN ? " · geradores: " + GEN.kinds.length : ""}`);
}
if (process.argv.includes("--refs")) console.log([...refs].join("\n"));
if (errs.length) { console.log(errs.join("\n")); process.exit(1); } else console.log("✅ Tudo válido");
