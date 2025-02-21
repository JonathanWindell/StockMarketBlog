//Light & Dark mode
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const body = document.body;

// Kontrollera om användaren har ett sparat tema
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  themeIcon.src = "img/ToggleIconOn.png"; // Sätter mörkt tema-ikon
}

// Funktion för att växla tema och ikon
function toggleTheme() {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    themeIcon.src = "img/ToggleIconOn.png"; // Mörkt tema-ikon
  } else {
    localStorage.setItem("theme", "light");
    themeIcon.src = "img/ToggleIconOff.png"; // Ljust tema-ikon
  }
}

// Lägg till event listeners på båda knapparna
themeToggleBtn.addEventListener("click", toggleTheme);

