var selectedMap;

// Function to show selected map and hide other maps
function showMap(mapId) {
  const mapsElements = document.querySelectorAll(".map");
  mapsElements.forEach((map) => {
    if (map.id === mapId) {
      map.classList.add("active"); // Set selected map as active
      // Put the map in the correct position after a 50ms delay
      setTimeout(() => {
        maps[mapId].invalidateSize();
      }, 50);
    } else {
      map.classList.remove("active"); // Remove active class from other map
    }
  });

  selectedMap = maps[mapId];
}

// Event listeners for when a map is selected
document
  .getElementById("btnDemographicLanguageMap")
  .addEventListener("click", () => {
    showMap("demographicLanguageMap");
  });
document
  .getElementById("btnHealthRiskBehaviorsMap")
  .addEventListener("click", () => {
    showMap("healthRiskBehaviorsMap");
  });
document
  .getElementById("btnHealthOutcomesMap")
  .addEventListener("click", () => {
    showMap("healthOutcomesMap");
  });
document
  .getElementById("btnScreeningRatesMap")
  .addEventListener("click", () => {
    showMap("screeningRatesMap");
  });
document.getElementById("btnHealthStatusMap").addEventListener("click", () => {
  showMap("healthStatusMap");
});

// Show the demographicLanguageMap by default
document.addEventListener("DOMContentLoaded", () => {
  showMap("demographicLanguageMap");
  // Put the map in the correct position after 50ms delay
  setTimeout(() => {
    maps["demographicLanguageMap"].invalidateSize();
  }, 50);
});
