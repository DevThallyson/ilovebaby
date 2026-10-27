/* Navegação entre telas, relógio e inicialização */
function mostrarTela(tela){
  $("telaPainel").classList.toggle("escondido", tela !== "painel");
  $("telaCadastro").classList.toggle("escondido", tela !== "cadastro");
  $("areaBusca").classList.toggle("escondido", tela !== "cadastro");
  window.scrollTo(0, 0);
}

function abrirCadastro(){
  limparFormulario();
  mostrarTela("cadastro");
  $("nome").focus();
}

function atualizarRelogio(){
  const agora = new Date();
  $("relogioHora").textContent = formatarHora(agora);
  $("relogioData").textContent = agora.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
}

$("btnCadastrar").addEventListener("click", abrirCadastro);
$("btnVoltar").addEventListener("click", () => { $("busca").value = ""; mostrarTela("painel"); renderizarPainel(); });

/* Mantém várias abas do navegador sincronizadas */
window.addEventListener("storage", e => {
  if (e.key !== CHAVE_ARMAZENAMENTO) return;
  motoristas = carregarMotoristas();
  renderizarPainel();
});

/* Atualiza tempos de espera e relógio a cada 30 segundos */
setInterval(() => { atualizarRelogio(); renderizarPainel(); }, 30000);

atualizarRelogio();
renderizarPainel();
