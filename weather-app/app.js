const API_KEY = "ccb937d6f9d595d624038f9407b8aade";
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const toggleUnitBtn = document.getElementById("toggleUnit");
const historyDiv = document.getElementById("history");
let unit = "metric"; // per celsius

// funksioni per ta mar motin
async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
    );

    if (!response.ok) {
      throw new Error("City not found!");
    }

    const data = await response.json();
    console.log(data);
    displayWeather(data);

    // ruajm qytetin ne localstorage
    localStorage.setItem("lastCity", city);

    updateHistory(city);
    displayHistory();
  } catch (error) {
    weatherResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

// funksioni per ta shfaq motin
function displayWeather(data) {
  const city = data.name;
  const temp = data.main.temp;
  const desc = data.weather[0].description;
  const icon = data.weather[0].icon;
  const tempMin = data.main.temp_min;
  const tempMax = data.main.temp_max;


  weatherResult.innerHTML = `
    <h2>${city}</h2>
    <img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon">
    <p>🌡 Temperature: ${temp}°${unit === "metric" ? "C" : "F"}</p>
    <p>🌥 Description: ${desc}</p>
    <p>🔽 Min: ${tempMin}°${unit === "metric" ? "C" : "F"} | 🔼 Max: ${tempMax}°${unit === "metric" ? "C" : "F"}</p>

  `;
}

// event listener per butonin e kerkimit
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    getWeather(city);
  }
});

//  kontrollojm nese ka qytet te ruajtur ne localstorage dhe e marrim motin per ate qytet
window.addEventListener("load", () => {
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    getWeather(lastCity);
  }
});

toggleUnitBtn.addEventListener("click", () => {
  unit = unit === "metric" ? "imperial" : "metric";
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    getWeather(lastCity);
  }
});

function updateHistory(city) {
  let history = JSON.parse(localStorage.getItem("history")) || [];

  if (!history.includes(city)) {
    history.push(city);

    if (history.length > 5) {
      history.shift(); // fshij qytetin me te vjeter
    }
  }

  localStorage.setItem("history", JSON.stringify(history));
}

function displayHistory() {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  historyDiv.innerHTML = "<h3>View last searched cities:</h3>";

  history.forEach(c => {
    const h5 = document.createElement("h5");
    h5.style.cursor = "pointer";
    h5.textContent = c.charAt(0).toUpperCase() + c.slice(1);
    h5.addEventListener("click", () => getWeather(c));
    historyDiv.appendChild(h5);
  });
}