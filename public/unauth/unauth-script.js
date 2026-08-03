const form = document.querySelector("#unlock-form");
const input = document.querySelector("#pwd-input");
const unlockBtn = document.querySelector("#unlock-btn");
const statusEl = document.querySelector("#status");
const card = document.querySelector("#card");
const reqPath = document.querySelector("#req-path");

const params = new URLSearchParams(window.location.search);

let appPwd = localStorage.getItem("appPwd") || null;

reqPath.textContent = window.location.pathname;
reqPath.title = window.location.pathname;

if (params.has("auth")) {
  statusEl.textContent = "Invalid access key, please try again.";
  statusEl.classList.add("is-error");
  card.classList.add("is-shake");
  setTimeout(() => card.classList.remove("is-shake"), 500);
} else if (appPwd) {
  const target = new URL(window.location.href);
  target.searchParams.set("auth", appPwd);
  window.location.replace(target.toString());
}

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

  appPwd = pwd.trim();
  localStorage.setItem("appPwd", appPwd);

  const target = new URL(window.location.href);
  target.searchParams.set("auth", pwd);
  window.location.href = target.toString();
});
