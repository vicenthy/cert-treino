# DVA Treino

App web para estudar para a **AWS Certified Developer - Associate (DVA-C02)** pelo celular. É gratuito.

**Precisão:** todas as questões curadas e os geradores trazem a frase da documentação oficial da AWS (`ev`/`evu`) que comprova a resposta, e o app mostra essa citação na explicação. Questões importadas de IA só são aceitas com uma citação, mas o app não consegue conferi-la sozinho: elas aparecem marcadas como "não verificada".

Inspirado no [Kiro Study Buddy](https://github.com/aws-samples/sample-kiro-study-buddy) (MIT): os modos de estudo, o transcript do simulado e o método de destrinchar questões em 4 passos foram adaptados para uso por toque, sem depender de IA ao vivo.

## O que tem
- **Treino rápido**: 10 questões com explicação de cada alternativa, conceito, pegadinha, dica e link da documentação oficial.
- **Revisão espaçada**: as questões que você erra voltam em 10 min, 1, 3, 7, 16 e 35 dias.
- **Simulado**: tempo corrido (2 min por questão, como os 130 min ÷ 65 da prova), marcação para revisar, nota de 100–1000, PASS/FAIL e desempenho por domínio.
- **Destrinchar**: palavras-chave → eliminação → escolha → reflexão, com autoavaliação de confiança.
- **Comparar**: 16 pares de serviços que mais confundem na prova.
- **Conteúdo dinâmico**:
  - *Variações geradas*: cálculos de RCU/WCU, concorrência da Lambda, limite do KMS e visibility timeout do SQS com números novos a cada vez, mais *flashes* de palavras-chave.
  - *Mais questões com IA*: o app monta um prompt (com as regras do Kiro Study Buddy, foco no seu domínio mais fraco e skills sorteadas do exam guide). Você cola no Claude e importa o JSON da resposta. O app valida e descarta questões repetidas ou malformadas.

O progresso fica no `localStorage` do aparelho. Use **Ajustes → Exportar** para fazer backup.

## Rodar localmente
```bash
python3 -m http.server 5190     # abra http://localhost:5190
node tools/validate.mjs         # valida o banco de questões e os geradores
```

## Usar no celular
O service worker (modo offline e instalação) exige HTTPS. O jeito mais simples é publicar como site estático:
- **GitHub Pages**: crie um repositório, envie esta pasta e ative Pages (branch `main`, raiz).
- **Cloudflare Pages / Netlify / Vercel**: arraste a pasta, sem build.

Depois, no celular, abra a URL → menu do navegador → **Adicionar à tela inicial**.

Ao alterar arquivos, incremente `VERSION` em `sw.js` para os aparelhos baixarem a nova versão.

## Estrutura
```
data/exam.js      metadados oficiais (domínios, pesos, tasks, skills)
data/q-d1..4.js   banco curado (esquema documentado em q-d1.js)
data/compare.js   comparações de serviços
data/gen.js       geradores de variações
app.js            telas e lógica
tools/validate.mjs
```

## Aviso
Material de estudo independente e não oficial. Não contém questões de provas reais. As questões podem ter imprecisões: confira na documentação oficial.
