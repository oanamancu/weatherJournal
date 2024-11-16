/* Global Variables */

const weatherBaseURL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
const serverBaseURL = 'http://localhost:3000';

//https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Bucharest?unitGroup=metric&include=current&key=xyz&contentType=json
const apiKey = 'MYAT2B7YH4SZ45VKR3Z9YS7D4&units=imperial';
/*window.addEventListener('load', async () => {
    apiKey = `key=${(await (async () => await fetch(`../.env`).then(response => response.json()))()).API_KEY}`;
})*/

// Create a new date instance dynamically with JS
function getDate() {
    let d = new Date();
    let newDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
    return newDate;
}

async function fetchWeather(weatherBaseURL, apiKey, zip) {
    const urlRetrieveOptins = 'unitGroup=metric&include=current';
    const urlContentType = 'contentType=json';
    const url = `${weatherBaseURL}${zip}?${urlRetrieveOptins}&key=${apiKey}&${urlContentType}`;
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


const retrieveData = async () =>{
    const request = await fetch('/all');
    try {
    // Transform into JSON
    const allData = await request.json()
    console.log(allData)
    // Write updated data to DOM elements
    document.getElementById('temp').innerHTML = Math.round(allData.temp)+ 'degrees';
    document.getElementById('content').innerHTML = allData.feel;
    document.getElementById('date').innerHTML =allData.date;
    }
    catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
   }


async function generateWeatherEntry() {
    return fetchWeather(weatherBaseURL, apiKey, document.querySelector('#zip').value)
    .then(temperature => postEntry(`${serverBaseURL}/data`,{temp: temperature, date: getDate(), feel: document.querySelector('#feelings').value}))
    .then(res => retrieveData())
    .catch(err => console.log(err));
}

function createNewEntry() {
    generateWeatherEntry();
}

document.querySelector('#generate').addEventListener('click', createNewEntry);