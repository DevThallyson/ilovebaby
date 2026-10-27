/* Estado da aplicação e utilitários */
const LIMITE_ATENCAO = 90; // minutos de espera para pedir atenção

let motoristas = [
  {placa:"HD1631", nome:"Renato Melo",  status:"patio",    min:167},
  {placa:"MJ4521", nome:"Ana Ferreira", status:"patio",    min:118},
  {placa:"B271A4", nome:"Carlos Silva", status:"patio",    min:78},
  {placa:"AV381B", nome:"João Pereira", status:"chegando", eta:"20 min"}
];
let entradasHoje = 24;
let filtro = "todos";

const $ = id => document.getElementById(id);
const fmt = m => m >= 60 ? `${Math.floor(m/60)}h ${String(m%60).padStart(2,"0")}min` : `${m}min`;
const hora = d => d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
const soDigitos = v => v.replace(/\D/g,"");
