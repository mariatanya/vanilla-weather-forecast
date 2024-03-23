function showWeather(response) {
  let temperatureElement = document.querySelector("#temp-value");
  let temperature = response.data.temperature.current;
  temperatureElement.innerHTML = Math.round(temperature);

  let cityElement = document.querySelector("#city-name");
  cityElement.innerHTML = response.data.city;

  let conditionElement = document.querySelector("#condition");
  conditionElement.innerHTML = response.data.condition.description;

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;

  let windSpeedElement = document.querySelector("#wind");
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;

  let timeElement = document.querySelector("#time");
  let now = new Date(response.data.time * 1000);
  timeElement.innerHTML = displayTime(now);

  let icon = `<img
                src="${response.data.condition.icon_url}"
                alt=""
                class="icon"
              />`;
  let iconElement = document.querySelector("#icon");
  iconElement.innerHTML = icon;

  getForecast(response.data.city);
}

function displayTime(now) {
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  let hours = now.getHours();
  if (hours < 10) {
    hours = "0" + hours;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[now.getDay()];

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "b4d4bae12atf537f223c2747of06ba2b";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function handleSearch(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  searchCity(searchInput.value);
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearch);

function getForecast(city) {
  let apiKey = "b4d4bae12atf537f223c2747of06ba2b";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

  return days[date.getDay()];
}

function displayForecast(response) {
  let forecastMarkup = "";
  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastMarkup =
        forecastMarkup +
        `<div class="row">
            <div class="column">
              <div class="forecast-day">${formatDay(day.time)}</div>
            
                <img
                  src="${day.condition.icon_url}"
                  alt=""
                  class="forecast-icon" 
                  />
               
              
              <div class="forecast-temp">
                <span class="max-temp">${Math.round(
                  day.temperature.maximum
                )} &deg; </span>
                <span class="min-temp">${Math.round(
                  day.temperature.minimum
                )} &deg;</span>
              </div>
            </div>
          </div>`;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastMarkup;
}

searchCity("Kadoma");
displayForecast();
