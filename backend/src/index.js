const express = require('express');
const app = express();

let healthProfile = null;

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
})

app.listen(8000, ()=>{
    console.log("Server is running.")
});