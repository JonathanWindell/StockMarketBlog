//Light & Dark mode
const lightModeBtn = document.getElementById("light-mode-btn");
const darkModeBtn = document.getElementById("dark-mode-btn");
const body = document.body;

// Kolla om användaren har sparat ett tema i localStorage och uppdatera UI
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  lightModeBtn.style.display = "none";
  darkModeBtn.style.display = "block";
}

// Funktion för att byta tema
function toggleTheme() {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    lightModeBtn.style.display = "none";
    darkModeBtn.style.display = "block";
  } else {
    localStorage.setItem("theme", "light");
    lightModeBtn.style.display = "block";
    darkModeBtn.style.display = "none";
  }
}

// Lägg till event listeners på båda knapparna
lightModeBtn.addEventListener("click", toggleTheme);
darkModeBtn.addEventListener("click", toggleTheme);
