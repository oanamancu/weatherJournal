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
    const lookFor = ['temp', 'date', 'feel'];
    for(const key of lookFor) {
        if (!keys.includes(key)) {
            return false;
        }
    } 
    return true;
}

app.get('/all', (req, res) => {
    res.send(projectData);
});

app.post('/data', (req, res) => { 
    if(checkData(req.body)) {
        projectData['temp'] = req.body.temp;
        projectData['date'] = req.body.date;
        projectData['feel'] = req.body.feel;
        res.send(projectData);
    }
    else { 
        throw new Error(`no ccorrect data sent! 
            The format should be: {temp: tempValue, date: dateValue, feel: feelValue}`);
    }
});