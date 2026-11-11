# Cert Treino

App web gratuito para estudar para certificações pelo celular. A tela inicial lista as certificações; cada uma abre um módulo próprio, com o progresso salvo separado.

| Certificação | Questões | Domínios |
|---|---|---|
| AWS Certified Developer – Associate (DVA-C02) | 114 | exam guide oficial |
| Claude Certified Architect – Foundations (CCA-F) | 84 (+ 13 comparações) | **não oficiais**: resumos públicos, sem o exam guide da Anthropic |

**Precisão:** toda questão curada traz a frase da documentação oficial (`ev`/`evu`) que comprova a resposta, e o app mostra essa citação na explicação. As citações são conferidas literalmente contra as páginas oficiais antes de entrar no banco. Questões importadas de IA aparecem marcadas como "não verificada".

Inspirado no [Kiro Study Buddy](https://github.com/aws-samples/sample-kiro-study-buddy) (MIT): os modos de estudo, o transcript do simulado e o método de destrinchar questões em 4 passos foram adaptados para uso por toque, sem depender de IA ao vivo.

## O que cada módulo tem
- **Treino rápido**: 10 questões com explicação de cada alternativa, conceito, pegadinha, dica e link da documentação oficial.
- **Revisão espaçada**: as questões que você erra voltam em 10 min, 1, 3, 7, 16 e 35 dias.
- **Simulado**: tempo corrido, marcação para revisar, nota de 100–1000, PASS/FAIL e desempenho por domínio.
- **Destrinchar**: palavras-chave → eliminação → escolha → reflexão, com autoavaliação de confiança.
- **Comparar** (quando o módulo tem comparações) e **variações geradas** (quando tem geradores).
- **Mais questões com IA**: o app monta um prompt focado no seu domínio mais fraco; você cola no Claude e importa o JSON. Só entram questões com citação de um domínio de documentação oficial aceito pelo módulo.

## Estrutura
```
index.html            hub: escolha da certificação
certs.js              registro das certificações
engine/app.js         motor comum (telas e lógica)
engine/styles.css
certs/<id>/index.html página do módulo (carrega os dados + o motor)
certs/<id>/data/      exam.js (metadados), q-*.js (banco), compare.js e gen.js (opcionais)
tools/validate.mjs    valida todos os módulos
sw.js                 service worker único (rede primeiro, cache para offline)
```

## Incluir uma nova certificação
1. Crie `certs/<id>/data/exam.js` com `window.EXAM` (veja os dois existentes): `id`, `storageKey`, `code`, `name`, `questions`, `minutes`, `passing`, `domains` (pesos somando 100), `docs.allow` (regex dos domínios de documentação oficial) e, se houver, `tasks`, `scenarios`, `skills`.
2. Crie os arquivos de questões (`QB.push(...)`), cada uma com `ev`/`evu`.
3. Copie um `certs/<id>/index.html` existente e ajuste o título, o logo e os `<script>` de dados.
4. Adicione a entrada em `certs.js` (com `total` igual ao número de questões).
5. Rode `node tools/validate.mjs`.

## Rodar localmente
```bash
python3 -m http.server 5190     # abra http://localhost:5190
node tools/validate.mjs
```

## Usar no celular
Publicado no GitHub Pages. No celular, abra a URL → menu do navegador → **Adicionar à tela inicial**. Ao mudar o hub ou o motor, incremente `VERSION` em `sw.js`.

## Aviso
Material de estudo independente e não oficial. Não contém questões de provas reais. As questões podem ter imprecisões: confira na documentação oficial.
