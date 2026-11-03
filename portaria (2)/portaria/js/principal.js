// troca de tela e início
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

$("btnCadastrar").addEventListener("click", abrirCadastro);
$("btnVoltar").addEventListener("click", () => { $("busca").value = ""; mostrarTela("painel"); desenharPainel(); });

// se o painel estiver aberto em outra aba, acompanha as mudanças
window.addEventListener("storage", e => {
  if (e.key !== CHAVE_DADOS) return;
  motoristas = carregarMotoristas();
  desenharPainel();
});

// o tempo de espera cresce com o relógio
setInterval(desenharPainel, 60000);

desenharPainel();
