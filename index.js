let APIkey = "570946d91ba7a0c6f87c2e7d33da2971";


const dateTime = document.querySelector(".dateTime");
const map = document.querySelector(".map");
const liveLocation = document.getElementById("liveLocation");

const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function setTimeAsPerZone(timeStamp, timezone) {
  const newDate = new Date((timeStamp + timezone) * 1000);

  let hours = newDate.getUTCHours();
  let minutes = newDate.getUTCMinutes();

  let hoursIn12HrFormat = hours >= 13 ? hours % 12 : hours;

  let ampm = hours >= 12 ? "pm" : "am";

  const currentTime =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    `${ampm}`;

  //console.log(currentTime);

  return currentTime;
}

function setDateAsPerZone(timeStamp, timezone) {
  const newDate = new Date((timeStamp + timezone) * 1000);

  let day = days[newDate.getUTCDay()];
  let month = months[newDate.getUTCMonth()];
  let date = newDate.getUTCDate();

  const currentDate = `${day} ${month}${date}`;
  return currentDate;
}

//Function to get Data by Search a CityName
async function getDataBySearch() {
  let city = document.getElementById("query").value;

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`;
  try {
    let res = await fetch(url);
    let data = await res.json();
    //console.log(data);
    appendSearchedCity(data);
    weeklyForecast(data.coord.lat, data.coord.lon);
    map.style.display = "block";
  } catch (error) {
    console.log(error);
    const container = document.querySelector(".weatherInfo");

    return (
      (container.innerHTML = `<h1>Invalid City Name</h1>`),
      (map.style.display = "none")
    );
  }
}

function appendSearchedCity(data) {
  const container = document.querySelector(".weatherInfo");

  container.innerHTML = null;
  container.style.border = "1px solid #eee";
  container.style.background = "rgba(24, 24, 27, 0.6)";

  let url = `https://maps.google.com/maps?q=${data.name},&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  let update = document.createElement("p");
  update.innerText = `Last updated at : -`;

  let dateTimeCity = document.createElement("div");
  dateTimeCity.setAttribute("class", "dateTimeCity");
  let dateTime = document.createElement("h2");
  dateTime.innerText =
    setTimeAsPerZone(data.dt, data.timezone) +
    ", " +
    setDateAsPerZone(data.dt, data.timezone);

  let city = document.createElement("h1");
  city.innerText = `${data.name}, ${data.sys.country}`;

  dateTimeCity.append(dateTime, city);

  let tempDiv = document.createElement("div");
  tempDiv.setAttribute("class", "tempDiv");

  let cloudImg = document.createElement("img");
  cloudImg.src = `./Images/weather_icons/${data.weather[0].icon}.png`;

  let temp = document.createElement("h1");
  temp.innerText = `${data.main.temp}°C`;

  tempDiv.append(cloudImg, temp);

  let feelDesc = document.createElement("h3");
  feelDesc.innerText = `Feels like: ${data.main.feels_like}°C, ${data.weather[0].description}`;
  feelDesc.style.fontSize = "18px";

  let infoDiv = document.createElement("div");
  infoDiv.setAttribute("class", "infoDiv");

  let maxMinTempDiv = document.createElement("div");
  let tempmax = document.createElement("p");
  tempmax.innerText = `Max temp:- ${data.main.temp_max}°C`;
  let tempmin = document.createElement("p");
  tempmin.innerText = `Min temp:- ${data.main.temp_min}°C`;
  maxMinTempDiv.append(tempmax, tempmin);

  let windHumidityDiv = document.createElement("div");
  let windData = document.createElement("p");
  windData.innerText = `Wind data:- {Speed:- ${data.wind.speed}mph, Deg:- ${data.wind.deg}°}`;
  let humidity = document.createElement("p");
  humidity.innerText = `Humidity:- ${data.main.humidity}%`;
  windHumidityDiv.append(windData, humidity);

  let sunRiseSetDiv = document.createElement("div");
  let sunrise = document.createElement("p");
  sunrise.innerText = `Sunrise:- ${setTimeAsPerZone(
    data.sys.sunrise,
    data.timezone
  )}`;
  let sunset = document.createElement("p");
  sunset.innerText = `Sunset:- ${setTimeAsPerZone(
    data.sys.sunset,
    data.timezone
  )}`;
  sunRiseSetDiv.append(sunrise, sunset);

  infoDiv.append(maxMinTempDiv, windHumidityDiv, sunRiseSetDiv);

  container.append(update, dateTimeCity, tempDiv, feelDesc, infoDiv);

  let iframe = document.getElementById("gmap_canvas");
  iframe.src = url;
}

function getLocation() {
  document.getElementById("query").value = "";
  navigator.geolocation.getCurrentPosition(success);

  function success(position) {
    const crd = position.coords;

    // console.log("Your current position is:");
    // console.log(`Latitude : ${crd.latitude}`);
    // console.log(`Longitude: ${crd.longitude}`);
    // console.log(`More or less ${crd.accuracy} meters.`);
    getWeatherOnLocation(crd.latitude, crd.longitude);
  }
}

async function getWeatherOnLocation(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`;

  let res = await fetch(url);
  let data = await res.json();
  //console.log(data);
  appendSearchedCity(data);
  weeklyForecast(lat, lon);
}
window.addEventListener("load", getLocation());

async function weeklyForecast(latitude, longitude) {
    const APIKey = "570946d91ba7a0c6f87c2e7d33da2971";
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${APIKey}`;
    
    console.log("url", url);
    
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch forecast data");
      }
      const data = await res.json();
      showWeeklyData(data.list);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }
  }
  
  function showWeeklyData(data) {
    const container = document.querySelector(".weeklyForecast");
    container.innerHTML = "";
  
    const groupedForecast = groupForecastByDay(data);
  
    groupedForecast.forEach(([day, forecasts]) => {
      const div = document.createElement("div");
      div.classList.add("forecast-day");
  
      const heading = document.createElement("h2");
      heading.innerText = day;
      div.appendChild(heading);
  
      // Selecting weather data for one time per day
      const selectedForecast = selectForecastForOneTime(forecasts);
  
      const timeStamp = selectedForecast.dt;
      const dayOfWeek =
        days[new Date(timeStamp * 1000).getDay()] + ", " +
        months[new Date(timeStamp * 1000).getMonth()] + " " +
        new Date(timeStamp * 1000).getDate();
  
      const weekDay = document.createElement("h4");
      weekDay.innerText = dayOfWeek;
  
      const image = document.createElement("img");
      image.src = `https://openweathermap.org/img/wn/${selectedForecast.weather[0].icon}.png`;
  
      const weatherDescription = document.createElement("p");
      weatherDescription.innerText = `Weather: ${selectedForecast.weather[0].description}`;
  
      const dayTemp = document.createElement("p");
      dayTemp.innerText = `Day:- ${(selectedForecast.main.temp - 273.15).toFixed(1)}°C`;
  
      const nightTemp = document.createElement("p");
      nightTemp.innerText = `Night:- ${(selectedForecast.main.temp - 273.15).toFixed(1)}°C`;
  
      const forecastDiv = document.createElement("div");
      forecastDiv.classList.add("forecast-item");
      forecastDiv.append(weekDay, image, weatherDescription, dayTemp, nightTemp);
      div.appendChild(forecastDiv);
  
      container.appendChild(div);
    });
  }
  
  function groupForecastByDay(data) {
    const groupedForecast = {};
    data.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "long" });
      if (!groupedForecast[day]) {
        groupedForecast[day] = [];
      }
      groupedForecast[day].push(forecast);
    });
    return Object.entries(groupedForecast);
  }
  
  function selectForecastForOneTime(forecasts) {
    // Selecting the forecast closest to noon (12 PM)
    const targetTime = 12; // 12 PM
    const targetIndex = forecasts.findIndex((forecast) => {
      const hour = new Date(forecast.dt * 1000).getHours();
      return hour >= targetTime;
    });
    // If no forecast found for 12 PM or later, select the last forecast of the day
    return targetIndex !== -1 ? forecasts[targetIndex] : forecasts[forecasts.length - 1];
  }
  

  