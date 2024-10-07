// Define temperature gradients
const temperatureGradients = {
  cold: 'linear-gradient(to right, #5da9e9, #c2e9fb)', // Soft blue to soft white for cold weather
  cool: 'linear-gradient(to right, #84fab0, #8fd3f4)', // Mint green for cool weather
  mild: 'linear-gradient(to right, #ff7f50, #fff68f)', // Coral peach to light yellow for mild weather
  warm1: 'linear-gradient(to right, #fbc2eb, #f68084)', // Soft lavender to pink for 15-20 degrees
  warm2: 'linear-gradient(to right, #ff5f6d, #ffc371)', // Soft pink to golden orange for 20-25 degrees
  warm3: 'linear-gradient(to right, #a75c66, #ff7070)', // Softer maroon to vibrant red for 25-30 degrees
  hot: 'linear-gradient(to right, #c65d0a, #f8c471)', // Softer sunset gradient for hot weather (over 30 degrees)





 

};

let currentCity = "";

// Function to change background gradient based on temperature
function changeBackground(temperature) {
  let gradient;

  // Determine which gradient to use based on temperature
  if (temperature < 10) {
    gradient = temperatureGradients.cold; // Cold
  } else if (temperature >= 10 && temperature < 15) {
    gradient = temperatureGradients.cool; // Cool
  } else if (temperature >= 15 && temperature < 20) {
    gradient = temperatureGradients.warm1; // Warm 1 (Soft lavender to pink)
  } else if (temperature >= 20 && temperature < 25) {
    gradient = temperatureGradients.warm2; // Warm 2 (Soft pink to golden orange)
  } else if (temperature >= 25 && temperature < 30) {
    gradient = temperatureGradients.warm3; // Warm 3 (Deep purple to vibrant red)
  } else {
    gradient = temperatureGradients.hot; // Hot (over 30 degrees, sunset gradient)
  }

  document.body.style.background = gradient;
}



// Function to display weather information
function showWeather(response) {
  let temperatureElement = document.querySelector("#temp-value");
  let temperature = response.data.temperature.current;
  temperatureElement.innerHTML = Math.round(temperature);

  let cityElement = document.querySelector("#city-name");
  let newCity = response.data.city; // Get the new city from the API response

  // Check if the new city is different from the current city
  if (newCity.toLowerCase() !== currentCity.toLowerCase()) {
    currentCity = newCity; // Update the current city
    changeBackground(temperature); // Change the background based on the new temperature
  }

  cityElement.innerHTML = newCity;

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

  getForecast(newCity);
}

// Function to display the current time
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

// Function to search and fetch city weather data
function searchCity(city) {
  let apiKey = "b4d4bae12atf537f223c2747of06ba2b";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

// Handle search form submit
function handleSearch(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-input");
  searchCity(searchInput.value);
}

// Add event listener to the search form
let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearch);

// Function to get forecast data
function getForecast(city) {
  let apiKey = "b4d4bae12atf537f223c2747of06ba2b";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

// Function to format days for the forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  return days[date.getDay()];
}

// Function to display forecast data
function displayForecast(response) {
  let forecastMarkup = "";
  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastMarkup +=
        `<div class="row">
            <div class="column">
              <div class="forecast-day">${formatDay(day.time)}</div>
                <img
                  src="${day.condition.icon_url}"
                  alt=""
                  class="forecast-icon" 
                />
              <div class="forecast-temp">
                <span class="max-temp">${Math.round(day.temperature.maximum)} &deg; </span>
                <span class="min-temp">${Math.round(day.temperature.minimum)} &deg;</span>
              </div>
            </div>
          </div>`;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastMarkup;
}

// Initial city search when the page loads
searchCity("Kadoma");

