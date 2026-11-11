// Registro das certificações. Para incluir uma nova: crie certs/<id>/ (index.html + data/)
// e adicione uma entrada aqui. tools/validate.mjs confere "total" com o banco real.
window.CERTS = [
  {
    id: "dva-c02", path: "certs/dva-c02/", logo: "DVA", vendor: "AWS",
    code: "DVA-C02", name: "AWS Certified Developer – Associate",
    storageKey: "dva-treino-v1", total: 114,
    note: "Domínios e pesos do exam guide oficial · questões verificadas na documentação da AWS"
  },
  {
    id: "cca-f", path: "certs/cca-f/", logo: "CCA", vendor: "Anthropic",
    code: "CCA-F", name: "Claude Certified Architect – Foundations",
    storageKey: "cert-treino-cca-f-v1", total: 84,
    note: "Domínios não oficiais (resumos públicos) · questões verificadas na documentação da Anthropic"
  }
];
