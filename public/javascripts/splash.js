document.addEventListener("DOMContentLoaded", () => {
  const showOnce = false;

  if (showOnce) {
    if (sessionStorage.getItem("splashShown")) {
      hideSplashInstantly();
      return;
    }
    sessionStorage.setItem("splashShown", "yes");
  }

  const splash = document.getElementById("splash-screen");

  setTimeout(() => {
    splash.classList.add("hidden");
  }, 2000);
});

function hideSplashInstantly() {
  const splash = document.getElementById("splash-screen");
  if (splash) splash.style.display = "none";
}
