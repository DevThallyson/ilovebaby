// dados e funções de apoio usados pelas duas telas
const CHAVE_DADOS = "portaria:motoristas";
const LIMITE_ATENCAO = 90; // minutos esperando para ficar em alerta

let motoristas = carregarMotoristas();
let filtroAtual = "todos";

const $ = id => document.getElementById(id);
const icone = nome => `<svg class="icone"><use href="#i-${nome}"/></svg>`;

function carregarMotoristas(){
  try { return JSON.parse(localStorage.getItem(CHAVE_DADOS)) || []; }
  catch { return []; }
}

function salvarMotoristas(){
  localStorage.setItem(CHAVE_DADOS, JSON.stringify(motoristas));
}

const minutosDesde = (inicio) => Math.max(0, Math.floor((Date.now() - inicio) / 60000));
const formatarTempo = min => min >= 60 ? `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, "0")}min` : `${min}min`;
const formatarHora = ts => new Date(ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
const mesmoDia = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
const somenteDigitos = texto => texto.replace(/\D/g, "");

// o nome digitado vai para dentro de um innerHTML, então escapamos
const escapar = texto => texto.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
