var buttonList = document.getElementById('buttonList');
var searchBtn = document.getElementById('searchBtn');
var cityNameInput = document.getElementById('city_name');
var appID = "17608614428d0ac991a9b9255cad74dd";
var currentCity = document.getElementById('city_display_rt');
var currentDate = document.getElementById('current-date');
var temp = document.getElementById('temp');


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
            console.log(data)
            city.latitude = data[0].lat.toFixed(2);
            city.longitude = data[0].lon.toFixed(2);
            //console.log(city.latitude);
            //console.log(city.longitude);
            getWeatherData();
        })
    var localStorageData = JSON.parse(localStorage.getItem('cityNames')) || []; // assign and parse the values in local storage to this variable or assign an empty array

    localStorageData.push(cityName); // pushes the latest value the user submitted into local storage
    localStorage.setItem("cityNames", JSON.stringify(localStorageData));

    var searchedCity = document.createElement("button")
    searchedCity.classList.add("btn", 'waves-effect', 'waves-dark')
    searchedCity.textContent = cityNameInput.value;
    buttonList.append(searchedCity);
}

function getWeatherData() {
    console.log(city.latitude);
    console.log(city.longitude);
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.latitude}&lon=${city.longitude}&appid=${appID}`;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            currentCity.textContent = data.city.name;
            temp.textContent = data.list[0].main.temp;
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

