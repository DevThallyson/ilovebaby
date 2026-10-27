/* Tela 2: formulário de cadastro, máscaras, validação e checklist */
const VALIDAR_CPF = true; // coloque false para testar com CPFs fictícios
const CAMPOS = ["nome", "cpf", "cnh", "placa"];

/* Máscaras de digitação */
$("cpf").addEventListener("input", e => {
  e.target.value = somenteDigitos(e.target.value).slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
});
$("cnh").addEventListener("input", e => { e.target.value = somenteDigitos(e.target.value).slice(0, 11); });
$("placa").addEventListener("input", e => {
  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
  atualizarResumo();
});
$("nome").addEventListener("input", atualizarResumo);
$("categoria").addEventListener("change", atualizarResumo);
CAMPOS.forEach(id => $(id).addEventListener("input", () => definirErro(id, "")));

function atualizarResumo(){
  $("resPlaca").textContent = $("placa").value || "—";
  $("resNome").textContent = $("nome").value.trim() || "—";
  $("resCategoria").textContent = $("categoria").value;
}

/* Validações */
function cpfValido(cpf){
  const d = somenteDigitos(cpf);
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  for (let tamanho = 9; tamanho < 11; tamanho++){
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(d[i]) * (tamanho + 1 - i);
    if (((soma * 10) % 11) % 10 !== Number(d[tamanho])) return false;
  }
  return true;
}
const placaValida = placa => /^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(placa); // modelo antigo e Mercosul

function definirErro(id, mensagem){
  $(`erro-${id}`).textContent = mensagem;
  $(`campo-${id}`).classList.toggle("invalido", Boolean(mensagem));
}

function validarFormulario(){
  const erros = {};
  if ($("nome").value.trim().split(/\s+/).length < 2) erros.nome = "Informe nome e sobrenome.";
  if (!(VALIDAR_CPF ? cpfValido($("cpf").value) : somenteDigitos($("cpf").value).length === 11)) erros.cpf = "CPF inválido.";
  if ($("cnh").value.length !== 11) erros.cnh = "A CNH deve ter 11 dígitos.";
  if (!placaValida($("placa").value)) erros.placa = "Placa inválida. Use o formato ABC1D23 ou ABC1234.";
  else if (motoristas.some(m => m.status === "patio" && m.placa === $("placa").value)) erros.placa = "Esta placa já está no pátio.";

  CAMPOS.forEach(id => definirErro(id, erros[id] || ""));
  const primeiro = CAMPOS.find(id => erros[id]);
  if (primeiro) $(primeiro).focus();
  return !primeiro;
}

/* Checklist */
const checklistCompleto = () => [...document.querySelectorAll(".marcador")].every(c => c.checked);

function atualizarChecklist(){
  const marcados = document.querySelectorAll(".marcador:checked").length;
  const completo = checklistCompleto();
  $("contChecklist").textContent = `${marcados} de 3`;
  $("btnLiberar").disabled = !completo;
  $("dicaLiberar").textContent = completo ? "Tudo certo para liberar a entrada" : "Conclua o checklist para liberar a entrada";
}
document.querySelectorAll(".marcador").forEach(c => c.addEventListener("change", atualizarChecklist));

function limparFormulario(){
  CAMPOS.forEach(id => { $(id).value = ""; definirErro(id, ""); });
  $("categoria").value = "E";
  document.querySelectorAll(".marcador").forEach(c => { c.checked = false; });
  $("resChegada").textContent = formatarHora(Date.now());
  atualizarResumo();
  atualizarChecklist();
}

/* Salvar: o motorista entra no pátio e aparece no painel */
$("btnLiberar").addEventListener("click", () => {
  if (!checklistCompleto() || !validarFormulario()) return;

  const motorista = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    nome: $("nome").value.trim(),
    cpf: $("cpf").value,
    cnh: $("cnh").value,
    categoria: $("categoria").value,
    placa: $("placa").value,
    status: "patio",
    entrada: Date.now(),
    saida: null
  };
  motoristas.push(motorista);
  salvarMotoristas();

  filtroAtual = "todos";
  document.querySelectorAll(".aba").forEach(a => a.classList.toggle("ativa", a.dataset.filtro === "todos"));
  $("busca").value = "";
  mostrarTela("painel");
  renderizarPainel();
  mostrarAviso(`Motorista liberado: ${motorista.placa}`);
});
