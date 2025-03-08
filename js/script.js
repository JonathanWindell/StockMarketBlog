window.onload = function () {
  // Update date and time
  function updateDateTime() {
    var dt = new Date();
    var options = { weekday: "long", day: "numeric", month: "long" };
    var formattedDate = dt.toLocaleDateString("sv-SE", options);
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    document.getElementById("dateTime").innerHTML = formattedDate;
  }

  updateDateTime();
  setInterval(updateDateTime, 1000);

  //Function for loading and showing latest post index.html
  function loadLatestPost() {
    fetch("Posts.json")
      .then((response) => response.json())
      .then((posts) => {
        if (posts.length === 0) return;

        //Sort posts so latest is first
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

//Function for loading and showing older posts
  function loadOlderPosts() {
    fetch("Posts.json")
      .then((response) => response.json())
      .then((posts) => {
        if (posts.length === 0) return;

        //Sort posts based on which is first
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        const olderPostsList = document.getElementById("olderPostsList");
        olderPostsList.innerHTML = ""; //Clear older posts

        //Loop to create headline
        for (let i = 1; i < posts.length; i++) { //Start from index 1 and jump over latest post
          const post = posts[i];

          //Create a list
          const listItem = document.createElement("li");
          const titleButton = document.createElement("button");
          titleButton.textContent = post.title;
          titleButton.classList.add("dropdown-btn");

          //Create a div för context. Hidden from start
          const contentDiv = document.createElement("div");
          contentDiv.classList.add("dropdown-content");
          contentDiv.style.display = "none";

          //Click function to load page
          titleButton.addEventListener("click", () => {
            if (contentDiv.innerHTML === "") { //If context already loaded
              fetch(post.file)
                .then((response) => response.text())
                .then((markdown) => {
                  contentDiv.innerHTML = marked.parse(markdown);
                  contentDiv.style.display = "block"; //Show context
                })
                .catch((error) => console.error("Error loading post:", error));
            } else {
              //Change context
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

//Call functions on both html sides
  if (document.getElementById("latestPostTitle")) {
    loadLatestPost(); // Ladda senaste inlägg för index.html
  }

  if (document.getElementById("olderPostsList")) {
    loadOlderPosts(); //Load older posts in older_post.html
  }

  // API for currency exchange
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




