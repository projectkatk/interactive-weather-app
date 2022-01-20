
let todayDate = document.querySelector('.weekday small');
let dayToday = document.querySelector('.weekday span')

//display city searched
let searchCity = document.querySelector('.search-city .city-input');
let cityTitle = document.querySelector('.cityName h1');
let referCity = document.querySelector('.referCity');
let dayInfo = document.querySelector('.day-info');

let feh = document.querySelector('.feh');
let cel = document.querySelector('.cel');
let tempNumber = document.querySelector('.tempNumber');

let forecast = document.querySelector('#forecast');

let apiKey = '7fc88c26f448c3db4496280b2ac2cb99';
let units = 'metric';

let dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];



searchCity.addEventListener('change', () => {
    cityTitle.textContent = searchCity.value[0].toUpperCase() + searchCity.value.slice(1);  
    main.style.background = 'linear-gradient(to bottom, #3c7aff93,#608dee93,#8cd8d88e, #eef1f38e)';  
    main.style.color = '#000';
    cel.style.color = '#416fec';
    feh.style.color = '#000';

    if(searchCity.value) {
        getCityWeather();
        searchCity.value = '';
    }        
})


//display weather info upon main weather API
let desc = document.querySelector('.desc p');
let humidity = document.querySelector('.humidity-num');
let wind = document.querySelector('.wind-num');
let temperature = document.querySelector('.tempNumber');
let main = document.querySelector('.main')


function changeBgColor(timeOfDay) {
    if(timeOfDay > 18 || timeOfDay < 5) {
        main.style.background = 'linear-gradient(to bottom, #182755a9, #000)';
        main.style.color = '#fff'
    } else {
        main.style.background = 'linear-gradient(to bottom, #3c7aff93,#608dee93,#8cd8d88e, #eef1f38e)';  
        main.style.color = '#000';
    }     
}

// show the entire weather info including main & forecast

function showWeather(response) {
    //time management
    let lon = response.data.coord.lon;
    let lat = response.data.coord.lat;
    let dt = response.data.dt;
    let localTime = new Date(dt*1000);
    let utcHour = localTime.getUTCHours();
    let utcMin = localTime.getUTCMinutes();
    let convertToHour = Math.floor(lon / 0.004167 / 3600);
    let convertToMin = Math.floor((lon / 0.004167 / 3600 - convertToHour) * 60);
    let thatLocalHour = utcHour + convertToHour;
    let thatLocalMin = utcMin + convertToMin;


    if(thatLocalMin >= 60) {
        thatLocalMin = thatLocalMin - 60;
        if(thatLocalMin < 10) {
            thatLocalMin = `0${thatLocalMin}`;
        }
        thatLocalHour++;
    }
    changeBgColor(thatLocalHour);

    
    //cityName
    cityTitle.textContent = response.data.name;
    
    // temperature
    tempNumber.textContent = Math.round(response.data.main.temp);
    convertTemp(response.data.main.temp); //conver temp from c to f vice versa
    
    // description
    desc.textContent = response.data.weather[0].main;

    //humidity
    humidity.textContent = `${response.data.main.humidity}%`;

    //wind
    wind.textContent = `${response.data.wind.speed} m/s`
    if(response.data.wind > 20) {
        wind.style.color = "red";
    }
    //icon
    getWeatherIcon(response.data.weather[0].icon); //display main weather icon

    //show the city name above "Today"
    referCity.textContent = cityTitle.textContent;
    let badge = `<span class="badge badge-pill badge-info">Now</span>`
    referCity.insertAdjacentHTML("beforeend", badge)


    //display forecast
    if(forecast.innerHTML === null) {
        getForecast(apiKey, lat, lon);        
    } else {
        forecast.innerHTML = '';
        getForecast(apiKey, lat, lon);
    }
}



// Get main weather info from open weather API==================================================================

function getCityWeather() {
    let nameOfCity = cityTitle.textContent;   
    let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${nameOfCity}&appid=${apiKey}&units=${units}`;   

    axios.get(weatherApiUrl)
        .then(showWeather)
}
// ================================================================================================================


//display current location searched to obtain latitude & longitude
let currentLocation = document.querySelector('.geoButton');

currentLocation.addEventListener('click', () => getCurrentPositionWeather(apiKey));   

//geolocation API to get latitude & longitude
// call showWeather once location has been obtained

function getCurrentPositionWeather(apiKey) {
        
    function handlePosition(position) {
        let localHour = new Date(position.timestamp).getHours();
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let geolocationApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`     
        changeBgColor(localHour);

        axios.get(geolocationApiUrl)
        .then(showWeather)
    }
    navigator.geolocation.getCurrentPosition(handlePosition);    
}

// ============== small details cush as weather icons, temp conversions ==========================//

//get weather Icon
function getWeatherIcon(weatherIcon) {
    let mainIcon = document.querySelector('.weather-icon');
    mainIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png"} alt="icon"/>`
}

// change from c to f  or f to c temp
function convertTemp(mainTemp) {
  

  feh.addEventListener('click', () => {
    tempNumber.textContent =Math.round((mainTemp* 9) / 5 + 32); 
    feh.style.color = '#416fec';
    cel.style.color = 'black';    
  })

  cel.addEventListener('click', () => {
      tempNumber.textContent = Math.round(mainTemp);
      feh.style.color = 'black';
      cel.style.color = '#416fec';
  })
}

// forecast management===================================================================

function showForecast(response) {
    let forecastArray = response.data.daily;
    let current = response.data;

    let currentTime = new Date().toLocaleString("en-US", {weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: `${current.timezone}`}); // get local time through conversion

    todayDate.textContent = `${currentTime}`;    

    displayForecast(current, forecastArray);    
}


function displayForecast(current, forecastArray) {
    for(let i = 1; i < forecastArray.length-2; i++) {
        let forecastDay = new Date(forecastArray[i].dt*1000).toLocaleString("en-US", {weekday: 'short', timeZone: `${current.timezone}`});
        let forecastDate = new Date(forecastArray[i].dt*1000).toLocaleString("en-US", {day: '2-digit', timeZone:`${current.timezone}` });
        let forecastMonth = new Date(forecastArray[i].dt*1000).toLocaleString("en-US", {month: 'short', timeZone:`${current.timezone}`});
        let forecastIcon = forecastArray[i].weather[0].icon;

        let forecastHTML =  `<div class="forecast">
                            <img src="http://openweathermap.org/img/wn/${forecastIcon}@2x.png"} alt="icon"/>
                            <div class="forecast-des">
                                <span class="dayOne dayofWeek">${forecastDay}</span>
                                <span class="dayOne-date date">${forecastDate} ${forecastMonth}</span>
                                <p class="f-temp dayOne-temp">Min: ${forecastArray[i].temp.min}°    Max: ${forecastArray[i].temp.max}°</p>
                            </div>
                        </div>`
        forecast.innerHTML += forecastHTML;
    }
}

//get forecast data through all in one API
function getForecast(apiKey, lat, lon) {
    let forecastURL =  `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=${units}&appid=${apiKey}`
    
    axios.get(forecastURL)
     .then(showForecast)   
 }

   





