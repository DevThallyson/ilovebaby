/* Tela 1: painel do porteiro (indicadores, abas e lista) */
function renderizarPainel(){
  const noPatio = motoristas.filter(m => m.status === "patio");
  const atencao = noPatio.filter(m => minutosDesde(m.entrada) >= LIMITE_ATENCAO).length;

  $("qtdPatio").textContent = noPatio.length;
  $("qtdHoje").textContent = motoristas.filter(m => mesmoDia(m.entrada, Date.now())).length;
  $("qtdAtencao").textContent = atencao;
  $("indicadorAtencao").classList.toggle("alerta", atencao > 0);

  $("contTodos").textContent = motoristas.length;
  $("contPatio").textContent = noPatio.length;
  $("contSaiu").textContent = motoristas.length - noPatio.length;

  const termo = $("busca").value.trim().toLowerCase();
  const visiveis = motoristas
    .filter(m => filtroAtual === "todos" || m.status === filtroAtual)
    .filter(m => !termo || m.placa.toLowerCase().includes(termo) || m.nome.toLowerCase().includes(termo))
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "patio" ? -1 : 1; // pátio primeiro
      return a.status === "patio" ? a.entrada - b.entrada : b.saida - a.saida; // maior espera primeiro
    });

  const lista = $("listaMotoristas");
  if (!visiveis.length){
    lista.innerHTML = montarEstadoVazio(termo);
    return;
  }
  lista.innerHTML = visiveis.map(montarLinha).join("");
}

function montarEstadoVazio(termo){
  if (!motoristas.length){
    return `<div class="vazio"><b>Nenhum motorista cadastrado</b>Cadastre o primeiro motorista para ele aparecer aqui.
      <div><button class="botao botao-primario" data-acao="novo">${icone("mais")}Cadastrar motorista</button></div></div>`;
  }
  if (termo) return `<div class="vazio"><b>Nenhum resultado</b>Nada encontrado para “${escapar(termo)}”.</div>`;
  return `<div class="vazio"><b>Lista vazia</b>Nenhum motorista nesta aba.</div>`;
}

function montarLinha(m){
  const min = minutosDesde(m.entrada);
  const noPatio = m.status === "patio";
  const critico = noPatio && min >= LIMITE_ATENCAO;

  let situacao, espera, acao;
  if (noPatio){
    const pct = Math.min(100, Math.round(min / LIMITE_ATENCAO * 100));
    const nivel = pct >= 100 ? "alto" : pct >= 60 ? "medio" : "";
    situacao = `<span class="etiqueta ${critico ? "critico" : "patio"}">${critico ? "Atenção" : "No pátio"}</span>`;
    espera = `<strong>${formatarTempo(min)}</strong><small>Entrou às ${formatarHora(m.entrada)}</small>
      <div class="trilho"><div class="preenchimento ${nivel}" style="width:${pct}%"></div></div>`;
    acao = `<button class="botao botao-pequeno ${critico ? "botao-perigo" : "botao-marinho"}" data-acao="liberar" data-id="${m.id}">Liberar</button>`;
  } else {
    situacao = `<span class="etiqueta saiu">Saiu</span>`;
    espera = `<strong>${formatarTempo(minutosDesde(m.entrada, m.saida))}</strong><small>Saiu às ${formatarHora(m.saida)}</small>`;
    acao = `<button class="botao botao-pequeno botao-contorno" data-acao="detalhes" data-id="${m.id}">Ver</button>`;
  }

  return `<div class="fila-linha ${critico ? "critico" : ""}">
    <button class="veiculo" data-acao="detalhes" data-id="${m.id}">
      <span class="icone-caixa">${icone("caminhao")}</span>
      <span><b>${escapar(m.placa)}</b><span class="nome">${escapar(m.nome)}</span></span>
    </button>
    <div>${situacao}</div>
    <div class="espera">${espera}</div>
    <div class="acao">${acao}</div>
  </div>`;
}

function liberarSaida(id){
  const motorista = motoristas.find(m => m.id === id);
  if (!motorista) return;
  motorista.status = "saiu";
  motorista.saida = Date.now();
  salvarMotoristas();
  renderizarPainel();
  mostrarAviso(`Saída liberada: ${motorista.placa}`);
}

function abrirDetalhes(id){
  const m = motoristas.find(x => x.id === id);
  if (!m) return;
  const linhas = [
    ["Motorista", m.nome], ["CPF", m.cpf], ["CNH", `${m.cnh} (categoria ${m.categoria})`],
    ["Entrada", `${new Date(m.entrada).toLocaleDateString("pt-BR")} às ${formatarHora(m.entrada)}`],
    ["Saída", m.saida ? `${new Date(m.saida).toLocaleDateString("pt-BR")} às ${formatarHora(m.saida)}` : "Ainda no pátio"]
  ];
  $("detalhesTitulo").textContent = `Veículo ${m.placa}`;
  $("detalhesLista").innerHTML = linhas.map(([titulo, valor]) => `<div><dt>${titulo}</dt><dd>${escapar(valor)}</dd></div>`).join("");
  $("dialogoDetalhes").showModal();
}

/* Eventos */
$("listaMotoristas").addEventListener("click", e => {
  const botao = e.target.closest("[data-acao]");
  if (!botao) return;
  const { acao, id } = botao.dataset;
  if (acao === "liberar") liberarSaida(id);
  if (acao === "detalhes") abrirDetalhes(id);
  if (acao === "novo") abrirCadastro();
});

$("abas").addEventListener("click", e => {
  const aba = e.target.closest(".aba");
  if (!aba) return;
  filtroAtual = aba.dataset.filtro;
  document.querySelectorAll(".aba").forEach(a => a.classList.toggle("ativa", a === aba));
  renderizarPainel();
});

$("busca").addEventListener("input", () => { mostrarTela("painel"); renderizarPainel(); });
