window.onload = function () {
  // Uppdatera datum och tid
  function updateDateTime() {
    var dt = new Date();
    var options = { weekday: "long", day: "numeric", month: "long" };
    var formattedDate = dt.toLocaleDateString("sv-SE", options);
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    document.getElementById("dateTime").innerHTML = formattedDate;
  }

  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Funktion för att ladda och visa senaste inlägget på index.html
  function loadLatestPost() {
    fetch("Posts.json")
      .then((response) => response.json())
      .then((posts) => {
        if (posts.length === 0) return;

        // Sortera inläggen så att det senaste är först
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        const latestPost = posts[0]; // Det senaste inlägget är nu först
        document.getElementById("latestPostTitle").textContent = latestPost.title;

        fetch(latestPost.file)
          .then((response) => response.text())
          .then((markdown) => {
            document.getElementById("latestPostContent").innerHTML = marked.parse(markdown);
          })
          .catch((error) => console.error("Error loading latest post:", error));
      })
      .catch((error) => console.error("Error loading posts.json:", error));
  }

// Funktion för att ladda och visa äldre inlägg på older_posts.html
  function loadOlderPosts() {
    fetch("Posts.json")
      .then((response) => response.json())
      .then((posts) => {
        if (posts.length === 0) return;

        // Sortera inläggen så att det senaste är först
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        const olderPostsList = document.getElementById("olderPostsList");
        olderPostsList.innerHTML = ""; // Rensa tidigare listade inlägg

        // Loop för att skapa rubriker för äldre inlägg
        for (let i = 1; i < posts.length; i++) { // Börja från index 1 för att hoppa över det senaste inlägget
          const post = posts[i];

          // Skapa en listpunkt med en knapp
          const listItem = document.createElement("li");
          const titleButton = document.createElement("button");
          titleButton.textContent = post.title;
          titleButton.classList.add("dropdown-btn");

          // Skapa en div för innehållet (gömt från början)
          const contentDiv = document.createElement("div");
          contentDiv.classList.add("dropdown-content");
          contentDiv.style.display = "none";

          // Klick-funktion för att ladda och visa innehåll
          titleButton.addEventListener("click", () => {
            if (contentDiv.innerHTML === "") { // Om innehållet inte redan är laddat
              fetch(post.file)
                .then((response) => response.text())
                .then((markdown) => {
                  contentDiv.innerHTML = marked.parse(markdown);
                  contentDiv.style.display = "block"; // Visa innehållet
                })
                .catch((error) => console.error("Error loading post:", error));
            } else {
              // Växla visning av innehåll
              contentDiv.style.display = contentDiv.style.display === "none" ? "block" : "none";
            }
          });

          listItem.appendChild(titleButton);
          listItem.appendChild(contentDiv);
          olderPostsList.appendChild(listItem);
        }
      })
      .catch((error) => console.error("Error loading posts.json:", error));
  }

// Anropa funktionerna på respektive sidor
  if (document.getElementById("latestPostTitle")) {
    loadLatestPost(); // Ladda senaste inlägg för index.html
  }

  if (document.getElementById("olderPostsList")) {
    loadOlderPosts(); // Ladda äldre inlägg för older_posts.html
  }

  // API-för valutakurser
  const API_URL = "https://v6.exchangerate-api.com/v6/9c6c15bcbf74d1b433634b86/latest/EUR";

  function displayExchangeRates(rates) {
    const ratesDiv = document.querySelector(".rates");
    ratesDiv.innerHTML = `
      <p>1 EUR: ${rates.USD} USD</p>
      <p>1 EUR: ${rates.SEK} SEK</p>
    `;
  }

  function fetchExchangeRates() {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (data.result === "success") {
          const rates = {
            EUR: data.conversion_rates.EUR,
            USD: data.conversion_rates.USD,
            SEK: data.conversion_rates.SEK,
            //NOK: data.conversion_rates.NOK,
            //DKK: data.conversion_rates.DKK,
          };

          localStorage.setItem(
            "exchangeRates",
            JSON.stringify({
              rates: rates,
              lastUpdated: Date.now(),
            })
          );

          console.log("Hämtade nya valutakurser:", rates);
          displayExchangeRates(rates);
        }
      })
      .catch((error) => console.error("Fel vid hämtning av API:", error));
  }

  function getExchangeRates() {
    const storedData = localStorage.getItem("exchangeRates");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const oneDay = 24 * 60 * 60 * 1000;

      if (Date.now() - parsedData.lastUpdated < oneDay) {
        console.log("Använder lagrade valutakurser:", parsedData.rates);
        displayExchangeRates(parsedData.rates);
        return;
      }
    }

    fetchExchangeRates();
  }

  getExchangeRates();
};




