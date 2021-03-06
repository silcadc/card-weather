let search_form = document.getElementById("form_search_cities");
let search_input = document.getElementById("input_cities");
let cities_found = document.querySelector(".cities_found");

const API_KEY = '3411f47b3616c2d84a51b1aa965e577f';

let magnifying = document.getElementById("magnifying");
let section_cities = document.querySelector(".section_cities");

const showData_cities = async (letter) => {
    const response = await fetch("./database/cities.json")
    const responseJson = await response.json();
    let cities_list = responseJson.cities;
    if(letter != null) {
        cities_list = responseJson.cities.filter(city => city.name.startsWith(letter));
    };
    $(cities_found).find('.cities_data').remove();
    cities_list.forEach(city => {
        const item = document.createElement('li')
        item.textContent = city.name;
        item.setAttribute("class", "cities_data");
        cities_found.appendChild(item);
        search_form.style.height = "300px";
    });

    let cities_data = document.querySelectorAll(".cities_found > .cities_data");
    cities_data.forEach(city => {
        city.addEventListener("click", () => {
            let city_selected = city.innerHTML;
            search_input.value = city_selected;
        });
    });
};
showData_cities();

search_input.addEventListener("keydown", () => {
    autocomplete();
});

search_input.addEventListener("keyup", () => {
    autocomplete();
});

const search_city_selected = async (term, unit) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${term}&units=${unit}&appid=${API_KEY}`)
    const responseJson = await response.json()
    let res_city = responseJson.name;
    let code_country = responseJson.sys.country;
    console.log(code_country)
    const response_country = await fetch(`https://restcountries.com/v3.1/alpha/${code_country}`)
    const responseJson_country = await response_country.json();
    const country_name = responseJson_country[0].name.common;
    
    let res_temperature = responseJson.main.temp;

    let card_information = document.createElement("div");
    card_information.setAttribute("id", "card_information");
    let x_icon = document.createElement("h3");
    x_icon.setAttribute("class", "x_icon");
    x_icon.textContent = "X";
    let name_city = document.createElement("h2");
    name_city.setAttribute("class", "cities_found name_city");
    name_city.textContent = res_city + `, ${country_name}`;
    let temperature_number = document.createElement("div");
    temperature_number.setAttribute("id", "temperature_number");
    temperature_number.textContent = Math.trunc(res_temperature) + '??';
    let unit_div = document.createElement("div");
    unit_div.setAttribute("id", "unit_div");

    let celsius_unit = document.createElement("li");
    celsius_unit.setAttribute("class", "unit_on");
    celsius_unit.setAttribute("id", "celsius");
    celsius_unit.textContent = "C";

    let fahrenheit_unit = document.createElement("li");
    fahrenheit_unit.setAttribute("class", "unit_off");
    fahrenheit_unit.setAttribute("id", "fahrenheit");
    fahrenheit_unit.textContent = "F";

    let kelvin_unit = document.createElement("li");
    kelvin_unit.setAttribute("class", "unit_off");
    kelvin_unit.setAttribute("id", "kelvin");
    kelvin_unit.textContent = "K";

    celsius_unit.addEventListener("click", () => {
        celsius_unit.classList.remove("unit_off");
        celsius_unit.classList.add("unit_on");
        fahrenheit_unit.classList.remove("unit_on");
        fahrenheit_unit.classList.add("unit_off");
        kelvin_unit.classList.remove("unit_on");
        kelvin_unit.classList.add("unit_off");
    });

    fahrenheit_unit.addEventListener("click", () => {
        celsius_unit.classList.remove("unit_on");
        celsius_unit.classList.add("unit_off");
        fahrenheit_unit.classList.remove("unit_off");
        fahrenheit_unit.classList.add("unit_on");
        kelvin_unit.classList.remove("unit_on");
        kelvin_unit.classList.add("unit_off");
    });

    kelvin_unit.addEventListener("click", () => {
        celsius_unit.classList.remove("unit_on");
        celsius_unit.classList.add("unit_off");
        fahrenheit_unit.classList.remove("unit_on");
        fahrenheit_unit.classList.add("unit_off");
        kelvin_unit.classList.remove("unit_off");
        kelvin_unit.classList.add("unit_on");
    });

    let img_weather = document.createElement("img");
    img_weather.setAttribute("class", "img_weather");
    let description_weather = document.createElement("h2");
    description_weather.setAttribute("class", "cities_found description_weather");

    if (res_temperature <= 19) {
        img_weather.setAttribute("src", "./icons/icons/coldWeather.svg");
        description_weather.textContent = "Cold";
    } else if (res_temperature >= 19.1 && res_temperature <= 26) {
        img_weather.setAttribute("src", "./icons/icons/warmWeather.svg");
        description_weather.textContent = "Warm";
    } else if (res_temperature >= 26.1) {
        img_weather.setAttribute("src", "./icons/icons/hotWeather.svg");
        description_weather.textContent = "Hot";
    };

    let btn_update = document.createElement("button");
    btn_update.setAttribute("class", "btn_update");
    btn_update.textContent = "Update";

    btn_update.addEventListener("click", () => {
        if (celsius_unit.classList.contains("unit_on")) {
            update_card(res_city, "metric", card_information);
        } else if (fahrenheit_unit.classList.contains("unit_on")) {
            update_card(res_city, "imperial", card_information);
        } else if (kelvin_unit.classList.contains("unit_on")) {
            update_card(res_city, "standard", card_information);
        };
    });

    section_cities.appendChild(card_information);
    card_information.appendChild(x_icon);
    card_information.appendChild(name_city);
    card_information.appendChild(temperature_number);
    card_information.appendChild(unit_div);
    unit_div.appendChild(celsius_unit);
    unit_div.appendChild(fahrenheit_unit);
    unit_div.appendChild(kelvin_unit);

    card_information.appendChild(img_weather);
    card_information.appendChild(description_weather);
    card_information.appendChild(btn_update);

    // ----Delete Card---- //
    x_icon.addEventListener("click", () => {
        delete_card(card_information);
    });
};

magnifying.addEventListener("click", () => {
    search_city_selected(search_input.value, "metric");
});

const update_card = async (term, unit, card) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${term}&units=${unit}&appid=${API_KEY}`)
    const responseJson = await response.json();
    const temp_res_Json = responseJson.main.temp;
    $(card).find('#temperature_number')[0].innerText = Math.trunc(responseJson.main.temp) + '??';
    const cold_Weather_icon = "./icons/icons/coldWeather.svg";
    const hot_Weather_icon = "./icons/icons/hotWeather.svg";
    const warm_Weather_icon = "./icons/icons/warmWeather.svg";

    let cold_temperature = 19;
    let warm_temperature_minimum = 19.1;
    let warm_temperature_maximum = 26;
    let hot_temperature = 26.1;

    if (unit == "metric") {
        cold_temperature = 19;
        warm_temperature_minimum = 19.1;
        warm_temperature_maximum = 26;
        hot_temperature = 26.1;
    } else if (unit == "imperial") {
        cold_temperature = 66.2;
        warm_temperature_minimum = 66.38;
        warm_temperature_maximum = 78.8;
        hot_temperature = 78.98;
    } else if (unit == "standard") {
        cold_temperature = 292.15;
        warm_temperature_minimum = 292.25;
        warm_temperature_maximum = 299.15;
        hot_temperature = 299.25;
    };

    if (temp_res_Json <= cold_temperature) {
        $(card).find('.img_weather')[0].src = cold_Weather_icon;
        $(card).find('.description_weather')[0].textContent = "Cold"; 
    } else if (temp_res_Json >= warm_temperature_minimum && temp_res_Json <= warm_temperature_maximum) {
        $(card).find('.img_weather')[0].src = warm_Weather_icon;
        $(card).find('.description_weather')[0].textContent = "Warm";
    } else if (temp_res_Json >= hot_temperature) {
        $(card).find('.img_weather')[0].src = hot_Weather_icon;
        $(card).find('.description_weather')[0].textContent = "Hot";
    };
};

const delete_card = (card) => {
    card.remove();
};

const autocomplete = () => {
    let letter = search_input.value;
    showData_cities(letter);
}






