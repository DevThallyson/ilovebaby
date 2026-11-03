// tela 1: indicadores, filtros e lista de motoristas
function desenharPainel(){
  const noPatio = motoristas.filter(m => m.status === "patio");

  $("qtdPatio").textContent = noPatio.length;
  $("qtdHoje").textContent = motoristas.filter(m => mesmoDia(m.entrada, Date.now())).length;
  $("qtdAtencao").textContent = noPatio.filter(m => minutosDesde(m.entrada) >= LIMITE_ATENCAO).length;

  const termo = $("busca").value.trim().toLowerCase();
  const visiveis = motoristas
    .filter(m => filtroAtual === "todos" || m.status === filtroAtual)
    .filter(m => !termo || m.placa.toLowerCase().includes(termo) || m.nome.toLowerCase().includes(termo))
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "patio" ? -1 : 1;
      return a.status === "patio" ? a.entrada - b.entrada : b.saida - a.saida;
    });

  $("listaMotoristas").innerHTML = visiveis.length ? visiveis.map(montarLinha).join("") : montarVazio(termo);
}

function montarVazio(termo){
  if (!motoristas.length){
    return `<div class="vazio"><p>Nenhum motorista cadastrado ainda.</p>
      <button class="botao botao-verde" data-acao="novo">Cadastrar o primeiro</button></div>`;
  }
  if (termo) return `<div class="vazio">Nada encontrado para "${escapar(termo)}".</div>`;
  return `<div class="vazio">Nenhum motorista nesta lista.</div>`;
}

function montarLinha(m){
  const noPatio = m.status === "patio";
  const min = minutosDesde(m.entrada);
  const emAlerta = noPatio && min >= LIMITE_ATENCAO;

  let tempo, acao = "";
  if (noPatio){
    tempo = `${formatarTempo(min)}<small>esperando</small>`;
    acao = `<button class="botao ${emAlerta ? "botao-vermelho" : "botao-marinho"}" data-acao="liberar" data-id="${m.id}">Liberar</button>`;
  } else {
    tempo = `<span style="font-weight:400;color:var(--cinza)">Saiu às ${formatarHora(m.saida)}</span>`;
  }

  return `<div class="linha ${emAlerta ? "alerta" : ""}">
    <div class="icone-linha">${icone("caminhao")}</div>
    <div class="info"><b>${escapar(m.placa)}</b><span>${escapar(m.nome)}</span></div>
    <div class="tempo">${tempo}</div>
    <div class="acao">${acao}</div>
  </div>`;
}

function liberarSaida(id){
  const motorista = motoristas.find(m => m.id === id);
  if (!motorista) return;
  motorista.status = "saiu";
  motorista.saida = Date.now();
  salvarMotoristas();
  desenharPainel();
}

$("listaMotoristas").addEventListener("click", e => {
  const botao = e.target.closest("[data-acao]");
  if (!botao) return;
  if (botao.dataset.acao === "liberar") liberarSaida(botao.dataset.id);
  if (botao.dataset.acao === "novo") abrirCadastro();
});

$("filtros").addEventListener("click", e => {
  const botao = e.target.closest(".filtro");
  if (!botao) return;
  filtroAtual = botao.dataset.filtro;
  document.querySelectorAll(".filtro").forEach(f => f.classList.toggle("ativo", f === botao));
  desenharPainel();
});

// pesquisar leva de volta para a lista
$("busca").addEventListener("input", () => { mostrarTela("painel"); desenharPainel(); });
