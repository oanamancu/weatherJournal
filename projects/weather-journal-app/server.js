// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 3000;
const server = app.listen(port, () => console.log(`Server running in port ${port}`));

//Routes

function checkData(data) {
    const keys = Object.keys(data);
    const lookFor = ['temperature', 'date', 'userResponse'];
    for(const key of lookFor) {
        if (!keys.includes(key)) {
            return false;
        }
    } 
    return true;
}

app.get('/data', (req, res) => {
    console.log('projectData: ' + Object.values(projectData));
    res.send(projectData);
});

app.post('/data', (req, res) => { 
    if(checkData(req.body)) {
        projectData['temperature'] = req.body.temperature;
        projectData['date'] = req.body.date;
        projectData['userResponse'] = req.body.userResponse;
        res.send(projectData);
    }
    else { 
        throw new Error(`no ccorrect data sent! 
            The format should be: {temperature: temperatureValue, date: dateValue, userResponse: userRespondeValue}`);
    }
});