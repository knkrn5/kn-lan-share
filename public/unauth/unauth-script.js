const form = document.querySelector("#unlock-form");
const input = document.querySelector("#pwd-input");
const unlockBtn = document.querySelector("#unlock-btn");
const statusEl = document.querySelector("#status");
const card = document.querySelector("#card");
const reqPath = document.querySelector("#req-path");
const themeToggle = document.querySelector("#theme-toggle");
const notification = document.querySelector("#notification");
const appPwd = localStorage.getItem("appPwd");

themeToggle?.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
});

function notificationUpdater(msg, tone = "info", duration = 2000) {
  if (!notification) return;
  notification.classList.remove("is-info", "is-success", "is-error");
  notification.classList.add(`is-${tone}`);
  notification.innerText = msg;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
    notification.innerText = "";
    notification.classList.remove("is-info", "is-success", "is-error");
  }, duration);
}


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
      notificationUpdater("Password set successfully", "success", 1200);
      setTimeout(() => window.location.reload(), 1200);
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
