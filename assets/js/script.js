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

var city = {
    latitude: "",
    longitude: "",
}


function getCityCoordinates() {
    var cityName = cityNameInput.value; // search based on the user input
    var requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${appID}`
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            city.latitude = data[0].lat.toFixed(2);
            city.longitude = data[0].lon.toFixed(2);

            get5DayForecast();
            getCurrentWeather();
        })
    var localStorageData = JSON.parse(localStorage.getItem('cityNames')) || []; // assign and parse the values in local storage to this variable or assign an empty array

    localStorageData.push(cityName); // pushes the latest value the user submitted into local storage
    localStorage.setItem("cityNames", JSON.stringify(localStorageData));

    var searchedCity = document.createElement("button")
    searchedCity.classList.add("btn", 'waves-effect', 'waves-dark')
    searchedCity.textContent = cityNameInput.value;
    buttonList.append(searchedCity);
}

console.log(city);

function getCurrentWeather() {
    var requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${city.latitude}&lon=${city.longitude}&appid=${appID}&units=imperial`

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            //var icon = '\u'+ data.weather[0].icon;

            const iconCode = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
            console.log(iconUrl);
            currentWeatherIcon.setAttribute("src", iconUrl);


            currentCity.textContent = data.name;
            const degreeSymbol = '\u00B0';


            temp.textContent = data.main.temp;
            temp.textContent += `${degreeSymbol}F`
            wind.textContent = data.wind.speed;
            wind.textContent += " MPH"
            humidity.textContent = data.main.humidity;
            humidity.textContent += "%"
        })

}

function get5DayForecast() {
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.latitude}&lon=${city.longitude}&appid=${appID}&units=imperial`;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // TODO use data from response object to populate the HTML text contents
            console.log(data)
            console.log(data.list);
            for (let index = 4; index < data.list.length; index += 8) {
                const element = data.list[index];
                console.log(element);

            }


        })


};

function displayData() {
    var now = dayjs();
    $('#current-date').text(now.format('MM-DD-YYYY'));


}

searchBtn.addEventListener('click', function (event) {
    event.preventDefault();
    getCityCoordinates();
    displayData();
});

