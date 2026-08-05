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

pwdBtn.addEventListener("click", () => {
  if (clickTimer) clearTimeout(clickTimer);

  clickTimer = setTimeout(() => {
    console.log("single click");
    clickTimer = null;

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
        // appPwd = data;
        localStorage.setItem("appPwd", data);

        // console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });

    // localStorage.setItem("appPwd", appPwd);
    window.location.reload();

    console.log(appPwd);
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

  console.log("double click");
});

document.querySelectorAll("#dirs a").forEach((a) => {
  if (!appPwd) return;
  const u = new URL(a.getAttribute("href"), window.location.origin);
  u.searchParams.set("auth", appPwd);
  a.href = u.pathname + u.search;
});

window.onload = () => {
  if (appPwd) {
    pwdInput.value = appPwd;
  }
};
