const form = document.querySelector("#unlock-form");
const input = document.querySelector("#pwd-input");
const unlockBtn = document.querySelector("#unlock-btn");
const statusEl = document.querySelector("#status");
const card = document.querySelector("#card");
const reqPath = document.querySelector("#req-path");
const themeToggle = document.querySelector("#theme-toggle");

themeToggle?.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
});

let appPwd = localStorage.getItem("appPwd") || null;

reqPath.textContent = window.location.pathname;
reqPath.title = window.location.pathname;

if (appPwd) {
  input.value = appPwd;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const pwd = input.value.trim();
  if (!pwd) {
    input.focus();
    return;
  }

  statusEl.textContent = "";
  statusEl.classList.remove("is-error");
  unlockBtn.classList.add("is-loading");
  unlockBtn.disabled = true;

  fetch("/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: pwd }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Invalid password");
      return res.text();
    })
    .then((data) => {
      localStorage.setItem("appPwd", data);
      window.location.reload();
    })
    .catch(() => {
      statusEl.textContent = "Invalid access key, please try again.";
      statusEl.classList.add("is-error");
      card.classList.add("is-shake");
      setTimeout(() => card.classList.remove("is-shake"), 500);
      unlockBtn.classList.remove("is-loading");
      unlockBtn.disabled = false;
    });
});
