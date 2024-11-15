/* Global Variables */

const weatherBaseURL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
const serverBaseURL = 'http://localhost:3000';

//https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Bucharest?unitGroup=metric&include=current&key=xyz&contentType=json
const apiKey = "key=MYAT2B7YH4SZ45VKR3Z9YS7D4"; 
/*window.addEventListener('load', async () => {
    apiKey = `key=${(await (async () => await fetch(`../.env`).then(response => response.json()))()).API_KEY}`;
})*/

// Create a new date instance dynamically with JS
function getDate() {
    let d = new Date();
    let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();
    return newDate;
}

async function fetchWeather(weatherBaseURL, apiKey, zip) {
    const urlRetrieveOptins = 'unitGroup=metric&include=current';
    const urlContentType = 'contentType=json';
    const url = `${weatherBaseURL}${zip}?${urlRetrieveOptins}&${apiKey}&${urlContentType}`;
    const response = await fetch(url);
    try {
        return (await response.json()).currentConditions.temp;
    } catch(err) {
        console.log(err);
    }
}

async function postEntry(path, data) {
    const response = await fetch(path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    });
    try {
        return await response.json();
    } catch(err) {
        console.log(err);
    }
}

async function getEntry(path) {
    const response = await fetch(path);
    try {
        return await response.json();
    } catch(err) {
        console.log(err);
    }
}


async function generateWeatherEntry() {
    return fetchWeather(weatherBaseURL, apiKey, document.querySelector('#zip').value)
    .then(temperature => postEntry(`${serverBaseURL}/data`,{temperature: temperature, date: getDate(), userResponse: document.querySelector('#feelings').value}))
    .then(res => getEntry(`${serverBaseURL}/data`))
    .then(data => {
        document.querySelector('#content').innerText = data.userResponse;
        document.querySelector('#temp').innerText = data.temperature;
        document.querySelector('#date').innerText = data.date;
    })
    .catch(err => console.log(err));
}

function createNewEntry() {
    generateWeatherEntry();
}

document.querySelector('#generate').addEventListener('click', createNewEntry);