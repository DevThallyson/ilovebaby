// ===== CONFIGURAÇÃO =====
// Troque pela URL do back-end que o seu grupo está fazendo.
const API_URL = "http://localhost:3000/api";

const form = document.getElementById("form-cadastro");
const msg = document.getElementById("msg");

function mostrarMensagem(texto, tipo) {
  msg.textContent = texto;
  msg.className = "mensagem " + tipo;
}

const campo = (id) => document.getElementById(id);

// Regras de validação de cada campo
const regras = {
  nome: (v) => v.trim().length >= 3,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  telefone: (v) => v.replace(/\D/g, "").length >= 10,
  empresa: (v) => v.trim().length >= 2,
  cnpj: (v) => v.replace(/\D/g, "").length === 14,
  senha: (v) => v.length >= 6,
  confirmar: (v) => v.length > 0 && v === campo("senha").value,
};

// Máscaras
campo("telefone").addEventListener("input", (e) => {
  let n = e.target.value.replace(/\D/g, "").slice(0, 11);
  n = n.replace(/^(\d{2})(\d)/, "($1) $2");
  n = n.length > 10 ? n.replace(/(\d{5})(\d{4})$/, "$1-$2") : n.replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  e.target.value = n;
});
campo("cnpj").addEventListener("input", (e) => {
  let n = e.target.value.replace(/\D/g, "").slice(0, 14);
  n = n.replace(/^(\d{2})(\d)/, "$1.$2")
       .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
       .replace(/\.(\d{3})(\d)/, ".$1/$2")
       .replace(/(\d{4})(\d)/, "$1-$2");
  e.target.value = n;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = form.querySelector(".btn");

  let tudoOk = true;
  for (const id in regras) {
    const ok = regras[id](campo(id).value);
    campo(id).classList.toggle("invalido", !ok);
    if (!ok) tudoOk = false;
  }
  if (!tudoOk) return mostrarMensagem("Corrija os campos destacados.", "erro");

  btn.disabled = true;
  try {
    const resposta = await fetch(API_URL + "/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: campo("nome").value.trim(),
        email: campo("email").value.trim(),
        telefone: campo("telefone").value,
        empresa: campo("empresa").value.trim(),
        cnpj: campo("cnpj").value,
        senha: campo("senha").value,
      }),
    });
    let dados = {};
    try { dados = await resposta.json(); } catch (_) {}

    if (!resposta.ok) {
      throw new Error(dados.mensagem || "Não foi possível criar a conta.");
    }
    mostrarMensagem("Conta criada! Redirecionando para o login...", "ok");
    setTimeout(() => (window.location.href = "../login/login.html"), 1200);
  } catch (erro) {
    mostrarMensagem(
      erro instanceof TypeError ? "Não foi possível conectar ao servidor." : erro.message,
      "erro"
    );
  } finally {
    btn.disabled = false;
  }
});
