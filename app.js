const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const fs = require('fs');
const path = require('path');


app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.json());

let port = process.env.port || 3000;

app.get("/", (req, res, next) => {
  fetch("https://api.thingspeak.com/channels/1187063/feeds.json?results=10")
    .then((response) => response.json())
    .then((jsonRes) => {
        const temp = [];
        const timestamps = [];
        const bpm = [];
        jsonRes.feeds.forEach(entry => {
            temp.push(parseFloat(entry.field1));
            bpm.push(parseFloat(entry.field2));
            timestamps.push(entry.created_at);
        });
        return {Temp: temp, Timestamps: timestamps, Bpm: bpm}
    }).then((result) => {
        console.log(result);
        res.render("dashboard", {temp: result.Temp, bpm: result.Bpm, times: result.Timestamps});
    })
    .catch((err) => console.log(err));
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server Started on Port 3000");
});
