const pwdForm = document.querySelector("#pwd-container");
const pwdInput = document.querySelector("#pwd-input");
const pwdBtn = document.querySelector("#pwd-container button");
const themeToggle = document.querySelector("#theme-toggle");

let appPwd = null;
appPwd = localStorage.getItem("appPwd") || null;

themeToggle?.addEventListener("click", () => {
  const next =
    document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
});

//button click and double click handling
let clickTimer = null;

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
      localStorage.setItem("appPwd", data);
    })
    .catch((err) => {
      console.error(err);
    });

  window.location.reload();
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

window.onload = () => {
  if (appPwd) {
    pwdInput.value = appPwd;
  }
};
