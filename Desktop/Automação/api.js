async function buscarLeads() {

  const response = await fetch(
    'https://jsonplaceholder.typicode.com/comments'
  );

  const dados = await response.json();

  return dados;

}

function calcularScore(lead) {

  let score = 0;

  if (lead.email) {
    score += 10;
  }

  if (lead.body.length > 50) {
    score += 20;
  }

  return score;

}

function classificarLead(score) {

  if (score >= 25) {
    return "🔥 Lead Quente";
  }

  if (score >= 10) {
    return "🟡 Lead Morno";
  }

  return "❄ Lead Frio";

}

async function iniciarSistema() {

  const leads = await buscarLeads();

  const ranking = leads.map(lead => {

    const score = calcularScore(lead);

    return {
      nome: lead.name,
      score,
      classificacao: classificarLead(score)
    };

  });

  console.log(ranking);

}

iniciarSistema();