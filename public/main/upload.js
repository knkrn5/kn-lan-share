const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
const uploadProgressBar = document.getElementById("uploadProgressBar");
const progressPercent = document.getElementById("progressPercent");
const notification = document.getElementById("notification");

const url = window.location.origin;
const uploadHint = document.querySelector(".upload-hint");

fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (uploadHint) uploadHint.textContent = file.name;
  notificationUpdater(`Selected: ${file.name}`, "info", 2000);
});

uploadButton.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("No file provided");
    return;
  }

  const preventLeave = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const cleanupBeforeUnload = () => {
    window.removeEventListener("beforeunload", preventLeave);
  };

  const xhr = new XMLHttpRequest();

  xhr.addEventListener("loadstart", () => {
    window.addEventListener("beforeunload", preventLeave);
  });

  // xhr.addEventListener("loadend", () => {
  //   window.removeEventListener("beforeunload", preventLeave);
  // });

  // xhr.addEventListener("abort", cleanupBeforeUnload);
  // xhr.addEventListener("timeout", cleanupBeforeUnload);

  // Tracking upload progress
  xhr.upload.addEventListener("progress", (event) => {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      progressUpdater(percentComplete);
    }
  });

  xhr.addEventListener("load", () => {
    try {
      if (xhr.status === 200) {
        notificationUpdater(xhr.responseText, "success", 5000);
      } else {
        notificationUpdater(
          `${xhr.status} ${xhr.statusText} ${xhr.responseText}`,
          "error",
          2000,
        );
      }
    } finally {
      cleanupBeforeUnload();
      setTimeout(() => {
        progressUpdater(0);
      }, 2000);
    }
  });

  xhr.addEventListener("error", () => {
    notificationUpdater(`Error uploading ${file.name}`, "error", 2000);
    progressUpdater(0);
    cleanupBeforeUnload();
  });

  xhr.open("POST", `${url}/upload`);
  xhr.setRequestHeader("filename", file.name);

  xhr.send(file);
  notificationUpdater(`Uploading ${file.name}`, "info", 2000);
});

function notificationUpdater(msg, tone = "info", duration = 2000) {
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

function progressUpdater(percentComplete) {
  uploadProgressBar.value = percentComplete.toFixed(2);
  progressPercent.innerText = `${percentComplete.toFixed(2)}%`;
}
