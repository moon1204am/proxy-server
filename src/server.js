'use strict';

const path = require('path');
const APP_ROOT_DIR = path.join(__dirname, '..');

const result = require('dotenv-safe').config({
    path: path.join(APP_ROOT_DIR, '.env'),
    example: path.join(APP_ROOT_DIR, '.env.example')
});

const express = require('express');
const app = express();

const axios = require('axios');
const instance = axios.create({
    baseURL: 'https://api.playground.klarna.com',
    headers: {
        'Content-type': "application/json",
        'Authorization': `Basic ${process.env.CREDENTIALS}`
    }
})

// CORS enabled for specific origin
const cors = require('cors');
var corsOptions = {
    origin: `${process.env.ORIGIN}`,
    optionsSuccessStatus: 200
  }
app.use(cors(corsOptions));

app.post('/order', async (req, res) => {
    const orderDetails = req.body;
    const response = await instance.post("/checkout/v3/orders/", orderDetails);
    res.json(await response.data);
})

app.get('/order/:order_id', async (req, res) => {
    const response = await instance.get("/checkout/v3/orders/" + req.params.order_id);
    res.json(await response.data);
})

app.listen(process.env.SERVER_PORT, () => {
    console.log("Listening on port " + process.env.SERVER_PORT);
})