const pwdInput = document.querySelector("#pwd-container input");
const pwdBtn = document.querySelector("#pwd-container button");

let appPwd = null;
appPwd = localStorage.getItem("appPwd") || null;

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

    appPwd = pwdInput.value.trim();
    localStorage.setItem("appPwd", appPwd);
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
  a.href = a.href + `?auth=${appPwd}`;
});

window.onload = () => {
  if (appPwd) {
    pwdInput.value = appPwd;
  }
};
