/* Tela 1: renderização e eventos do dashboard */
function render(){
  const patio = motoristas.filter(m=>m.status==="patio");
  $("nPatio").textContent = patio.length;
  $("nHoje").textContent = entradasHoje;
  $("nAtencao").textContent = patio.filter(m=>m.min>=LIMITE_ATENCAO).length;

  const termo = $("busca").value.trim().toLowerCase();
  const lista = motoristas.filter(m =>
    (filtro==="todos" || m.status===filtro) &&
    (!termo || m.placa.toLowerCase().includes(termo) || m.nome.toLowerCase().includes(termo)));

  $("lista").innerHTML = lista.length ? "" : '<div class="empty">Nenhum motorista encontrado.</div>';
  lista.forEach(m=>{
    const alerta = m.status==="patio" && m.min>=LIMITE_ATENCAO;
    const row = document.createElement("div");
    row.className = "row"+(alerta?" alert":"");
    let tempo = "", acao = "";
    if(m.status==="patio"){
      tempo = `${fmt(m.min)}<small>esperando</small>`;
      acao = `<button class="btn ${alerta?"btn-red":"btn-navy"}" data-lib="${m.placa}">Liberar</button>`;
    }else if(m.status==="chegando"){
      tempo = `<span style="font-size:10px;color:var(--muted)">Chegando<small>em ${m.eta}</small></span>`;
      acao = `<button class="btn btn-out" data-ver="${m.placa}">Ver</button>`;
    }else{
      tempo = `<span style="font-size:10px;color:var(--muted)">Saiu às ${m.saida}</span>`;
      acao = `<button class="btn btn-out" data-ver="${m.placa}">Ver</button>`;
    }
    row.innerHTML = `<div class="ic">🚚</div>
      <div class="info"><b>${m.placa}</b><span>${m.nome}</span></div>
      <div class="time">${tempo}</div><div class="act">${acao}</div>`;
    $("lista").appendChild(row);
  });
}

$("lista").addEventListener("click", e=>{
  const lib = e.target.dataset.lib, ver = e.target.dataset.ver;
  if(lib){
    const m = motoristas.find(x=>x.placa===lib);
    m.status = "saiu"; m.saida = hora(new Date());
    render();
  }
  if(ver){
    const m = motoristas.find(x=>x.placa===ver);
    alert(`${m.placa} — ${m.nome}`);
  }
});

$("tabs").addEventListener("click", e=>{
  if(!e.target.dataset.f) return;
  filtro = e.target.dataset.f;
  document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active", t===e.target));
  render();
});

$("busca").addEventListener("input", ()=>{ mostrar("dash"); render(); });
