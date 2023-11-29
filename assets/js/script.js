// variable declaration and assignment
var buttonList = document.getElementById('buttonList');
var searchBtn = document.getElementById('searchBtn');
var cityNameInput = document.getElementById('city_name');
var appID = "17608614428d0ac991a9b9255cad74dd";
var currentCity = document.getElementById('city_display_rt');
var currentDate = document.getElementById('current-date');
var temp = document.getElementById('temp');
var wind = document.getElementById('wind');
var humidity = document.getElementById('humidity');
var currentWeatherIcon = document.getElementById('current-weather-icon');
var fiveDayForecast = document.getElementById('five-Day-Forecast')
var clearBtn = document.getElementById("clear");

// city object data structure
var city = {
    latitude: "",
    longitude: "",
    common_name: "",
}

const degreeSymbol = '\u00B0';

// function to get the city coordinates based on the city name the user entered
// calls subsequent helper methods to display the data on the screen
function getCityCoordinates(cityname) {
    if (cityname) {
        city.common_name = cityname; // search based on the button value in the button list
        var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city.common_name}&appid=${appID}`
    } else {
        city.common_name = cityNameInput.value; // search based on the user input
        var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city.common_name}&appid=${appID}`
    }
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // store results from the API in the city data object
            city.latitude = data[0].lat.toFixed(2);
            city.longitude = data[0].lon.toFixed(2);

            fiveDayForecast.innerHTML = "";
            displayButtons();
            get5DayForecast();
            getCurrentWeather();
        })

}

// can only be called after getCityCoordinates runs because it needs to build the API URL based on the latitudes and longitudes
function getCurrentWeather() {
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${city.latitude}&lon=${city.longitude}&appid=${appID}&units=imperial`

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            // display the weather data in the current weather div
            const iconCode = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
            currentWeatherIcon.setAttribute("src", iconUrl);

            currentCity.textContent = data.name;

            temp.textContent = data.main.temp;
            temp.textContent += `${degreeSymbol}F`
            wind.textContent = data.wind.speed;
            wind.textContent += " MPH"
            humidity.textContent = data.main.humidity;
            humidity.textContent += "%"
        })

}

// function to get the five day forecast of a city based on its latitude and longitude
function get5DayForecast() {
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.latitude}&lon=${city.longitude}&appid=${appID}&units=imperial`;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // dynamically create the HTML for each day of the five day forecast
            for (let index = 1; index < data.list.length; index += 8) {
                const element = data.list[index];
                var cardDiv = document.createElement('div');
                var cardContent = document.createElement('div');
                var fiveDayTitle = document.createElement('h6');
                var fiveDayIcon = document.createElement("img");
                var fiveDayTemp = document.createElement('h6');
                var fiveDayWind = document.createElement('h6');
                var fiveDayHumidity = document.createElement('h6');

                cardDiv.classList.add("card", "custom-card", "blue-grey", "darken-1");
                cardContent.classList.add("card-content", "white-text");

                // set date
                fiveDayTitle.textContent = element.dt_txt.split(' ')[0];

                // set icon
                var iconCode = element.weather[0].icon
                var iconSrc = `http://openweathermap.org/img/w/${iconCode}.png`;
                fiveDayIcon.setAttribute('src', iconSrc);

                // set temp
                fiveDayTemp.textContent = element.main.temp + `${degreeSymbol}F`;

                // set wind
                fiveDayWind.textContent = element.wind.speed + " MPH";


                //set humidity
                fiveDayHumidity.textContent = element.main.humidity + "%";


                // append data elements to the card content div
                cardContent.append(fiveDayTitle);
                cardContent.append(fiveDayIcon);
                cardContent.append(fiveDayTemp);
                cardContent.append(fiveDayWind);
                cardContent.append(fiveDayHumidity);

                // append to parent
                cardDiv.append(cardContent);

                // append to parent
                fiveDayForecast.append(cardDiv);
            } //end for loop
        })
}; // end function

function displayData() {
    // use jQuery to get the current date
    var now = dayjs();
    $('#current-date').text(now.format('MM-DD-YYYY'));
}

// event listener on the search button that prevents default form behavior and gets the city coordinates and displays the data
searchBtn.addEventListener('click', function (event) {
    event.preventDefault();
    getCityCoordinates();
    displayData();
});

// creates the HTML elements beneath the searched cities list
function displayButtons() {
    var localStorageData = JSON.parse(localStorage.getItem('cityNames')) || []; // variable is equal to the current items in local storage or it is an empty array.
    city.common_name = cityNameInput.value.toUpperCase();

    if (localStorageData.includes(city.common_name)) { // don't create multiple instances of the button
        console.log("City already in local storage")
    } else {
        var searchedCity = document.createElement("button");
        searchedCity.classList.add("btn", 'waves-effect', 'waves-dark', "city-button");
        searchedCity.textContent = city.common_name;
        buttonList.append(searchedCity);

        localStorageData.push(city.common_name); // pushes the latest value the user submitted into local storage
        localStorage.setItem("cityNames", JSON.stringify(localStorageData));
    }
    clearBtn.style.display = "block"; // default is display: none;

}

buttonList.addEventListener("click", function (event) {
    // Check if the clicked element is a button 
    if (event.target.tagName === 'BUTTON') {
        // Access the specific button that was clicked
        var clickedButton = event.target;

        getCityCoordinates(clickedButton.textContent);
        getCurrentWeather();
    }
})


// clear out the information in local storage as well as the previously searched cities
clearBtn.addEventListener("click", function () {
    var localStorageData = JSON.parse(localStorage.getItem('cityNames')) || [];
    if (localStorageData.length > 0) {
        localStorage.clear();
        buttonList.innerHTML = "";
        clearBtn.style.display = "none";
    } else {
        console.log('Nothing to clear.')
    }
})