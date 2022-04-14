'use strict';

const path = require('path');
const APP_ROOT_DIR = path.join(__dirname, '..');

const result = require('dotenv-safe').config({
    path: path.join(APP_ROOT_DIR, '.env'),
    example: path.join(APP_ROOT_DIR, '.env.example')
});

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const axios = require('axios');
const instance = axios.create({
    baseURL: 'https://api.playground.klarna.com',
    headers: {
        'Content-type': "application/json",
        'Authorization': `Basic ${Buffer.from(
            `${process.env.KCO_USERNAME}:${process.env.KCO_PASSWORD}`
          ).toString('base64')}`
    },
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

const server = app.listen(
    process.env.SERVER_PORT,
    process.env.SERVER_HOST,
    () => {
      console.log(
          `Server is up at ${server.address().address}:${server.address().port}`
      );
    }
);