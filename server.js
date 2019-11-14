const express = require('express');
const path = require('path');
const { seedAndSync, Product, Company, Offering } = require('./db.js')

const app = express();

const PORT = 3000;

app.get('/', (req,res,next) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/products', (req,res,next) => {
    Product.findAll()
        .then( products => res.send(products));
})

app.get('/api/companies', (req,res,next) => {
    Company.findAll()
        .then( companies => res.send(companies));
})

app.get('/api/offerings', (req,res,next) => {
    Offering.findAll()
        .then( offerings => res.send(offerings));
})

app.listen(PORT, () => {
    seedAndSync()
    .then(() => {
    console.log(`Listening on port ${PORT}`)
    });
});