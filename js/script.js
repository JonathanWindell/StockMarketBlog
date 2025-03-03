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

  // Hämta senaste inlägget
  function loadLatestPost() {
    fetch("Posts/TestPost.md")
      .then((response) => response.text())
      .then((markdown) => {
        document.getElementById("latestPostContent").innerHTML = marked.parse(markdown);
      })
      .catch((error) => console.error("Error loading post:", error));
  }

  loadLatestPost();

  // API-för valutakurser
  const API_URL = "https://v6.exchangerate-api.com/v6/9c6c15bcbf74d1b433634b86/latest/EUR";

  function displayExchangeRates(rates) {
    const ratesDiv = document.querySelector(".rates");
    ratesDiv.innerHTML = `
      <p>1 EUR = ${rates.USD} USD</p>
      <p>1 EUR = ${rates.SEK} SEK</p>
      <p>1 EUR = ${rates.NOK} NOK</p>
      <p>1 EUR = ${rates.DKK} DKK</p>
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
            NOK: data.conversion_rates.NOK,
            DKK: data.conversion_rates.DKK,
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

//Fixa artikelsidan med gamla. När ny post är uppladda så ska de bytas ut.



