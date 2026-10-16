// ===== CONFIGURAÇÃO =====
// Troque pela URL do back-end que o seu grupo está fazendo.
const API_URL = "http://localhost:3000/api";

const form = document.getElementById("form-login");
const msg = document.getElementById("msg");
const usuario = document.getElementById("usuario");
const senha = document.getElementById("senha");

function mostrarMensagem(texto, tipo) {
  msg.textContent = texto;
  msg.className = "mensagem " + tipo;
}

// Mostrar/ocultar senha
document.getElementById("olho").addEventListener("click", (e) => {
  const visivel = senha.type === "text";
  senha.type = visivel ? "password" : "text";
  e.currentTarget.setAttribute("aria-label", visivel ? "Mostrar senha" : "Ocultar senha");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = form.querySelector(".btn");

  usuario.classList.toggle("invalido", !usuario.value.trim());
  senha.classList.toggle("invalido", !senha.value);
  if (!usuario.value.trim() || !senha.value) {
    return mostrarMensagem("Preencha usuário e senha.", "erro");
  }

  btn.disabled = true;
  try {
    const resposta = await fetch(API_URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario: usuario.value.trim(), senha: senha.value }),
    });
    let dados = {};
    try { dados = await resposta.json(); } catch (_) {}

    if (!resposta.ok) {
      throw new Error(dados.mensagem || "Usuário ou senha incorretos.");
    }
    // Esperado do back-end: { token: "...", usuario: { nome: "..." } }
    if (dados.token) localStorage.setItem("token", dados.token);
    if (dados.usuario) localStorage.setItem("usuario", JSON.stringify(dados.usuario));

    mostrarMensagem("Login realizado! Redirecionando...", "ok");
    setTimeout(() => (window.location.href = "../home/home.html"), 800);
  } catch (erro) {
    mostrarMensagem(
      erro instanceof TypeError ? "Não foi possível conectar ao servidor." : erro.message,
      "erro"
    );
  } finally {
    btn.disabled = false;
  }
});
