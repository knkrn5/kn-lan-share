const pwdForm = document.querySelector("#pwd-container");
const pwdInput = document.querySelector("#app-pwd-input");
const pwdBtn = document.querySelector("#pwd-container button");
const themeToggle = document.querySelector("#theme-toggle");
const notification = document.querySelector("#notification");

let appPwd = null;
// appPwd = localStorage.getItem("appPwd") || null;

themeToggle?.addEventListener("click", () => {
  const next =
    document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
});

//button click and double click handling
let clickTimer = null;

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

function submitPassword() {
  if (!pwdInput.value) {
    alert("Password cannot be empty");
    return;
  }

  const enteredPwd = pwdInput.value.trim();

  fetch("/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: enteredPwd }),
  })
    .then((res) => res.text())
    .then((data) => {
      notificationUpdater("Password set successfully", "success", 2500);
      if (document.querySelector("#req-path")) {
        setTimeout(() => window.location.reload(), 1200);
      }
    })
    .catch((err) => {
      console.error(err);
      notificationUpdater("Failed to set password", "error", 2500);
    });

}

pwdForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (clickTimer) clearTimeout(clickTimer);
  clickTimer = setTimeout(() => {
    clickTimer = null;
    submitPassword();
  }, 250);
});

pwdBtn.addEventListener("dblclick", () => {
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }

  pwdInput.type = "text";
  setTimeout(() => {
    pwdInput.type = "password";
  }, 2000);
});
