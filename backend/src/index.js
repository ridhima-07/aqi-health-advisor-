const express = require('express');
const app = express();

let healthProfile = null;
let locations = [];

async function getApi (lat, lon) {
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=5f73bc1d60bcb647d5084a007f61a151`);
        const data = await response.json();
        return data;
    } catch ( error ) {
        console.log("error");
    }
}

app.use(express.json());

app.get('/', (req,res)=>{
    res.send("<h1>Hello World!<h1>");
});

app.post('/health-profile', (req,res)=>{
    healthProfile = req.body;
    res.send();
});

app.get('/health-profile', (req,res) => {
    res.send(healthProfile);
});

app.post('/location', (req,res)=>{
    locations.push(req.body);
    res.send();
});

app.get('/locations', (req,res)=>{
    res.send(locations);
});

app.get('/aqi', async (req,res)=>{
    const city = req.query.city;
    const location = locations.find(loc => loc.city === city);
    if ( !location ) {
        return res.send("City not found.")
    }
    const aqi = await getApi(location.lat, location.lon);
    res.send(aqi); 
});

app.listen(8000, ()=>{
    console.log("Server is running.")
});