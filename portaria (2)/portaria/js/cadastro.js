// tela 2: formulário, validação e checklist
const VALIDAR_CPF = true; // false para testar com CPFs inventados
const CAMPOS = ["nome", "cpf", "cnh", "placa"];

$("cpf").addEventListener("input", e => {
  e.target.value = somenteDigitos(e.target.value).slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
});
$("cnh").addEventListener("input", e => { e.target.value = somenteDigitos(e.target.value).slice(0, 11); });
$("placa").addEventListener("input", e => {
  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
});
["nome", "placa", "categoria"].forEach(id => $(id).addEventListener("input", atualizarResumo));
CAMPOS.forEach(id => $(id).addEventListener("input", () => mostrarErro(id, "")));

function atualizarResumo(){
  $("resPlaca").textContent = $("placa").value || "—";
  $("resNome").textContent = $("nome").value.trim() || "—";
  $("resCategoria").textContent = $("categoria").value;
}

function cpfValido(cpf){
  const d = somenteDigitos(cpf);
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  for (let tam = 9; tam < 11; tam++){
    let soma = 0;
    for (let i = 0; i < tam; i++) soma += Number(d[i]) * (tam + 1 - i);
    if (((soma * 10) % 11) % 10 !== Number(d[tam])) return false;
  }
  return true;
}

// aceita placa antiga (ABC1234) e Mercosul (ABC1D23)
const placaValida = placa => /^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(placa);

function mostrarErro(id, mensagem){
  $(`erro-${id}`).textContent = mensagem;
  $(`campo-${id}`).classList.toggle("invalido", Boolean(mensagem));
}

function validarFormulario(){
  const erros = {};
  if ($("nome").value.trim().split(/\s+/).length < 2) erros.nome = "Informe nome e sobrenome";
  const cpfOk = VALIDAR_CPF ? cpfValido($("cpf").value) : somenteDigitos($("cpf").value).length === 11;
  if (!cpfOk) erros.cpf = "CPF inválido";
  if ($("cnh").value.length !== 11) erros.cnh = "A CNH tem 11 dígitos";
  if (!placaValida($("placa").value)) erros.placa = "Placa inválida";
  else if (motoristas.some(m => m.status === "patio" && m.placa === $("placa").value)) erros.placa = "Essa placa já está no pátio";

  CAMPOS.forEach(id => mostrarErro(id, erros[id] || ""));
  const primeiroComErro = CAMPOS.find(id => erros[id]);
  if (primeiroComErro) $(primeiroComErro).focus();
  return !primeiroComErro;
}

const checklistCompleto = () => [...document.querySelectorAll(".marcador")].every(c => c.checked);

function atualizarBotao(){
  const ok = checklistCompleto();
  $("btnLiberar").disabled = !ok;
  $("dicaLiberar").textContent = ok ? "Tudo certo para liberar" : "Conclua o checklist para liberar a entrada";
}
document.querySelectorAll(".marcador").forEach(c => c.addEventListener("change", atualizarBotao));

function limparFormulario(){
  CAMPOS.forEach(id => { $(id).value = ""; mostrarErro(id, ""); });
  $("categoria").value = "E";
  document.querySelectorAll(".marcador").forEach(c => { c.checked = false; });
  $("resChegada").textContent = formatarHora(Date.now());
  atualizarResumo();
  atualizarBotao();
}

// libera a entrada: o motorista passa a aparecer no painel
$("btnLiberar").addEventListener("click", () => {
  if (!checklistCompleto() || !validarFormulario()) return;

  motoristas.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    nome: $("nome").value.trim(),
    cpf: $("cpf").value,
    cnh: $("cnh").value,
    categoria: $("categoria").value,
    placa: $("placa").value,
    status: "patio",
    entrada: Date.now(),
    saida: null
  });
  salvarMotoristas();

  filtroAtual = "todos";
  document.querySelectorAll(".filtro").forEach(f => f.classList.toggle("ativo", f.dataset.filtro === "todos"));
  $("busca").value = "";
  mostrarTela("painel");
  desenharPainel();
});
