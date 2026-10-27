/* Estado da aplicação, armazenamento local e funções utilitárias */
const CHAVE_ARMAZENAMENTO = "portaria:motoristas";
const LIMITE_ATENCAO = 90; // minutos de espera até o motorista pedir atenção

let motoristas = carregarMotoristas();
let filtroAtual = "todos";

const $ = id => document.getElementById(id);
const icone = nome => `<svg class="icone" aria-hidden="true"><use href="#i-${nome}"/></svg>`;

/* Armazenamento: os cadastros ficam salvos no navegador */
function carregarMotoristas(){
  try { return JSON.parse(localStorage.getItem(CHAVE_ARMAZENAMENTO)) || []; }
  catch { return []; }
}
function salvarMotoristas(){
  try { localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(motoristas)); }
  catch { mostrarAviso("Não foi possível salvar os dados neste navegador."); }
}

/* Tempo e formatação */
const minutosDesde = (inicio, fim = Date.now()) => Math.max(0, Math.floor((fim - inicio) / 60000));
const formatarTempo = min => min >= 60 ? `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, "0")}min` : `${min} min`;
const formatarHora = ts => new Date(ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
const mesmoDia = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
const somenteDigitos = texto => texto.replace(/\D/g, "");

/* Evita que o texto digitado seja interpretado como HTML */
const escapar = texto => texto.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* Aviso temporário na parte inferior da tela */
let temporizadorAviso;
function mostrarAviso(texto){
  const aviso = $("aviso");
  aviso.textContent = texto;
  aviso.classList.add("visivel");
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => aviso.classList.remove("visivel"), 3000);
}
