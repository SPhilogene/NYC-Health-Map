const aboutLink = document.getElementById("about-link");
const aboutPopup = document.getElementById("about-popup");
const closeBtn = document.querySelector("#about-popup .close-btn");
const overlay = document.getElementById("overlay");

// When clicked, display the overlay and the about popup
aboutLink.addEventListener("click", (e) => {
  overlay.style.display = "block";
  aboutPopup.style.display = "block";
});

// When clicked, hide the overlay and the about popup
closeBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  aboutPopup.style.display = "none";
});

// When clicked, hide the overlay and the about popup
overlay.addEventListener("click", () => {
  overlay.style.display = "none";
  aboutPopup.style.display = "none";
});
