// Valida o banco de questões, as comparações e os geradores. Uso: node tools/validate.mjs
import { readFileSync } from "node:fs";
import vm from "node:vm";
const ctx = { window: {}, console }; ctx.window = ctx; vm.createContext(ctx);
for (const f of ["exam", "q-d1", "q-d2", "q-d3", "q-d4", "compare", "gen"])
  vm.runInContext(readFileSync(new URL(`../data/${f}.js`, import.meta.url), "utf8"), ctx, { filename: f });
const { EXAM, QB, CMP, GEN } = ctx;
const errs = [];
const check = (q, where) => {
  const e = m => errs.push(`${where} ${q.id}: ${m}`);
  if (!q.q || !Array.isArray(q.o)) return e("sem enunciado/opções");
  if (q.o.length < (q.gen ? 2 : 4)) e(`poucas opções (${q.o.length})`);
  if (q.w.length !== q.o.length) e("w ≠ o");
  if (!q.a.length || q.a.some(i => i < 0 || i >= q.o.length)) e("gabarito inválido");
  if (!q.gen && q.a.length > 1 !== !!q.multi) e("flag multi inconsistente");
  if (q.a.length === 2 && !/DUAS|DOIS/.test(q.q)) e("múltipla resposta sem 'DUAS' no enunciado");
  for (const k of q.kw) if (!q.q.includes(k)) e(`kw não está no enunciado: "${k}"`);
  for (const i of q.el) if (q.a.includes(i)) e("el contém a resposta correta");
  if (!EXAM.tasks[q.t]) e(`task inválida ${q.t}`);
  if (String(q.d) !== q.t[0]) e("domínio ≠ task");
  for (const f of ["obj", "concept", "trap", "tip", "ref"]) if (!q[f]) e(`falta ${f}`);
  if (!q.cmp && (!q.ev || !q.evu)) e("sem evidência da documentação (ev/evu)");
  if (new Set(q.o).size !== q.o.length) e("opções duplicadas");
};
const ids = new Set();
for (const q of QB) { if (ids.has(q.id)) errs.push(`id duplicado ${q.id}`); ids.add(q.id); check(q, "banco"); }
for (let i = 0; i < 3000; i++) check(GEN.one(), "gerador");
for (const k of GEN.kinds) for (let i = 0; i < 300; i++) { const q = GEN.one(k); if (q.a.length !== 1) errs.push(`gerador ${k}: ${q.a.length} corretas`); }
for (const c of CMP) for (const r of c.rows) if (r.length !== c.svc.length + 1) errs.push(`comparação ${c.id}: linha "${r[0]}" com ${r.length - 1} colunas, esperado ${c.svc.length}`);
const byD = {}; QB.forEach(q => byD[q.d] = (byD[q.d] || 0) + 1);
console.log(`Banco: ${QB.length} questões`, byD, `· múltipla resposta: ${QB.filter(q => q.multi).length} · comparações: ${CMP.length}`);
if (process.argv.includes("--refs")) console.log([...new Set([...QB.map(q => q.ref), ...CMP.map(c => c.ref), EXAM.guide, "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html", "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html", "https://docs.aws.amazon.com/kms/latest/APIReference/API_Encrypt.html"])].join("\n"));
if (errs.length) { console.log(errs.join("\n")); process.exit(1); } else console.log("✅ Tudo válido");
