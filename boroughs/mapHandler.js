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
    // console.log(selectedMap)
  });
document
  .getElementById("btnHealthRiskBehaviorsMap")
  .addEventListener("click", () => {
    showMap("healthRiskBehaviorsMap");
    // console.log(selectedMap)
  });
document
  .getElementById("btnHealthOutcomesMap")
  .addEventListener("click", () => {
    showMap("healthOutcomesMap");
    // console.log(selectedMap)
  });
document
  .getElementById("btnScreeningRatesMap")
  .addEventListener("click", () => {
    showMap("screeningRatesMap");
    // console.log(selectedMap)
  });
document
.getElementById("btnHealthStatusMap")
.addEventListener("click", () => {
  showMap("healthStatusMap");
  // console.log(selectedMap)
});

// Show the demographicLanguageMap by default
document.addEventListener("DOMContentLoaded", () => {
  showMap("demographicLanguageMap");
  // console.log(selectedMap)
  // Put the map in the correct position after 50ms delay
  setTimeout(() => {
    maps.invalidateSize();
  }, 50);
});
