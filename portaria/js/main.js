/* Navegação entre telas e inicialização */
function mostrar(tela){
  $("viewDash").classList.toggle("hidden", tela!=="dash");
  $("viewCadastro").classList.toggle("hidden", tela!=="cad");
  $("search").classList.toggle("hidden", tela!=="cad");
}

$("btnCadastrar").onclick = ()=>{ limparForm(); mostrar("cad"); };
$("btnVoltar").onclick = ()=>{ $("busca").value=""; mostrar("dash"); render(); };

// Atualiza o tempo de espera a cada minuto
setInterval(()=>{ motoristas.forEach(m=>{ if(m.status==="patio") m.min++; }); render(); }, 60000);

render();
