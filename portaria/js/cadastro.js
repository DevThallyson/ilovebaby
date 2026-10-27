/* Tela 2: formulário, máscaras, checklist e validação */
$("cpf").addEventListener("input", e=>{
  let v = soDigitos(e.target.value).slice(0,11);
  v = v.replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2");
  e.target.value = v;
});
$("cnh").addEventListener("input", e=> e.target.value = soDigitos(e.target.value).slice(0,11));
$("placa").addEventListener("input", e=>{
  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,7);
  $("sPlaca").textContent = e.target.value || "—";
});

function checklistOk(){ return [...document.querySelectorAll(".ck")].every(c=>c.checked); }

function atualizarBotao(){
  const ok = checklistOk();
  $("btnLiberar").disabled = !ok;
  $("btnLiberar").classList.toggle("on", ok);
  $("hint").textContent = ok ? "Tudo certo para liberar" : "Conclua o checklist para liberar a saída";
}
document.querySelectorAll(".ck").forEach(c=>c.addEventListener("change", atualizarBotao));

function limparForm(){
  ["nome","cpf","cnh","placa"].forEach(id=>{ $(id).value=""; $(id).classList.remove("err"); });
  $("cat").value = "E";
  document.querySelectorAll(".ck").forEach(c=>c.checked=false);
  const agora = new Date();
  $("sPlaca").textContent = "—";
  $("sCheg").textContent = hora(agora);
  $("sPrev").textContent = hora(new Date(agora.getTime()+80*60000));
  atualizarBotao();
}

function validar(){
  let ok = true;
  const regras = {
    nome:  v => v.trim().split(/\s+/).length >= 2,
    cpf:   v => soDigitos(v).length === 11,
    cnh:   v => v.length === 11,
    placa: v => v.length === 7
  };
  for(const id in regras){
    const bad = !regras[id]($(id).value);
    $(id).classList.toggle("err", bad);
    if(bad) ok = false;
  }
  return ok;
}

$("btnLiberar").onclick = ()=>{
  if(!checklistOk()) return;
  if(!validar()){ alert("Preencha corretamente os campos obrigatórios."); return; }
  const placa = $("placa").value;
  if(motoristas.some(m=>m.placa===placa && m.status!=="saiu")){
    alert("Já existe um motorista ativo com essa placa."); return;
  }
  motoristas.unshift({placa, nome:$("nome").value.trim(), status:"patio", min:0});
  entradasHoje++;
  filtro = "todos";
  document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active", t.dataset.f==="todos"));
  $("busca").value = "";
  mostrar("dash"); render();
};
