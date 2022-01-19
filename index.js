// let weather = {
//     paris: {
//         temp: 19.7,
//         humidity: 80
//     },
//     tokyo: {
//         temp: 17.3,
//         humidity: 50
//     },
//     lisbon: {
//         temp: 30.2,
//         humidity: 20
//     },
//     "san francisco": {
//         temp: 20.9,
//         humidity: 100
//     },
//     moscow: {
//         temp: -5,
//         humidity: 20
//     }
// };

// let cityName = prompt("Enter a city");
// let cityNameLowerCase;

// if(cityName !== null) {
// cityNameLowerCase = cityName.toLowerCase();
// }


// function cityWeather() {
// let sorry = "Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+sydney";
// let count = 0;

// for(let city in weather) {
//     if(!cityName || cityName === null) {
//         alert(sorry);
//         break;
//     }
//     else {
//         if(cityNameLowerCase !== city) {
//             count++;
//             if(count === 5) {
//                 alert(sorry);
//                 break;
//             }
//         } else {
//             let celcius = Math.round(weather[`${city}`].temp);
//             let humidity = weather[`${city}`].humidity;
//             let cToF = ((celcius * 9) / 5) + 32; 
//             let cityFirstNameCapital = city[0].toUpperCase() + city.substring(1);

//            alert(`It is currently ${celcius}°C (${cToF}°F) in ${cityFirstNameCapital} with a humidity of ${humidity}%`);
//         }
//     }
// }
// }
// cityWeather();







// adding date & form features

let today = new Date();
let year = today.getFullYear();
let month = today.getMonth();
let days = today.getDate();
let day = today.getDay();

let dayOfWeekArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let monthOfYearArray = ['January', 'February', 'March','April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//get date info
let dayAndTime = document.querySelector('.weekday span');
let todayDate = document.querySelector('.weekday small');

dayAndTime.textContent = dayOfWeekArray[day];
todayDate.textContent = `${monthOfYearArray[month]} ${days}, ${year}`;


//display city searched
let searchCity = document.querySelector('.search-city .city-input');
let cityTitle = document.querySelector('.cityName h1');


searchCity.addEventListener('change', () => {
    cityTitle.textContent = searchCity.value[0].toUpperCase() + searchCity.value.slice(1);    
    if(searchCity.value) {
        getCityWeather();
        searchCity.value = '';
    }    
})


//display weather info upon main weather API
let tempNumber = document.querySelector('.tempNumber');
let desc = document.querySelector('.desc p');
let humidity = document.querySelector('.humidity-num');
let wind = document.querySelector('.wind-num');

function showWeather(response) {

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
}



// Get main weather info from open weather API

let apiKey = '7fc88c26f448c3db4496280b2ac2cb99';
let units = 'metric'

function getCityWeather() {
    let nameOfCity = cityTitle.textContent;   
    let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${nameOfCity}&appid=${apiKey}&units=${units}`;   

    axios.get(weatherApiUrl)
        .then(showWeather)
}

//display current location searched
let currentLocation = document.querySelector('.geoButton');
currentLocation.addEventListener('click', () => getCurrentPositionWeather(apiKey));   

function getCurrentPositionWeather(apiKey) {

    function handlePosition(position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let geolocationApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`          

        axios.get(geolocationApiUrl)
        .then(showWeather)
    }
    navigator.geolocation.getCurrentPosition(handlePosition);    
}


//get weather Icon
function getWeatherIcon(weatherIcon) {
    let mainIcon = document.querySelector('.weather-icon');
    mainIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherIcon}@2x.png"} alt="icon"/>`
}

// change from c to f  or f to c temp
function convertTemp(mainTemp) {
  let feh = document.querySelector('.feh');
  let cel = document.querySelector('.cel');
  let tempNumber = document.querySelector('.tempNumber');

  feh.addEventListener('click', () => {
    tempNumber.textContent =Math.round((mainTemp* 9) / 5 + 32); 
    feh.style.color = '#2b57cf';
    cel.style.color = 'black';
  })

  cel.addEventListener('click', () => {
      tempNumber.textContent = Math.round(mainTemp);
      feh.style.color = 'black';
      cel.style.color = '#2b57cf';
  })
}
    

   





