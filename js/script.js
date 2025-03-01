window.onload = function() {
  // Uppdatera datum och tid
  function updateDateTime() {
    var dt = new Date();
    var options = { weekday: 'long', day: 'numeric', month: 'long' };
    var formattedDate = dt.toLocaleDateString('sv-SE', options);
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    document.getElementById("dateTime").innerHTML = formattedDate;
  }

  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Hämta senaste inlägget
  function loadLatestPost() {
    fetch('Posts/TestPost.md')  // Se till att filen finns i rätt mapp
      .then(response => response.text())
      .then(markdown => {
        document.getElementById('latestPostContent').innerHTML = marked.parse(markdown);
      })
      .catch(error => console.error("Error loading post:", error));
  }

  loadLatestPost();
};

//Fixa artikelsidan med gamla. När ny post är uppladda så ska de bytas ut.



