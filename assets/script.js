// Precaution to make sure HTML loads before JavaScript code runs
$(document).ready(function () {

    var cityArray;
    var apiKey = "d4eddad13454bd157378f5f6d7ef617d";
    // Retrieve present weather and place in presDiv
    var presDiv = $("#presentWeather");
    var futureForecast = $("#futureForecast");

    // Retrieve city search array from local storage if items in array, or start with an empty array
    if (localStorage.getItem("cityKey")) {
        cityArray = JSON.parse(localStorage.getItem("cityKey"));
        recordCitySearch(cityArray);
    } else {
        cityArray = [];
    };

    // Weather search for New York if local storage array is empty
    // Else weather search for last element in the array 
    console.log(cityArray);
    if (cityArray.length == 0) {
        presentWeather("New York");
        futureWeather("New York");
    } else {
        presentWeather(city = cityArray.slice(-1));
        futureWeather(city = cityArray.slice(-1));
    }
    // Retrieve weather if user clicks to Search for a city
    $("#lookupCity").click(function () {
        event.preventDefault();
        var city = $("#enterCity").val();
        presentWeather(city);
        futureWeather(city);
    });
    // Retrieve weather if user clicks on city that is in local storage array 
    $("#previousSearch").click(function () {
        var city = event.target.value;
        presentWeather(city);
        futureWeather(city);
    })
    // Retrieve present weather for city that is searched
    function presentWeather(city) {
        var queryURL1 = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=d4eddad13454bd157378f5f6d7ef617d";

        $.ajax(queryURL1)
            .then(function (response) {
                // Convert dt timestamp (GMT) to js date object 
                var presTime = new Date(response.dt * 1000);
                console.log(presTime)
                var weatherIcon = "https://openweathermap.org/img/w/" + (response.weather[0].icon) + ".png";
                console.log(response);
                presDiv.html(`
                    <h2>${response.name}, ${response.sys.country} (${presTime.getMonth() + 1}/${presTime.getDate()}/${presTime.getFullYear()})<img src=${weatherIcon} height="70px"></h2>
                    <p>Temperature: ${parseInt(response.main.temp).toFixed(1) + " &#176F"}</p>
                    <p>Humidity: ${(response.main.humidity)}%</p>
                    <p>Wind Speed: ${(response.wind.speed).toFixed(1) + " MPH"}</p>`, presentUV(response.coord))
                // Check values per variables below in console.log 
                var h2City = (response.name + ", " + response.sys.country);
                var h2Date = ((presTime.getMonth() + 1) + "/" + presTime.getDate() + "/" + presTime.getFullYear());
                var h2Icon = (response.weather[0].icon);
                var h2IconUrl = ("https://openweathermap.org/img/w/" + h2Icon + ".png");
                var h2IconImage = $("<img>").attr("src", h2Icon);
                var pTemp = (response.main.temp).toFixed(1) + " \xB0F";
                var pHum = (response.main.humidity).toFixed(0) + "%";
                var pWind = (response.wind.speed).toFixed(1) + " MPH";
                var pUvLat = (response.coord.lat);
                var pUvLon = (response.coord.lon);
                console.log("City = " + h2City);
                console.log("present Date = " + h2Date);
                console.log("Weather h2Icon = " + h2Icon);

                console.log("Temp = " + pTemp);
                console.log("Humidity = " + pHum);
                console.log("Wind Speed = " + pWind);
                console.log("UV Index latitude = " + pUvLat);
                console.log("UV Index longitude = " + pUvLon);
                // CHECK OF DUPLICATED VALUES BELOW FOR PRESENT WEATHER CONDITIONS
                // presDiv.html("<h2>" + h2City + " " + h2Date + " " + h2Icon + "</h2><br>");
                // presDiv.append("<p>Temperature: " + pTemp + "</p>");
                // presDiv.append("<p>Humidity: " + pHum + "</p>");
                // presDiv.append("<p>Wind Speed: " + pWind + "</p>");

                cityBtn(response.name);
            })
    };

    // Retrieve UV index info for city displaying present weather 
    function presentUV(coordinates) {
        var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?lat=" + coordinates.lat + "&lon=" + coordinates.lon + "&APPID=" + apiKey;

        $.ajax(queryURL2)
            .then(function (response) {
                var UvIndex = response.value;
                var uvColor = "green";

                console.log("Present UV data for: " + city);
                console.log(response);

                //Change UV background based on Index value
                if (UvIndex >= 11) {
                    uvColor = "violet";
                } else if (UvIndex >= 8) {
                    uvColor = "red";
                } else if (UvIndex >= 6) {
                    uvColor = "orange";
                } else if (UvIndex >= 3) {
                    uvColor = "yellow";
                }
                presDiv.append(`<p>UV Index: <span class=uvPadding" style="background-color: ${uvColor};">${UvIndex}</span></p>`);
                // CHECK OF UV INDEX VALUES BELOW FOR PRESENT WEATHER CONDITIONS
                console.log("Present UV Index Value = " + UvIndex)
                // presDiv.append("<p>UV Index: " + UvIndex + "</p>");
            })
    }

    // Retrieve future weather forecast for city that is searched
    function futureWeather(city) {
        var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&APPID=d4eddad13454bd157378f5f6d7ef617d";

        $.ajax(queryURL3)
            .then(function (response) {
                var forecast = response.list;

                console.log("Future forecast data for: " + city);
                console.log(response);
                
                futureForecast.empty();
                $.each(forecast, function (i) {
                    if (!forecast[i].dt_txt.includes("12:00:00")) {
                        return;
                    }
                    var forecastDate = new Date(forecast[i].dt * 1000);
                    var weatherIcon = `https://openweathermap.org/img/w/${forecast[i].weather[0].icon}.png`;
                    // Append future forecast data to create Bootstrap cards 
                    futureForecast.append(`
                        <div class="col-md">
                            <div class="card bg-primary">
                                <div class="card-body">
                                    <h4>${forecastDate.getMonth() + 1}/${forecastDate.getDate()}/${forecastDate.getFullYear()}</h4>
                                    <img src=${weatherIcon} alt="Icon">
                                    <p>Temp: ${(forecast[i].main.temp).toFixed(2) + " &#176F"}</p>
                                    <p>Humidity: ${forecast[i].main.humidity}%</p>
                                </div>
                            </div>
                        </div>`)
                })
            })
    };

    function cityBtn(city) {
        // Check if the button exists in history trimming whitespace, and if it does, exit the function
        var citySearch = city.trim();
        var buttonCheck = $(`#previousSearch > BUTTON[value='${citySearch}']`);
        if (buttonCheck.length == 1) {
            return;
        }
        // Don't add a duplicate city name to the array
        if (!cityArray.includes(city)) {
            cityArray.push(city);
            localStorage.setItem("cityKey", JSON.stringify(cityArray));
        }

        $("#previousSearch").prepend(`<button class="btn btn-light" value='${city}'>${city}</button>`);
    }

    function recordCitySearch(array) {
        $.each(array, function (i) {
            cityBtn(array[i]);
        })
    }


});